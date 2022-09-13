import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contry } from './contry.entity';

@Entity()
export class DeliveryCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @ManyToOne(() => Contry)
  contry: Contry;
}
