import * as express from "express";
import { Headless } from "./headless";
import { createLogger } from "./logging";
import * as lib from "./lib";
import * as morgan from "morgan";

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

	private handler = (req: express.Request, res: express.Response) => {
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
			url = lib.sanitizeUrl(path);
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

		this.headless.screenshot(url, options)
			.then(image => {
				res.contentType("png");
				res.end(image, "binary");
			})
			.catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	}
}
