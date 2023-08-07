SHELL = /bin/sh

$(eval FRONTEND_NAME=surveystream_frontend)
$(eval FRONTEND_NAME_TEST=surveystream_frontend_test)
$(eval VERSION=0.1)
$(eval PROD_NEW_ACCOUNT=923242859002)
$(eval STAGING_ACCOUNT=210688620213)
$(eval ADMIN_ACCOUNT=077878936716)
$(eval DEV_ACCOUNT=453207568606)

test-image:
	@docker build -f Dockerfile.test --build-arg BUILD_ENV="development" --rm --platform=linux/amd64 -t $(FRONTEND_NAME_TEST):$(VERSION) . 
	@docker run -it -v $PWD:/app -w /app $(FRONTEND_NAME_TEST):$(VERSION) npm run cypress:run

image:
	@docker build -f Dockerfile.client --build-arg BUILD_ENV="development" --rm --platform=linux/amd64 -t $(FRONTEND_NAME):$(VERSION) . 

container-up:
	# Start a local version of the web app that uses the DoD dev database
	@FRONTEND_NAME=${FRONTEND_NAME} \
	VERSION=${VERSION} \
	docker-compose -f docker-compose/docker-compose.remote-dev-db.yml up -d

container-down:
	@FRONTEND_NAME=${FRONTEND_NAME} \
	VERSION=${VERSION} \
	docker-compose -f docker-compose/docker-compose.remote-dev-db.yml down