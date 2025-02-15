import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BaseAisaTxHandler } from "./handlerBase";
export declare class MainAccountTxHandler extends BaseAisaTxHandler {
    static initialize(): Promise<MainAccountTxHandler>;
    createMainAccount(uuid: number[], globalPayeeWhitelist: Array<PublicKey>): Promise<String | undefined>;
    getMainAccountState(uuid: number[]): Promise<[owner: PublicKey, globalPayeeWhitelist: Array<PublicKey>]>;
    getSubAccountState(uuid: number[], agent: PublicKey): Promise<[
        whitelistedPayees: Array<PublicKey>,
        whitelistedTokens: Array<PublicKey>,
        paymentInterval: anchor.BN,
        paymentCount: number,
        maxPerPayment: anchor.BN,
        lastPaymentTimestamp: anchor.BN
    ]>;
    updateMainAccountRules(uuid: number[], globalPayeeWhitelist: Array<PublicKey>): Promise<String | undefined>;
    updateSubAccountRules(uuid: number[], agent: PublicKey, payeeWhitelist?: Array<PublicKey>, tokenWhitelist?: Array<PublicKey>, maxPerPayment?: anchor.BN, paymentCount?: number, paymentInterval?: anchor.BN): Promise<String | undefined>;
    increaseAllowance(uuid: number[], agent: PublicKey, allowanceAmount: anchor.BN, paymentCount: number, tokenMint: PublicKey, ownerTokenAccount?: PublicKey, //default to ATA derivation
    tokenProgram?: PublicKey): Promise<String | undefined>;
    decreaseAllowance(uuid: number[], agent: PublicKey, allowanceAmount: anchor.BN, paymentCount: number, tokenMint: PublicKey, ownerTokenAccount?: PublicKey, //default to ATA derivation
    tokenProgram?: PublicKey): Promise<String | undefined>;
    createSubAccount(uuid: number[], agent: PublicKey, payeeWhitelist: Array<PublicKey>, // empty array
    tokenWhitelist: Array<PublicKey>, // empty array
    maxPerPayment: anchor.BN, //uint64::MAX
    paymentCount: number, // 0
    paymentInterval: anchor.BN, // 0
    allowanceAmount: anchor.BN, // 0
    tokenMint?: PublicKey, ownerTokenAccount?: PublicKey, //default to ATA derivation
    tokenProgram?: PublicKey): Promise<String | undefined>;
}
//# sourceMappingURL=mainAccHandler.d.ts.map