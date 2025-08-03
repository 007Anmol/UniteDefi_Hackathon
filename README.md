# SwapBridge Pay

**Cross-chain token swap and payment dApp using 1inch + Stellar**

SwapBridge Pay is a simple, fast, and gas-optimized cross-chain relay that enables users to swap tokens via **1inch API** on Ethereum and send equivalent value to any **Stellar wallet**. Built for the [1inch Unite DeFi Hackathon](https://unite.1inch.dev), this app demonstrates a smooth experience for real-world use cases like **remittances, DeFi payouts, and off-ramping** — without writing a single smart contract.

---

## 🌉 What it does

- Connect your MetaMask wallet (Sepolia)
- Swap ETH → USDC using **1inch Fusion/Swap API**
- Send the swapped value to a **Stellar address** in XLM or USDC
- Track transaction status at every step
- All in one clean, dark-themed UI

---

## 🛠️ How it's made

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS (dark theme)
- **Wallet Integration**: MetaMask via `ethers.js`
- **Swap Engine**: 1inch API (`/swap` or `/fusion`)
- **Cross-chain Payment**: Stellar SDK on testnet
- **Backend**: Node.js + Express + Axios
- **Security**: No private keys exposed, uses `.env` for API keys
- **No smart contracts**, fully off-chain logic

---

## 🔧 Running Locally

### Prerequisites
- Node.js >= 18
- MetaMask (connected to Sepolia testnet)
- Stellar testnet account (use [Stellar Laboratory](https://laboratory.stellar.org))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/swapbridge-pay.git
cd swapbridge-pay

