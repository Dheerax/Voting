# Secure Voting System with Face Authentication & Blockchain

A modern, secure voting platform that combines **Face Recognition** for identity verification and **Ethereum Blockchain** for immutable vote storage.

## 🚀 Features

- **Face Authentication**: Uses `face-api.js` to verify user identity during registration and before casting a vote.
- **Blockchain Security**: Votes are stored on a local Ethereum network (Hardhat) to ensure results are tamper-proof.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium user experience.
- **Hybrid Storage**: Voter profiles are stored in MongoDB, while actual votes and counts live on-chain.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Ethers.js
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **AI/ML**: Face-api.js (TensorFlow.js)

---

## 📋 Prerequisites

- **Node.js**: v18+ recommended
- **MongoDB**: A running instance (local or Atlas)
- **Git**

---

## 🏗️ Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd bc
   ```

2. **Setup Blockchain**:

   ```bash
   cd blockchain
   npm install
   ```

3. **Setup Server**:

   ```bash
   cd ../server
   npm install
   # Create a .env file (see .env section below)
   ```

4. **Setup Client**:
   ```bash
   cd ../client
   npm install
   ```

---

## 🚦 How to Run

Follow these steps in order (using separate terminal windows):

### 1. Start Local Blockchain

```bash
cd blockchain
npx hardhat node
```

### 2. Deploy Smart Contract

In another terminal:

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

_Note: This script will automatically update the contract address and ABI in the frontend._

### 3. Start Backend Server

```bash
cd server
node server.js
```

### 4. Start Frontend

```bash
cd client
npm run dev
```

---

## 🔐 Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 📂 Project Structure

- **/blockchain**: Solidity contracts, Hardhat configuration, and deployment scripts.
- **/server**: Express API for user registration and authentication.
- **/client**: React frontend with face authentication components and voting logic.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

## 📜 License

This project is licensed under the MIT License.
