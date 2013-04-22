REPORTER = List

test: 
	@./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--slow 200ms \
		--bail

clean:
	@rm -rf dist
	@rm -rf components
	@rm -rf build
	@rm -rf docs

.PHONY: test