import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) { }

  async setOrders() {
    await this.cacheManager.set('key1', 'hello');
  }

  async getOrders() {
    let cacheData: any = await this.cacheManager.get('students');
    if (cacheData) {
      return cacheData;
    }
    let studentsData = await this.retrieveStudentsFromDb();
    this.cacheManager.set('students', studentsData);
    return studentsData;
  }

  async retrieveStudentsFromDb() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const students = [
          { name: "John", age: 20, GPA: 3 },
          { name: "Kemal", age: 23, GPA: 5 },
          { name: "Takachi", age: 24, GPA: 2 }
        ];
        resolve(students);
      }, 1000)
    })
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
