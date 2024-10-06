import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('fetchOrders')
  setOrders() {
    return this.orderService.fetchOrders();
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
}
