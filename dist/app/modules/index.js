"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = exports.AuthRoutes = exports.UserRoutes = void 0;
var user_route_1 = require("./user/user.route");
Object.defineProperty(exports, "UserRoutes", { enumerable: true, get: function () { return __importDefault(user_route_1).default; } });
var auth_route_1 = require("./auth/auth.route");
Object.defineProperty(exports, "AuthRoutes", { enumerable: true, get: function () { return __importDefault(auth_route_1).default; } });
var transaction_route_1 = require("./transaction/transaction.route");
Object.defineProperty(exports, "TransactionRoutes", { enumerable: true, get: function () { return __importDefault(transaction_route_1).default; } });
