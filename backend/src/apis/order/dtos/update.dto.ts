import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DELIVERY_STATUS_ENUM } from '../entities/deliveryState.enum';

export class updateDState {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly delivery_state: DELIVERY_STATUS_ENUM;
}
