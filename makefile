
test: 
	@./node_modules/.bin/mocha \
		--slow 200ms \
		--bail

test-dev: 
	@NODE_DEBUG='request metainspector' ./node_modules/.bin/mocha \
		--slow 200ms \
		--bail

clean:
	@rm -rf dist
	@rm -rf components
	@rm -rf build
	@rm -rf docs

.PHONY: test