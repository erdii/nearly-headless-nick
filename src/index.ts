async function main() {
	console.log("hi");
}

main().catch(err => {
	console.error("An uncatched error occured:", err);
	process.exit(1);
});
