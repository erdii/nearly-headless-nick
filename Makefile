VERSION := $(shell jq -r '.version' package.json)
NAME := $(shell jq -r '.name' package.json)
RELEASE_PATH = release
RELEASE_FILE := $(shell ls -Art $(RELEASE_PATH) | grep '.zip' | grep -v 'latest' | tail -n 1)

.PHONY: build
build:
	npm run build

.PHONY: release
release: build
	mkdir $(RELEASE_PATH) || true
	zip -j $(RELEASE_PATH)/$(NAME)_$(VERSION).zip build/*
	cp $(RELEASE_PATH)/$(NAME)_$(VERSION).zip $(RELEASE_PATH)/$(NAME)_latest.zip
	keybase pgp sign -d -i $(RELEASE_PATH)/$(NAME)_$(VERSION).zip -o $(RELEASE_PATH)/$(NAME)_$(VERSION).zip.asc
	cp $(RELEASE_PATH)/$(NAME)_$(VERSION).zip.asc $(RELEASE_PATH)/$(NAME)_latest.zip.asc

.PHONY: docker
docker: build
	sudo docker build . -t $(NAME):latest -t $(NAME):$(VERSION)
