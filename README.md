# Nearly Headless Nick

Website screenshots as a (micro-)service!

-> EXPERIMENTAL

This is a small microservice based on *chrome-headless* and *express* that makes you wonderful screenshots of
* websites given by url
* posted html

### Installation
* docker:
	* run `docker run --rm -p 3000:3000 -e CACHE_HOST=IP.TO.REDIS.SERVER erdii/nearly-headless-nick:lastest`
* bare:
	* clone repository
	* run `make release`, find the release in `.release`
	* extract the release on your server: `unzip release.zip`
	* cd into the unzipped folder
	* install dependencies: `npm install --production`
	* run the server with `npm start`


### Configuration

The server can be configured using envvars, command-line args and a config file. See `src/config.ts` for more.


### Usage

[api documentation can be found here!](https://erdii.github.io/nearly-headless-nick/)


### Development

* `npm run watch` -> build and watch file changes
* `make build` -> build
* `make release` -> make and sign a release
* `make docker` -> build and create docker image


* test the docker container: `docker run --rm -p 3001:3000 -e DEBUG=HEADLESS:* -e CACHE_HOST=192.168.178.45 nearly-headless-nick:latest`
* configurable options can be looked up in `src/config.ts`
