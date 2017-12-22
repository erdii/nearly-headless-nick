import * as express from "express";
import * as morgan from "morgan";
import * as BodyParser from "body-parser";
import { Headless, SHOT_TYPE } from "./headless";
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
			this.app.use(BodyParser.text({
				type: "*/*",
				// limit: null // leave that for later
			}));

			this.app.get("/cs", this.createScreenshot);
			this.app.post("/html", this.createHTMLScreenshot);
			this.app.get("/help", (req, res) => res.redirect("https://erdii.github.io/nearly-headless-nick"));

			this.app.listen(this.port, () => {
				resolve();
			});
		});
	}


	/**
	 * @api {get} /cs Request url screenshot
	 * @apiGroup Main
	 * @apiDescription This endpoint requests a screenshot of the page at
	 * a user supplied url, that will be cached.
	 * The user can supply various parameters, to define things like
	 * the viewport size, scaled picture sizes, js execution and more.
	 * @apiName createScreenshot#
	 * @apiParam  {String} url the page url
	 * @apiParam  {Number{1-+Infinity}} w=1024 viewport width
	 * @apiParam  {Number{1-+Infinity}} h=768 viewport height
	 * @apiParam  {Number{1-+Infinity}} sw=null optional: scaled image width
	 * @apiParam  {Number{1-+Infinity}} sh=null optional: scaled image height
	 * @apiParam  {Boolean} nojs=false disables js execution on the screenshotted page
	 * @apiParam  {Boolean} fp=false screenshot full page height (this overrides h)
	 * @apiParam  {Number{1-60}} delay=null optional: delay the screenshot for x seconds (use when the site is very js heavy)
	 */
	private createScreenshot = async (req: express.Request, res: express.Response) => {
		log("new request");

		// parse options from query params
		const options = lib.createOptions(req.query);

		// parse url
		try {
			options.url = lib.sanitizeUrl(req.query.url);
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

		log("debug: %s", options);

		// take screenshot of the target url
		try {
			const image = await this.headless.screenshot(SHOT_TYPE.URL, options);
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


	/**
	 * @api {post} /html Request html screenshot
	 * @apiGroup Main
	 * @apiDescription This endpoint requests a screenshot of the rendered html payload
	 * The user can supply various parameters, to define things like
	 * the viewport size, scaled picture sizes, js execution and more.
	 * @apiName createHTMLScreenshot
	 * @apiParam  {Number{1-+Infinity}} w=1024 viewport width
	 * @apiParam  {Number{1-+Infinity}} h=768 viewport height
	 * @apiParam  {Number{1-+Infinity}} sw=null optional: scaled image width
	 * @apiParam  {Number{1-+Infinity}} sh=null optional: scaled image height
	 * @apiParam  {Boolean} nojs=false disables js execution on the screenshotted page
	 * @apiParam  {Boolean} fp=false screenshot full page height (this overrides h)
	 * @apiParam  {Number{1-60}} delay=null optional: delay the screenshot for x seconds (use when the site is very js heavy)
	 */
	private createHTMLScreenshot = async (req: express.Request, res: express.Response) => {
		log("new request");

		// parse options from query params
		const options = lib.createOptions(req.query);

		options.html = req.body;

		log("debug:", options);

		// take screenshot of the target url
		try {
			const image = await this.headless.screenshot(SHOT_TYPE.HTML, options);
			res.contentType("jpeg");
			res.end(image, "binary");
		} catch (err) {
			console.error(err);
			res.sendStatus(500);
		}
	}


}
