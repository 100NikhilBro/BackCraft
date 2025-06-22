# 🔧 AuthTask API – TypeScript Backend

A clean and scalable **TypeScript-based Express.js backend** featuring:

- JWT authentication with refresh token logic  
- Full CRUD operations for **users** and **tasks**  
- Secure password hashing with `secure-password`  
- Input sanitization using `sanitize-html`  
- Data validation via `zod`  
- MongoDB integration via Mongoose  
- Modular controller + middleware structure  
- Ideal for learning or kickstarting real-world projects


## 🚀 Features

### ✅ Authentication & Authorization
- **JWT Auth** (access + refresh tokens)
- Authenticated routes using **custom middleware**
- Refresh token handling via **HTTP-only cookies**

### 🧩 User Management
- Signup, login, logout
- Profile fetch/update
- Delete user with associated tasks
- Stores hashed passwords using `secure-password`

### 📌 Task Management
- Create, update, delete, and fetch tasks
- Tasks are linked to users using ObjectId reference
- Only authenticated users can manage their tasks

### 🛡 Security
- **`secure-password`** for strong password hashing using scrypt (more secure than bcrypt)
- **`sanitize-html`** for input sanitization (prevents XSS and injection attacks)
- **Zod schema validation** for body payloads
- Tokens verified and decoded securely

### 📦 Tech Stack
- Node.js + Express.js
- TypeScript
- MongoDB with Mongoose
- Zod
- JWT
- secure-password
- sanitize-html





