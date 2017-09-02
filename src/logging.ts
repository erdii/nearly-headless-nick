import * as debug from "debug";

const appName = "HEADLESS";

/**
 * createLogger("moduleName")
 *
 * creates a logger with the scope HEADLESS:moduleName
 *
 * @export
 * @param {string} moduleName module scope
 * @returns {(formatter: string, ...args: any[]) => void} scoped logging function
 */
export function createLogger(moduleName: string) {
	return debug(appName + ":" + moduleName);
}
