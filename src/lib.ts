import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import * as crypto from "crypto";
import * as os from "os";
import { createLogger } from "./logging";
import { config } from "./config";

const log = createLogger("lib");

export function hash(input: string) {
	return crypto.createHash("sha256").update(input).digest("hex");
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

export function sanitizeInt(intString: string): number {
	const parsed = parseInt(intString, 10);

	return parsed.toString() === intString
		? parsed
		: null;
}

export function createOptions(query: any) {
	const { w, h } = query;

	const options = {} as any;

	if (w != null) options.width = sanitizeInt(w);
	if (h != null) options.height = sanitizeInt(h);

	return options;
}
