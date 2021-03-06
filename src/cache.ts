import * as redis from "redis";
import { config } from "./config";

/**
 * A Redis based cache to store the screenshots with a ttl
 */
export class Cache {
	private static prefix = "HEADLESSNICK:";
	private client: redis.RedisClient;

	/**
	 * new Cache()
	 *
	 * connects to redis with with the config from `config.cache`
	 */
	constructor() {
		this.client = redis.createClient({
			host: config.get("cache.host"),
			port: config.get("cache.port"),
		});
	}

	public async init() {/* placeholder for later */}

	/**
	 * this.makeKey(partial)
	 *
	 * @param {string} partial last partial string of the returned key
	 * @returns {string} complete redis key
	 */
	private static makeKey(partial: string): string {
		return Cache.prefix + partial;
	}

	/**
	 * await set("key", imageBuffer)
	 *
	 * caches the imagedata for `config.cache.ttl` seconds
	 *
	 * @param {string} key cache key
	 * @param {Buffer} image image data
	 */
	public set(key: string, image: Buffer) {
		return new Promise((resolve, reject) => {
			this.client.setex(key, config.get("cache.ttl"), image.toString("base64"), (err) => {
				err ? reject(err) : resolve();
			});
		});
	}

	/**
	 * await get("key")
	 *
	 * fetches the image cached under "key" from redis
	 * returns null in case of a cache miss
	 *
	 * @param {string} key cache key
	 * @returns {Buffer|null} image data
	 */
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
