import * as anchor from "@coral-xyz/anchor";
import { AisaContracts } from "../utils/aisa_types";
import { AddressLookupTableAccount, Connection, Keypair, PublicKey, Signer, TransactionInstruction } from "@solana/web3.js";
export declare class BaseAisaTxHandler {
    program: anchor.Program<AisaContracts>;
    provider: anchor.Provider;
    connection: Connection;
    signer: Keypair;
    wallet: anchor.Wallet;
    protected constructor();
    static initialize(): Promise<BaseAisaTxHandler>;
    private getProgram;
    private loadRpc;
    private loadWallet;
    sendAndConfirmTransaction(instructions: TransactionInstruction[], payerKey: PublicKey, signers: Signer[], lookupTableAccounts?: AddressLookupTableAccount[]): Promise<string | undefined>;
}
