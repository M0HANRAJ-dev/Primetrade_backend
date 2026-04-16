# Primetrade – Full Stack Task Manager

A scalable REST API with JWT authentication and role-based access control, built with Django REST Framework + React frontend.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Django 5.2, Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| Database | SQLite (dev) — swappable to PostgreSQL |
| Docs | Swagger UI via `drf-yasg` |
| Frontend | React + Vite, Axios |
| Security | CORS, password hashing, input validation, rate limiting |

---

## Project Structure

```
├── manage.py
├── requirements.txt
├── README.md
├── Primetrade_backend/     # Django config (settings, urls)
├── users/                  # User registration, login, profile
├── tasks/                  # Task CRUD with role-based access
└── frontend/               # React app (Vite)
    └── src/
        ├── api.js          # Axios instance with JWT interceptor
        ├── App.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Dashboard.jsx
```

---

## Backend Setup

```bash
git clone https://github.com/your-username/primetrade-backend.git
cd primetrade-backend

python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://localhost:8000`

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints

### Auth & Users — `/api/v1/users/`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users/register/` | Register a new user | No |
| POST | `/api/v1/users/login/` | Login and get JWT tokens | No |
| POST | `/api/v1/users/token/refresh/` | Refresh access token | No |
| GET | `/api/v1/users/profile/` | Get current user profile | Yes |

### Tasks — `/api/v1/tasks/`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/tasks/` | List tasks (own / all if admin) | Yes |
| POST | `/api/v1/tasks/` | Create a new task | Yes |
| GET | `/api/v1/tasks/{id}/` | Get a specific task | Yes |
| PUT | `/api/v1/tasks/{id}/` | Update a task | Yes (owner/admin) |
| PATCH | `/api/v1/tasks/{id}/` | Partially update a task | Yes (owner/admin) |
| DELETE | `/api/v1/tasks/{id}/` | Delete a task | Yes (owner/admin) |

---

## Authentication

Uses **JWT (JSON Web Tokens)**.

```
Authorization: Bearer <access_token>
```

- Access token expires in **1 hour**
- Refresh token expires in **7 days**
- Token is automatically refreshed via Axios interceptor

---

## Role-Based Access

| Role | Permissions |
|------|-------------|
| `user` | CRUD on own tasks only |
| `admin` | CRUD on all tasks |

Set `is_admin: true` during registration to create an admin user.

---

## API Documentation

- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

---

## Example Requests

### Register
```json
POST /api/v1/users/register/
{
  "username": "john",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "is_admin": false
}
```

### Login
```json
POST /api/v1/users/login/
{
  "username": "john",
  "password": "SecurePass123!"
}
```

### Create Task
```json
POST /api/v1/tasks/
Authorization: Bearer <access_token>

{
  "title": "My first task",
  "description": "Task description here",
  "completed": false
}
```

---

## Scalability Notes

- **Modular structure** — new apps (e.g., `products`, `notes`) can be added independently
- **Database** — swap SQLite for PostgreSQL by updating `DATABASES` in `settings.py`
- **Caching** — Redis can be integrated with `django-redis` for caching querysets
- **Rate limiting** — API throttling configured (20 req/min anon, 100 req/min user)
- **Docker** — containerize with a `Dockerfile` + `docker-compose.yml` for easy deployment
- **Load balancing** — stateless JWT auth works behind a load balancer (e.g., AWS ALB)
- **Microservices** — users and tasks apps are decoupled and can be extracted into separate services

---

## Security Practices

- Passwords hashed using Django's PBKDF2 algorithm
- JWT tokens with short expiry (1 hour access)
- Automatic token refresh via Axios interceptor
- Input validation via DRF serializers
- CORS configured
- API rate limiting to prevent abuse
- `SECRET_KEY` stored in `.env` (never committed to git)
