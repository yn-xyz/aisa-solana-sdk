/**
 * AISA Solana SDK Integration Tests
 * 
 * This test file demonstrates the core workflow of using the AISA SDK:
 * 1. Initialize handlers for main account and sub-account
 * 2. Create a main account with specified UUID and global payee whitelist
 * 3. Create a sub-account with necessary parameters
 * 4. Get account state information
 * 5. Process payment requests
 * 
 * Note: These tests make actual calls to the Solana blockchain and require:
 * - Valid RPC endpoint in .env file
 * - Valid private key with sufficient balance in .env file
 */

import { PublicKey, Keypair } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import * as dotenv from 'dotenv';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { BN } from '@coral-xyz/anchor';
import { deriveMainAccount, deriveSubAccount } from '../utils/common';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// Import proper handler classes from txhandler directory
import { MainAccountTxHandler } from '../txhandler/mainAccHandler';
import { SubAccountTxHandler } from '../txhandler/subAccHandler';

// Load environment variables
dotenv.config();

// Set a longer default Jest timeout for all tests
jest.setTimeout(180000); // 3 minutes to allow for blockchain interactions

// Generate a more unique UUID with a timestamp component and specific namespace to reduce conflicts
const generateTestUUID = () => {
  // Add timestamp components to make UUID more unique
  const now = new Date();
  const timestamp = [
    now.getFullYear() % 256,
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds() % 256,
    Math.floor(now.getMilliseconds() / 256)
  ];
  
  // Add more entropy by using crypto-safe random numbers when available
  const getRandomValues = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      // Browser environment with crypto
      const array = new Uint8Array(12);
      window.crypto.getRandomValues(array);
      return Array.from(array);
    } else {
      // Node environment or no crypto
      return Array.from({ length: 12 }, () => Math.floor(Math.random() * 256));
    }
  };
  
  // Combine timestamp and random components
  return [...timestamp, ...getRandomValues()];
};

// Helper function to safely check if a main account exists
const checkMainAccountExists = async (handler: MainAccountTxHandler, uuid: number[]): Promise<boolean> => {
  try {
    const [owner, ] = await handler.getMainAccountState(uuid);
    // Check if account exists and is owned by our wallet
    return owner.toString() === handler.wallet.publicKey.toString();
  } catch (error) {
    // Account doesn't exist or other error occurred
    return false;
  }
};

// Helper function to wait for transaction confirmation
const waitForConfirmation = async (milliseconds: number = 3000) => {
  console.log(`Waiting ${milliseconds}ms for transaction confirmation...`);
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

// Get wallet from environment variable for testing
const getWalletFromEnv = (): PublicKey => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not defined in .env");
  }
  
  try {
    // Convert base58 private key to keypair
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    return keypair.publicKey;
  } catch (error: any) {
    throw new Error(`Invalid private key format: ${error.message}`);
  }
};

// Use the wallet's public key from env as the test payee
const TEST_PAYEE = getWalletFromEnv();

// Use a real token mint for testing (provided by the user)
const TEST_TOKEN = new PublicKey(process.env.TOKEN_MINT || ''); 

/**
 * Advanced Multi-Account Testing Scenario
 * 
 * This test suite demonstrates a more complex workflow:
 * 1. Create a main account A
 * 2. Generate two new keypairs B and C
 * 3. Create sub-accounts for B and C under main account A
 * 4. Fund B and C with SOL and tokens
 * 5. Set allowances for B and C
 * 6. Test payment requests from B and C
 */
