import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BaseAisaTxHandler } from "./handlerBase";
export declare class SubAccountTxHandler extends BaseAisaTxHandler {
    static initialize(): Promise<SubAccountTxHandler>;
    getMainAccountState(uuid: number[]): Promise<[owner: PublicKey, globalPayeeWhitelist: Array<PublicKey>]>;
    getSubAccountState(uuid: number[]): Promise<[
        whitelistedPayees: Array<PublicKey>,
        whitelistedTokens: Array<PublicKey>,
        paymentInterval: anchor.BN,
        paymentCount: number,
        maxPerPayment: anchor.BN,
        lastPaymentTimestamp: anchor.BN
    ]>;
    paymentRequest(uuid: number[], payee: PublicKey, paymentAmount: anchor.BN, tokenMint: PublicKey, payeeTokenAccount?: PublicKey, tokenProgram?: PublicKey): Promise<String | undefined>;
}
