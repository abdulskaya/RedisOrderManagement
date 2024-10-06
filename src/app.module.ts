import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { Order } from './order/entities/order.entity';
import { OrderModule } from './order/order.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config) => {
        const store = await redisStore({
          ttl: 1000 * 30000,
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port')
          },
          username: config.get('redis.username'),
          password: config.get('redis.password')
        });
        return { store };
      },
      inject: [ConfigService]
    }),
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
