import * as express from "express";
import { Headless } from "./headless";

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
			this.app.get("*", this.handler);

			this.app.listen(3000, () => {
				resolve();
			});
		});
	}

	private handler = (req: express.Request, res: express.Response) => {
		const url = (req.query.q || "").trim();

		if (!url) {
			res.sendStatus(400);
		}

		this.headless.screenshot(url)
			.then(path => {
				console.log(path);
				res.sendFile(path);
			})
			.catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	}
}
