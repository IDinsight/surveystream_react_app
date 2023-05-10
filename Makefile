SHELL = /bin/sh

$(eval FRONTEND_NAME=dod_surveystream_frontend)
$(eval VERSION=0.1)
$(eval PROD_NEW_ACCOUNT=923242859002)
$(eval STAGING_ACCOUNT=210688620213)
$(eval ADMIN_ACCOUNT=077878936716)
$(eval DEV_ACCOUNT=453207568606)


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

image-stg:
	@docker build -f Dockerfile.client --build-arg BUILD_ENV="staging" --rm --platform=linux/amd64 -t $(FRONTEND_NAME):$(VERSION) . 
	@docker tag $(FRONTEND_NAME):$(VERSION) $(STAGING_ACCOUNT).dkr.ecr.ap-south-1.amazonaws.com/web-callisto-ecr-repository:frontend
	@aws ecr get-login-password \
    --region ap-south-1 \
	--profile surveystream_staging | \
	docker login \
    --username AWS \
    --password-stdin $(STAGING_ACCOUNT).dkr.ecr.ap-south-1.amazonaws.com
	@docker push $(STAGING_ACCOUNT).dkr.ecr.ap-south-1.amazonaws.com/web-callisto-ecr-repository:frontend

container-up-stg:
	# Configure ecs-cli options
	@ecs-cli configure --cluster web-callisto-cluster \
	--default-launch-type EC2 \
	--region ap-south-1 \
	--config-name dod-surveystream-web-app-config-frontend

	@STAGING_ACCOUNT=${STAGING_ACCOUNT} \
	ADMIN_ACCOUNT=${ADMIN_ACCOUNT} \
	ecs-cli compose -f docker-compose/docker-compose.stg.yml \
	--aws-profile surveystream_staging \
	--project-name app \
	--cluster-config dod-surveystream-web-app-config-frontend \
	--task-role-arn arn:aws:iam::$(STAGING_ACCOUNT):role/web-callisto-task-role \
	service up \
	--target-group-arn arn:aws:elasticloadbalancing:ap-south-1:$(STAGING_ACCOUNT):targetgroup/surveystream-callisto-lb-tg-443/a2fc23d27adbdc2d \
	--container-name app \
	--container-port 80 \
	--create-log-groups \
	--deployment-min-healthy-percent 0

container-down-stg:
	@ecs-cli compose -f docker-compose/docker-compose.stg.yml \
	--aws-profile surveystream_staging \
	--region ap-south-1 \
	--project-name app \
	--cluster-config dod-surveystream-web-app-config-frontend \
	--cluster web-callisto-cluster \
	service down --timeout 10

image-prod-new:
	@docker build -f Dockerfile.client --build-arg BUILD_ENV="staging" --rm --platform=linux/amd64 -t $(FRONTEND_NAME):$(VERSION) . 
	@docker tag $(FRONTEND_NAME):$(VERSION) $(PROD_NEW_ACCOUNT).dkr.ecr.ap-south-1.amazonaws.com/web-ecr-repository:frontend
	@aws ecr get-login-password \
    --region ap-south-1 \
	--profile surveystream_prod | \
	docker login \
    --username AWS \
    --password-stdin $(PROD_NEW_ACCOUNT).dkr.ecr.ap-south-1.amazonaws.com
	@docker push $(PROD_NEW_ACCOUNT).dkr.ecr.ap-south-1.amazonaws.com/web-ecr-repository:frontend

container-prod-new:
	# Configure ecs-cli options
	@ecs-cli configure --cluster web-cluster \
	--default-launch-type EC2 \
	--region ap-south-1 \
	--config-name dod-surveystream-web-app-config

	@PROD_NEW_ACCOUNT=${PROD_NEW_ACCOUNT} \
	ADMIN_ACCOUNT=${ADMIN_ACCOUNT} \
	ecs-cli compose -f docker-compose/docker-compose.prod-new.yml \
	--aws-profile surveystream_prod \
	--project-name dod-surveystream-web-app \
	--cluster-config dod-surveystream-web-app-config \
	--task-role-arn arn:aws:iam::$(PROD_NEW_ACCOUNT):role/web-task-role \
	service up \
	--target-group-arn arn:aws:elasticloadbalancing:ap-south-1:$(PROD_NEW_ACCOUNT):targetgroup/surveystream-lb-tg-443/13b8531a30c92246 \
	--container-name client \
	--container-port 80 \
	--create-log-groups \
	--deployment-min-healthy-percent 0

down-prod-new:
	@ecs-cli compose -f docker-compose/docker-compose.prod-new.yml \
	--aws-profile surveystream_prod \
	--region ap-south-1 \
	--project-name dod-surveystream-web-app \
	--cluster-config dod-surveystream-web-app-config \
	--cluster web-cluster \
	service down --timeout 10

image-prod:
	@docker build -f Dockerfile.api --rm --build-arg NAME=$(BACKEND_NAME) --build-arg PORT=$(BACKEND_PORT) -t $(BACKEND_NAME):$(VERSION) . 
	@docker tag $(BACKEND_NAME):$(VERSION) 678681925278.dkr.ecr.ap-south-1.amazonaws.com/dod-surveystream-web-app:backend
	@$$(aws ecr get-login --no-include-email --region ap-south-1)
	@docker push 678681925278.dkr.ecr.ap-south-1.amazonaws.com/dod-surveystream-web-app:backend

	@docker build -f Dockerfile.client --rm -t $(FRONTEND_NAME):$(VERSION) . 
	@docker tag $(FRONTEND_NAME):$(VERSION) 678681925278.dkr.ecr.ap-south-1.amazonaws.com/dod-surveystream-web-app:frontend
	@$$(aws ecr get-login --no-include-email --region ap-south-1)
	@docker push 678681925278.dkr.ecr.ap-south-1.amazonaws.com/dod-surveystream-web-app:frontend

container-up-prod:
	# Configure ecs-cli options
	@ecs-cli configure --cluster dod-surveystream-web-app-cluster \
	--default-launch-type EC2 \
	--region ap-south-1 \
	--config-name dod-surveystream-web-app-config

	@ecs-cli compose -f docker-compose/docker-compose.aws.yml \
	--project-name dod-surveystream-web-app \
	--cluster-config dod-surveystream-web-app-config \
	--task-role-arn arn:aws:iam::678681925278:role/dod-surveystream-web-app-task-role \
	service up \
	--target-group-arn arn:aws:elasticloadbalancing:ap-south-1:678681925278:targetgroup/dod-surveystream-web-app-tg-443/440079da841258e5 \
	--container-name client \
	--container-port 80 \
	--create-log-groups \
	--deployment-min-healthy-percent 0

container-down-prod:
	@ecs-cli compose -f docker-compose/docker-compose.aws.yml \
	--project-name dod-surveystream-web-app \
	--cluster-config dod-surveystream-web-app-config \
	service down