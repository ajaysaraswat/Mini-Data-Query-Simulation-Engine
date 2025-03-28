# AI Analytics Query System

## Introduction
The **AI Analytics Query System** is a backend service that simulates natural language processing for database queries. It allows users to ask questions in plain English and receive structured data responses. The system includes authentication, query translation, and mock database interactions.

## Key Features
- **Natural language to SQL translation**
- **User authentication with JWT & cookies**
- **Mock database with sample data**
- **Query validation & explanation**
- **Error handling & security measures**

## System Architecture
```
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── database/        # Data layer
│   ├── middleware/      # Custom middleware
│   └── routes/          # API routes
```

## Setup Instructions

### 1️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣ Create `.env` File
```env
JWT_SECRET=your_secret_key
```

### 3️⃣ Start the Server
```sh
npm start
```
Server will run at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### 1️⃣ Register User
```http
POST /api/auth/register
```
📌 **Request:**
```json
{
    "username": "user@example.com",
    "password": "password123"
}
```
📌 **Response:**
```json
{
    "message": "User registered successfully",
    "user": { "id": 1, "username": "user@example.com" }
}
```

#### 2️⃣ Login
```http
POST /api/auth/login
```
📌 **Request:**
```json
{
    "username": "user@example.com",
    "password": "password123"
}
```
📌 **Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1...",
    "user": { "id": 1, "username": "user@example.com" }
}
```
🔹 **Token is returned in HTTP-only cookies. Use it for all further requests.**

### Query Endpoints

#### 1️⃣ Process Query
```http
POST /api/query
Authorization: Bearer <token>
```
📌 **Request:**
```json
{
    "query": "Show me all sales"
}
```
📌 **Response:**
```json
{"naturalQuery":"Show me all sales","sqlQuery":"SELECT * FROM sales","result":[{"id":1,"product":"Widget","amount":100,"date":"2024-01-01"},{"id":2,"product":"Gadget","amount":200,"date":"2024-01-02"},{"id":3,"product":"Device","amount":150,"date":"2024-01-03"}]}
```

#### 2️⃣ Explain Query
```http
POST /api/explain
Authorization: Bearer <token>
```
📌 **Response:**
```json
{
    "steps": [
        { "step": 1, "description": "Natural language parsing" },
        { "step": 2, "description": "Entity recognition" },
        { "step": 3, "description": "SQL translation" }
    ],
    "translatedSQL": "SELECT * FROM sales"
}
```

#### 3️⃣ Validate Query
```http
POST /api/validate
Authorization: Bearer <token>
```
📌 **Valid Request:**
```json
{
    "query": "How many customers do we have?"
}
```
📌 **Valid Response:**
```json
{ "valid": true }
```

📌 **Invalid Request:**
```json
{
    "query": "DELETE everything"
}
```
📌 **Invalid Response:**
```json
{ "error": "Query contains unsupported operations" }
```

## Database Structure
The **mock database** is stored in memory and resets when the server restarts.
```json
{
    "users": [
        { "id": 1, "username": "admin", "password": "hashed_password" }
    ],
    "sales": [
        { "id": 1, "product": "Laptop", "amount": 1200, "date": "2024-03-01" }
    ],
    "customers": [
        { "id": 1, "name": "John Doe", "email": "john@example.com" }
    ]
}
```

## Query Translation Logic
### Pattern Matching for Natural Queries → SQL
```js
static patterns = {
    show: /^show\s+me\s+/i,
    get: /^get\s+/i,
    count: /count|number\s+of/i
};
```

### Basic Queries → SQL
```js
static handleBasicQuery(query) {
    return `SELECT * FROM sales`;
}
```

### Count Queries → SQL
```js
static handleCountQuery(query) {
    return `SELECT COUNT(*) as count FROM customers`;
}
```

### Aggregate Queries → SQL
```js
static handleAggregateQuery(query) {
    return `SELECT AVG(amount) as average FROM sales`;
}
```

## Authentication System

### JWT Implementation
```js
const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "24h" }
);
```

### Secure Cookie Storage
```js
res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
});
```

## Error Handling
✅ **Invalid Queries:** `{ "error": "Query contains unsupported operations" }`
✅ **Authentication Required:** `{ "error": "Authentication required" }`
✅ **Invalid Credentials:** `{ "error": "Invalid username or password" }`

## Best Practices

🔹 **Security**
- Use **HTTP-only cookies** for tokens
- **Hash passwords** before storing
- Implement **rate-limiting** for login attempts

🔹 **Error Handling**
- Return **meaningful error messages**
- **Log errors** for debugging
- Handle **edge cases properly**

🔹 **Code Organization**
- Separate **controllers, services, and routes**
- Use **meaningful variable names**
- Write **clean and modular code**

## How to Run the Database?
This project **uses an in-memory mock database** that resets when the server restarts. **No external database is needed.**

If you want to **persist data**, consider using **SQLite or MongoDB.**

## 🚀 Conclusion
This project **simulates AI-powered query processing** by converting **natural language to SQL.** It includes **authentication, error handling, and a mock database.**



