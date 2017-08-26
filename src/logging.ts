import * as debug from "debug";

const appName = "HEADLESS";

export function createLogger(moduleName: string) {
	return debug(appName + ":" + moduleName);
}
