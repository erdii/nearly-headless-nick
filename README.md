# Nearly Headless Nick

puppeteer + express = screenshots of websites :3

this is WIP!

puppeteer docs: https://github.com/GoogleChrome/puppeteer/blob/3ce173c16bb9e8ae27ef148507c1bc2e1979645d/docs/api.md

example url: http://localhost:3000/http://outdatedbrowser.com?width=350&height=600

* `npm run release` -> make and sign a release
* `npm run watch` -> build and watch file changes
* `npm run build` -> build

* test the docker container: `sudo docker run -p 3001:3000 -e CACHE_HOST=192.168.178.45 nearly-headless-nick:latest`
* configurable options can be looked up in `src/config.ts`
