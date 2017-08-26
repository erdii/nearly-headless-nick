import { Headless } from "./headless";
import { Server } from "./server";
import { createLogger } from "./logging";
import { config } from "./config";

const log = createLogger("index");

async function main() {
	const headless = new Headless();
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
