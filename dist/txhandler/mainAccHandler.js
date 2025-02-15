"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.MainAccountTxHandler = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const common_1 = require("../utils/common");
const spl_token_1 = require("@solana/spl-token");
const handlerBase_1 = require("./handlerBase");
class MainAccountTxHandler extends handlerBase_1.BaseAisaTxHandler {
    static initialize() {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const handler = (yield _super.initialize.call(this));
            return handler;
        });
    }
    //to be called by the user
    createMainAccount(uuid, globalPayeeWhitelist) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionInstructions = [];
            let createIx = yield this.program.methods
                .createMainAccount(uuid, globalPayeeWhitelist)
                .accounts({
                owner: this.signer.publicKey,
            })
                .instruction();
            transactionInstructions.push(createIx);
            return yield this.sendAndConfirmTransaction(transactionInstructions, this.signer.publicKey, [this.signer]);
        });
    }
    //to be called by user
    getMainAccountState(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const mainAccountState = yield this.program.account.mainAccount.fetch((0, common_1.deriveMainAccount)(Uint8Array.from(uuid)));
            return [mainAccountState.owner, mainAccountState.globalWhitelistedPayees];
        });
    }
    //to be called by user
    getSubAccountState(uuid, agent) {
        return __awaiter(this, void 0, void 0, function* () {
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            const subAccountState = yield this.program.account.subAccount.fetch((0, common_1.deriveSubAccount)(mainAccount, agent));
            return [
                subAccountState.whitelistedPayees,
                subAccountState.whitelistedTokens,
                subAccountState.paymentInterval,
                subAccountState.paymentCount,
                subAccountState.maxPerPayment,
                subAccountState.lastPaymentTimestamp,
            ];
        });
    }
    //to be called by the user
    updateMainAccountRules(uuid, globalPayeeWhitelist) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionInstructions = [];
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            let updateMainAccountIx = yield this.program.methods
                .updateGlobalWhitelistedPayees(globalPayeeWhitelist)
                .accounts({
                owner: this.signer.publicKey,
                mainAccount: mainAccount,
            })
                .instruction();
            transactionInstructions.push(updateMainAccountIx);
            return yield this.sendAndConfirmTransaction(transactionInstructions, this.signer.publicKey, [this.signer]);
        });
    }
    //to be called by the user
    updateSubAccountRules(uuid, agent, payeeWhitelist, tokenWhitelist, maxPerPayment, paymentCount, paymentInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionInstructions = [];
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            if (payeeWhitelist) {
                let payeeWhitelistIx = yield this.program.methods
                    .updateWhitelistedPayees(payeeWhitelist)
                    .accounts({
                    owner: this.signer.publicKey,
                    agent: agent,
                    mainAccount: mainAccount,
                })
                    .instruction();
                transactionInstructions.push(payeeWhitelistIx);
            }
            if (tokenWhitelist) {
                let tokenWhitelistIx = yield this.program.methods
                    .updateWhitelistedTokens(tokenWhitelist)
                    .accounts({
                    owner: this.signer.publicKey,
                    agent: agent,
                    mainAccount: mainAccount,
                })
                    .instruction();
                transactionInstructions.push(tokenWhitelistIx);
            }
            if (maxPerPayment) {
                let maxPerPaymentIx = yield this.program.methods
                    .updateMaxPerPayment(maxPerPayment)
                    .accounts({
                    owner: this.signer.publicKey,
                    agent: agent,
                    mainAccount: mainAccount,
                })
                    .instruction();
                transactionInstructions.push(maxPerPaymentIx);
            }
            if (paymentCount) {
                let paymentCountIx = yield this.program.methods
                    .updatePaymentCount(paymentCount)
                    .accounts({
                    owner: this.signer.publicKey,
                    agent: agent,
                    mainAccount: mainAccount,
                })
                    .instruction();
                transactionInstructions.push(paymentCountIx);
                if (paymentInterval) {
                    let paymentIntervalIx = yield this.program.methods
                        .updatePaymentInterval(paymentInterval)
                        .accounts({
                        owner: this.signer.publicKey,
                        agent: agent,
                        mainAccount: mainAccount,
                    })
                        .instruction();
                    transactionInstructions.push(paymentIntervalIx);
                }
                return yield this.sendAndConfirmTransaction(transactionInstructions, this.signer.publicKey, [this.signer]);
            }
        });
    }
    //to be called by the user
    increaseAllowance(uuid, agent, allowanceAmount, paymentCount, tokenMint, ownerTokenAccount, //default to ATA derivation
    tokenProgram //default to TOKENPROGRAM, which covers most stables
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionInstructions = [];
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            let TokenProgram = tokenProgram ? tokenProgram : spl_token_1.TOKEN_PROGRAM_ID;
            let allowanceIx = yield this.program.methods
                .increaseSubAccountAllowance(allowanceAmount, paymentCount)
                .accounts({
                owner: this.signer.publicKey,
                ownerTokenAccount: ownerTokenAccount
                    ? ownerTokenAccount
                    : (0, spl_token_1.getAssociatedTokenAddressSync)(tokenMint, this.signer.publicKey, false, TokenProgram, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID),
                agent: agent,
                mainAccount: mainAccount,
                tokenMint: tokenMint,
                tokenProgram: TokenProgram,
            })
                .instruction();
            transactionInstructions.push(allowanceIx);
            return yield this.sendAndConfirmTransaction(transactionInstructions, this.signer.publicKey, [this.signer]);
        });
    }
    //to be called by the user
    decreaseAllowance(uuid, agent, allowanceAmount, paymentCount, tokenMint, ownerTokenAccount, //default to ATA derivation
    tokenProgram //default to TOKENPROGRAM, which covers most stables
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionInstructions = [];
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            let subAccount = (0, common_1.deriveSubAccount)(mainAccount, this.signer.publicKey);
            let TokenProgram = tokenProgram ? tokenProgram : spl_token_1.TOKEN_PROGRAM_ID;
            let allowanceIx = yield this.program.methods
                .decreaseSubAccountAllowance(allowanceAmount, paymentCount)
                .accounts({
                owner: this.signer.publicKey,
                ownerTokenAccount: ownerTokenAccount
                    ? ownerTokenAccount
                    : (0, spl_token_1.getAssociatedTokenAddressSync)(tokenMint, this.signer.publicKey, false, TokenProgram, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID),
                saTokenAccount: (0, spl_token_1.getAssociatedTokenAddressSync)(tokenMint, subAccount, true, TokenProgram, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID),
                agent: agent,
                mainAccount: mainAccount,
                tokenMint: tokenMint,
                tokenProgram: TokenProgram,
            })
                .instruction();
            transactionInstructions.push(allowanceIx);
            return yield this.sendAndConfirmTransaction(transactionInstructions, this.signer.publicKey, [this.signer]);
        });
    }
    //to be called by the user
    createSubAccount(uuid, agent, payeeWhitelist, // empty array
    tokenWhitelist, // empty array
    maxPerPayment, //uint64::MAX
    paymentCount, // 0
    paymentInterval, // 0
    allowanceAmount, // 0
    tokenMint, ownerTokenAccount, //default to ATA derivation
    tokenProgram //default to TOKENPROGRAM, which covers most stables
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionInstructions = [];
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            let TokenProgram = tokenProgram ? tokenProgram : spl_token_1.TOKEN_PROGRAM_ID;
            let createSubAccountIx = yield this.program.methods
                .createSubAccount(payeeWhitelist, tokenWhitelist, maxPerPayment, paymentCount, paymentInterval)
                .accounts({
                owner: this.signer.publicKey,
                agent: agent,
                mainAccount: mainAccount,
            })
                .instruction();
            transactionInstructions.push(createSubAccountIx);
            //only increase allowance if more than 0
            if (allowanceAmount.gt(new anchor.BN(0))) {
                if (!tokenMint) {
                    throw new Error("tokenMint must be specified if allowanceAmount is greater than 0");
                }
                let increaseAllowanceIx = yield this.program.methods
                    .increaseSubAccountAllowance(allowanceAmount, 0)
                    .accounts({
                    owner: this.signer.publicKey,
                    ownerTokenAccount: ownerTokenAccount
                        ? ownerTokenAccount
                        : (0, spl_token_1.getAssociatedTokenAddressSync)(tokenMint, this.signer.publicKey, false, TokenProgram, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID),
                    agent: agent,
                    mainAccount: mainAccount,
                    tokenMint: tokenMint,
                    tokenProgram: TokenProgram,
                })
                    .instruction();
                transactionInstructions.push(increaseAllowanceIx);
            }
            return yield this.sendAndConfirmTransaction(transactionInstructions, this.signer.publicKey, [this.signer]);
        });
    }
}
exports.MainAccountTxHandler = MainAccountTxHandler;
