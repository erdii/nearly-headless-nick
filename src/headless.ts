import * as puppeteer from "puppeteer";
import * as lib from "./lib";

export class Headless {
	private browser: any;
	private folder: string;

	public async init(options: any = {}) {
		this.folder = await lib.createTmpDir();
		this.browser = await puppeteer.launch(options);
	}

	public async screenshot(url: string) {
		const path = lib.createScreenshotPath(this.folder, url);

		const page = await this.browser.newPage();

		await page.setViewport({
			width: 1920,
			height: 1080,
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
