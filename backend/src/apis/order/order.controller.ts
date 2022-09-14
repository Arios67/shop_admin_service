import {
  Controller,
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

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiParam({
    name: 'payState',
    required: false,
    type: String,
    description: '조회할 주문 상태',
    enum: ['결제완료', '결제취소'],
  })
  @ApiQuery({
    name: '주문기간',
    type: [String],
    example: ['2022-09-10', '2022-09-14'],
    required: true,
    description: '검색 기간 (시작 값 필수)',
  })
  @Get(':payState')
  async getList(
    @Param('payState') payState: String,
    @Query('주문기간', ParseArrayPipe) term: Date[],
  ) {
    if (!term) {
      term = [new Date('2014-01-27'), new Date()];
    }
    // term 배열이 있지만(시작기간은 있지만) 종료기간이 없을 경우
    if (!term[1]) {
      term.push(new Date());
    }

    // swagger에서 param 값이 비어있으면 ',' 값이 들어옴
    if (payState == ',') {
      payState = null;
    }

    term = [new Date(term[0]), new Date(term[1])];
    console.log(term);
    return await this.orderService.find(payState, term);
  }

  @ApiParam({
    name: 'name',
    description: '검색 할 주문자명',
    type: String,
    required: true,
  })
  @Get('/search/:name')
  async getByName(@Param('name') name: string) {
    return await this.orderService.findByName(name);
  }

  @ApiBody({
    type: updateDState,
    required: true,
    description: 'Avliable value : 배송 대기, 배송 중, 배송 완료',
  })
  @Put(':id')
  async updateDState(@Param('id') id: string, @Body() input: updateDState) {
    console.log(input);
    return await this.orderService.updateDState(id, input.delivery_state);
  }
}
