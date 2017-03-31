SHELL = /bin/sh

# Run tests for local development
test:
	touch .env
	cd docker/test && docker-compose run --rm  test

serve:
	cd docker/dev && docker-compose up --build


