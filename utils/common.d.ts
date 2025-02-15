import { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
export declare function deriveMainAccount(uuid: Uint8Array): PublicKey;
export declare function deriveSubAccount(mainAccount: PublicKey, agent: PublicKey): PublicKey;
export declare function getTokenBalance(connection: Connection, tokenAccount: PublicKey): Promise<number>;
