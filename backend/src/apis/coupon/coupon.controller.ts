import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponInput } from './dtos/createCoupon.input';
import { COUPON_TYPE_ENUM } from './entities/coupontype.enum';

@Controller('coupon')
@ApiTags('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  /**
   * @description 신규 쿠폰 생성
   * @returns json
   */
  @Post()
  async create(@Body() input: CreateCouponInput) {
    return await this.couponService.create(input);
  }

  /**
   * @description 쿠폰 리스트 조회 (사용된 쿠폰만 조회 가능)
   * @param IsUsed
   * @returns json Array
   */
  @ApiParam({
    name: 'IsUsed',
    type: Boolean,
    description: 'true = 사용된 쿠폰만 조회',
  })
  @Get(':IsUsed')
  async getList(@Param('IsUsed', ParseBoolPipe) IsUsed: Boolean) {
    return await this.couponService.find(IsUsed);
  }

  /**
   * @description 쿠폰 타입 별 사용 횟수 조회
   * @param type
   * @returns number(Array.length)
   */
  @ApiParam({
    name: 'type',
    type: String,
    description: '사용 횟수를 조회할 쿠폰 타입',
    required: true,
    enum: ['배송비', '퍼센트', '정액'],
  })
  @Get('/number/:type')
  async getUsedTime(@Param('type') type: COUPON_TYPE_ENUM) {
    return await this.couponService.findUsedTime(type);
  }

  /**
   * @description 쿠폰 타입 별 총 할인 액 조회
   * @param type
   * @returns number
   */
  @ApiParam({
    name: 'type',
    type: String,
    description: '총 할인 액을 조회할 쿠폰 타입',
    required: true,
    enum: ['배송비', '퍼센트', '정액'],
  })
  @Get('/amount/:type')
  async getOffAmount(@Param('type') type: COUPON_TYPE_ENUM) {
    return await this.couponService.findOffAmount(type);
  }
}
