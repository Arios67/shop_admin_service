import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contry {
  @PrimaryGeneratedColumn()
  contry_id: number;

  @Column()
  contry_name: string;

  @Column()
  contry_code: string;

  @Column()
  contry_dcode: string;
}
