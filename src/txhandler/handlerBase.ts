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
import * as dotenv from "dotenv";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
// Import the IDL directly
import AisaContractsIDL from "../utils/aisa_contracts.json";

// Remove the relative path that's causing issues
// const idlPath = "../utils/aisa_contracts.json";

export class BaseAisaTxHandler {
  public program!: anchor.Program<AisaContracts>; // Use definite assignment assertion
  public provider!: anchor.Provider;
  public connection!: Connection;
  public signer!: Keypair; // can be user or agent
  public wallet!: anchor.Wallet; // can be user or agent
  protected constructor() {}

  //to be called by the user or agent
  public static async initialize(handler?: BaseAisaTxHandler, options?: { keyPair?: Keypair }): Promise<BaseAisaTxHandler> {
    // If no handler provided, create a new instance
    if (!handler) {
      handler = new BaseAisaTxHandler();
    }
    
    dotenv.config();

    // Use provided keyPair if available, otherwise load from environment
    if (options?.keyPair) {
      handler.wallet = new anchor.Wallet(options.keyPair);
      handler.signer = options.keyPair;
    } else {
      handler.wallet = handler.loadWallet();
      handler.signer = handler.wallet.payer;
    }
    
    handler.provider = new anchor.AnchorProvider(
      handler.loadRpc(),
      handler.wallet,
      {
        preflightCommitment: "processed",
      }
    );
    handler.connection = handler.provider.connection;
    handler.program = handler.getProgram(handler.provider);

    return handler;
  }

  private getProgram(
    provider: anchor.Provider
  ): anchor.Program<AisaContracts> {
    // Use the imported IDL directly instead of dynamic require
    return new anchor.Program(AisaContractsIDL as any, provider);
  }

  private loadRpc(): anchor.web3.Connection {
    // Check for both regular and Next.js prefixed environment variables
    const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;

    if (!rpcUrl) {
      throw new Error("RPC URL not defined in .env (use RPC_URL or NEXT_PUBLIC_RPC_URL)");
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

  private loadWallet(): anchor.Wallet {
    // Check for both regular and Next.js prefixed environment variables
    const privateKeyString = process.env.PRIVATE_KEY || process.env.NEXT_PUBLIC_PRIVATE_KEY;

    if (!privateKeyString) {
      throw new Error("PRIVATE_KEY not defined in .env (use PRIVATE_KEY or NEXT_PUBLIC_PRIVATE_KEY)");
    }

    try {
      const privateKey = bs58.decode(privateKeyString);

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
