import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy{
    private logger = new Logger(RedisService.name);
    private redis_host = this.configService.getOrThrow<string>('REDIS_HOST') || 'localhost';
    private redis_port = this.configService.getOrThrow<string>('REDIS_PORT') || 6379;
    private redis_url: string;
    private readonly client: Redis;

    constructor(private readonly configService: ConfigService) {
        if(!this.redis_host || !this.redis_port) {
            this.logger.warn('Redis Host or Redis Port is missing!');
        }
        this.redis_url = `redis://${this.redis_host}:${Number(this.redis_port)}`;
        
        this.logger.log('REDIS_ADDRESS::', this.redis_url);
        this.client = new Redis(this.redis_url || `redis://${this.redis_host}:${this.redis_port}`);

        this.client.on('ready', () => {
            this.logger.log('Redis connected and ready');
        });

        this.client.on('error', (err: Error) => {
            this.logger.error(`Redis error: ${err.message}`, err.stack);
        });
    }

    async isInitialized() {
        if(this.client) {
            return true;
        } else { 
            return false;
        }
    }

    async acquireLock(key: string, ttlSeconds = 30): Promise<boolean> {
        // NX = set if not exists, EX = expire in seconds
        const result = await this.client.set(`lock:${key}`, 'LOCKED', 'EX', ttlSeconds, 'NX');
        return result === 'OK';
    }

    async releaseLock(key: string): Promise<void> {
        await this.client.del(`lock:${key}`);
    }

    async getCachedResponse<T>(key: string): Promise<T | null> {
        // console.log(this.client);
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async setCachedResponse(key: string, value: any, ttlSeconds = 86400): Promise<void> {
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }

    onModuleDestroy() {
        this.client.quit();
    }
}
