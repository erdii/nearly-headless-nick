import * as redis from "redis";
import { config } from "./config";

export class Cache {
	private static prefix = "HEADLESSNICK:";
	private client: redis.RedisClient;

	constructor() {
		this.client = redis.createClient({
			host: config.get("cache.host"),
			port: config.get("cache.port"),
		});
	}

	public async init() {/* placeholder for later */}

	private static makeKey(partial: string): string {
		return Cache.prefix + partial;
	}

	public set(key: string, image: Buffer) {
		return new Promise((resolve, reject) => {
			this.client.setex(key, config.get("cache.ttl"), image.toString("base64"), (err) => {
				err ? reject(err) : resolve();
			});
		});
	}

	public get(key: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			this.client.get(key, (err, data: string) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(data ? Buffer.from(data, "base64") : null);
			});
		});
	}
}
