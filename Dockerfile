##################
## BUILD LAYER ###
##################
FROM node:24 AS build

WORKDIR /app

COPY . .

ENV CI=true
ENV NODE_ENV=production
# relative paths for env vars (app doesn't support absolute paths yet)
ENV NOTE_DIR=./data/
ENV DATABASE_URL=./data/.database.db

# absolute paths for volumes
VOLUME /app/data/

RUN npm install -g pnpm
RUN pnpm i

RUN pnpm build


#################
### RUN LAYER ###
#################
FROM node:24-alpine AS run

WORKDIR /app

# Build artifacts
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/*.lock /app/
# Drizzle migrations
COPY --from=build /app/drizzle /app/drizzle

RUN npm install -g pnpm
RUN pnpm install --production

ENV NODE_ENV=production
ENV NOTE_DIR=./data/
ENV DATABASE_URL=./data/.database.db

VOLUME /app/data/


# TODO: Create data folders
# TODO: Run migrations

EXPOSE 3000

CMD ["node", "build/index.js"]