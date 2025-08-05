# 📚 Ababil Wallet API

A secure and scalable RESTful API built with Express, TypeScript, and MongoDB,
designed for managing digital wallet operations—such as user accounts,
transactions, and balance handling—within the `Ababil Wallet system`

### 🌐 Base URL

| Environment | URL                                          |
| ----------- | -------------------------------------------- |
| Development | `http://localhost:<PORT>/api/v1`             |
| Production  | `https://neela-lms-server.vercel.app/api/v1` |

📌 Features

- 👤 User registration, login, and authentication
- 💳 Manage wallet balance: top-up, cash-in, cash-out, and transfers
- 🔁 Track transaction history with filtering and sorting
- 📈 View wallet summaries and analytics
- 🛡️ Data validation using Zod for secure operations
- ⚙️ Clean code architecture with centralized error handling

<details>
<summary>📁 Project Structure</summary>

```txt
~/ababil-wallet-api
├── scripts
│   ├── app.sh
│   └── push.sh
├── src
│   ├── app
│   │   ├── errors
│   │   │   ├── _AppError.ts
│   │   │   ├── _global.error.ts
│   │   │   ├── index.ts
│   │   │   └── _notFound.ts
│   │   ├── middlewares
│   │   │   ├── _checkAuth.ts
│   │   │   ├── index.ts
│   │   │   ├── _multer.ts
│   │   │   └── _validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── transaction
│   │   │   │   ├── transaction.controller.ts
│   │   │   │   ├── transaction.interface.ts
│   │   │   │   ├── transaction.model.ts
│   │   │   │   ├── transaction.routes.ts
│   │   │   │   ├── transaction.service.ts
│   │   │   │   └── transaction.validation.ts
│   │   │   ├── user
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.validation.ts
│   │   │   ├── wallet
│   │   │   │   ├── wallet.controller.ts
│   │   │   │   ├── wallet.interface.ts
│   │   │   │   ├── wallet.model.ts
│   │   │   │   ├── wallet.routes.ts
│   │   │   │   ├── wallet.service.ts
│   │   │   │   └── wallet.validation.ts
│   │   │   └── index.ts
│   │   └── routes
│   │       └── index.ts
│   ├── config
│   │   ├── _db.config.ts
│   │   ├── _env.config.ts
│   │   ├── index.ts
│   │   ├── _nodemailer.config.ts
│   │   └── _passport.config.ts
│   ├── interface
│   │   ├── declare
│   │   │   └── index.d.ts
│   │   ├── _collections.types.ts
│   │   ├── _error.types.ts
│   │   ├── index.ts
│   │   └── _nodemailer.types.ts
│   ├── shared
│   │   ├── common
│   │   │   ├── index.ts
│   │   │   ├── _rootResponse.ts
│   │   │   └── _seedSupperAdmin.ts
│   │   ├── constants
│   │   │   ├── _httpCodes.ts
│   │   │   ├── index.ts
│   │   │   └── _mimeType.ts
│   │   ├── helpers
│   │   │   ├── _handleCastError.ts
│   │   │   ├── _handleDuplicateError.ts
│   │   │   ├── _handlerValidationError.ts
│   │   │   ├── _handleZodError.ts
│   │   │   └── index.ts
│   │   ├── templates
│   │   │   ├── forgetPassword.ejs
│   │   │   ├── request-for-agent.ejs
│   │   │   ├── update-to-agent-status.ejs
│   │   │   └── verify-user.ejs
│   │   ├── util
│   │   │   ├── _catchAsync.ts
│   │   │   ├── index.ts
│   │   │   ├── _jwt.ts
│   │   │   ├── _rollback.ts
│   │   │   ├── _sendMail.ts
│   │   │   ├── _sendResponse.ts
│   │   │   ├── _setCookie.ts
│   │   │   ├── _uploadToCloudinary.ts
│   │   │   ├── _useQuery.ts
│   │   │   └── _userTokens.ts
│   │   └── index.ts
│   ├── _app.ts
│   ├── index.ts
│   └── _server.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json

22 directories, 84 files
```

</details>

### List Of API's endpoints:

0. **Root Response:** `/`

1. **auth:**

   1. `POST` Login User
      - `/auth/login`
   2. `POST` Get Verify Email
      - `/auth/get-verify-token`
   3. `GET` Get new Access Token
      - `/auth/access-token`
   4. `DELETE` Logout
      - `/auth/logout`
   5. `GET` Google Login
      - `/auth/google`
   6. `POST` Forgot Password
      - `/auth/forgot-password`
   7. `POST` Reset Password
      - `/auth/reset-password?resetToken=<encrypted token>`

2. **user:**

   1. `POST` Register User
      - `/user/register`
   2. `GET` Get All Users
      - `/user/get-all-users`
   3. `GET` Request For Agent
      - `/user/request-for-agent`
   4. `PATCH` Update To Agent Status
      - `/user/update-to-agent-status`
   5. `PATCH` Edit Profile
      - `/user/edit`
   6. `GET` Get Single User
      - `/user/<user id>`

3. **transaction:**

   1. `POST` Top up money
      - `/transaction/top-up`
   2. `POST` Withdraw money
      - `/transaction/withdraw`
   3. `POST` Send Money
      - `/transaction/send-money`
   4. `GET` Transaction History
      - `/transaction/transaction-history?author_type=<sender | receiver>&userId=<user id>`
   5. `POST` Cash In
      - `/transaction/cash-in`
   6. `POST` Cash Out
      - `/transaction/cash-out`

4. **wallet:**
   1. `PATCH` Block Wallet
      - `/wallet/block/<wallet id>`
   2. `PATCH` Unblock Wallet
      - `/wallet/unblock/<wallet id>`

## Endpoint details with Production API:

...TODO: working on it.

### 🧰 Tech Stack

- **Backend**: Express.js, TypeScript

- **Database**: MongoDB with Mongoose

- **Validation**: Zod

- **Hosting**: Vercel

- **Tools**: Postman, Vs Code, MongoDB Compass

---

### 🚀 Running the Project Locally

1. Clone the repo:

   ```bash
   git clone https://github.com/neelarani/ababil-wallet-api
   cd ababil-wallet-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` from `.env.example` and fill in your values.

4. Run dev server:

   ```bash
   npm run dev
   ```

## ❤️ Coded with cha ☕, bugs 🐞, and lots of love ❤️
