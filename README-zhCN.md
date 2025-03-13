# AISA Solana SDK

AISA Solana SDK是一个TypeScript库，用于与AISA（Automated Intelligent Spending Accounts）Solana智能合约进行交互。该SDK提供了一组API，允许应用程序创建和管理主账户和子账户，设置支付规则，处理授权支付等功能。

[English Documentation](./README.md)

## 特性

- 主账户和子账户的创建和管理
- 支付收款人白名单管理
- 令牌白名单管理
- 配置付款频率、金额和间隔
- 增加和减少子账户授权额度
- 支持SPL代币支付请求处理

## 安装

```bash
npm install aisa-solana-sdk
# 或
yarn add aisa-solana-sdk
```

## 环境配置

创建一个`.env`文件，参考`.env.sample`配置以下变量：

```
RPC_URL=<你的Solana RPC URL>
CONTRACT_ADDRESS=<AISA合约地址>
PRIVATE_KEY=<你的钱包私钥>
```

## 使用方法

### 初始化

```typescript
import { MainAccountTxHandler, SubAccountTxHandler } from "aisa-solana-sdk";

// 初始化主账户处理器（账户所有者使用）
const mainAccountHandler = await MainAccountTxHandler.initialize();

// 初始化子账户处理器（代理/用户使用）
const subAccountHandler = await SubAccountTxHandler.initialize();
```

### 主账户操作示例

```typescript
// 创建主账户
const uuid = [1, 2, 3, 4]; // 唯一标识符
const globalPayeeWhitelist = ["收款人公钥1", "收款人公钥2"]; // 全局允许的收款人列表
const txId = await mainAccountHandler.createMainAccount(uuid, globalPayeeWhitelist);

// 查询主账户状态
const [owner, whitelist] = await mainAccountHandler.getMainAccountState(uuid);

// 更新主账户规则
await mainAccountHandler.updateMainAccountRules(uuid, ["新收款人公钥1", "新收款人公钥2"]);
```

### 子账户操作示例

```typescript
// 创建子账户
import * as anchor from "@coral-xyz/anchor";
const uuid = [1, 2, 3, 4]; // 主账户的唯一标识符
const agent = "代理公钥"; // 子账户的代理人
const payeeWhitelist = ["收款人公钥1"]; // 子账户允许的收款人
const tokenWhitelist = ["代币公钥1", "代币公钥2"]; // 子账户允许的代币
const maxPerPayment = new anchor.BN(1000000); // 每次支付的最大金额
const paymentCount = 10; // 支付次数
const paymentInterval = new anchor.BN(86400); // 支付间隔（秒）
const allowanceAmount = new anchor.BN(10000000); // 初始授权金额

await mainAccountHandler.createSubAccount(
  uuid,
  agent,
  payeeWhitelist,
  tokenWhitelist,
  maxPerPayment,
  paymentCount,
  paymentInterval,
  allowanceAmount,
  "代币公钥" // 可选参数
);

// 增加子账户授权额度
await mainAccountHandler.increaseAllowance(
  uuid,
  agent,
  new anchor.BN(5000000), // 增加金额
  5, // 支付次数
  "代币公钥"
);

// 减少子账户授权额度
await mainAccountHandler.decreaseAllowance(
  uuid,
  agent,
  new anchor.BN(2000000), // 减少金额
  2, // 支付次数
  "代币公钥"
);
```

### 子账户支付请求（由代理/用户发起）

```typescript
// 发起支付请求
const uuid = [1, 2, 3, 4]; // 主账户的唯一标识符
const payee = "收款人公钥"; // 收款人公钥
const amount = new anchor.BN(500000); // 支付金额
const tokenMint = "代币公钥"; // 代币公钥

const txId = await subAccountHandler.paymentRequest(
  uuid,
  payee,
  amount,
  tokenMint
);
```

## 主要组件

### MainAccountTxHandler

主账户交易处理器，由账户所有者使用，提供以下功能：

- 创建和管理主账户
- 创建和管理子账户
- 设置全局收款人白名单
- 设置子账户的支付规则和限制
- 管理子账户的授权额度

### SubAccountTxHandler

子账户交易处理器，由子账户代理/用户使用，提供以下功能：

- 查询账户状态
- 发起符合规则的支付请求

## 许可证

ISC 