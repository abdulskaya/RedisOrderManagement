import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Order } from './order/entities/order.entity';
import { OrderModule } from './order/order.module';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 30000
    }),
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
