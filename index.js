var e=require("@coral-xyz/anchor"),n=require("@solana/web3.js"),r=require("@solana/spl-token"),t=require("dotenv");function o(e){if(e&&e.__esModule)return e;var n=Object.create(null);return e&&Object.keys(e).forEach(function(r){if("default"!==r){var t=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(n,r,t.get?t:{enumerable:!0,get:function(){return e[r]}})}}),n.default=e,n}var i=/*#__PURE__*/o(e),c=/*#__PURE__*/o(t);function s(e,n){e.prototype=Object.create(n.prototype),e.prototype.constructor=e,a(e,n)}function a(e,n){return a=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,n){return e.__proto__=n,e},a(e,n)}var u=new i.web3.PublicKey("G34e7zJuRne2pfDHh9YayixM2rJFdwV624NUzbj9FRR5");function m(e){return n.PublicKey.findProgramAddressSync([Buffer.from("main_account"),Buffer.from(e)],u)[0]}function l(e,r){return n.PublicKey.findProgramAddressSync([Buffer.from("sub_account"),e.toBuffer(),r.toBuffer()],u)[0]}var h=/*#__PURE__*/function(){function e(){this.program=void 0,this.provider=void 0,this.connection=void 0,this.signer=void 0,this.wallet=void 0}e.initialize=function(){try{var n=new e;return c.config(),n.wallet=n.loadWallet(),n.signer=n.wallet.payer,n.provider=new i.AnchorProvider(n.loadRpc(),n.wallet,{preflightCommitment:"processed"}),n.connection=n.provider.connection,n.program=n.getProgram("./utils/aisa_contracts.json",n.provider),Promise.resolve(n)}catch(e){return Promise.reject(e)}};var r=e.prototype;return r.getProgram=function(e,n){var r=JSON.parse(JSON.stringify(require(e)));return new i.Program(r,n)},r.loadRpc=function(){var e=process.env.RPC_URL;if(!e)throw new Error("RPC URL not defined in .env");try{return new i.web3.Connection(e,{commitment:"processed"})}catch(e){throw new Error("Failed to create RPC connection: "+e.message)}},r.loadWallet=function(){var e=process.env.PRIVATE_KEY;if(!e)throw new Error("PRIVATE_KEY not defined in .env");try{var r=Uint8Array.from(JSON.parse(e));if(64!==r.length)throw new Error("Invalid private key length");var t=n.Keypair.fromSecretKey(r);return new i.Wallet(t)}catch(e){throw new Error("Invalid private key format : "+e.message)}},r.sendAndConfirmTransaction=function(e,r,t,o){try{var i=this;return Promise.resolve(function(c,s){try{var a=Promise.resolve(i.connection.getLatestBlockhash()).then(function(c){var s=new n.TransactionMessage({payerKey:r,recentBlockhash:c.blockhash,instructions:e}).compileToV0Message(o),a=new n.VersionedTransaction(s);return a.sign(t),Promise.resolve(i.connection.sendTransaction(a)).then(function(e){return Promise.resolve(i.connection.confirmTransaction({blockhash:c.blockhash,lastValidBlockHeight:c.lastValidBlockHeight,signature:e},"confirmed")).then(function(){return e})})})}catch(e){return s(e)}return a&&a.then?a.then(void 0,s):a}(0,function(e){console.log(e)}))}catch(e){return Promise.reject(e)}},e}(),f=/*#__PURE__*/function(e){function n(){return e.apply(this,arguments)||this}s(n,e),n.initialize=function(){try{return Promise.resolve(e.initialize.call(this))}catch(e){return Promise.reject(e)}};var t=n.prototype;return t.createMainAccount=function(e,n){try{var r=this,t=[];return Promise.resolve(r.program.methods.createMainAccount(e,n).accounts({owner:r.signer.publicKey}).instruction()).then(function(e){return t.push(e),Promise.resolve(r.sendAndConfirmTransaction(t,r.signer.publicKey,[r.signer]))})}catch(e){return Promise.reject(e)}},t.getMainAccountState=function(e){try{return Promise.resolve(this.program.account.mainAccount.fetch(m(Uint8Array.from(e)))).then(function(e){return[e.owner,e.globalWhitelistedPayees]})}catch(e){return Promise.reject(e)}},t.getSubAccountState=function(e,n){try{var r=m(Uint8Array.from(e));return Promise.resolve(this.program.account.subAccount.fetch(l(r,n))).then(function(e){return[e.whitelistedPayees,e.whitelistedTokens,e.paymentInterval,e.paymentCount,e.maxPerPayment,e.lastPaymentTimestamp]})}catch(e){return Promise.reject(e)}},t.updateMainAccountRules=function(e,n){try{var r=this,t=[],o=m(Uint8Array.from(e));return Promise.resolve(r.program.methods.updateGlobalWhitelistedPayees(n).accounts({owner:r.signer.publicKey,mainAccount:o}).instruction()).then(function(e){return t.push(e),Promise.resolve(r.sendAndConfirmTransaction(t,r.signer.publicKey,[r.signer]))})}catch(e){return Promise.reject(e)}},t.updateSubAccountRules=function(e,n,r,t,o,i,c){try{var s=function(){function e(){function e(){return function(){if(i)return Promise.resolve(a.program.methods.updatePaymentCount(i).accounts({owner:a.signer.publicKey,agent:n,mainAccount:l}).instruction()).then(function(e){function r(){return Promise.resolve(a.sendAndConfirmTransaction(u,a.signer.publicKey,[a.signer]))}u.push(e);var t=function(){if(c)return Promise.resolve(a.program.methods.updatePaymentInterval(c).accounts({owner:a.signer.publicKey,agent:n,mainAccount:l}).instruction()).then(function(e){u.push(e)})}();return t&&t.then?t.then(r):r()})}()}var r=function(){if(o)return Promise.resolve(a.program.methods.updateMaxPerPayment(o).accounts({owner:a.signer.publicKey,agent:n,mainAccount:l}).instruction()).then(function(e){u.push(e)})}();return r&&r.then?r.then(e):e()}var r=function(){if(t)return Promise.resolve(a.program.methods.updateWhitelistedTokens(t).accounts({owner:a.signer.publicKey,agent:n,mainAccount:l}).instruction()).then(function(e){u.push(e)})}();return r&&r.then?r.then(e):e()},a=this,u=[],l=m(Uint8Array.from(e)),h=function(){if(r)return Promise.resolve(a.program.methods.updateWhitelistedPayees(r).accounts({owner:a.signer.publicKey,agent:n,mainAccount:l}).instruction()).then(function(e){u.push(e)})}();return Promise.resolve(h&&h.then?h.then(s):s())}catch(e){return Promise.reject(e)}},t.increaseAllowance=function(e,n,t,o,i,c,s){try{var a=this,u=[],l=m(Uint8Array.from(e)),h=s||r.TOKEN_PROGRAM_ID;return Promise.resolve(a.program.methods.increaseSubAccountAllowance(t,o).accounts({owner:a.signer.publicKey,ownerTokenAccount:c||r.getAssociatedTokenAddressSync(i,a.signer.publicKey,!1,h,r.ASSOCIATED_TOKEN_PROGRAM_ID),agent:n,mainAccount:l,tokenMint:i,tokenProgram:h}).instruction()).then(function(e){return u.push(e),Promise.resolve(a.sendAndConfirmTransaction(u,a.signer.publicKey,[a.signer]))})}catch(e){return Promise.reject(e)}},t.decreaseAllowance=function(e,n,t,o,i,c,s){try{var a=this,u=[],h=m(Uint8Array.from(e)),f=l(h,a.signer.publicKey),p=s||r.TOKEN_PROGRAM_ID;return Promise.resolve(a.program.methods.decreaseSubAccountAllowance(t,o).accounts({owner:a.signer.publicKey,ownerTokenAccount:c||r.getAssociatedTokenAddressSync(i,a.signer.publicKey,!1,p,r.ASSOCIATED_TOKEN_PROGRAM_ID),saTokenAccount:r.getAssociatedTokenAddressSync(i,f,!0,p,r.ASSOCIATED_TOKEN_PROGRAM_ID),agent:n,mainAccount:h,tokenMint:i,tokenProgram:p}).instruction()).then(function(e){return u.push(e),Promise.resolve(a.sendAndConfirmTransaction(u,a.signer.publicKey,[a.signer]))})}catch(e){return Promise.reject(e)}},t.createSubAccount=function(e,n,t,o,c,s,a,u,l,h,f){try{var p=this,d=[],y=m(Uint8Array.from(e)),g=f||r.TOKEN_PROGRAM_ID;return Promise.resolve(p.program.methods.createSubAccount(t,o,c,s,a).accounts({owner:p.signer.publicKey,agent:n,mainAccount:y}).instruction()).then(function(e){function t(e){return Promise.resolve(p.sendAndConfirmTransaction(d,p.signer.publicKey,[p.signer]))}d.push(e);var o=function(){if(u.gt(new i.BN(0))){if(!l)throw new Error("tokenMint must be specified if allowanceAmount is greater than 0");return Promise.resolve(p.program.methods.increaseSubAccountAllowance(u,0).accounts({owner:p.signer.publicKey,ownerTokenAccount:h||r.getAssociatedTokenAddressSync(l,p.signer.publicKey,!1,g,r.ASSOCIATED_TOKEN_PROGRAM_ID),agent:n,mainAccount:y,tokenMint:l,tokenProgram:g}).instruction()).then(function(e){d.push(e)})}}();return o&&o.then?o.then(t):t()})}catch(e){return Promise.reject(e)}},n}(h),p=/*#__PURE__*/function(e){function n(){return e.apply(this,arguments)||this}s(n,e),n.initialize=function(){try{return Promise.resolve(e.initialize.call(this))}catch(e){return Promise.reject(e)}};var t=n.prototype;return t.getMainAccountState=function(e){try{return Promise.resolve(this.program.account.mainAccount.fetch(m(Uint8Array.from(e)))).then(function(e){return[e.owner,e.globalWhitelistedPayees]})}catch(e){return Promise.reject(e)}},t.getSubAccountState=function(e){try{var n=m(Uint8Array.from(e));return Promise.resolve(this.program.account.subAccount.fetch(l(n,this.signer.publicKey))).then(function(e){return[e.whitelistedPayees,e.whitelistedTokens,e.paymentInterval,e.paymentCount,e.maxPerPayment,e.lastPaymentTimestamp]})}catch(e){return Promise.reject(e)}},t.paymentRequest=function(e,n,t,o,i,c){try{var s=this,a=[],u=m(Uint8Array.from(e)),h=l(u,s.signer.publicKey),f=c||r.TOKEN_PROGRAM_ID;return Promise.resolve(s.program.methods.paymentRequest(t).accounts({agent:s.signer.publicKey,payee:n,mainAccount:u,saTokenAccount:r.getAssociatedTokenAddressSync(o,h,!0,f,r.ASSOCIATED_TOKEN_PROGRAM_ID),payeeTokenAccount:i||r.getAssociatedTokenAddressSync(o,n,!1,f,r.ASSOCIATED_TOKEN_PROGRAM_ID),tokenMint:o,tokenProgram:f}).instruction()).then(function(e){return a.push(e),Promise.resolve(s.sendAndConfirmTransaction(a,s.signer.publicKey,[s.signer]))})}catch(e){return Promise.reject(e)}},n}(h);exports.MainAccountTxHandler=f,exports.SubAccountTxHandler=p;
