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
exports.deriveMainAccount = deriveMainAccount;
exports.deriveSubAccount = deriveSubAccount;
exports.getTokenBalance = getTokenBalance;
const web3_js_1 = require("@solana/web3.js");
const consts_1 = require("./consts");
function deriveMainAccount(uuid) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(consts_1.MAIN_ACCOUNT_SEED), Buffer.from(uuid)], consts_1.AISA_CONTRACT)[0];
}
function deriveSubAccount(mainAccount, agent) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(consts_1.SUB_ACCOUNT_SEED), mainAccount.toBuffer(), agent.toBuffer()], consts_1.AISA_CONTRACT)[0];
}
function getTokenBalance(connection, tokenAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        return Number((yield connection.getTokenAccountBalance(tokenAccount, "processed")).value
            .amount);
    });
}
