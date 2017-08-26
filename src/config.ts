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

	screenshot: {
		type: {
			doc: "the screenshot data type",
			default: "jpeg",
			format: ["jpeg", "png"],
			env: "TYPE",
			arg: "format",
		},

		quality: {
			doc: "jpeg quality from 1-100",
			default: 80,
			format: (value) => typeof value === "number" && Math.floor(value) === value && value >= 1 && value <= 100,
			env: "JPEG_QUALITY",
			arg: "jpeg-quality",
		}
	},

	cache: {
		host: {
			doc: "redis server hostname",
			default: "127.0.0.1",
			format: String,
			env: "CACHE_HOST",
			arg: "cache-host",
		},

		port: {
			doc: "redis server port",
			default: 6379,
			format: "port",
			env: "CACHE_PORT",
			arg: "cache-port",
		},

		ttl: {
			doc: "amount of seconds a picture is cached",
			default: 600,
			format: "nat",
			env: "TTL",
			arg: "ttl",
		},
	}
});

config.validate({
	allowed: "strict",
});
