import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from './redis.service';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const store = await redisStore({
                    ttl: 1000 * 30000,
                    socket: {
                        host: configService.get<string>('redis.host'),
                        port: configService.get<number>('redis.port')
                    },
                    username: configService.get<string>('redis.username'),
                    password: configService.get<string>('redis.password')
                });
                return { store };
            },
            inject: [ConfigService]
        }),
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule { }
