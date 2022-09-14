import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Coupon } from '../entities/coupon.entity';
import { IsNotEmpty } from 'class-validator';
import { COUPON_TYPE_ENUM } from '../entities/coupontype.enum';

export class CreateCouponInput extends OmitType(Coupon, ['id']) {
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: '쿠폰 할인액',
  })
  readonly discount: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '할인 타입',
  })
  readonly type: COUPON_TYPE_ENUM;
}
