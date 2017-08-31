# Nearly Headless Nick

puppeteer + express = screenshots of websites :3

this is WIP!

puppeteer docs: https://github.com/GoogleChrome/puppeteer/blob/v0.10.0/README.md

example url: http://localhost:3000/cs?url=www.youtube.com%2Fwatch%3Fv%3DQzBsdMfmCZU?w=2000&sw=1000

* `npm run release` -> make and sign a release
* `npm run watch` -> build and watch file changes
* `npm run build` -> build

* test the docker container: `sudo docker run -p 3001:3000 -e CACHE_HOST=192.168.178.45 nearly-headless-nick:latest`
* configurable options can be looked up in `src/config.ts`
