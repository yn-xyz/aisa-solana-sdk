import * as anchor from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { deriveMainAccount, deriveSubAccount } from "../utils/common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BaseAisaTxHandler } from "./handlerBase";

export class MainAccountTxHandler extends BaseAisaTxHandler {
  public static async initialize(): Promise<MainAccountTxHandler> {
    // Create a new instance of this class
    const handler = new MainAccountTxHandler();
    // Initialize the base class properties by passing the instance
    await BaseAisaTxHandler.initialize(handler);
    // Return the properly initialized instance
    return handler;
  }

  //to be called by the user
  public async createMainAccount(
    uuid: number[],
    globalPayeeWhitelist: Array<PublicKey>
  ): Promise<String | undefined> {
    let transactionInstructions: TransactionInstruction[] = [];
    let createIx = await this.program.methods
      .createMainAccount(uuid, globalPayeeWhitelist)
      .accounts({
        owner: this.signer.publicKey,
      })
      .instruction();
    transactionInstructions.push(createIx);

    return await this.sendAndConfirmTransaction(
      transactionInstructions,
      this.signer.publicKey,
      [this.signer]
    );
  }

  //to be called by user
  public async getMainAccountState(
    uuid: number[]
  ): Promise<[owner: PublicKey, globalPayeeWhitelist: Array<PublicKey>]> {
    const mainAccountState = await this.program.account.mainAccount.fetch(
      deriveMainAccount(Uint8Array.from(uuid))
    );
    return [mainAccountState.owner, mainAccountState.globalWhitelistedPayees];
  }

