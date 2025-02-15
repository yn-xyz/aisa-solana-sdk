"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAisaTxHandler = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
const dotenv = __importStar(require("dotenv"));
const idlPath = "./utils/aisa_contracts.json";
class BaseAisaTxHandler {
    constructor() { }
    //to be called by the user or agent
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = new BaseAisaTxHandler();
            dotenv.config();
            handler.wallet = handler.loadWallet();
            handler.signer = handler.wallet.payer;
            handler.provider = new anchor.AnchorProvider(handler.loadRpc(), handler.wallet, {
                preflightCommitment: "processed",
            });
            handler.connection = handler.provider.connection;
            handler.program = handler.getProgram(idlPath, handler.provider);
            return handler;
        });
    }
    getProgram(idlPath, provider) {
        const AaIdl = JSON.parse(JSON.stringify(require(idlPath)));
        return new anchor.Program(AaIdl, provider);
    }
    loadRpc() {
        const rpcUrl = process.env.RPC_URL;
        if (!rpcUrl) {
            throw new Error("RPC URL not defined in .env");
        }
        try {
            const connection = new anchor.web3.Connection(rpcUrl, {
                commitment: "processed",
            });
            return connection;
        }
        catch (error) {
            throw new Error(`Failed to create RPC connection: ${error.message}`);
        }
    }
    loadWallet() {
        const privateKeyString = process.env.PRIVATE_KEY;
        if (!privateKeyString) {
            throw new Error("PRIVATE_KEY not defined in .env");
        }
        try {
            const privateKey = Uint8Array.from(JSON.parse(privateKeyString));
            if (privateKey.length !== 64) {
                throw new Error("Invalid private key length");
            }
            const keypair = web3_js_1.Keypair.fromSecretKey(privateKey);
            return new anchor.Wallet(keypair);
        }
        catch (error) {
            throw new Error(`Invalid private key format : ${error.message}`);
        }
    }
    sendAndConfirmTransaction(instructions, payerKey, signers, lookupTableAccounts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestBlockHash = yield this.connection.getLatestBlockhash();
                const messageV0 = new web3_js_1.TransactionMessage({
                    payerKey: payerKey,
                    recentBlockhash: latestBlockHash.blockhash,
                    instructions: instructions,
                }).compileToV0Message(lookupTableAccounts);
                const transactionV0 = new web3_js_1.VersionedTransaction(messageV0);
                transactionV0.sign(signers);
                const signature = yield this.connection.sendTransaction(transactionV0);
                yield this.connection.confirmTransaction({
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature: signature,
                }, "confirmed");
                return signature;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.BaseAisaTxHandler = BaseAisaTxHandler;
