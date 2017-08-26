import * as convict from "convict";

export const config = convict({
	server: {
		port: {
			doc: "the port to listen on",
			default: 3000,
			format: "port",
			env: "PORT",
			arg: "port",
		},
	},
	screenshots: {
		retentionTime: {
			doc: "amount of milliseconds a picture is note stale",
			default: 600000,
			format: "nat",
			env: "RETENTION_TIME",
			arg: "retention-time",
		}
	}
});

config.validate({
	allowed: "strict",
});
