alias d := dev
alias l := lint
alias f := fix
alias e := e2e
alias u := unit

pm := "pnpm"

dev:
	{{pm}} dev

lint:
	{{pm}} lint

fix:
	{{pm}} lint --fix

e2e:
	{{pm}} test:e2e

unit:
	{{pm}} test:unit

build:
	{{pm}} build

preview:
	{{pm}} preview

previewBuild: build
	just preview