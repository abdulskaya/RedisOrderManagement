import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject('CACHE_MANAGER') private cacheManager: Cache,
    ) { }

    // Redis'e veri yazma
    async set(cacheKey: string, data: any) {
        await this.cacheManager.set(cacheKey, data);
    }

    // Redis'ten veri alma
    async get<T>(cacheKey: string): Promise<T | undefined> {
        return this.cacheManager.get(cacheKey);
    }

    // Statik metodlar için servis instance'ını referans almak gerekir
    static async setStatic(redisService: RedisService, cacheKey: string, data: any) {
        await redisService.set(cacheKey, data);
    }

    static async getStatic<T>(redisService: RedisService, cacheKey: string): Promise<T | undefined> {
        return redisService.get<T>(cacheKey);
    }
}
