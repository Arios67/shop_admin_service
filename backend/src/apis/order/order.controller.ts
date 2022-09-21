import {
  Controller,
  Body,
  Get,
  Param,
  Put,
  Query,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderInput } from './dtos/createOrder.input';
import { updateDState } from './dtos/update.dto';
import { PAY_STATUS_ENUM } from './entities/payState.enum';
import { OrderService } from './order.service';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * @description 주문 내역 리스트 조회 (주문 상태, 기간 별 조회 가능)
   * @param payState
   * @param term
   * @returns json Array
   */
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

  /**
   * @description 주문자명으로 주문 조회
   * @param name
   * @returns json Array
   */
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

  /**
   * @description 해당 주문 배송 상태 변경
   * @param id
   * @param delivery_state
   * @returns
   */
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

  @ApiOperation({
    summary: '주문 생성',
    description: '! price는 달러 단위 입력',
  })
  @Post()
  async create(@Body() input: CreateOrderInput) {
    return await this.orderService.create(input);
  }
}
