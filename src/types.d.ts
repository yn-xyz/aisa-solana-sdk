// src/types.d.ts

// Define a type for UUID
export type UUID = number[];

// Define a type for PublicKey (assuming it's a string representation)
export type PublicKey = string;

// Define the MainAccountTxHandler interface
export interface MainAccountTxHandler {
  /**
   * Creates a main account.
   * @param uuid - The unique identifier for the account, represented as an array of numbers.
   * @param globalPayeeWhitelist - An array of public keys representing whitelisted payees.
   * @returns A promise that resolves to the transaction signature, or undefined if there is an error
   */
  createMainAccount(
    uuid: UUID,
    globalPayeeWhitelist: Array<PublicKey>
  ): Promise<string | undefined>;

  /**
   * Retrieves the state of the main account.
   * @param uuid - The unique identifier for the account, represented as an array of numbers.
   * @returns A promise that resolves to a tuple containing:
   * - owner: The public key of the account owner.
   * - globalPayeeWhitelist: An array of public keys representing the global whitelisted payees.
   */
  getMainAccountState(
    uuid: UUID
  ): Promise<[owner: PublicKey, globalPayeeWhitelist: Array<PublicKey>]>;

  /**
   * Retrieves the state of a sub-account.
   * @param uuid - The unique identifier for the main account, represented as an array of numbers.
   * @param agent - The public key of the agent accessing the sub-account.
   * @returns A promise that resolves to an array containing:
   * - whitelistedPayees: An array of public keys representing the whitelisted payees for the sub-account.
   * - whitelistedTokens: An array of public keys representing the whitelisted tokens for the sub-account.
   * - paymentInterval: The payment interval as a BigNumber (anchor.BN).
   * - paymentCount: The number of payments made.
   * - maxPerPayment: The maximum amount allowed per payment as a BigNumber (anchor.BN).
   * - lastPaymentTimestamp: The timestamp of the last payment as a BigNumber (anchor.BN).
   */
  getSubAccountState(
    uuid: UUID,
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
  >;

  /**
   * Updates the rules for the main account.
   * @param uuid - The unique identifier for the account, represented as an array of numbers.
   * @param globalPayeeWhitelist - An array of public keys representing the new whitelisted payees.
   * @returns A promise that resolves to the transaction signature, or undefined if there is an error
   */
  updateMainAccountRules(
    uuid: UUID,
    globalPayeeWhitelist: Array<PublicKey>
  ): Promise<string | undefined>;

  /**
   * Updates the rules for a sub-account.
   * @param uuid - The unique identifier for the main account, represented as an array of numbers.
   * @param agent - The public key of the agent accessing the sub-account.
   * @param payeeWhitelist - An optional array of public keys representing the new whitelisted payees.
   * @param tokenWhitelist - An optional array of public keys representing the new whitelisted tokens.
   * @param maxPerPayment - An optional maximum amount per payment as a BigNumber (anchor.BN).
   * @param paymentCount - An optional number of payments.
   * @param paymentInterval - An optional payment interval as a BigNumber (anchor.BN).
   * @returns A promise that resolves to the transaction signature, or undefined if there is an error
   */
  updateSubAccountRules(
    uuid: UUID,
    agent: PublicKey,
    payeeWhitelist?: Array<PublicKey>,
    tokenWhitelist?: Array<PublicKey>,
    maxPerPayment?: anchor.BN,
    paymentCount?: number,
    paymentInterval?: anchor.BN
  ): Promise<string | undefined>;

  /**
   * Increases the allowance for a sub-account.
   * @param uuid - The unique identifier for the main account, represented as an array of numbers.
   * @param agent - The public key of the agent accessing the sub-account.
   * @param allowanceAmount - The amount to increase the allowance by as a BigNumber (anchor.BN).
   * @param paymentCount - The number of payments.
   * @param tokenMint - The public key of the token mint.
   * @param ownerTokenAccount - An optional owner's token account.
   * @param tokenProgram - An optional token program.
   * @returns A promise that resolves to the transaction signature, or undefined if there is an error
   */
  increaseAllowance(
    uuid: UUID,
    agent: PublicKey,
    allowanceAmount: anchor.BN,
    paymentCount: number,
    tokenMint: PublicKey,
    ownerTokenAccount?: PublicKey,
    tokenProgram?: PublicKey
  ): Promise<string | undefined>;

  /**
   * Decreases the allowance for a sub-account.
   * @param uuid - The unique identifier for the main account, represented as an array of numbers.
   * @param agent - The public key of the agent accessing the sub-account.
   * @param allowanceAmount - The amount to decrease the allowance by as a BigNumber (anchor.BN).
   * @param paymentCount - The number of payments.
   * @param tokenMint - The public key of the token mint.
   * @param ownerTokenAccount - An optional owner's token account.
   * @param tokenProgram - An optional token program.
   * @returns A promise that resolves to the transaction signature, or undefined if there is an error
   */
  decreaseAllowance(
    uuid: UUID,
    agent: PublicKey,
    allowanceAmount: anchor.BN,
    paymentCount: number,
    tokenMint: PublicKey,
    ownerTokenAccount?: PublicKey,
    tokenProgram?: PublicKey
  ): Promise<string | undefined>;

  /**
   * Creates a sub-account.
   * @param uuid - The unique identifier for the main account, represented as an array of numbers.
   * @param agent - The public key of the agent accessing the sub-account.
   * @param payeeWhitelist - An array of public keys representing whitelisted payees.
   * @param tokenWhitelist - An array of public keys representing whitelisted tokens.
   * @param maxPerPayment - The maximum amount per payment as a BigNumber (anchor.BN).
   * @param paymentCount - The number of payments.
   * @param paymentInterval - The payment interval as a BigNumber (anchor.BN).
   * @param allowanceAmount - The allowance amount as a BigNumber (anchor.BN).
   * @param tokenMint - An optional public key of the token mint.
   * @param ownerTokenAccount - An optional owner's token account.
   * @param tokenProgram - An optional token program.
   * @returns A promise that resolves to the transaction signature, or undefined if there is an error
   */
  createSubAccount(
    uuid: UUID,
    agent: PublicKey,
    payeeWhitelist: Array<PublicKey>,
    tokenWhitelist: Array<PublicKey>,
    maxPerPayment: anchor.BN,
    paymentCount: number,
    paymentInterval: anchor.BN,
    allowanceAmount: anchor.BN,
    tokenMint?: PublicKey,
    ownerTokenAccount?: PublicKey,
    tokenProgram?: PublicKey
  ): Promise<string | undefined>;
}
// Define the SubAccountTxHandler interface
export interface SubAccountTxHandler {
  /**
   * Retrieves the state of the main account.
   * @param uuid - The unique identifier for the main account.
   * @returns A promise that resolves to a tuple containing the owner's public key and an array of whitelisted payees.
   */
  getMainAccountState(
    uuid: UUID
  ): Promise<[owner: PublicKey, globalPayeeWhitelist: Array<PublicKey>]>;

  /**
   * Retrieves the state of a sub-account.
   * @param uuid - The unique identifier for the main account.
   * @returns A promise that resolves to an array containing the sub-account's state details.
   */
  getSubAccountState(
    uuid: UUID
  ): Promise<
    [
      whitelistedPayees: Array<PublicKey>,
      whitelistedTokens: Array<PublicKey>,
      paymentInterval: anchor.BN,
      paymentCount: number,
      maxPerPayment: anchor.BN,
      lastPaymentTimestamp: anchor.BN
    ]
  >;

  /**
   * Requests a payment from a sub-account.
   * @param uuid - The unique identifier for the main account.
   * @param payee - The public key of the payee.
   * @param paymentAmount - The amount to be paid.
   * @param tokenMint - The public key of the token mint.
   * @param payeeTokenAccount - An optional payee's token account.
   * @param tokenProgram - An optional token program.
   * @returns  A promise that resolves to the transaction signature, or undefined if there is an error
   */
  paymentRequest(
    uuid: UUID,
    payee: PublicKey,
    paymentAmount: anchor.BN,
    tokenMint: PublicKey,
    payeeTokenAccount?: PublicKey,
    tokenProgram?: PublicKey
  ): Promise<string | undefined>;
}
