"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const interface_1 = require("../../../interface");
const transactionSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: interface_1.Collections.User,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: interface_1.Collections.User,
    },
    transactionType: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
    },
    amount: {
        type: Number,
    },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)(interface_1.Collections.Transaction, transactionSchema);
