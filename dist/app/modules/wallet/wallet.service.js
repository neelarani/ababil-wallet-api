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
exports.unblockWallet = exports.blockWallet = exports.isWalletBlocked = void 0;
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("./wallet.model");
const isWalletBlocked = (walletId) => __awaiter(void 0, void 0, void 0, function* () { var _a; return ((_a = (yield wallet_model_1.Wallet.findOne({ _id: walletId }))) === null || _a === void 0 ? void 0 : _a.isBlocked) ? true : false; });
exports.isWalletBlocked = isWalletBlocked;
const blockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new Error('User not found');
    let wallet = yield wallet_model_1.Wallet.exists({ _id: user.wallet });
    if (!wallet)
        throw new Error('Wallet not found');
    if (yield (0, exports.isWalletBlocked)(wallet._id))
        throw new Error('Wallet is already blocked');
    wallet = yield wallet_model_1.Wallet.findByIdAndUpdate(wallet._id, { isBlocked: true }, { new: true });
    if (!wallet)
        throw new Error('Wallet not found');
    return wallet;
});
exports.blockWallet = blockWallet;
const unblockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new Error('User not found');
    let wallet = yield wallet_model_1.Wallet.exists({ _id: user.wallet });
    if (!wallet)
        throw new Error('Wallet not found');
    if (!(yield (0, exports.isWalletBlocked)(wallet._id)))
        throw new Error('Wallet is already unblocked');
    wallet = yield wallet_model_1.Wallet.findByIdAndUpdate(wallet._id, { isBlocked: false }, { new: true });
    if (!wallet)
        throw new Error('Wallet not found');
    return wallet;
});
exports.unblockWallet = unblockWallet;
