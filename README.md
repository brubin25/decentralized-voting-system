# Decentralized-Voting-System-Using-Ethereum-Blockchain

A secure, transparent, and tamper-proof online voting platform powered by Ethereum smart contracts.

Built by:  
Briand Lancelot Rubin (1267280), Di Pan (1254890), Sheng Tan (1252550), Hanyan Yao (1257998), Shenping Xiong (1267894), Zhijie Shen (1263245)  
COMP-5413-AB: Blockchain Technology  
Supervised by: Dr. Muhammad Mazhar Ullah Rathore

## About the Project

This project leverages Ethereum blockchain and smart contracts to build a decentralized voting system that ensures:
- Secure and transparent elections
- Tamper-proof and immutable voting records
- Voter privacy and authentication
- Elimination of centralized control

The system uses:
- React.js for the front end
- FastAPI and MySQL for voter authentication
- Solidity + Truffle for smart contract logic
- MetaMask + Ganache CLI for blockchain interaction

## Demo

- Project Demo PPT: [View Slide Deck](./Group23_DecentralizedVotingSystem_PPT.pptx)
- Final Report: [Project README PDF](./Group23_DecentralizedVotingSystem_README.pdf)

## Features

- JWT Authentication for secure user login
- Admin Panel to manage elections, dates, and candidates
- Immutable Smart Contract Voting
- Voting Period Controls using timestamps
- Double Voting Prevention
- MetaMask Integration for wallet-based voting
- Live Candidate Data directly from blockchain

## Technology Stack

| Layer             | Tools/Frameworks                            |
|------------------|---------------------------------------------|
| Frontend         | React.js, Bootstrap                         |
| Backend          | Node.js, FastAPI, Express.js                |
| Blockchain       | Solidity, Truffle, Ganache CLI              |
| Wallet/Provider  | MetaMask, Web3.js                           |
| Database         | MySQL                                       |
| Others           | JWT, dotenv, Browserify, NVM                |

## Project Structure

```
Decentralized-Voting-System
├── client/              # React.js Frontend UI
│   ├── src/
│   ├── public/
│   └── ...
├── Database_API/        # FastAPI-based voter API
│   ├── main.py
│   └── .env
├── server/              # Node.js backend with MySQL connection
│   └── index.js
├── smart-contract/      # Truffle smart contract setup
│   ├── Voting.sol
│   ├── migrations/
│   ├── truffle-config.js
│   └── build/
└── README.md
```

## Requirements

| Component         | Version                |
|------------------|------------------------|
| Node.js           | v18.14.0 (via NVM)     |
| Truffle           | v5.11.5                |
| Solidity          | 0.8.20                 |
| Ganache CLI       | v7.9.1                 |
| MetaMask          | Latest Extension       |
| Python            | v3.9                   |
| MySQL             | Port 3306 Available    |

## Installation Guide

### Node, NVM & Truffle

```
nvm install 18.14.0
nvm use 18.14.0
npm install -g truffle
```

### Ganache CLI

```
npm install -g ganache
ganache --server.port 7545 --chain.chainId 5777
```

### MetaMask Setup

- Add a custom network:
  - Network name: Localhost 7545  
  - RPC URL: http://127.0.0.1:7545  
  - Chain ID: 5777
- Import a private key from Ganache into MetaMask

### Python + FastAPI Dependencies

```
pip install fastapi mysql-connector-python pydantic python-dotenv uvicorn[standard] PyJWT
```

## Usage Instructions

### 1. Smart Contracts

```
cd smart-contract/
truffle compile --all
truffle migrate --reset --network development
```

Copy the deployed address into `client/src/hooks/useVotingContract.jsx`  
Copy `build/contracts/Voting.json` to `client/src/contracts/`

### 2. Backend Server

Update MySQL credentials in `server/index.js`
```
cd server/
npm install
node index.js
```

### 3. Database Setup

In MySQL:

```
CREATE DATABASE voter_db;

USE voter_db;

CREATE TABLE voters (
  voter_id VARCHAR(36) PRIMARY KEY NOT NULL,
  role ENUM('admin', 'user') NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

Add test users with hashed passwords.

### 4. FastAPI Auth Server

```
cd Database_API
uvicorn main:app --reload --host 127.0.0.1
```

### 5. Frontend App

```
cd client
npm install
npm run dev
```

## Smart Contract Overview

### Election Creation
- Validates title, candidate count, date
- Assigns admin using msg.sender
- Stores candidate metadata
- Emits ElectionCreated event for traceability

### Voting Function
- Checks timestamp bounds (startTs <= now <= endTs)
- Rejects duplicate voters using hasVoted
- Validates candidate ID and increments vote count
- Emits Voted event on success

## Evaluation Criteria

- Fully working frontend and backend demo
- Secure wallet login via MetaMask
- Immutable and auditable smart contracts
- Admin CRUD operations (election, candidates)
- Real-time UI updates with blockchain values

## Future Improvements

- DAO-style community governance
- Blockchain-based vote result auditing
- Encrypted, decentralized voter registry
- Mobile wallet support

## License

Licensed under the MIT License.
