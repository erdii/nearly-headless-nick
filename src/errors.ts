export class HttpError extends Error {
	public url: string;
	public code: number;

	constructor(url: string, code: number) {
		super("EHTTPERROR");

		this.url = url;
		this.code = code;
	}

	public toString() {
		return `${this.url} responded with error code ${this.code}`;
	}
}

export class ProtocolError extends Error {
	public url: string;
	public proto: string;

	constructor(url: string, proto: string) {
		super("EPROTOERROR");

		this.url = url;
		this.proto = proto;
	}

	public toString() {
		return `Malformed request url. Allowed protocols are 'http:' and https:'. You used '${this.proto}'`;
	}
}

export class MissingUrlError extends Error {
	constructor() {
		super("EMISSINGURLERROR");
	}

	public toString() {
		return "Missing url";
	}
}
