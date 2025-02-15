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
exports.SubAccountTxHandler = void 0;
const common_1 = require("../utils/common");
const spl_token_1 = require("@solana/spl-token");
const handlerBase_1 = require("./handlerBase");
class SubAccountTxHandler extends handlerBase_1.BaseAisaTxHandler {
    static initialize() {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const handler = (yield _super.initialize.call(this));
            return handler;
        });
    }
    //to be called by agent
    getMainAccountState(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const mainAccountState = yield this.program.account.mainAccount.fetch((0, common_1.deriveMainAccount)(Uint8Array.from(uuid)));
            return [mainAccountState.owner, mainAccountState.globalWhitelistedPayees];
        });
    }
    //to be called by agent
    getSubAccountState(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            const subAccountState = yield this.program.account.subAccount.fetch((0, common_1.deriveSubAccount)(mainAccount, this.signer.publicKey));
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
    //to be called by the agent
    paymentRequest(uuid, payee, paymentAmount, tokenMint, payeeTokenAccount, //default to ATA derivation
    tokenProgram //default to TOKENPROGRAM, which covers most stables
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            let transactionInstructions = [];
            let mainAccount = (0, common_1.deriveMainAccount)(Uint8Array.from(uuid));
            let subAccount = (0, common_1.deriveSubAccount)(mainAccount, this.signer.publicKey);
            let TokenProgram = tokenProgram ? tokenProgram : spl_token_1.TOKEN_PROGRAM_ID;
            let paymentIx = yield this.program.methods
                .paymentRequest(paymentAmount)
                .accounts({
                agent: this.signer.publicKey,
                payee: payee,
                mainAccount: mainAccount,
                saTokenAccount: (0, spl_token_1.getAssociatedTokenAddressSync)(tokenMint, subAccount, true, TokenProgram, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID),
                payeeTokenAccount: payeeTokenAccount
                    ? payeeTokenAccount
                    : (0, spl_token_1.getAssociatedTokenAddressSync)(tokenMint, payee, false, TokenProgram, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID),
                tokenMint: tokenMint,
                tokenProgram: TokenProgram,
            })
                .instruction();
            transactionInstructions.push(paymentIx);
            return yield this.sendAndConfirmTransaction(transactionInstructions, this.signer.publicKey, [this.signer]);
        });
    }
}
exports.SubAccountTxHandler = SubAccountTxHandler;
