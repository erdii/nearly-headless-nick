import { Headless } from "./headless";
import { Server } from "./server";

async function main() {
	const headless = new Headless();
	await headless.init();

	const server = new Server(3000, headless);
	await server.init();

	console.log("server listening");
}

main().catch(err => {
	console.error("An uncatched error occured:", err);
	process.exit(1);
});
