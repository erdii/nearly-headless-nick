import * as convict from "convict";

const config = convict({
	server: {
		port: {
			doc: "the port to listen on",
			default: 3000,
			env: "PORT",
			arg: "port",
		},
	},
});
