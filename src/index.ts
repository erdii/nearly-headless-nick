import { Headless } from "./headless";
import { Server } from "./server";
import { createLogger } from "./logging";
import { config } from "./config";
import { Cache } from "./cache";

const log = createLogger("index");

async function main() {
	// init the cache module
	// connects to redis
	const cache = new Cache();
	await cache.init();

	// init headless module
	// boots up a chrome headless instance
	const headless = new Headless(cache);
	await headless.init();

	// init express server
	const port = config.get("server.port");

	const server = new Server(port, headless);
	await server.init();

	log("server listening on port %d", port);
}

// run the app
// but exit in case of
// an uncatched error
main().catch(err => {
	console.error("An uncatched error occured:", err);
	process.exit(1);
});
