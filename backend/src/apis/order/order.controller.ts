import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { updateDState } from './dtos/update.dto';
import { PAY_STATUS_ENUM } from './entities/payState.enum';
import { OrderService } from './order.service';

@Controller()
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiParam({
    name: '주문 상태',
    type: String,
    required: false,
    description: '입력 값이 없을 경우 모든 주문 상태 조회',
  })
  @ApiQuery({
    name: '주문 기간',
    type: [String],
    example: ['2022-09-10', '2022-09-14'],
    required: false,
    description: '입력 값이 없을 경우 전체 기간 조회',
  })
  @Get(':payState')
  async find(
    @Param('주문 상태') payState: PAY_STATUS_ENUM,
    @Query('주문 기간', ParseArrayPipe) term: Date[],
  ) {
    if (!term) {
      term = [new Date('2014-01-27'), new Date()];
    }
    // term 배열이 있지만(시작기간은 있지만) 종료기간이 없을 경우
    if (!term[1]) {
      term.push(new Date());
    }
    // string -> datetime 변환
    term = [new Date(term[0]), new Date(term[1])];
    return await this.orderService.find(payState, term);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.orderService.findById(id);
  }

  @Put(':id')
  async updateDState(@Param('id') id: string, @Body() input: updateDState) {
    console.log(input);
    return await this.orderService.updateDState(id, input.delivery_state);
  }
}
