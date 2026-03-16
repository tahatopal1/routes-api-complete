# 🛣️ Case Study: Route API

A full-stack application designed to show fundamental software programming and development skills, based on a simulated scenario where users can register locations, transportations and query some routes based on the same data.  

## ✨ Key Features

* **Routing Logic:** Calculates available routes between origin and destination points (Airports, Venues) using varying transportation types.
* **Secure Authentication:** Stateless, HTTP-only cookie-based JWT authentication, protecting endpoints based on `ADMIN` and `AGENCY` roles.
* **Caching:** Redis integration for fast retrieval of route calculations.
* **Data Integrity:** SQL DB integration for providing a consistent data through normalized DB tables.
* **Interactive Documentation:** Fully auto-generated OpenAPI 3.0 specification via Swagger UI.

---

## 🏗️ Architecture & Tech Stack

This project is split into a decoupled frontend and backend, orchestrated entirely via Docker.

**Backend:** Java 21, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, Flyway.

**Frontend:** React 18 (Vite based)

**Infrastructure:** MySQL 8, Redis, Docker.

---

## 🚀 Quick Start (Local Development)

The entire application stack is containerized. You do not need Java, Node.js, or any databases installed locally to run this project.

### Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tahatopal1/routes-api-complete
```

2. Build and spin up the containers:
```bash
docker compose up --d
```

*(Note: The initial build may take a few minutes as Docker fetches the database images and compiles the Java and React applications via multi-stage builds).*

### Accessing the Application

Once the terminal logs indicate that the backend has started, the system is fully accessible:

* **🖥️ Frontend UI (React/Vite):** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **⚙️ Backend API Base URL:** `http://localhost:8080`
* **📖 Swagger API Documentation:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 🧪 Testing the API (Swagger UI)

The backend features a fully interactive Swagger UI to explore the endpoints.

Because the API uses strict **HttpOnly Cookie Authentication**, please follow these steps to test secure endpoints:

1. Navigate to the `/login` endpoint in the Swagger UI. Credentials are:
* **Role:** `ADMIN`, **Email:** `admin@route.com`, **Password:** `admin123`
* **Role:** `AGENCY`, **Email:** `agency@route.com`, **Password:** `agency123`
2. Execute the request with valid credentials. The browser will automatically capture and store the secure JWT cookie.
3. You may now execute requests against any secured endpoint (like `/routes` or `/locations`). The browser will handle injecting the authentication cookie automatically.
4. `/locations` or `/transportations` endpoints were secured by the role called `ADMIN`. You can reach only to `/routes` endpoint via `AGENCY` role.

---

## 🧹 Project Teardown

To gracefully stop the application and remove the containers, run:

```bash
docker compose down
```

To completely wipe the database and cache volumes to start fresh next time:

```bash
docker compose down -v
```

---
