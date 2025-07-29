"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
const mongoose_qb_1 = require("mongoose-qb");
exports.useQuery = (0, mongoose_qb_1.createQuery)({
    defaultLimit: 10,
    defaultPage: 1,
    defaultSortField: "-createdAt",
});
