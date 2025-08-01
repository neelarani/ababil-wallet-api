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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoney = exports.withdraw = exports.topUpMoney = void 0;
const transaction_interface_1 = require("./transaction.interface");
const transaction_model_1 = require("./transaction.model");
const errors_1 = require("../../../app/errors");
const shared_1 = require("../../../shared");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
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
const withdraw = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.withdraw = withdraw;
const sendMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.userId === payload.receiverId) {
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Cannot send money to yourself`);
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderWallet = yield wallet_model_1.Wallet.findOne({
            user: decodedToken.userId,
        }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({
            user: payload.receiverId,
        }).session(session);
        if (!senderWallet || !receiverWallet) {
            throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, `Sender or receiver wallet not found`);
        }
        if (senderWallet.balance < payload.amount) {
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Insufficient balance in wallet`);
        }
        senderWallet.balance -= payload.amount;
        receiverWallet.balance += payload.amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        const transaction = yield transaction_model_1.Transaction.create([
            {
                sender: decodedToken.userId,
                receiver: payload.receiverId,
                amount: payload.amount,
                transactionType: transaction_interface_1.TransactionType.SEND_MONEY,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { transaction, senderWallet, receiverWallet };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.sendMoney = sendMoney;
