import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import * as crypto from "crypto";

function hash(input: string) {
	return crypto.createHash("sha256").update(input).digest("hex");
}

export function createTmpDir() {
	return new Promise<string>((resolve, reject) => {
		fs.mkdtemp("/tmp/near-headless-nick", (err, folder) => {
			if (err != null) {
				reject(err);
			} else {
				resolve(folder);
			}
		});
	});
}

export function createScreenshotPath(basePath: string, pageUrl: string): string {
	const parsed = url.parse(pageUrl, false);
	const unixTimestamp = Math.floor(Date.now() / 1000);
	const filename = `${parsed.host}_${hash(parsed.pathname)}_${unixTimestamp}.png`;
	return path.join(basePath, filename);
}
