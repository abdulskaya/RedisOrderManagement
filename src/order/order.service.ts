import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { faker } from '@faker-js/faker';
const moment = require("moment");
import * as fs from 'fs';
import * as path from 'path';
import { RedisService } from 'src/redis/redis.service';


@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    private readonly redisService: RedisService
  ) { }

  async onModuleInit() {
    await this.seedOrders();
  }

  async fetchOrders() {
    let newOrders: Order[] = await this.readOrdersFromFile();
    if (newOrders?.length > 0) {
      let index: number = 1;
      const startTime = Date.now();
      for (let newOrder of newOrders) {
        console.log(`Hepsiburada siparişler kontrol ediliyor => ${index}/${newOrders.length}`);
        let order: any = process.env.REDIS_ACTIVE == 'true' ? await this.redisService.get(newOrder.orderNumber) : await this.orderModel.findOne(({ where: { orderNumber: newOrder.orderNumber } }));
        if (!order) {
          await this.createOrder(order);
        } else {
          console.log(`Hepsiburada => ${newOrder.orderNumber} zaten var (${index}/${newOrders.length})`);
        }
        index += 1;
      }
      const endTime = Date.now();
      console.log(`Sipariş getirme işlemi ${(endTime - startTime) / 1000} saniyede tamamlandı.`);
    }
  }

  /**
   * Siparişleri oluşturur
   *
   * @async
   * @returns {*}
   */
  async seedOrders() {
    const orderCount = await this.orderModel.count();
    if (orderCount === 0) {
      console.log('Seeding 250 orders...');
      const orders: Partial<Order>[] = [];
      const orderPrefix = 'HB';

      for (let i = 0; i < 250; i++) {
        const randomNumber = faker.number.int({ min: 100000, max: 999999 }); // 6 haneli rastgele sayı
        let order = {
          orderNumber: `${orderPrefix}-${randomNumber}`,
          customerName: faker.name.firstName() + ' ' + faker.name.lastName(),
          item: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 10 }),
          status: (faker.helpers as any).arrayElement(['cat', 'dog', 'mouse']),
          date: moment().subtract('minutes', i)
        };
        orders.push(order);
        await this.createOrder(order);
      }

      // Siparişleri JSON dosyasına yazma (bu siparişleri daha sonra api üzerinden çekilmiş gibi davranarak redis kurgusunda da ele alacağız)
      const filePath = path.join(__dirname + '/../../', 'TrendyolOrders.json');
      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
      console.log('Orders have been written to orders.json file.');
      console.log('Seeding completed.');
    } else {
      console.log('Orders already exist. Skipping seeding.');
    }
  }


  /**
   * Sipariş JSON dosyasını okur
   *
   * @async
   * @returns {unknown}
   */
  async readOrdersFromFile() {
    const filePath = path.join(__dirname + '/../../', 'TrendyolOrders.json');
    if (fs.existsSync(filePath)) {
      const fileData = await fs.readFileSync(filePath, 'utf-8');
      const orders = JSON.parse(fileData);
      return orders;
    } else {
      console.log('Orders file does not exist.');
      return [];
    }
  }

  async setOrders() {
    await this.redisService.set('key1', 'hello');
  }

  async getOrders() {
    let cacheData: any = await this.redisService.get('orders');
    return cacheData;
  }

  /**
   * Yeni sipariş oluşturur ve Redis'e kaydeder.
   *
   * @async
   * @param {Partial<Order>} orderData
   * @returns {Promise<Order>}
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const newOrder = await this.orderModel.create(orderData);  // Veritabanına kaydet
    // Redis'e kaydet
    await this.redisService.set(newOrder.orderNumber, newOrder);
    return newOrder;
  }

  /**
   * Siparişi Redis'ten veya veritabanından getir
   *
   * @async
   * @param {string} orderNumber
   * @returns {Promise<Order | undefined>}
   */
  async findOrder(orderNumber: string): Promise<Order | undefined> {
    // Öncelikle Redis'ten sorgula
    const cachedOrder = await this.redisService.get<Order>(orderNumber);
    if (cachedOrder) {
      return cachedOrder;
    }

    // Eğer Redis'te yoksa veritabanından al
    const order = await this.orderModel.findOne({ where: { orderNumber } });

    // Redis'te yok ama veritabanında varsa Redis'e kaydet
    if (order) {
      await this.redisService.set(order.orderNumber, order);
    }

    return order;
  }
}
