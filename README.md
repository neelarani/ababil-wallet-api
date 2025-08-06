# Ababil Wallet API

A **secure**, **scalable**, and **feature-rich** RESTful API built with
**Express.js**, **TypeScript**, and **MongoDB** — powering the core operations
of the `Ababil Wallet System`.

From user onboarding to wallet management, from transaction tracking to balance
operations — everything is handled with clean code architecture, centralized
error handling, and Zod validation for peace of mind.

## 🌐 Base URL

| Environment | URL                                           |
| ----------- | --------------------------------------------- |
| Development | `http://localhost:<PORT>/api/v1`              |
| Production  | `https://ababil-wallet-api.vercel.app/api/v1` |

## 🚀 Key Features

- 👤 **Authentication & Authorization** (Credentials + Google OAuth)
- 💳 **Wallet Operations**: Top-up, Withdraw, Transfer, Cash In/Out
- 🔁 **Transaction History** with filtering and sorting
- 📊 **Wallet Summary & Analytics**
- 🛡️ **Secure Input Validation** using **Zod**
- 🧼 **Clean & Modular Code** with centralized error handling
- 📧 **Password Reset & Email Verification**

## 📁 Project Structure

```bash
~/ababil-wallet-api
├── scripts/                  # Shell scripts
│   ├── app.sh
│   └── push.sh
├── src/
│   ├── app/                  # Core application
│   │   ├── errors/           # Error handlers
│   │   ├── middlewares/      # Express middlewares
│   │   ├── modules/          # Feature modules (auth, user, wallet, etc.)
│   │   └── routes/           # Main route entrypoint
│   ├── config/               # Configs (env, DB, mail, passport)
│   ├── interface/            # TypeScript interfaces and declarations
│   ├── shared/               # Helpers, constants, templates, utils
│   ├── _app.ts               # Express App setup
│   ├── _server.ts            # Server boot file
│   └── index.ts              # Entry file
├── .env                      # Environment variables
├── .env.example              # Sample .env
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # This file
```

## 📌 API Endpoints

### 🔗 Root

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| `GET`  | `/`      | API is alive check |

### 🔐 Auth

| Method   | Endpoint                                  | Description                      |
| -------- | ----------------------------------------- | -------------------------------- |
| `POST`   | `/auth/login`                             | Login with credentials           |
| `POST`   | `/auth/get-verify-token`                  | Request email verification token |
| `GET`    | `/auth/access-token`                      | Get new access token             |
| `DELETE` | `/auth/logout`                            | Logout user                      |
| `GET`    | `/auth/google`                            | Google OAuth login               |
| `POST`   | `/auth/forgot-password`                   | Initiate password reset          |
| `POST`   | `/auth/reset-password?resetToken=<token>` | Reset password                   |

### 👥 User

| Method  | Endpoint                       | Description             |
| ------- | ------------------------------ | ----------------------- |
| `POST`  | `/user/register`               | Register new user       |
| `GET`   | `/user/get-all-users`          | List all users          |
| `GET`   | `/user/request-for-agent`      | Request to become agent |
| `PATCH` | `/user/update-to-agent-status` | Update to agent         |
| `PATCH` | `/user/edit`                   | Edit profile            |
| `GET`   | `/user/<userId>`               | Get single user         |

### 💰 Transactions

| Method | Endpoint                                                          | Description                |
| ------ | ----------------------------------------------------------------- | -------------------------- |
| `POST` | `/transaction/top-up`                                             | Top-up wallet              |
| `POST` | `/transaction/withdraw`                                           | Withdraw money             |
| `POST` | `/transaction/send-money`                                         | Send money to another user |
| `POST` | `/transaction/cash-in`                                            | Agent cash-in              |
| `POST` | `/transaction/cash-out`                                           | Agent cash-out             |
| `GET`  | `/transaction/transaction-history?author_type=sender&userId=<id>` | View history               |

### 🧾 Wallet

| Method  | Endpoint               | Description    |
| ------- | ---------------------- | -------------- |
| `PATCH` | `/wallet/block/<id>`   | Block wallet   |
| `PATCH` | `/wallet/unblock/<id>` | Unblock wallet |

## 📬 Sample Request: Login User

### Endpoint

```
POST /auth/login
```

### URL

```
https://ababil-wallet-api.vercel.app/api/v1/auth/login
```

### Request Body

```json
{
  "email": "example@gmail.com",
  "password": "1D#dgo2435"
}
```

### Response

```json
{
  "status": 201,
  "success": true,
  "message": "User logged successfully",
  "data": {
    "tokens": {
      "accessToken": "....",
      "refreshToken": "...."
    },
    "user": {
      "_id": "....",
      "name": "Neela Rani",
      ...
    }
  }
}
```

> ✅ See more endpoints: 🔗
> [View Full Collection in Postman](https://www.postman.com/ababil-team/public-workspace/collection/jzu6si1/ababil-wallet-api?action=share&source=copy-link&creator=42682780)

## 🛠 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Backend    | Node.js, Express.js               |
| Language   | TypeScript                        |
| Database   | MongoDB + Mongoose                |
| Validation | Zod                               |
| OAuth      | Google OAuth + Passport.js        |
| Deployment | Vercel                            |
| Tools      | Postman, VS Code, MongoDB Compass |

## 🧪 Run the Project Locally

```bash
# 1. Clone the repo
git clone https://github.com/neelarani/ababil-wallet-api
cd neela-wallet-api

# 2. Install dependencies
npm install

# 3. Copy .env.example and create your .env
cp .env.example .env

# 4. Run development server
npm run dev
```

## ❤️ Coded with cha ☕, bugs 🐞, and lots of love ❤️
