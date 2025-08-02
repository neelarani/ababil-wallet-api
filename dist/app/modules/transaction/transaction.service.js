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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashOut = exports.cashIn = exports.transactionHistory = exports.sendMoney = exports.withdraw = exports.topUpMoney = void 0;
const transaction_interface_1 = require("./transaction.interface");
const transaction_model_1 = require("./transaction.model");
const errors_1 = require("../../../app/errors");
const shared_1 = require("../../../shared");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = require("mongoose");
const mongoose_qb_1 = require("mongoose-qb");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const wallet_service_1 = require("../wallet/wallet.service");
const topUpMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield wallet_model_1.Wallet.findOne({ user: decodedToken.userId });
    if (!wallet || (yield (0, wallet_service_1.isWalletBlocked)(wallet._id)))
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `No wallet has been found or might be blocked for your account!`);
    let transaction = yield transaction_model_1.Transaction.create({
        receiver: decodedToken.userId,
        amount: payload.amount,
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
    if (!wallet || (yield (0, wallet_service_1.isWalletBlocked)(wallet._id)))
        throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `No wallet has been found or might be blocked for your account!`);
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
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        if (decodedToken.userId === payload.receiverId) {
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Cannot send money to yourself`);
        }
        const senderWallet = yield wallet_model_1.Wallet.findOne({
            user: decodedToken.userId,
        }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({
            user: payload.receiverId,
        }).session(session);
        if (!senderWallet || !receiverWallet) {
            throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, `Sender or receiver wallet not found`);
        }
        if ((yield (0, wallet_service_1.isWalletBlocked)(senderWallet._id)) ||
            (yield (0, wallet_service_1.isWalletBlocked)(receiverWallet._id)))
            throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Sender or receiver wallet might be blocked!`);
        if (senderWallet.balance < payload.amount) {
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Insufficient balance in wallet`);
        }
        senderWallet.balance -= payload.amount;
        receiverWallet.balance += payload.amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        const transaction = (yield transaction_model_1.Transaction.create([
            {
                sender: decodedToken.userId,
                receiver: payload.receiverId,
                amount: payload.amount,
                transactionType: transaction_interface_1.TransactionType.SEND_MONEY,
            },
        ], { session }))[0];
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
const transactionHistory = (query, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = query || {}, { author_type, userId } = _a, rest = __rest(_a, ["author_type", "userId"]);
    const isAdmin = [user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decodedToken.role);
    if (!author_type && !isAdmin)
        throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `You must provide author_type params in request, [e.g. ?author_type=sender, ?author_type=receiver]`);
    query = isAdmin
        ? Object.assign(Object.assign({}, rest), { [author_type]: userId }) : Object.assign(Object.assign({}, rest), { [author_type]: decodedToken.userId });
    return yield (0, mongoose_qb_1.useQuery)(transaction_model_1.Transaction, query, {
        filter: true,
        paginate: true,
        populate: [
            { path: 'sender', select: 'name email phone' },
            { path: 'receiver', select: 'name email phone' },
        ],
    });
});
exports.transactionHistory = transactionHistory;
const cashIn = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        if (decodedToken.userId === payload.receiverId) {
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `You can't cash in to yourself`);
        }
        const receiver = yield user_model_1.User.findById(payload.receiverId).session(session);
        if (!receiver)
            throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, `Receiver not found`);
        if (receiver.role !== user_interface_1.Role.USER)
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Receiver must be an USER`);
        let receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiver._id }).session(session);
        let agentWallet = yield wallet_model_1.Wallet.findOne({
            user: decodedToken.userId,
        }).session(session);
        if (!receiverWallet || !agentWallet)
            throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, `Receiver or agent wallet not found`);
        if ((yield (0, wallet_service_1.isWalletBlocked)(receiverWallet._id)) ||
            (yield (0, wallet_service_1.isWalletBlocked)(agentWallet._id)))
            throw new errors_1.AppError(shared_1.HTTP_CODE.INTERNAL_SERVER_ERROR, `Receiver or agent wallet might be blocked!`);
        if (payload.amount > agentWallet.balance)
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Insufficient balance in agent wallet`);
        agentWallet.balance -= payload.amount;
        receiverWallet.balance += payload.amount;
        yield agentWallet.save({ session });
        yield receiverWallet.save({ session });
        const transaction = (yield transaction_model_1.Transaction.create([
            {
                sender: decodedToken.userId,
                receiver: payload.receiverId,
                amount: payload.amount,
                transactionType: transaction_interface_1.TransactionType.CASH_IN,
            },
        ], { session }))[0];
        yield session.commitTransaction();
        session.endSession();
        return { transaction, agentWallet, receiverWallet };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.cashIn = cashIn;
const cashOut = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        if (decodedToken.userId === payload.receiverId)
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `You can't cash out to yourself`);
        const receiver = yield user_model_1.User.findById(payload.receiverId).session(session);
        if (!receiver)
            throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, `Receiver not found`);
        if (receiver.role !== user_interface_1.Role.AGENT)
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Receiver must be an AGENT`);
        let receiverWallet = yield wallet_model_1.Wallet.findOne({
            user: payload.receiverId,
        }).session(session);
        let senderWallet = yield wallet_model_1.Wallet.findOne({
            user: decodedToken.userId,
        }).session(session);
        if (!receiverWallet || !senderWallet)
            throw new errors_1.AppError(shared_1.HTTP_CODE.NOT_FOUND, `Receiver or agent wallet not found`);
        if ((yield (0, wallet_service_1.isWalletBlocked)(receiverWallet._id)) ||
            (yield (0, wallet_service_1.isWalletBlocked)(senderWallet._id)))
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Receiver or agent wallet might be blocked!`);
        if (payload.amount > senderWallet.balance)
            throw new errors_1.AppError(shared_1.HTTP_CODE.BAD_REQUEST, `Insufficient balance in agent wallet`);
        senderWallet.balance -= payload.amount;
        receiverWallet.balance += payload.amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        const transaction = (yield transaction_model_1.Transaction.create([
            {
                sender: decodedToken.userId,
                receiver: payload.receiverId,
                amount: payload.amount,
                transactionType: transaction_interface_1.TransactionType.CASH_OUT,
            },
        ], { session }))[0];
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
exports.cashOut = cashOut;
