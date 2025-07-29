"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errors_1 = require("./app/errors");
const shared_1 = require("./shared");
const app = (0, express_1.default)();
app.set("json spaces", 2);
app.all("/", shared_1.rootResponse);
app.use(errors_1.notFound);
app.use(errors_1.globalErrorHandler);
exports.default = app;
