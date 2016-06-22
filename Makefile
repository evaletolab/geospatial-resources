
#BRUNCH = ./node_modules/.bin/brunch
WEBPACK = ./node_modules/.bin/webpack
MOCHA 	= ./node_modules/.bin/mocha
install:
	npm install

test:
	NODE_ENV=test $(MOCHA) test

clean:
	rm -f dist 

devel:
	$(WEBPACK) --progress --colors

prod:
	$(WEBPACK) --progress --colors -p --config webpack.production.config.js



.PHONY: install test prod devel clean 
