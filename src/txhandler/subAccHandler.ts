import * as anchor from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { deriveMainAccount, deriveSubAccount } from "../utils/common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BaseAisaTxHandler } from "./handlerBase";
import * as dotenv from "dotenv";
import * as path from "path";

const idlPath = path.join(__dirname, "../utils/aisa_contracts.json");
export class SubAccountTxHandler extends BaseAisaTxHandler {
  //to be called by the user or agent
  public static async initialize(): Promise<SubAccountTxHandler> {
    const handler = new SubAccountTxHandler();
    dotenv.config();

    handler.wallet = handler.loadWallet();
    handler.signer = handler.wallet.payer;
    handler.provider = new anchor.AnchorProvider(
      handler.loadRpc(),
      handler.wallet,
      {
        preflightCommitment: "processed",
      }
    );
    handler.connection = handler.provider.connection;
    handler.program = handler.getProgram(idlPath, handler.provider);

    return handler;
  }

  //to be called by agent
  public async getMainAccountState(
    uuid: number[]
  ): Promise<[owner: PublicKey, globalPayeeWhitelist: Array<PublicKey>]> {
    const mainAccountState = await this.program.account.mainAccount.fetch(
      deriveMainAccount(Uint8Array.from(uuid))
    );
    return [mainAccountState.owner, mainAccountState.globalWhitelistedPayees];
  }

  //to be called by agent
  public async getSubAccountState(
    uuid: number[]
  ): Promise<
    [
      whitelistedPayees: Array<PublicKey>,
      whitelistedTokens: Array<PublicKey>,
      paymentInterval: anchor.BN,
      paymentCount: number,
      maxPerPayment: anchor.BN,
      lastPaymentTimestamp: anchor.BN
    ]
  > {
    let mainAccount = deriveMainAccount(Uint8Array.from(uuid));
    const subAccountState = await this.program.account.subAccount.fetch(
      deriveSubAccount(mainAccount, this.signer.publicKey)
    );
    return [
      subAccountState.whitelistedPayees,
      subAccountState.whitelistedTokens,
      subAccountState.paymentInterval,
      subAccountState.paymentCount,
      subAccountState.maxPerPayment,
      subAccountState.lastPaymentTimestamp,
    ];
  }

  //to be called by the agent
  public async paymentRequest(
    uuid: number[],
    payee: PublicKey,
    paymentAmount: anchor.BN,
    tokenMint: PublicKey,
    payeeTokenAccount?: PublicKey, //default to ATA derivation
    tokenProgram?: PublicKey //default to TOKENPROGRAM, which covers most stables
  ): Promise<String | undefined> {
    let transactionInstructions: TransactionInstruction[] = [];
    let mainAccount = deriveMainAccount(Uint8Array.from(uuid));
    let subAccount = deriveSubAccount(mainAccount, this.signer.publicKey);
    let TokenProgram = tokenProgram ? tokenProgram : TOKEN_PROGRAM_ID;

    let paymentIx = await this.program.methods
      .paymentRequest(paymentAmount)
      .accounts({
        agent: this.signer.publicKey,
        payee: payee,
        mainAccount: mainAccount,
        saTokenAccount: getAssociatedTokenAddressSync(
          tokenMint,
          subAccount,
          true,
          TokenProgram,
          ASSOCIATED_TOKEN_PROGRAM_ID
        ),
        payeeTokenAccount: payeeTokenAccount
          ? payeeTokenAccount
          : getAssociatedTokenAddressSync(
              tokenMint,
              payee,
              false,
              TokenProgram,
              ASSOCIATED_TOKEN_PROGRAM_ID
            ),
        tokenMint: tokenMint,
        tokenProgram: TokenProgram,
      })
      .instruction();

    transactionInstructions.push(paymentIx);

    return await this.sendAndConfirmTransaction(
      transactionInstructions,
      this.signer.publicKey,
      [this.signer]
    );
  }
}
