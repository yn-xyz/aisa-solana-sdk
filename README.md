# AISA Solana SDK

A TypeScript library for interacting with AISA (Automated Intelligent Spending Accounts) Solana smart contracts. This SDK provides a set of APIs that allow applications to create and manage main accounts and sub-accounts, set payment rules, handle authorized payments, and more.

[中文文档](./README-zhCN.md)

## Features

- Create and manage main accounts and sub-accounts
- Payment recipient whitelist management
- Token whitelist management
- Configure payment frequency, amount, and intervals
- Increase and decrease sub-account allowances
- Support for SPL token payment requests

## Installation

```bash
npm install aisa-solana-sdk
# or
yarn add aisa-solana-sdk
```

## Environment Configuration

Create a `.env` file, referencing `.env.sample` to configure the following variables:

```
RPC_URL=<Your Solana RPC URL>
CONTRACT_ADDRESS=<AISA Contract Address>
PRIVATE_KEY=<Your Wallet Private Key>
```

## Usage

### Initialization

```typescript
import { MainAccountTxHandler, SubAccountTxHandler } from "aisa-solana-sdk";

// Initialize the main account handler (used by account owner)
const mainAccountHandler = await MainAccountTxHandler.initialize();

// Initialize the sub-account handler (used by agent/user)
const subAccountHandler = await SubAccountTxHandler.initialize();
```

### Main Account Operations

```typescript
// Create a main account
const uuid = [1, 2, 3, 4]; // Unique identifier
const globalPayeeWhitelist = ["payee_pubkey1", "payee_pubkey2"]; // Global allowed payee list
const txId = await mainAccountHandler.createMainAccount(uuid, globalPayeeWhitelist);

// Query main account state
const [owner, whitelist] = await mainAccountHandler.getMainAccountState(uuid);

// Update main account rules
await mainAccountHandler.updateMainAccountRules(uuid, ["new_payee_pubkey1", "new_payee_pubkey2"]);
```

### Sub-Account Operations

```typescript
// Create a sub-account
import * as anchor from "@coral-xyz/anchor";
const uuid = [1, 2, 3, 4]; // Main account's unique identifier
const agent = "agent_pubkey"; // Sub-account's agent
const payeeWhitelist = ["payee_pubkey1"]; // Allowed payees for the sub-account
const tokenWhitelist = ["token_pubkey1", "token_pubkey2"]; // Allowed tokens for the sub-account
const maxPerPayment = new anchor.BN(1000000); // Maximum amount per payment
const paymentCount = 10; // Number of payments
const paymentInterval = new anchor.BN(86400); // Payment interval (seconds)
const allowanceAmount = new anchor.BN(10000000); // Initial allowance amount

await mainAccountHandler.createSubAccount(
  uuid,
  agent,
  payeeWhitelist,
  tokenWhitelist,
  maxPerPayment,
  paymentCount,
  paymentInterval,
  allowanceAmount,
  "token_pubkey" // Optional parameter
);

// Increase sub-account allowance
await mainAccountHandler.increaseAllowance(
  uuid,
  agent,
  new anchor.BN(5000000), // Amount to increase
  5, // Payment count
  "token_pubkey"
);

// Decrease sub-account allowance
await mainAccountHandler.decreaseAllowance(
  uuid,
  agent,
  new anchor.BN(2000000), // Amount to decrease
  2, // Payment count
  "token_pubkey"
);
```

### Sub-Account Payment Requests (Initiated by Agent/User)

```typescript
// Initiate a payment request
const uuid = [1, 2, 3, 4]; // Main account's unique identifier
const payee = "payee_pubkey"; // Payee public key
const amount = new anchor.BN(500000); // Payment amount
const tokenMint = "token_pubkey"; // Token public key

const txId = await subAccountHandler.paymentRequest(
  uuid,
  payee,
  amount,
  tokenMint
);
```

## Main Components

### MainAccountTxHandler

Main account transaction handler, used by the account owner, providing the following functions:

- Create and manage main accounts
- Create and manage sub-accounts
- Set global payee whitelist
- Set payment rules and limitations for sub-accounts
- Manage sub-account allowances

### SubAccountTxHandler

Sub-account transaction handler, used by sub-account agents/users, providing the following functions:

- Query account state
- Initiate payment requests that comply with rules

## License

ISC 