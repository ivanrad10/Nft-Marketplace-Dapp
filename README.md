# NFT Marketplace Dapp

This is a decentralized NFT marketplace where users can mint, list, and purchase NFTs. The project is structured into three main parts: frontend, backend, and smart contracts.

## Project Structure

### Frontend

The frontend is built using React and TypeScript, providing the user interface for interacting with the NFT marketplace.

### Backend

The backend is built using NestJS and TypeScript, handling the server-side logic and database interactions.

### Smart Contracts

The smart contracts are written in Solidity and are used to manage the NFTs on the blockchain.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Foundry](https://book.getfoundry.sh/)
- [OpenZeppelin](https://www.openzeppelin.com/contracts)
- [MetaMask](https://metamask.io/) (for browser wallet)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ivanrad10/NFT-Marketplace-Dapp.git
cd NFT-Marketplace
```

2. **Compile and deploy smart contracts:**

```bash
cd Contracts
```

Run a local blockchain

```bash
anvil
```

Deploy contracts

```bash
forge create --rpc-url 127.0.0.1:8545 --private-key yourPrivateKey src/BasicNft.sol:BasicNft
forge create --rpc-url 127.0.0.1:8545 --private-key yourPrivateKey src/NftMarketplace.sol:NftMarketplace
```

3. **Run Backend:**

```
cd Backend
npm run start:dev
```

4. **Run Frontend:**

```
cd Frontend
npm start
```

5. **Run the MongoDb localhost**
