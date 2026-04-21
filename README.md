# weather-app

React + Vite frontend, Node/Express backend, MariaDB. Fully containerised.

## Running

Copy `.env.example` to `.env` and fill in the values before starting.

```bash
# Dev - HMR (Vite on :5173) + nodemon, source mounted as volumes
docker compose -f compose.yml -f compose.dev.yml up

# Prod-like - built static files served by nginx on :8080
docker compose up --build

# Preview the final merged config before starting (resolves all env vars and overrides)
docker compose -f compose.yml -f compose.dev.yml config   # dev
docker compose config                                      # prod

# Force rebuild images and recreate containers (e.g. after changing Dockerfile or dependencies)
docker compose -f compose.yml -f compose.dev.yml up --build --force-recreate    # dev
docker compose up --build --force-recreate                                      # prod
```

## Architecture decisions

**Proxy layer owns the backend URL (not the frontend)**
The React code always fetches `/api/...` as a relative path. In prod nginx proxies it to the `backend` container; in dev Vite's built-in `server.proxy` does the same. This avoids baking a URL into the JS bundle and keeps the frontend code environment-agnostic.

**`VITE_*` vars are build-time only (not runtime)**
Vite "bakes in" env vars during `npm run build` into a bundle, so setting them in `compose.yml` at container start has no effect on an already-built bundle. The proxy approach sidesteps this entirely.

**`compose.dev.yml` overrides existing values**
`compose.dev.yml` is a merge file. It swaps the built images for stock `node:current-alpine` with source volumes, leaving MariaDB untouched so both environments share the same database service.

**Named volumes keep `node_modules` between sessions**
Mounting `./frontend:/app` would overwrite the container's `node_modules` with whatever is (or isn't) on the host. A named volume at `/app/node_modules` takes precedence and persists across restarts, so `npm install` only runs on first start.

**WSL2 polling for HMR**
`vite.config.ts` sets `server.watch.usePolling: true` because inotify events do not cross the WSL/Windows filesystem boundary, which would silently break hot reload without it.
