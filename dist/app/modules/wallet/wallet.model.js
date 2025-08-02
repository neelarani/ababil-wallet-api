"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const interface_1 = require("../../../interface");
const walletSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: interface_1.Collections.User,
    },
    balance: {
        type: Number,
        default: 50,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
});
exports.Wallet = (0, mongoose_1.model)(interface_1.Collections.Wallet, walletSchema);
