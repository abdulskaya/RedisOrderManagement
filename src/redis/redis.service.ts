import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Redis = require('ioredis');
@Injectable()
export class RedisService {
    private redisClient: any = new Redis();
    constructor(
        private readonly configService: ConfigService
    ) {
        this.redisClient = new Redis({
            ttl: 1000 * 30000,
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
            username: configService.get<string>('redis.username'),
            password: configService.get<string>('redis.password')
        });
    }

    // Redis'e veri yazma
    async set(cacheKey: string, data: any) {
        await this.redisClient.set(cacheKey, JSON.stringify(data));
    }

    // Redis'ten veri alma
    async get<T>(cacheKey: string): Promise<T | undefined> {
        return this.getWithLuaScript(cacheKey);
    }

    // Redis'ten lua script ile veri alma
    async getWithLuaScript<T>(cacheKey: string): Promise<T | undefined> {
        const luaScript = `
        local value = redis.call('GET', KEYS[1])
        if value then
          return value
        else
          return nil
        end
      `;
        const result = await this.redisClient.eval(luaScript, 1, cacheKey);
        return result ? JSON.parse(result) : null;
    }

    static async setStatic(redisService: RedisService, cacheKey: string, data: any) {
        await redisService.set(cacheKey, data);
    }

    static async getStatic<T>(redisService: RedisService, cacheKey: string): Promise<T | undefined> {
        return redisService.get<T>(cacheKey);
    }
}
