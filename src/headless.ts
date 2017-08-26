import * as puppeteer from "puppeteer";
import * as lib from "./lib";
import { Cache } from "./cache";
import { createLogger } from "./logging";
import { config } from "./config";

const log = createLogger("puppeteer");

export class Headless {
	private browser: any;
	private folder: string;
	private cache: Cache;

	public static readonly defaultOptions = {
		width: 1024,
		height: 768,
	};

	constructor(cache: Cache) {
		this.cache = cache;
	}

	public async init(options: any = {}) {
		log("initializing puppeteer");
		this.browser = await puppeteer.launch(options);
	}

	public async screenshot(url: string, _options = {}) {
		const options = {
			...Headless.defaultOptions,
			..._options
		};

		const cacheKey = lib.hash(url);
		log(cacheKey, options);

		let cachedImage: Buffer;

		try {
			cachedImage = await this.cache.get(cacheKey);
		} catch (err) {
			log("could not get image from cache", err);
		}

		if (cachedImage != null) {
			return cachedImage;
		}

		const page = await this.browser.newPage();

		await page.setViewport({
			width: options.width,
			height: options.height,
		});

		await page.goto(url, {
			waitUntil: "networkidle",
		});

		const imageBuffer = await page.screenshot(config.get("screenshot"));

		try {
			await this.cache.set(cacheKey, imageBuffer);
		} catch (err) {
			log("could not save image to cache", err);
		}

		await page.close();

		return imageBuffer as Buffer;
	}
}
