import * as express from "express";
import * as morgan from "morgan";
import { Headless } from "./headless";
import { createLogger } from "./logging";
import * as lib from "./lib";
import * as Errors from "./errors";

const log = createLogger("server");

export class Server {
	private port: number;
	private headless: Headless;
	private app: express.Express;

	constructor(port: number, headless: Headless) {
		this.port = port;
		this.headless = headless;
		this.app = express();
	}

	public init() {
		return new Promise((resolve, reject) => {
			log("initializing server");
			this.app.use(morgan("combined"));
			this.app.get("*", this.handler);

			this.app.listen(3000, () => {
				resolve();
			});
		});
	}

	private handler = async (req: express.Request, res: express.Response) => {
		const path = (req.path.slice(1) || "").trim();

		switch (path) {
			case "favicon.ico":
				res.sendStatus(404);
				return;
		}

		log("new request");

		const options = lib.createOptions(req.query);

		let url;

		try {
			url = lib.sanitizeUrl(req.query.url);
		} catch (err) {
			switch (err.message) {
				case "EMISSINGURL":
					res.sendStatus(404);
					break;
				case "EINVALIDPROTO":
					res.sendStatus(400);
					break;
				default:
					res.sendStatus(500);
			}
			return;
		}

		log("debug: %s", url, options);

		try {
			const image = await this.headless.screenshot(url, options);
			res.contentType("jpeg");
			res.end(image, "binary");
		} catch (err) {
			if (err instanceof Errors.HttpError) {
				log("could not reach url %s... responded with code: %d", err.url, err.code);
				res.sendStatus(err.code);
				return;
			}

			console.error(err);
			res.sendStatus(500);
		}
	}
}
