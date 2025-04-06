import { PublicKey } from "@solana/web3.js";
import { AISA_CONTRACT, MAIN_ACCOUNT_SEED, SUB_ACCOUNT_SEED } from "./consts";
import { Connection } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export type TimeUnit =
  | { second: {} }
  | { minute: {} }
  | { hour: {} }
  | { day: {} }
  | { week: {} }
  | { month: {} };

export type SpendCap =
  | { none: {} }
  | {
      limited: {
        duration: number; // u32
        unit: TimeUnit;
        amount: BN; // u64
      };
    };
export type SpendCapUpdate =
  | { type: "spendCap"; value: SpendCap }
  | { type: "amount"; value: BN }
  | { type: "duration"; duration: number; unit: TimeUnit };

export function deriveMainAccount(uuid: Uint8Array): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MAIN_ACCOUNT_SEED), Buffer.from(uuid)],
    AISA_CONTRACT
  )[0];
}

export function deriveSubAccount(
  mainAccount: PublicKey,
  agent: PublicKey
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SUB_ACCOUNT_SEED), mainAccount.toBuffer(), agent.toBuffer()],
    AISA_CONTRACT
  )[0];
}

export async function getTokenBalance(
  connection: Connection,
  tokenAccount: PublicKey
): Promise<number> {
  return Number(
    (await connection.getTokenAccountBalance(tokenAccount, "processed")).value
      .amount
  );
}
