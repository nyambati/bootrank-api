SHELL = /bin/sh

# Run tests for local development
test:
	cd docker/test && docker-compose build && docker-compose run --rm  test

serve:
	cd docker/dev && docker-compose up --build
