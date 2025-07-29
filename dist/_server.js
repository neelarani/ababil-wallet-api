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
const http_1 = require("http");
const _app_1 = __importDefault(require("./_app"));
const config_1 = require("./config");
const mongoose_1 = __importDefault(require("mongoose"));
class AbabilWalletServer {
    constructor() {
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.server.listen(config_1.ENV.PORT, () => {
                    console.log(`Server listening at: http://localhost:${config_1.ENV.PORT}`);
                });
            }
            catch (error) {
                console.error(`Failed to start the Server`, error instanceof Error && error);
                if (this.server.listening) {
                    mongoose_1.default.connection.close(true);
                    this.server.close(err => {
                        if (err) {
                            console.log('Error closing server:', err);
                            process.exit(1);
                        }
                        else {
                            console.log('Server has been closed');
                        }
                    });
                }
                console.log('Database disconnected');
                process.exit(1);
            }
        });
        this.shutdown = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.server.listening) {
                    this.server.close(err => {
                        if (err) {
                            console.log('Error closing server:', err);
                            process.exit(1);
                        }
                        else {
                            console.log('Server has been closed');
                        }
                    });
                }
                yield mongoose_1.default.connection.close(false);
                console.log('Database disconnected');
                process.exit(0);
            }
            catch (error) {
                console.log('Error during shutdown:', error);
                process.exit(1);
            }
        });
        this.server = (0, http_1.createServer)(_app_1.default);
    }
}
exports.default = AbabilWalletServer;
