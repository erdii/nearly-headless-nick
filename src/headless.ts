import * as puppeteer from "puppeteer";
import * as lib from "./lib";
import { Cache } from "./cache";
import { createLogger } from "./logging";
import { config } from "./config";
import * as im from "./image-manipulation";

const log = createLogger("puppeteer");

export class Headless {
	private browser: any;
	private folder: string;
	private cache: Cache;

	public static readonly defaultOptions: IScreenshotOpts = {
		width: 1024,
		height: 768,
		targetWidth: null as number,
		targetHeight: null as number,
	};

	constructor(cache: Cache) {
		this.cache = cache;
	}

	public async init(options: any = {}) {
		log("initializing puppeteer");
		this.browser = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
			...options
		});
	}

	public async screenshot(url: string, _options: IScreenshotOpts = {}) {
		const options = {
			...Headless.defaultOptions,
			..._options
		};

		const cacheKey = lib.hash(url + JSON.stringify(options));
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

		const { width, height } = options;

		await page.setViewport({
			width,
			height,
		});

		await page.goto(url, {
			waitUntil: "networkidle",
		});

		let imageBuffer = await page.screenshot(config.get("screenshot"));

		if (options.targetWidth || options.targetHeight) {
			const { type, targetWidth, targetHeight } = options;
			imageBuffer = await im.resize(imageBuffer, type, targetWidth, targetHeight);
		}

		try {
			await this.cache.set(cacheKey, imageBuffer);
		} catch (err) {
			log("could not save image to cache", err);
		}

		await page.close();

		return imageBuffer as Buffer;
	}
}
