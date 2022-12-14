import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { DELIVERY_STATUS_ENUM } from './deliveryState.enum';
import { PAY_STATUS_ENUM } from './payState.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: PAY_STATUS_ENUM.결제완료 })
  pay_state: PAY_STATUS_ENUM;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  buyr_city: string;

  @Column()
  buyr_contry: string;

  @Column()
  buyr_zipx: string;

  @Column({ default: DELIVERY_STATUS_ENUM.배송_대기 })
  delivery_state: DELIVERY_STATUS_ENUM;

  @CreateDateColumn()
  createAt: Date;

  @ManyToOne(() => User, { eager: true })
  user: User;
}
