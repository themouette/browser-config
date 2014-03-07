# test in node environment using mocha client
test-node:
	./node_modules/.bin/mocha --require should --reporter list ${ARGS} test/tests/*.js

# Launches unit tests in casperjs environment
test-unit-casper:
	./node_modules/.bin/casperjs test test/casper.js

# Run tests in all environments.
# `ARGS` value is forwarded:
#
# ``` sh
# $ make ARGS="--reporter dot" test
# ```
test: test-node test-unit-casper

.PHONY: test
