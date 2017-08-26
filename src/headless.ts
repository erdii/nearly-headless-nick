import * as puppeteer from "puppeteer";
import * as lib from "./lib";

export class Headless {
	private browser: any;
	private folder: string;

	public static readonly defaultOptions = {
		width: 1024,
		height: 768,
	};

	public async init(options: any = {}) {
		this.folder = await lib.createTmpDir();
		this.browser = await puppeteer.launch(options);
	}

	public async screenshot(url: string, _options = {}) {
		const options = {
			...Headless.defaultOptions,
			..._options
		};

		console.log(options);

		const path = lib.createScreenshotPath(this.folder, url, options);

		const exists = await lib.fileExists(path);

		if (exists) {
			return path;
		}

		const page = await this.browser.newPage();

		await page.setViewport({
			width: options.width,
			height: options.height,
		});

		await page.goto(url, {
			waitUntil: "networkidle",
		});

		await page.screenshot({
			path,
		});

		await page.close();

		return path;
	}
}
