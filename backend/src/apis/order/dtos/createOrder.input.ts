import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Order } from '../entities/order.entity';

export class CreateOrderInput extends OmitType(Order, [
  'id',
  'pay_state',
  'createAt',
  'delivery_state',
]) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
  })
  readonly quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
  })
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly buyr_city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly buyr_contry: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly buyr_zipx: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly userId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    type: String,
  })
  readonly couponId: string;
}
