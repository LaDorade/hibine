# Test Workflow

## Setup Functionning

The "scripts/dp-setup.ts" script, create a sqlite db in the folder `./test-data/` and create an user.

This is used before playwright (e2e) tests to have a clean and independent environment.

In `playwright.config.ts`, we build the server with the mode "test".
