import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  dcode: string;
}
