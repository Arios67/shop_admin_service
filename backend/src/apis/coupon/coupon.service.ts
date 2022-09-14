import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not, IsNull } from 'typeorm';
import { CreateCouponInput } from './dtos/createCoupon.input';
import { Coupon } from './entities/coupon.entity';
import { COUPON_TYPE_ENUM } from './entities/coupontype.enum';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    private datasource: DataSource,
  ) {}

  // 신규 쿠폰 생성
  async create(input: CreateCouponInput) {
    return await this.couponRepository.save({ ...input });
  }

  // 쿠폰 리스트(사용되었다면 사용내역 추가, 사용된 쿠폰만 조회가능) 조회
  async find(IsUsed: Boolean) {
    if (IsUsed) {
      const qb = this.datasource.createQueryBuilder(Coupon, 'coupon');
      return await qb
        .leftJoinAndSelect('coupon.order', 'order')
        .where({ off_amount: Not(IsNull()) })
        .getMany();
    }
    const qb = this.datasource.createQueryBuilder(Coupon, 'coupon');
    return await qb.leftJoinAndSelect('coupon.order', 'order').getMany();
  }

  // 타입 별 사용횟수 조회
  async findUsedTime(type: COUPON_TYPE_ENUM) {
    const qb = this.datasource.createQueryBuilder(Coupon, 'coupon');
    const result = await qb
      .where('coupon.type =:type', { type: type })
      .andWhere({ off_amount: Not(IsNull()) })
      .getMany();
    return result.length;
  }

  // 타입 별 총 할인액 조회
  async findOffAmount(type: COUPON_TYPE_ENUM) {
    const qb = this.datasource.createQueryBuilder(Coupon, 'coupon');
    const result = await qb
      .where({ type: type })
      .andWhere({ off_amount: Not(IsNull()) })
      .getMany();

    if (result.length !== 0) {
      let sum = 0;
      for (let i = 0; i < result.length; i++) {
        sum += result[i].off_amount;
      }

      return sum;
    }
    return 0;
  }
}
