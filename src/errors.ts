export class HttpError extends Error {
	public url: string;
	public code: number;

	constructor(url: string, code: number) {
		super("EHTTPERROR");

		this.url = url;
		this.code = code;
	}
}
