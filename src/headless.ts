import * as puppeteer from "puppeteer";
import * as lib from "./lib";
import { Cache } from "./cache";
import { createLogger } from "./logging";
import { config } from "./config";
import * as im from "./image-manipulation";
import * as Errors from "./errors";

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
		fullPage: false,
		noJs: false,
		delay: null,
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

		// create page
		const page = await this.browser.newPage();

		// set viewport sizes
		await page.setViewport({
			width: options.width,
			height: options.height,
		});

		// disable js is requested
		if (options.noJs) {
			await page.setJavaScriptEnabled(false);
		}

		// navigate to target url
		const response = await page.goto(url, {
			waitUntil: "networkidle",
		});

		if (!response.ok) {
			throw new Errors.HttpError(url, response.status);
		}

		if (options.delay) {
			await page.waitFor(options.delay * 1000);
		}

		// create a screenshot
		let imageBuffer = await page.screenshot({
			type: "jpeg",
			quality: config.get("screenshot.quality"),
			fullPage: options.fullPage,
		});

		// scale the screenshot if requested
		if (options.targetWidth || options.targetHeight) {
			const { targetWidth, targetHeight } = options;
			imageBuffer = await im.resize(imageBuffer, targetWidth, targetHeight);
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
