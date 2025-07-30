"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const errors_1 = require("./app/errors");
const shared_1 = require("./shared");
const routes_1 = require("./app/routes");
const config_1 = require("./config");
require("./config/_passport");
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: config_1.ENV.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.set('json spaces', 2);
app.all('/', shared_1.rootResponse);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/v1', routes_1.router);
app.use(errors_1.notFound);
app.use(errors_1.globalErrorHandler);
exports.default = app;
