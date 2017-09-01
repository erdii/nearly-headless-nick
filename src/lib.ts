import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import * as crypto from "crypto";
import * as os from "os";
import { createLogger } from "./logging";
import { config } from "./config";
import * as Errors from "./errors";

const log = createLogger("lib");

export function hash(input: string) {
	return crypto.createHash("sha256").update(input).digest("hex");
}

export function sanitizeUrl(pageUrl: string) {
	if (!pageUrl) throw new Errors.MissingUrlError();

	const parsedUrl = url.parse(pageUrl);

	if (!(parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:")) {
		if (parsedUrl.protocol) {
			throw new Errors.ProtocolError(pageUrl, parsedUrl.protocol);
		} else {
			return "http://" + pageUrl;
		}
	}

	return pageUrl;
}

export function sanitizePosInt(intString: string): number {
	const parsed = parseInt(intString, 10);

	// bail out if the number does not equal the textual representation
	if (parsed.toString() !== intString) {
		return null;
	}

	// ensure returning a positive number
	return parsed < 0
		? Math.abs(parsed)
		: parsed;
}

export function createOptions(query: any) {
	const { w, h, sw, sh, fp } = query;

	const options = {} as IScreenshotOpts;

	if (w != null) options.width = sanitizePosInt(w);
	if (h != null) options.height = sanitizePosInt(h);
	if (sw != null) options.targetWidth = sanitizePosInt(sw);
	if (sh != null) options.targetHeight = sanitizePosInt(sh);
	if (fp != null) options.fullPage = true;

	return options;
}
