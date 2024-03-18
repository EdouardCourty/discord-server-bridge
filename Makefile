NODE = node
YARN = yarn
PM2  = pm2

##
##        ✨✨✨ The Discord Server Bridge Makefile ✨✨✨
##
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' Makefile | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'


install: ## Installs the dependencies
	$(YARN) install

deploy-production: ## Deploys the bot to production
	$(PM2) deploy production

eslint: ## Runs ESLint on the src directory
	$(YARN) eslint src

# These line avoid make to confuse argument with target
%:
	@:
