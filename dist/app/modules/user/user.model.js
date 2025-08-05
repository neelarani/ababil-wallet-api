"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToAgent = exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const interface_1 = require("../../../interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    isDeleted: { type: String },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: {
        type: [authProviderSchema],
    },
    wallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: interface_1.Collections.Wallet,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const toAgentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: interface_1.Collections.User,
    },
    status: {
        type: String,
        enum: Object.values(user_interface_1.IToAgentStatus),
        default: user_interface_1.IToAgentStatus.PENDING,
    },
});
exports.User = (0, mongoose_1.model)(interface_1.Collections.User, userSchema);
exports.ToAgent = (0, mongoose_1.model)(interface_1.Collections.ToAgent, toAgentSchema);
