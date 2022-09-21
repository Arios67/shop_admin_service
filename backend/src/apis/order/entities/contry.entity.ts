import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Contry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contry_name: string;

  @Column()
  contry_code: string;

  @Column()
  contry_dcode: string;
}
