import * as anchor from "@coral-xyz/anchor";
import { AisaContracts } from "../utils/aisa_types";
import {
  AddressLookupTableAccount,
  Connection,
  Keypair,
  PublicKey,
  Signer,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import * as path from "path";

export class BaseAisaTxHandler {
  public program!: anchor.Program<AisaContracts>; // Use definite assignment assertion
  public provider!: anchor.Provider;
  public connection!: Connection;
  public signer!: Keypair; // can be user or agent
  public wallet!: anchor.Wallet; // can be user or agent
  protected constructor() {}

  public getProgram(
    idlPath: string,
    provider: anchor.Provider
  ): anchor.Program<AisaContracts> {
    const AaIdl = JSON.parse(JSON.stringify(require(idlPath)));
    return new anchor.Program(AaIdl, provider);
  }

  public loadRpc(): anchor.web3.Connection {
    const rpcUrl = process.env.RPC_URL;

    if (!rpcUrl) {
      throw new Error("RPC URL not defined in .env");
    }

    try {
      const connection = new anchor.web3.Connection(rpcUrl, {
        commitment: "processed",
      });
      return connection;
    } catch (error: any) {
      throw new Error(`Failed to create RPC connection: ${error.message}`);
    }
  }

  public loadWallet(): anchor.Wallet {
    const privateKeyString = process.env.PRIVATE_KEY;

    if (!privateKeyString) {
      throw new Error("PRIVATE_KEY not defined in .env");
    }

    try {
      const privateKey = Uint8Array.from(JSON.parse(privateKeyString));

      if (privateKey.length !== 64) {
        throw new Error("Invalid private key length");
      }

      const keypair = Keypair.fromSecretKey(privateKey);
      return new anchor.Wallet(keypair);
    } catch (error: any) {
      throw new Error(`Invalid private key format : ${error.message}`);
    }
  }

  public async sendAndConfirmTransaction(
    instructions: TransactionInstruction[],
    payerKey: PublicKey,
    signers: Signer[],
    lookupTableAccounts?: AddressLookupTableAccount[]
  ): Promise<string | undefined> {
    try {
      const latestBlockHash = await this.connection.getLatestBlockhash();
      const messageV0 = new TransactionMessage({
        payerKey: payerKey,
        recentBlockhash: latestBlockHash.blockhash,
        instructions: instructions,
      }).compileToV0Message(lookupTableAccounts);

      const transactionV0 = new VersionedTransaction(messageV0);
      transactionV0.sign(signers);

      const signature = await this.connection.sendTransaction(transactionV0);
      await this.connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        },
        "confirmed"
      );
      return signature;
    } catch (error) {
      console.log(error);
    }
  }
}
