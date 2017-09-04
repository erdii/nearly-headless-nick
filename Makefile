VERSION := $(shell jq -r '.version' package.json)
NAME := $(shell jq -r '.name' package.json)
BUILD_PATH := .build
RELEASE_PATH := .release
RELEASE_FILE := $(shell ls -Art $(RELEASE_PATH) | grep '.zip' | grep -v 'latest' | tail -n 1)
DOCKER_REPO := erdii

.PHONY: build
build: clean copy-pkg
	npm run build


.PHONY: release
release: build release-apidoc
	mkdir $(RELEASE_PATH) || true
	zip -j $(RELEASE_PATH)/$(NAME)_$(VERSION).zip $(BUILD_PATH)/*
	cp $(RELEASE_PATH)/$(NAME)_$(VERSION).zip $(RELEASE_PATH)/$(NAME)_latest.zip
	keybase pgp sign -d -i $(RELEASE_PATH)/$(NAME)_$(VERSION).zip -o $(RELEASE_PATH)/$(NAME)_$(VERSION).zip.asc
	cp $(RELEASE_PATH)/$(NAME)_$(VERSION).zip.asc $(RELEASE_PATH)/$(NAME)_latest.zip.asc


.PHONY: docker
docker: build
	sudo docker build . -t $(DOCKER_REPO)/$(NAME):latest -t $(DOCKER_REPO)/$(NAME):$(VERSION)


.PHONY: release-docker
release-docker: docker
	sudo docker push $(DOCKER_REPO)/$(NAME)


.PHONY: clean
clean:
	rm -r $(BUILD_PATH) || true


copy-pkg:
	mkdir $(BUILD_PATH) || true
	cp package.json package-lock.json $(BUILD_PATH)

.PHONY: apidoc
apidoc:
	npm run apidoc -- -i src/ -o apidoc/

.PHONY: release-apidoc
release-apidoc: apidoc
	git add apidoc/
	git commit -m "apidoc update"
	git subtree push --prefix apidoc origin gh-pages