  //to be called by user
  public async getSubAccountState(
    uuid: number[],
    agent: PublicKey
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
      deriveSubAccount(mainAccount, agent)
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

  //to be called by the user
  public async updateMainAccountRules(
    uuid: number[],
    globalPayeeWhitelist: Array<PublicKey>
  ): Promise<String | undefined> {
    let transactionInstructions: TransactionInstruction[] = [];
    let mainAccount = deriveMainAccount(Uint8Array.from(uuid));

    let updateMainAccountIx = await this.program.methods
      .updateGlobalWhitelistedPayees(globalPayeeWhitelist)
      .accounts({
        owner: this.signer.publicKey,
        mainAccount: mainAccount,
      })
      .instruction();
    transactionInstructions.push(updateMainAccountIx);

    return await this.sendAndConfirmTransaction(
      transactionInstructions,
      this.signer.publicKey,
      [this.signer]
    );
  }

  //to be called by the user
  public async updateSubAccountRules(
    uuid: number[],
    agent: PublicKey,
    payeeWhitelist?: Array<PublicKey>,
    tokenWhitelist?: Array<PublicKey>,
    maxPerPayment?: anchor.BN,
    paymentCount?: number,
    paymentInterval?: anchor.BN
  ): Promise<String | undefined> {
    let transactionInstructions: TransactionInstruction[] = [];
    let mainAccount = deriveMainAccount(Uint8Array.from(uuid));

    if (payeeWhitelist) {
      let payeeWhitelistIx = await this.program.methods
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
      let tokenWhitelistIx = await this.program.methods
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
      let maxPerPaymentIx = await this.program.methods
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
      let paymentCountIx = await this.program.methods
        .updatePaymentCount(paymentCount)
        .accounts({
          owner: this.signer.publicKey,
          agent: agent,
          mainAccount: mainAccount,
        })
        .instruction();
      transactionInstructions.push(paymentCountIx);

      if (paymentInterval) {
        let paymentIntervalIx = await this.program.methods
          .updatePaymentInterval(paymentInterval)
          .accounts({
            owner: this.signer.publicKey,
            agent: agent,
            mainAccount: mainAccount,
          })
          .instruction();
        transactionInstructions.push(paymentIntervalIx);
      }

      return await this.sendAndConfirmTransaction(
        transactionInstructions,
        this.signer.publicKey,
        [this.signer]
      );
    }
  }

  //to be called by the user
  public async increaseAllowance(
    uuid: number[],
    agent: PublicKey,
    allowanceAmount: anchor.BN,
    paymentCount: number,
    tokenMint: PublicKey,
    ownerTokenAccount?: PublicKey, //default to ATA derivation
    tokenProgram?: PublicKey //default to TOKENPROGRAM, which covers most stables
  ): Promise<String | undefined> {
    let transactionInstructions: TransactionInstruction[] = [];
    let mainAccount = deriveMainAccount(Uint8Array.from(uuid));
    let TokenProgram = tokenProgram ? tokenProgram : TOKEN_PROGRAM_ID;

    let allowanceIx = await this.program.methods
      .increaseSubAccountAllowance(allowanceAmount, paymentCount)
      .accounts({
        owner: this.signer.publicKey,
        ownerTokenAccount: ownerTokenAccount
          ? ownerTokenAccount
          : getAssociatedTokenAddressSync(
              tokenMint,
              this.signer.publicKey,
              false,
              TokenProgram,
              ASSOCIATED_TOKEN_PROGRAM_ID
            ),
        agent: agent,
        mainAccount: mainAccount,
        tokenMint: tokenMint,
        tokenProgram: TokenProgram,
      })
      .instruction();

    transactionInstructions.push(allowanceIx);

    return await this.sendAndConfirmTransaction(
      transactionInstructions,
      this.signer.publicKey,
      [this.signer]
    );
  }

  //to be called by the user
  public async decreaseAllowance(
    uuid: number[],
    agent: PublicKey,
    allowanceAmount: anchor.BN,
    paymentCount: number,
    tokenMint: PublicKey,
    ownerTokenAccount?: PublicKey, //default to ATA derivation
    tokenProgram?: PublicKey //default to TOKENPROGRAM, which covers most stables
  ): Promise<String | undefined> {
    let transactionInstructions: TransactionInstruction[] = [];
    let mainAccount = deriveMainAccount(Uint8Array.from(uuid));
    let subAccount = deriveSubAccount(mainAccount, this.signer.publicKey);
    let TokenProgram = tokenProgram ? tokenProgram : TOKEN_PROGRAM_ID;

    let allowanceIx = await this.program.methods
      .decreaseSubAccountAllowance(allowanceAmount, paymentCount)
      .accounts({
        owner: this.signer.publicKey,
        ownerTokenAccount: ownerTokenAccount
          ? ownerTokenAccount
          : getAssociatedTokenAddressSync(
              tokenMint,
              this.signer.publicKey,
              false,
              TokenProgram,
              ASSOCIATED_TOKEN_PROGRAM_ID
            ),
        saTokenAccount: getAssociatedTokenAddressSync(
          tokenMint,
          subAccount,
          true,
          TokenProgram,
          ASSOCIATED_TOKEN_PROGRAM_ID
        ),
        agent: agent,
        mainAccount: mainAccount,
        tokenMint: tokenMint,
        tokenProgram: TokenProgram,
      })
      .instruction();

    transactionInstructions.push(allowanceIx);

    return await this.sendAndConfirmTransaction(
      transactionInstructions,
      this.signer.publicKey,
      [this.signer]
    );
  }

  //to be called by the user
  public async createSubAccount(
    uuid: number[],
    agent: PublicKey,
    payeeWhitelist: Array<PublicKey>, // empty array
    tokenWhitelist: Array<PublicKey>, // empty array
    maxPerPayment: anchor.BN, //uint64::MAX
    paymentCount: number, // 0
    paymentInterval: anchor.BN, // 0
    allowanceAmount: anchor.BN, // 0
    tokenMint?: PublicKey,
    ownerTokenAccount?: PublicKey, //default to ATA derivation
    tokenProgram?: PublicKey //default to TOKENPROGRAM, which covers most stables
  ): Promise<String | undefined> {
    let transactionInstructions: TransactionInstruction[] = [];
    let mainAccount = deriveMainAccount(Uint8Array.from(uuid));
    let TokenProgram = tokenProgram ? tokenProgram : TOKEN_PROGRAM_ID;

    let createSubAccountIx = await this.program.methods
      .createSubAccount(
        payeeWhitelist,
        tokenWhitelist,
        maxPerPayment,
        paymentCount,
        paymentInterval
      )
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
        throw new Error(
          "tokenMint must be specified if allowanceAmount is greater than 0"
        );
      }
      let increaseAllowanceIx = await this.program.methods
        .increaseSubAccountAllowance(allowanceAmount, 0)
        .accounts({
          owner: this.signer.publicKey,
          ownerTokenAccount: ownerTokenAccount
            ? ownerTokenAccount
            : getAssociatedTokenAddressSync(
                tokenMint,
                this.signer.publicKey,
                false,
                TokenProgram,
                ASSOCIATED_TOKEN_PROGRAM_ID
              ),
          agent: agent,
          mainAccount: mainAccount,
          tokenMint: tokenMint,
          tokenProgram: TokenProgram,
        })
        .instruction();
      transactionInstructions.push(increaseAllowanceIx);
    }

    return await this.sendAndConfirmTransaction(
      transactionInstructions,
      this.signer.publicKey,
      [this.signer]
    );
  }
}
