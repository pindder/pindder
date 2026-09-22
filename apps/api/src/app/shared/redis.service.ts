import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy{
    private client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

    async acquireLock(key: string, ttlSeconds = 30): Promise<boolean> {
        // NX = set if not exists, EX = expire in seconds
        const result = await this.client.set(`lock:${key}`, 'LOCKED', 'EX', ttlSeconds, 'NX');
        return result === 'OK';
    }

    async releaseLock(key: string): Promise<void> {
        await this.client.del(`lock:${key}`);
    }

    async getCachedResponse<T>(key: string): Promise<T | null> {
        const data = await this.client.get(`cache:${key}`);
        return data ? JSON.parse(data) : null;
    }

    async setCachedResponse(key: string, value: any, ttlSeconds = 86400): Promise<void> {
        await this.client.set(`cache:${key}`, JSON.stringify(value), 'EX', ttlSeconds);
    }

    onModuleDestroy() {
        this.client.quit();
    }
}
