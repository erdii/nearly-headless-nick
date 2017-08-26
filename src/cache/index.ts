import * as redis from "redis";

export class Cache {
	private static prefix = "HEADLESSNICK:";
	private client: redis.RedisClient;

	constructor() {
		this.client = redis.createClient({
			host: "127.0.0.1",
			port: 6379,
		});
	}

	public async init() {/* placeholder for later */}

	private static makeKey(partial: string): string {
		return Cache.prefix + partial;
	}

	public set(key: string, image: Buffer) {
		return new Promise((resolve, reject) => {
			this.client.setex(key, 120, image.toString("base64"), (err) => {
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
