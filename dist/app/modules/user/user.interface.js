"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IToAgentStatus = exports.IsActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
var IToAgentStatus;
(function (IToAgentStatus) {
    IToAgentStatus["PENDING"] = "PENDING";
    IToAgentStatus["SUSPENDED"] = "SUSPENDED";
    IToAgentStatus["APPROVED"] = "APPROVED";
})(IToAgentStatus || (exports.IToAgentStatus = IToAgentStatus = {}));
