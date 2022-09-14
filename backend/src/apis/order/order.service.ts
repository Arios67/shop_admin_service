import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThan, LessThan } from 'typeorm';
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

  async findByName(name: string) {
    const qb = this.datasouce.createQueryBuilder(Order, 'order');
    return await qb
      .leftJoinAndSelect('order.user', 'user')
      .where('user.username =:name', { name: name })
      .getMany();
  }

  async updateDState(id: string, input: DELIVERY_STATUS_ENUM) {
    const prev = await this.orderRepository.findOneBy({ id });
    return await this.orderRepository.save({
      ...prev,
      delivery_state: input,
    });
  }
}
