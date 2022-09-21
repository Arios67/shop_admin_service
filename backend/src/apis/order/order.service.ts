import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository, DataSource, MoreThan, LessThan } from 'typeorm';
import { Coupon } from '../coupon/entities/coupon.entity';
import { CreateOrderInput } from './dtos/createOrder.input';
import { Contry } from './entities/contry.entity';
import { DeliveryCost } from './entities/deliveryCost.entity';
import { DELIVERY_STATUS_ENUM } from './entities/deliveryState.enum';
import { Order } from './entities/order.entity';
import { PAY_STATUS_ENUM } from './entities/payState.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private datasouce: DataSource,
  ) {}

  // 주문내역 조회 (결제 상태, 기간 별 조회 가능)
  async find(payState: String, term) {
    if (payState) {
      return await this.datasouce
        .createQueryBuilder(Order, 'order')
        .leftJoinAndSelect('order.user', 'user')
        .where('order.pay_state =:pS', { pS: payState })
        .andWhere({ createAt: MoreThan(term[0]) })
        .andWhere({ createAt: LessThan(term[1]) })
        .getMany();
    }
    return await this.datasouce
      .createQueryBuilder(Order, 'order')
      .leftJoinAndSelect('order.user', 'user')
      .where({ createAt: MoreThan(term[0]) })
      .andWhere({ createAt: LessThan(term[1]) })
      .getMany();
  }

  // 주문내역 주문자 명으로 조회
  async findByName(name: string) {
    const qb = this.datasouce.createQueryBuilder(Order, 'order');
    return await qb
      .leftJoinAndSelect('order.user', 'user')
      .where('user.username =:name', { name: name })
      .getMany();
  }

  // 주문 상품 배송상태 변경
  async updateDState(id: string, input: DELIVERY_STATUS_ENUM) {
    const prev = await this.orderRepository.findOneBy({ id });
    return await this.orderRepository.save({
      ...prev,
      delivery_state: input,
    });
  }

  // 주문 생성
  async create(input: CreateOrderInput) {
    // 달러 매매 기준율 구하기(String)
    let exchangeRate = await axios.get(
      `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.APPKEY}&data=AP01`,
    );
    exchangeRate = exchangeRate.data[
      exchangeRate.data.length - 1
    ].deal_bas_r.replace(',', '');

    let { quantity, price, buyr_contry, couponId, userId, ...rest } = input;

    // 1. 배송비 계산을 위해 입력받은 국가를 조회
    const contryQB = this.datasouce.createQueryBuilder();
    const contry = await contryQB
      .from(Contry, 'contry')
      .select('contry', 'contry_code')
      .where({ contry_code: buyr_contry })
      .getOne();

    // 2. 조회한 국가의 배송비를 수량에 맞게 조회
    const deliveryQB = this.datasouce.createQueryBuilder(
      DeliveryCost,
      'delivery_cost',
    );
    const deliverCost = await deliveryQB
      .leftJoinAndSelect('delivery_cost.contry', 'contry')
      .where('delivery_cost.contry =:contry', { contry: contry.id })
      .andWhere('delivery_cost.quantity =:q', { q: quantity })
      .getOne();

    // 3. 쿠폰이 사용되었다면, 쿠폰 적용
    if (couponId) {
      const couponQB = this.datasouce.createQueryBuilder(Coupon, 'coupon');
      const coupon = await couponQB
        .leftJoinAndSelect('coupon.order', 'order')
        .where({ id: couponId })
        .getOne();

      // 3-1 사용된 쿠폰이라면 에러 반환
      if (coupon.order) {
        throw new HttpException('이미 사용된 쿠폰입니다.', 400);
      }

      // 3-2. 쿠폰 타입 별 할인 적용
      if (coupon.type === '정액') {
        price -= coupon.discount;
      }
      if (coupon.type === '퍼센트') {
        price -= price * (coupon.discount / 100);
      }
      if (coupon.type === '배송비') {
        deliverCost.cost -= coupon.discount;
      }
    }

    // 4. 배송비 달러로 환산 한 뒤 price에 적용
    deliverCost.cost /= Number(exchangeRate);
    price += deliverCost.cost;

    // KR의 경우 price 원 단위로 환산하여 저장
    if (buyr_contry === 'KR') {
      price *= Number(exchangeRate);
    }

    // 5. 주문 저장
    return await this.orderRepository.save({
      user: userId,
      quantity,
      price,
      buyr_contry,
      ...rest,
    });
  }
}