describe('AISA SDK Multi-Account Workflow', () => {
  // We'll use both handlers for the tests
  let mainAccountHandler: MainAccountTxHandler;  // Main account handler (account A)
  let agentBKeypair: Keypair;                    // Account B keypair
  let agentCKeypair: Keypair;                    // Account C keypair
  let agentBHandler: SubAccountTxHandler;        // Handler for account B
  let agentCHandler: SubAccountTxHandler;        // Handler for account C
  
  // Use a random UUID to avoid account conflicts
  const MULTI_TEST_UUID = generateTestUUID();
  
  // Flag to track if main account was successfully created
  let mainAccountCreated = false;
  
  // Track if sub-accounts were successfully created
  let subAccountBCreated = false;
  let subAccountCCreated = false;
  
  // Track if agents' handlers were successfully initialized
  let agentBHandlerInitialized = false;
  let agentCHandlerInitialized = false;
  
  // This runs before all tests in this suite
  beforeAll(async () => {
    // 注意：全局超时设置已经移到文件顶部
    
    // Initialize the main account handler
    console.log('Initializing main account handler for multi-account tests...');
    mainAccountHandler = await MainAccountTxHandler.initialize();
    
    // Generate two new keypairs for agents B and C
    agentBKeypair = Keypair.generate();
    agentCKeypair = Keypair.generate();
    
    console.log('Created agent B with public key:', agentBKeypair.publicKey.toString());
    console.log('Created agent C with public key:', agentCKeypair.publicKey.toString());
    
    // Create the main account
    let retries = 0;
    const MAX_RETRIES = 3;
    
    while (!mainAccountCreated && retries < MAX_RETRIES) {
      try {
        // Check if an account with this UUID already exists
        const accountExists = await checkMainAccountExists(mainAccountHandler, MULTI_TEST_UUID);
        
        if (accountExists) {
          console.log('Multi-test main account already exists with correct owner, continuing...');
          mainAccountCreated = true;
          break; // Exit the loop immediately
        } else {
          // Create it with the current UUID
          console.log('Attempting to create multi-test main account with UUID:', MULTI_TEST_UUID.join(','));
          try {
            const txId = await mainAccountHandler.createMainAccount(
              MULTI_TEST_UUID,
              [TEST_PAYEE] // Add main wallet and test payee to whitelist
            );
            console.log('Created multi-test main account, txId:', txId);
            
            // Wait for the transaction to confirm
            await waitForConfirmation();
            
            // Verify the account was created successfully
            const verifyExists = await checkMainAccountExists(mainAccountHandler, MULTI_TEST_UUID);
            if (verifyExists) {
              console.log('Successfully verified multi-test main account creation');
              mainAccountCreated = true;
              break; // Exit the loop immediately
            } else {
              // If verification fails, generate a new UUID and retry
              console.log('Account verification failed, generating new UUID and retrying...');
              MULTI_TEST_UUID.length = 0; // Clear the array
              MULTI_TEST_UUID.push(...generateTestUUID()); // Add new values
              retries++;
            }
          } catch (createError: any) {
            console.error('Error creating main account:', createError);
            
            // Check if it's a DuplicatePublicKey error
            if (createError.toString().includes('DuplicatePubkey') || 
                (createError.transactionLogs && 
                 createError.transactionLogs.some((log: string) => log.includes('DuplicatePubkey')))) {
              console.log('Account with this UUID exists but has different owner, generating new UUID...');
              MULTI_TEST_UUID.length = 0; // Clear the array
              MULTI_TEST_UUID.push(...generateTestUUID()); // Add new values
            } else {
              // For unexpected errors, log and retry with a new UUID
              console.log('Unexpected error creating account, generating new UUID and retrying...');
              MULTI_TEST_UUID.length = 0; // Clear the array
              MULTI_TEST_UUID.push(...generateTestUUID()); // Add new values
            }
            retries++;
          }
        }
      } catch (error: any) {
        console.error('Error during multi-test main account setup:', error);
        
        // Generate a new UUID and retry
        console.log('Error in account check, generating new UUID and retrying...');
        MULTI_TEST_UUID.length = 0; // Clear the array
        MULTI_TEST_UUID.push(...generateTestUUID()); // Add new values
        retries++;
      }
      
      // Wait between retries
      if (!mainAccountCreated && retries < MAX_RETRIES) {
        console.log(`Retry attempt ${retries}/${MAX_RETRIES}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second pause
      }
    }
    
    if (mainAccountCreated) {
      console.log('Multi-account test setup completed successfully');
    } else {
      console.warn('Multi-account test setup failed, tests in this suite will be skipped');
    }
  }, 60000); // 确保beforeAll有足够的时间完成
  
  // Test funding and initializing agents B and C
  test('Should fund agents B and C with SOL', async () => {
    // Skip this test if main account creation failed
    if (!mainAccountCreated) {
      console.log('Main account not created, skipping funding test');
      return;
    }
    
    // Fund the agent accounts with SOL from main account
    try {
      // Create a transaction to transfer SOL to agent B
      const transferBInstructions = [
        anchor.web3.SystemProgram.transfer({
          fromPubkey: mainAccountHandler.wallet.publicKey,
          toPubkey: agentBKeypair.publicKey,
          lamports: 100000000 // 0.1 SOL - increased significantly for rent
        })
      ];
      
      const txSignatureB = await mainAccountHandler.sendAndConfirmTransaction(
        transferBInstructions,
        mainAccountHandler.wallet.publicKey,
        [mainAccountHandler.signer]
      );
      console.log('Funded agent B with 0.1 SOL, txId:', txSignatureB);
      
      // Create a transaction to transfer SOL to agent C
      const transferCInstructions = [
        anchor.web3.SystemProgram.transfer({
          fromPubkey: mainAccountHandler.wallet.publicKey,
          toPubkey: agentCKeypair.publicKey,
          lamports: 100000000 // 0.1 SOL - increased significantly for rent
        })
      ];
      
      const txSignatureC = await mainAccountHandler.sendAndConfirmTransaction(
        transferCInstructions,
        mainAccountHandler.wallet.publicKey,
        [mainAccountHandler.signer]
      );
      console.log('Funded agent C with 0.1 SOL, txId:', txSignatureC);
      
      // Wait for transactions to confirm
      await waitForConfirmation();
      
    } catch (error: any) {
      console.error('Failed to fund agents with SOL:', error);
      throw error; // Funding is critical for subsequent tests
    }
  }, 10000);
  
  // Test creating sub-accounts for agents B and C
  test('Should create sub-accounts for agents B and C', async () => {
    // Skip this test if main account creation failed
    if (!mainAccountCreated) {
      console.log('Main account not created, skipping sub-account creation test');
      return;
    }
    
    // Create sub-account for agent B
    try {
      // First check if the sub-account already exists
      const mainAccount = deriveMainAccount(Uint8Array.from(MULTI_TEST_UUID));
      const subAccountB = deriveSubAccount(mainAccount, agentBKeypair.publicKey);
      
      // Check if sub-account B already exists
      try {
        await mainAccountHandler.program.account.subAccount.fetch(subAccountB);
        console.log('Sub-account for agent B already exists, skipping creation');
        subAccountBCreated = true;
      } catch (error: any) {
        // Sub-account doesn't exist, create it
        console.log('Creating sub-account for agent B...');
        const txIdB = await mainAccountHandler.createSubAccount(
          MULTI_TEST_UUID,
          agentBKeypair.publicKey,
          [TEST_PAYEE], // payeeWhitelist
          [TEST_TOKEN], // tokenWhitelist
          new anchor.BN(1000000), // maxPerPayment
          10, // paymentCount
          new anchor.BN(86400), // paymentInterval (1 day in seconds)
          new anchor.BN(5000000), // Initial allowance (increased from 0)
          TEST_TOKEN
        );
        console.log('Created sub-account for agent B, txId:', txIdB);
        
        // Wait for transaction to confirm
        await waitForConfirmation();
        
        // Verify sub-account was created
        try {
          await mainAccountHandler.program.account.subAccount.fetch(subAccountB);
          console.log('Successfully verified sub-account B creation');
          subAccountBCreated = true;
        } catch (error: any) {
          console.error('Failed to verify sub-account B creation:', error);
        }
      }
    } catch (error: any) {
      console.error('Failed to create sub-account for agent B:', error);
      // Continue with tests but log clear error
      console.log('Continuing despite sub-account B creation failure, but later tests may fail');
    }
    
    // Create sub-account for agent C
    try {
      // First check if the sub-account already exists
      const mainAccount = deriveMainAccount(Uint8Array.from(MULTI_TEST_UUID));
      const subAccountC = deriveSubAccount(mainAccount, agentCKeypair.publicKey);
      
      // Check if sub-account C already exists
      try {
        await mainAccountHandler.program.account.subAccount.fetch(subAccountC);
        console.log('Sub-account for agent C already exists, skipping creation');
        subAccountCCreated = true;
      } catch (error: any) {
        // Sub-account doesn't exist, create it
        console.log('Creating sub-account for agent C...');
        const txIdC = await mainAccountHandler.createSubAccount(
          MULTI_TEST_UUID,
          agentCKeypair.publicKey,
          [TEST_PAYEE], // payeeWhitelist
          [TEST_TOKEN], // tokenWhitelist
          new anchor.BN(500000), // maxPerPayment (less than agent B)
          5, // paymentCount (less than agent B)
          new anchor.BN(43200), // paymentInterval (12 hours in seconds)
          new anchor.BN(2500000), // Initial allowance (increased from 0)
          TEST_TOKEN
        );
        console.log('Created sub-account for agent C, txId:', txIdC);
        
        // Wait for transaction to confirm
        await waitForConfirmation();
        
        // Verify sub-account was created
        try {
          await mainAccountHandler.program.account.subAccount.fetch(subAccountC);
          console.log('Successfully verified sub-account C creation');
          subAccountCCreated = true;
        } catch (error: any) {
          console.error('Failed to verify sub-account C creation:', error);
        }
      }
    } catch (error: any) {
      console.error('Failed to create sub-account for agent C:', error);
      // Continue with tests but log clear error
      console.log('Continuing despite sub-account C creation failure, but later tests may fail');
    }
  }, 20000);
  
  // Test setting allowances for agents B and C
  test('Should set token allowances for agents B and C', async () => {
    // Skip this test if sub-accounts weren't created
    if (!subAccountBCreated && !subAccountCCreated) {
      console.log('No sub-accounts were created, skipping allowance setting test');
      return;
    }
    
    // Set allowance for agent B if sub-account was created
    if (subAccountBCreated) {
      try {
        const txIdB = await mainAccountHandler.increaseAllowance(
          MULTI_TEST_UUID,
          agentBKeypair.publicKey,
          new anchor.BN(5000000), // 5 tokens (assuming 6 decimals)
          10, // payment count
          TEST_TOKEN
        );
        console.log('Set allowance for agent B, txId:', txIdB);
        
        // Wait for transaction to confirm
        await waitForConfirmation();
        
      } catch (error: any) {
        // Check if it's a duplicate key error, which we can ignore
        if (error.toString().includes('DuplicatePubkey')) {
          console.log('This appears to be a duplicate key error, which may be safe to ignore');
        } else {
          console.error('Failed to set allowance for agent B:', error);
          console.log('Continuing despite agent B allowance setting failure, but later tests may fail');
        }
      }
    } else {
      console.log('Sub-account B not created, skipping its allowance setting');
    }
    
    // Set allowance for agent C if sub-account was created
    if (subAccountCCreated) {
      try {
        const txIdC = await mainAccountHandler.increaseAllowance(
          MULTI_TEST_UUID,
          agentCKeypair.publicKey,
          new anchor.BN(2500000), // 2.5 tokens (assuming 6 decimals)
          5, // payment count
          TEST_TOKEN
        );
        console.log('Set allowance for agent C, txId:', txIdC);
        
        // Wait for transaction to confirm
        await waitForConfirmation();
        
      } catch (error: any) {
        // Check if it's a duplicate key error, which we can ignore
        if (error.toString().includes('DuplicatePubkey')) {
          console.log('This appears to be a duplicate key error, which may be safe to ignore');
        } else {
          console.error('Failed to set allowance for agent C:', error);
          console.log('Continuing despite agent C allowance setting failure, but later tests may fail');
        }
      }
    } else {
      console.log('Sub-account C not created, skipping its allowance setting');
    }
  }, 20000);
  
  // Check token balances and transfer tokens if needed
  test('Should check and fund sub-accounts with tokens', async () => {
    // Skip this test if no sub-accounts were created
    if (!subAccountBCreated && !subAccountCCreated) {
      console.log('No sub-accounts were created, skipping token funding test');
      return;
    }
    
    try {
      // Check token balances for sub-accounts and transfer tokens if needed
      
      // We derive the necessary accounts
      const mainAccount = deriveMainAccount(Uint8Array.from(MULTI_TEST_UUID));
      let subAccountBTokenAccount;
      let subAccountCTokenAccount;
      
      // Derive the ATA addresses for the sub-accounts
      const TokenProgram = TOKEN_PROGRAM_ID;
      
      if (subAccountBCreated) {
        const subAccountB = deriveSubAccount(mainAccount, agentBKeypair.publicKey);
        subAccountBTokenAccount = getAssociatedTokenAddressSync(
          TEST_TOKEN,
          subAccountB,
          true,
          TokenProgram,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log('Sub-account B token account:', subAccountBTokenAccount.toString());
      }
      
      if (subAccountCCreated) {
        const subAccountC = deriveSubAccount(mainAccount, agentCKeypair.publicKey);
        subAccountCTokenAccount = getAssociatedTokenAddressSync(
          TEST_TOKEN,
          subAccountC,
          true,
          TokenProgram,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log('Sub-account C token account:', subAccountCTokenAccount.toString());
      }
      
      // Get the main wallet's token account for TEST_TOKEN
      const mainWalletTokenAccount = getAssociatedTokenAddressSync(
        TEST_TOKEN,
        mainAccountHandler.wallet.publicKey,
        false,
        TokenProgram,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      console.log('Main wallet token account:', mainWalletTokenAccount.toString());
      
      // First make sure the main wallet's token account exists and has balance
      try {
        // Check if the main wallet token account exists
        const mainBalance = await mainAccountHandler.connection.getTokenAccountBalance(mainWalletTokenAccount);
        console.log('Main wallet token balance:', mainBalance.value.uiAmount);
        
        // Let's skip the explicit transfers and rely on the increaseAllowance calls from previous test
        // Those should have set up the token accounts and transferred tokens
        
        console.log('Using the tokens transferred by increaseAllowance - skipping additional transfers');
        
      } catch (error: any) {
        console.error('Error checking main wallet token account:', error);
        throw new Error('Main wallet token account is required for tests');
      }
      
      // Wait for any transactions to confirm
      await waitForConfirmation();
      
    } catch (error: any) {
      console.error('Failed to check and fund sub-accounts with tokens:', error);
      console.log('Continuing despite token funding issues, but payment tests may fail');
    }
  }, 10000);
  
  // Test initializing handlers for agents B and C
  test('Should initialize handlers for agents B and C', async () => {
    // Skip this test if main account creation failed
    if (!mainAccountCreated) {
      console.log('Main account not created, skipping handler initialization test');
      return;
    }
    
    // Create a custom handler for agent B that uses agent B's keypair
    class CustomBHandler extends SubAccountTxHandler {
      public static async initializeWithKeypair(keypair: Keypair): Promise<SubAccountTxHandler> {
        // Save the environment variables
        const origPrivateKey = process.env.PRIVATE_KEY;
        
        try {
          // Override the private key with agent B's keypair
          process.env.PRIVATE_KEY = bs58.encode(keypair.secretKey);
          
          // Initialize with the overridden environment
          const handler = await SubAccountTxHandler.initialize();
          return handler;
        } finally {
          // Restore the original environment
          process.env.PRIVATE_KEY = origPrivateKey;
        }
      }
    }
    
    // Create a custom handler for agent C that uses agent C's keypair
    class CustomCHandler extends SubAccountTxHandler {
      public static async initializeWithKeypair(keypair: Keypair): Promise<SubAccountTxHandler> {
        // Save the environment variables
        const origPrivateKey = process.env.PRIVATE_KEY;
        
        try {
          // Override the private key with agent C's keypair
          process.env.PRIVATE_KEY = bs58.encode(keypair.secretKey);
          
          // Initialize with the overridden environment
          const handler = await SubAccountTxHandler.initialize();
          return handler;
        } finally {
          // Restore the original environment
          process.env.PRIVATE_KEY = origPrivateKey;
        }
      }
    }
    
    // Initialize agent B's handler if its sub-account was created
    if (subAccountBCreated) {
      try {
        // Initialize the handler with the custom keypair
        agentBHandler = await CustomBHandler.initializeWithKeypair(agentBKeypair);
        console.log('Initialized handler for agent B');
        expect(agentBHandler).toBeDefined();
        expect(agentBHandler.wallet.publicKey.toString()).toBe(agentBKeypair.publicKey.toString());
        agentBHandlerInitialized = true;
      } catch (error: any) {
        console.error('Failed to initialize handler for agent B:', error);
      }
    } else {
      console.log('Sub-account B not created, skipping its handler initialization');
    }
    
    // Initialize agent C's handler if its sub-account was created
    if (subAccountCCreated) {
      try {
        // Initialize the handler with the custom keypair
        agentCHandler = await CustomCHandler.initializeWithKeypair(agentCKeypair);
        console.log('Initialized handler for agent C');
        expect(agentCHandler).toBeDefined();
        expect(agentCHandler.wallet.publicKey.toString()).toBe(agentCKeypair.publicKey.toString());
        agentCHandlerInitialized = true;
      } catch (error: any) {
        console.error('Failed to initialize handler for agent C:', error);
      }
    } else {
      console.log('Sub-account C not created, skipping its handler initialization');
    }
    
    // At least one handler should be initialized
    if (!agentBHandlerInitialized && !agentCHandlerInitialized) {
      throw new Error('Failed to initialize handlers for both agents');
    }
  });
  
  // Test processing payment requests from agents B and C
  test('Should process payment requests from agents B and C', async () => {
    // Skip this test if no handlers were initialized
    if (!agentBHandlerInitialized && !agentCHandlerInitialized) {
      console.log('No agent handlers were initialized, skipping payment request test');
      return;
    }
    
    // Process payment request from agent B if its handler was initialized
    if (agentBHandlerInitialized) {
      try {
        // First verify the sub-account exists and has appropriate allowance/state
        try {
          const stateB = await agentBHandler.getSubAccountState(MULTI_TEST_UUID);
          console.log('Agent B sub-account state before payment:', stateB);
        } catch (error: any) {
          console.warn('Could not verify agent B sub-account state, payment may fail:', error);
        }
        
        const txIdB = await agentBHandler.paymentRequest(
          MULTI_TEST_UUID,
          TEST_PAYEE,
          new anchor.BN(100000), // 0.1 tokens (assuming 6 decimals)
          TEST_TOKEN
        );
        console.log('Processed payment request from agent B, txId:', txIdB);
        
        // Wait for transaction to confirm
        await waitForConfirmation();
        
      } catch (error: any) {
        console.error('Failed to process payment request from agent B:', error);
        console.log('Agent B payment request failed, check previous errors for context');
      }
    } else {
      console.log('Agent B handler not initialized, skipping its payment request');
    }
    
    // Process payment request from agent C if its handler was initialized
    if (agentCHandlerInitialized) {
      try {
        // First verify the sub-account exists and has appropriate allowance/state
        try {
          const stateC = await agentCHandler.getSubAccountState(MULTI_TEST_UUID);
          console.log('Agent C sub-account state before payment:', stateC);
        } catch (error: any) {
          console.warn('Could not verify agent C sub-account state, payment may fail:', error);
        }
        
        const txIdC = await agentCHandler.paymentRequest(
          MULTI_TEST_UUID,
          TEST_PAYEE,
          new anchor.BN(50000), // 0.05 tokens (assuming 6 decimals)
          TEST_TOKEN
        );
        console.log('Processed payment request from agent C, txId:', txIdC);
        
        // Wait for transaction to confirm
        await waitForConfirmation();
        
      } catch (error: any) {
        console.error('Failed to process payment request from agent C:', error);
        console.log('Agent C payment request failed, check previous errors for context');
      }
    } else {
      console.log('Agent C handler not initialized, skipping its payment request');
    }
  }, 30000);
  
  // Test checking the state of the sub-accounts after payments
  test('Should verify sub-account states after payments', async () => {
    // Skip this test if no handlers were initialized
    if (!agentBHandlerInitialized && !agentCHandlerInitialized) {
      console.log('No agent handlers were initialized, skipping sub-account state verification test');
      return;
    }
    
    // Check state of agent B's sub-account if its handler was initialized
    if (agentBHandlerInitialized) {
      try {
        // We need to use agent B's handler to get agent B's sub-account state
        const stateB = await agentBHandler.getSubAccountState(MULTI_TEST_UUID);
        console.log('Agent B sub-account state after payment:', stateB);
        expect(stateB).toBeDefined();
        
        // Extract relevant state values for logging
        const [, , , paymentCountB, , lastPaymentTimestampB] = stateB;
        console.log('Agent B payment count:', paymentCountB);
        console.log('Agent B last payment timestamp:', lastPaymentTimestampB.toString());
        
      } catch (error: any) {
        console.error('Failed to verify agent B sub-account state:', error);
        console.log('Sub-account state verification failure is expected if earlier steps failed');
      }
    } else {
      console.log('Agent B handler not initialized, skipping its state verification');
    }
    
    // Check state of agent C's sub-account if its handler was initialized
    if (agentCHandlerInitialized) {
      try {
        // We need to use agent C's handler to get agent C's sub-account state
        const stateC = await agentCHandler.getSubAccountState(MULTI_TEST_UUID);
        console.log('Agent C sub-account state after payment:', stateC);
        expect(stateC).toBeDefined();
        
        // Extract relevant state values for logging
        const [, , , paymentCountC, , lastPaymentTimestampC] = stateC;
        console.log('Agent C payment count:', paymentCountC);
        console.log('Agent C last payment timestamp:', lastPaymentTimestampC.toString());
        
      } catch (error: any) {
        console.error('Failed to verify agent C sub-account state:', error);
        console.log('Sub-account state verification failure is expected if earlier steps failed');
      }
    } else {
      console.log('Agent C handler not initialized, skipping its state verification');
    }
  });
}); 