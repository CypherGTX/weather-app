# 🚀 Weather App

This application is built using React and Node.js and integrates with the OpenWeatherMap API to fetch weather data by city.

By entering a city name in the search field, users can retrieve key weather information, including: location, temperature, humidity, wind speed, and weather status (e.g., clear, cloudy, etc.).

All fetched results are stored in a database and displayed on the frontend as an interactive table. The table supports filtering and sorting, allowing users to efficiently browse and analyze the collected weather data.
## 🛠 Tech Stack

**Frontend**
- Vite
- JavaScript / TypeScript
- React

**Backend**
- Node.js
- Express

**Database**
- MariaDB (or any SQL database)
- Runs inside Docker container

**DevOps / Tools**
- Docker
- Docker Compose

## ⚙️ Environment Variables

Create a `.env` file in the root (or backend) directory and configure the following:

| Variable     | Description                     | Example            |
|--------------|---------------------------------|--------------------|
| DB_HOST      | Database host                   | localhost:3306, mariadb (inside docker network)         |
| DB_PORT      | Database port                   | 3306 (default)      |
| DB_USER      | Database username               | custom_user (to avoid using root)           |
| DB_PASSWORD  | Database password               | password           |
| DB_NAME      | Database name                   | app_db             |
| PORT         | Backend server port             | 3000               |
| VITE_BACKEND_URL | URL to Backend Server (scope: Frontend)           | http://localhost:3000 |
| API_KEY      | Key used by backend to connect to external API | KEY |


## ▶️ How to Run (Local Development)


### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
````

### 2. Install dependencies

```bash
cd backend
npm install

cd frontend
npm install
```

### 3. Run database (Docker)

```bash
docker compose up mariadb -d
```

### 4. Start frontend and backend in shell

```bash
cd backend
npm run dev

cd frontend
npm run dev
```

## 🐳 Run with Docker (Full Setup)


### Build and start all services

```bash
docker compose up --build
```

### Run specific service

```bash
docker compose up <service> --build
```
Example:
```bash
docker compose up backend --build
docker compose up frontend --build
```

### Stop containers

```bash
docker compose down
```

## 🧩 Architecture Notes

* Database runs inside Docker in both local and containerized environments
* Backend connects to DB via internal Docker network (`DB_HOST=db`)
* Frontend communicates with backend via API (configured through `VITE_API_URL`)
* Vite is used for fast frontend development and hot reload

## 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
│
├── .env
├── docker-compose.yml
└── README.md
```

## 📌 Scripts (Example)


### Backend

```bash
npm run dev      # start with nodemon
npm run start    # production start
```

### Frontend

```bash
npm run dev      # start Vite dev server
npm run build    # production build
```

## 🧪 Future Improvements

* Add tests
* CI/CD pipeline
* Production-ready Docker setup
* Environment-specific configs
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
