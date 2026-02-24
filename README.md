# 🏦 PaisaBank — AI-Powered Banking Application

<div align="center">

![PaisaBank](https://img.shields.io/badge/PaisaBank-Smart%20Banking-f59e0b?style=for-the-badge&logo=landmark&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=for-the-badge&logo=mongodb&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-llama3.2-ff6b35?style=for-the-badge)

**Developed by [Ankita Ubale](https://github.com/ankitaubale)**

*A full-stack modern banking application with AI assistant, real-time transactions, and secure authentication.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🌟 Overview

**PaisaBank** is a full-stack banking web application built with the MERN stack (MongoDB, Express, React, Node.js). It provides users with a complete digital banking experience — from managing multiple bank accounts and real-time transactions to an AI-powered financial assistant powered by Ollama's llama3.2 model running locally.

The application features a sleek dark navy-and-gold UI, JWT-based authentication, role-based admin access, and a fully responsive layout.

---

## ✨ Features

### 👤 User Features
- **Authentication** — Secure registration and login with JWT tokens and bcrypt password hashing
- **Dashboard** — Real-time portfolio overview with balance chart and quick actions
- **Account Management** — Create, edit, and delete Savings, Checking, and Business accounts
- **Transactions** — Deposit, withdraw, and transfer funds between accounts instantly
- **AI Assistant** — Chat with BankBot powered by Ollama llama3.2 for financial advice
- **Profile** — Update personal information and manage account settings

### 🛡️ Admin Features
- **Admin Dashboard** — System-wide statistics (total users, accounts, transactions, balance)
- **User Management** — View all users, promote/demote admin roles, delete users
- **Account Overview** — Browse all customer accounts across the system
- **Transaction Monitor** — View and filter all system-wide transactions

### 🔒 Security
- JWT authentication with 7-day token expiry
- Bcrypt password hashing (12 salt rounds)
- Protected routes on both frontend and backend
- Role-based access control (user / admin)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose     |
|----------- |---------------------------||
| React      | 18.2    | UI Framework |
| Vite       | 5.x     | Build Tool & Dev Server |
| RRD        | 6.x     | Client-side Routing |
| Axios      | 1.6     | HTTP Client |
| Recharts   | 2.x     | Data Visualization |
| Lucide React | 0.294 | Icon Library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js    | 22.x | Runtime |
| Express    | 4.18 | Web Framework |
| Mongoose   | 8.x | MongoDB ODM |
| JSON Web Token | 9.x | Authentication |
| Bcryptjs   | 2.4 | Password Hashing |
| node-fetch | 3.x | Ollama API Calls |
| dotenv      | 16.x | Environment Variables |
| nodemon     | 3.x | Dev Auto-restart |

### Database & AI
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud Database |
| Ollama + llama3.2 | Local AI Model |

---

## 📁 Project Structure

```
bank-app/
│
├── 📂 backend/
│   ├── 📂 controllers/
│   │   ├── authController.js        # Register, login, profile CRUD
│   │   ├── accountController.js     # Account CRUD operations
│   │   ├── transactionController.js # Deposit, withdraw, transfer
│   │   ├── aiController.js          # Ollama AI chat integration
│   │   └── 
│   │
│   ├── 📂 middleware/
│   │   ├── auth.js                  # JWT protect middleware
│   │   └── adminAuth.js             # Admin role guard
│   │
│   ├── 📂 models/
│   │   ├── User.js                  # User schema with bcrypt
│   │   ├── Account.js               # Bank account schema
│   │   └── Transaction.js           # Transaction schema
│   │
│   ├── 📂 routes/
│   │   ├── auth.js                  # /api/auth routes
│   │   ├── accounts.js              # /api/accounts routes
│   │   ├── transactions.js          # /api/transactions routes
│   │   ├── ai.js                    # /api/ai routes
│   │   └── admin.js                 # /api/admin routes
│   │
│   ├── .env                         # Environment variables (create this)
│   ├── .env.example                 # Environment template
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Layout.jsx           # Main sidebar layout
│   │   │   └── AdminLayout.jsx      # Admin sidebar layout
│   │   │
│   │   ├── 📂 context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Accounts.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── 📂 admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminAccounts.jsx
│   │   │       └── AdminTransactions.jsx
│   │   │
│   │   ├── App.jsx                  # Routes & guards
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   │
│   ├── index.html
│   ├── vite.config.js               # Vite + API proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| Node.js | v18 or higher | https://nodejs.org |
| MongoDB | Atlas (cloud) or local | https://mongodb.com |
| Ollama | Latest | https://ollama.ai |
| Git | Any | https://git-scm.com |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ankitaubale/PaisaBank.git
cd bank-app
```

---

### Step 2 — Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env      # Windows
# OR
cp .env.example .env        # Mac/Linux

# Edit .env with your values (see Environment Variables section)
# Then start the backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected
```

---

### Step 3 — Setup Frontend

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 4 — Setup Ollama AI (Optional)

```bash
# Install Ollama from https://ollama.ai, then:

# Start Ollama server
ollama serve

# Pull the AI model (in a new terminal)
ollama pull llama3.2
```

> **Note:** The app works fully without Ollama. The AI Assistant will show an offline message if Ollama is not running.

---

### Step 5 — Open the App

Visit **http://localhost:5173** in your browser.

Register a new account and start banking! 🎉

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` folder with these values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bankapp_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens | Any long random string |
| `OLLAMA_URL` | Ollama server URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | AI model to use | `llama3.2` or `tinyllama` |

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create new user account | ❌ |
| POST | `/login` | Login and get JWT token | ❌ |
| GET | `/profile` | Get current user profile | ✅ |
| PUT | `/profile` | Update user profile | ✅ |
| DELETE | `/profile` | Delete user account | ✅ |

### Account Routes — `/api/accounts`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create new bank account | ✅ |
| GET | `/` | Get all user accounts | ✅ |
| GET | `/:id` | Get single account | ✅ |
| PUT | `/:id` | Update account | ✅ |
| DELETE | `/:id` | Delete account | ✅ |

### Transaction Routes — `/api/transactions`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/deposit` | Deposit funds | ✅ |
| POST | `/withdraw` | Withdraw funds | ✅ |
| POST | `/transfer` | Transfer between accounts | ✅ |
| GET | `/account/:id` | Get account transactions | ✅ |

### AI Routes — `/api/ai`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/chat` | Chat with BankBot AI | ✅ |

### Admin Routes — `/api/admin`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/stats` | System-wide statistics | 👑 Admin |
| GET | `/users` | All users list | 👑 Admin |
| PUT | `/users/:id/role` | Change user role | 👑 Admin |
| DELETE | `/users/:id` | Delete user | 👑 Admin |
| GET | `/accounts` | All accounts | 👑 Admin |
| GET | `/transactions` | All transactions | 👑 Admin |

---

## 🎨 Screenshots

### Login Page
> Dark split-screen design with navy panel and stats on the left, login form on the right.

### Dashboard
> Real-time balance overview, quick action buttons (Deposit, Withdraw, Transfer, AI Chat), area chart, and accounts list.

### Accounts
> Card grid layout showing all bank accounts with balance, account type color coding, and edit/delete controls.

### Transactions
> Two-column layout with transaction form on the left and scrollable transaction history on the right.

### AI Assistant
> Full-height chat interface with BankBot, typing indicators, suggested questions, and real-time responses.

### Admin Panel
> System statistics cards, user management table with role controls, and transaction monitoring.

---

## 🔧 Available Scripts

### Backend
```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm run start    # Start without nodemon (production)
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🛡️ Making a User Admin

To promote a user to admin, run this in MongoDB Atlas query editor or MongoDB Compass:

```js
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```



🖥️ 1️⃣ Runtime & System Dependencies
These are the core system-level dependencies required to run the application.

| Dependency                 | Required Version           | Why It’s Needed                |
| -------------------------- | -------------------------- | ------------------------------ |
| Node.js                    | v18+ (Recommended v20 LTS) | Runs backend & builds frontend |
| npm                        | v9+                        | Package management             |
| MongoDB                    | Atlas (Cloud) or 6.x+      | Database                       |
| Git                        | Any                        | Source control                 |
| Ollama                     | Latest                     | AI model runtime               |
| Nginx (Production)         | 1.24+                      | Reverse proxy + static serving |
| Linux Server (Recommended) | Ubuntu 22.04 LTS           | Production deployment OS       |


⚙️ 2️⃣ Backend Dependencies (Node.js API)

All backend dependencies are defined in backend/package.json.

| Package      | Purpose                    |
| ------------ | -------------------------- |
| express      | Web framework              |
| mongoose     | MongoDB ODM                |
| jsonwebtoken | JWT authentication         |
| bcryptjs     | Password hashing           |
| dotenv       | Load environment variables |
| cors         | Cross-origin requests      |
| node-fetch   | Call Ollama AI API         |


Development Dependencies

| Package | Purpose                         |
| ------- | ------------------------------- |
| nodemon | Auto-restart during development |


🎨 3️⃣ Frontend Dependencies (React App)

Defined in frontend/package.json.

| Package          | Purpose            |
| ---------------- | ------------------ |
| react            | UI framework       |
| react-dom        | React rendering    |
| react-router-dom | Routing            |
| axios            | API communication  |
| recharts         | Data visualization |
| lucide-react     | Icons              |

Build Dependencies (Dev Dependencies)

| Package      | Purpose             |
| ------------ | ------------------- |
| vite         | Build tool          |
| tailwindcss  | Styling             |
| postcss      | CSS processing      |
| autoprefixer | CSS vendor prefixes |


- DevOps Responsibility

- DevOps must:

     --Install Node.js

    ---Run npm run build

    Deploy /dist folder to:

Nginx
Configure reverse proxy for /api

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

<div align="center">

### Ankita Ubale

[![GitHub](https://img.shields.io/badge/GitHub-ankitaubale-181717?style=for-the-badge&logo=github)](https://github.com/ankitaubale)
[![Email](https://img.shields.io/badge/Email-ankitaubalesocial@gmail.com-ea4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ankitaubale48@gmail.com)

*Built with ❤️ using React, Node.js, MongoDB, and Ollama AI*

</div>

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

**© 2026 Ankita Ubale — PaisaBank**

</div>
