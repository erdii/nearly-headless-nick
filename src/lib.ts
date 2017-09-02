import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import * as crypto from "crypto";
import * as os from "os";
import { createLogger } from "./logging";
import { config } from "./config";
import * as Errors from "./errors";

const log = createLogger("lib");

/**
 * hash("input")
 *
 * create sha256 hash of input string
 *
 * @export
 * @param {string} input string to hash
 * @returns {string} sha256 hash of input string
 */
export function hash(input: string) {
	return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * sanitizeUrl("www.example.com")
 *
 * sanitizes and validates a url by parsing it, and checking if the proto is either http: or https:
 * defaults proto to http: and throws if proto is entirely unknown
 *
 * @export
 * @param {string} pageUrl the url to sanitize
 * @returns {string} sanitized url
 * @throws {ProtocolError} if the url protocol is unknown
 */
export function sanitizeUrl(pageUrl: string) {
	if (!pageUrl) throw new Errors.MissingUrlError();

	const parsedUrl = url.parse(pageUrl);

	if (!(parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:")) {
		if (parsedUrl.protocol) {
			throw new Errors.ProtocolError(pageUrl, parsedUrl.protocol);
		} else {
			parsedUrl.protocol = "http:";
			return url.format(parsedUrl);
		}
	}

	return pageUrl;
}

/**
 * sanitizePosInt("120")
 *
 * ensures that it returns a positive integer (no float)
 * returns null if the parsed number does not equal the input string
 *
 * @export
 * @param {string} intString number string to sanitize and parse
 * @returns {number} a guaranteed positive integer
 */
export function sanitizePosInt(intString: string): number {
	const parsed = parseInt(intString, 10);

	// bail out if the number does not equal input string
	if (parsed.toString() !== intString) {
		return null;
	}

	// ensure returning a positive number
	return parsed < 0
		? Math.abs(parsed)
		: parsed;
}

/**
 * createOptions(req.query)
 *
 * creates a screenshot options object from an express req.query object
 *
 * @export
 * @param {*} query an express req.query object
 * @returns IScreenshotOpts
 */
export function createOptions(query: any) {
	const { w, h, sw, sh, fp, nojs, d } = query;

	const options = {} as IScreenshotOpts;

	if (w != null) options.width = sanitizePosInt(w);
	if (h != null) options.height = sanitizePosInt(h);
	if (sw != null) options.targetWidth = sanitizePosInt(sw);
	if (sh != null) options.targetHeight = sanitizePosInt(sh);
	if (fp != null) options.fullPage = true;
	if (nojs != null) options.noJs = true;
	if (d != null) options.delay = Math.min(sanitizePosInt(d), 60);

	return options;
}
