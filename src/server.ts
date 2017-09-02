import * as express from "express";
import * as morgan from "morgan";
import { Headless } from "./headless";
import { createLogger } from "./logging";
import * as lib from "./lib";
import * as Errors from "./errors";

const log = createLogger("server");

/**
 * Express server with request handler functions
 */
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
			this.app.get("/cs", this.handler);

			this.app.listen(this.port, () => {
				resolve();
			});
		});
	}


	/**
	 * @api {get} /sc Request a screenshot
	 * @apiGroup Main
	 * @apiDescription This endpoint requests a screenshot of the page at
	 * a user supplied url, that will be cached.
	 * The user can supply various parameters, to define things like
	 * the viewport size, scaled picture sizes, js execution and more.
	 * @apiName ScreenshotCreate
	 * @apiParam  {Number{1-+Infinity}} w=1024 viewport width
	 * @apiParam  {Number{1-+Infinity}} h=768 viewport height
	 * @apiParam  {Number{1-+Infinity}} sw=null optional: scaled image width
	 * @apiParam  {Number{1-+Infinity}} sh=null optional: scaled image height
	 * @apiParam  {Boolean} nojs=false disables js execution on the screenshotted page
	 * @apiParam  {Boolean} fp=false screenshot full page height (this overrides h)
	 * @apiParam  {Number{1-60}} delay=null optional: delay the screenshot for x seconds (use when the site is very js heavy)
	 */
	private handler = async (req: express.Request, res: express.Response) => {
		log("new request");

		// parse options from query params
		const options = lib.createOptions(req.query);

		let url;

		// parse url
		try {
			url = lib.sanitizeUrl(req.query.url);
		} catch (err) {
			if (err instanceof Errors.MissingUrlError) {
				res.status(404).send(err.toString());
			} else if (err instanceof Errors.ProtocolError) {
				res.status(400).send(err.toString());
			} else {
				res.sendStatus(500);
			}
			return;
		}

		log("debug: %s", url, options);

		// take screenshot of the target url
		try {
			const image = await this.headless.screenshot(url, options);
			res.contentType("jpeg");
			res.end(image, "binary");
		} catch (err) {
			if (err instanceof Errors.HttpError) {
				log("could not reach url %s... responded with code: %d", err.url, err.code);
				res.status(err.code).send(err.toString());
				return;
			}

			console.error(err);
			res.sendStatus(500);
		}
	}
}
