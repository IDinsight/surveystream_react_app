SHELL = /bin/sh

$(eval FRONTEND_NAME=surveystream_frontend)
$(eval FRONTEND_NAME_TEST=surveystream_frontend_test)
$(eval VERSION=0.1)
$(eval PROD_NEW_ACCOUNT=923242859002)
$(eval STAGING_ACCOUNT=210688620213)
$(eval ADMIN_ACCOUNT=077878936716)
$(eval DEV_ACCOUNT=453207568606)

test-image:
	@docker build -f Dockerfile.client.test --build-arg BUILD_ENV="development" --rm --platform=linux/amd64 -t $(FRONTEND_NAME_TEST):$(VERSION) . 
	@docker run -it --rm -v $(PWD):/app -w /app $(FRONTEND_NAME_TEST):$(VERSION) /bin/bash npm run cypress:run 


login:
	@export AWS_PROFILE=surveystream_dev
	@aws sso login --profile surveystream_dev

image:
	@docker build -f Dockerfile.client --build-arg BUILD_ENV="development" --rm --platform=linux/amd64 -t $(FRONTEND_NAME):$(VERSION) . 

image-test:
	@docker build -f Dockerfile.test --build-arg BUILD_ENV="development" --rm --platform=linux/arm64/v8 -t $(FRONTEND_NAME):$(VERSION) . 

web-db-tunnel:
	# Open a connection to the remote db via the bastion host
	@aws ssm start-session \
	--target i-0ddd10471f2a098be \
	--profile surveystream_dev \
	--region ap-south-1 \
	--document-name AWS-StartPortForwardingSession \
	--parameters '{"portNumber":["5433"],"localPortNumber":["5432"]}'

container-up:
	# Start a local version of the web app that uses the DoD dev database
	@FRONTEND_NAME=${FRONTEND_NAME} \
	VERSION=${VERSION} \
	docker-compose -f docker-compose/docker-compose.e2e-test.yml -f docker-compose/docker-compose.override.yml up --exit-code-from cypress;


container-down:
	@FRONTEND_NAME=${FRONTEND_NAME} \
	VERSION=${VERSION} \
	docker-compose -f docker-compose/docker-compose.remote-dev-db.yml down