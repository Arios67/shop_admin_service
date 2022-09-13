import { Order } from '../../order/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { COUPON_TYPE_ENUM } from './coupontype.enum';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  discount: number;

  @Column()
  type: COUPON_TYPE_ENUM;

  @ManyToOne(() => Order, { eager: true })
  order: Order;
}
