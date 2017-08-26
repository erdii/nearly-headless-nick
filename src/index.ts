import { Headless } from "./headless";
import { Server } from "./server";
import { createLogger } from "./logging";
import { config } from "./config";
import { Cache } from "./cache";

const log = createLogger("index");

async function main() {
	const cache = new Cache();
	await cache.init();

	const headless = new Headless(cache);
	await headless.init();

	const port = config.get("server.port");

	const server = new Server(port, headless);
	await server.init();

	log("server listening on port %d", port);
}

main().catch(err => {
	console.error("An uncatched error occured:", err);
	process.exit(1);
});
