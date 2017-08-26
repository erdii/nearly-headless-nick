import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import * as crypto from "crypto";
import * as os from "os";
import { createLogger } from "./logging";
import { config } from "./config";

const log = createLogger("lib");

function hash(input: string) {
	return crypto.createHash("sha256").update(input).digest("hex");
}

export function createTmpDir() {
	return new Promise<string>((resolve, reject) => {
		log("creating temporary folder for the screenshots");
		const tmp = os.tmpdir();
		const prefix = path.join(tmp, "nead-headless-nick");

		fs.mkdtemp(prefix, (err, folder) => {
			if (err != null) {
				reject(err);
			} else {
				log(`created folder "${folder}"`);
				resolve(folder);
			}
		});
	});
}

export function createScreenshotPath(basePath: string, pageUrl: string, options: any): string {
	const minuteTimestamp = Math.floor(Date.now() / config.get("screenshots.retentionTime"));
	const filename = `${hash(pageUrl + minuteTimestamp + JSON.stringify(options))}.png`;
	return path.join(basePath, filename);
}

export function fileExists(filePath: string) {
	return new Promise((resolve, reject) => {
		fs.access(filePath, (err) => {
			resolve(err == null);
		});
	});
}

export function sanitizeUrl(pageUrl: string) {
	const parsedUrl = url.parse(pageUrl);

	if (!(parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:")) {
		if (parsedUrl.protocol) {
			throw new Error("EINVALIDPROTO");
		} else if (!pageUrl) {
			throw new Error("EMISSINGURL");
		} else {
			return "http://" + pageUrl;
		}
	}

	return pageUrl;
}

function isIntString(intString: string): boolean {
	return parseInt(intString, 10).toString() === intString;
}

export function sanitizeInt(intString: string): number {
	if (!isIntString(intString)) {
		return null;
	} else {
		return parseInt(intString, 10);
	}
}

export function createOptions(width: string, height: string) {
	const options = {} as any;

	if (width != null) options.width = sanitizeInt(width);
	if (height != null) options.height = sanitizeInt(height);

	return options;
}
