# Signup Demo Project

## Description
A simple API for user registration and login using Node.js, Express, and MongoDB Atlas.

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- CORS

## Project Structure
```
📁 shorouk 9/
├── 📁 models/
│   └── User.js              # User schema and password encryption
├── 📁 node_modules/          # Dependencies (don't touch)
├── 📄 .env                   # Environment variables (MongoDB URI, PORT)
├── 📄 package.json           # Project metadata and dependencies
├── 📄 server.js              # Main server file with all APIs
└── 📄 README.md              # This file
```

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Open your browser at:**
   ```
   http://localhost:3000
   ```

## Environment Variables (.env)
The `.env` file contains:
```
MONGODB_URI=mongodb://Electracore:Shorouk9@ac-qoaciyj-shard-00-00.m4fef83.mongodb.net:27017,ac-qoaciyj-shard-00-01.m4fef83.mongodb.net:27017,ac-qoaciyj-shard-00-02.m4fef83.mongodb.net:27017/signup-demo?ssl=true&replicaSet=atlas-tz7uq4-shard-0&authSource=admin&appName=Cluster0
PORT=3000
NODE_ENV=development
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and status |
| GET | `/api/users` | Get all registered users |
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login existing user |

## API Usage Examples

### Register a new user
**Request:**
```bash
POST /api/register
Content-Type: application/json

{
    "first": "Ahmed",
    "last": "Mohamed",
    "email": "ahmed@example.com",
    "password": "123456"
}
```

**Response:**
```json
{
    "ok": true,
    "message": "تم تسجيل المستخدم بنجاح",
    "user": {
        "id": "...",
        "first": "Ahmed",
        "last": "Mohamed",
        "email": "ahmed@example.com",
        "created": "..."
    }
}
```

### Login
**Request:**
```bash
POST /api/login
Content-Type: application/json

{
    "email": "ahmed@example.com",
    "password": "123456"
}
```

**Response:**
```json
{
    "ok": true,
    "message": "تم تسجيل الدخول بنجاح",
    "user": {
        "id": "...",
        "first": "Ahmed",
        "last": "Mohamed",
        "email": "ahmed@example.com"
    }
}
```

### Get all users
**Request:**
```bash
GET /api/users
```

**Response:**
```json
{
    "ok": true,
    "count": 1,
    "users": [
        {
            "id": "...",
            "first": "Ahmed",
            "last": "Mohamed",
            "email": "ahmed@example.com",
            "created": "..."
        }
    ]
}
```

## Features
- ✅ User registration with encrypted passwords (bcryptjs)
- ✅ User login with password verification
- ✅ MongoDB Atlas cloud database
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled

## Project Status
✅ **Complete and fully functional**
- Server running on port 3000
- MongoDB connected successfully
- All APIs tested and working

## Author
**Shorouk**

## Date
March 2026 - Ramadan 1446