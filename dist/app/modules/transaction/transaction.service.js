"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawMoney = exports.topUpMoney = void 0;
const transaction_interface_1 = require("./transaction.interface");
const transaction_model_1 = require("./transaction.model");
const errors_1 = require("../../../app/errors");
const shared_1 = require("../../../shared");
const wallet_model_1 = require("../wallet/wallet.model");
const topUpMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield wallet_model_1.Wallet.findOne({ user: decodedToken.userId });
    if (!wallet)
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `No wallet has been found for your account!`);
    let transaction = yield transaction_model_1.Transaction.create({
        amount: payload.amount,
        receiver: decodedToken.userId,
        transactionType: transaction_interface_1.TransactionType.TOP_UP,
    });
    if (!transaction)
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to top up`);
    const updatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(wallet._id, {
        $set: { balance: wallet.balance + payload.amount },
    }, { new: true, runValidators: true });
    if (!updatedWallet)
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to store updated balance in wallet`);
    return {
        transaction,
        wallet: updatedWallet,
    };
});
exports.topUpMoney = topUpMoney;
const withdrawMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: decodedToken.userId });
    if (!wallet)
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Wallet not Found!`);
    if (wallet.balance < payload.amount) {
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Insufficient balance in wallet!`);
    }
    const transaction = yield transaction_model_1.Transaction.create({
        amount: payload.amount,
        sender: decodedToken.userId,
        transactionType: transaction_interface_1.TransactionType.WITHDRAW,
    });
    if (!transaction)
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to withdraw`);
    const updatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(wallet._id, {
        $set: { balance: wallet.balance - payload.amount },
    }, { new: true, runValidators: true });
    if (!updatedWallet)
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to update wallet balance`);
    return {
        transaction,
        wallet: updatedWallet,
    };
});
exports.withdrawMoney = withdrawMoney;
