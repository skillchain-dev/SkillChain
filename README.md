# SkillChain

SkillChain is a decentralized skill verification and talent management platform. It features a modern React client, an Express/MongoDB REST API, AI-assisted resume parsing, job matching, an interactive career chatbot, and EVM-backed credential verification on the local Hardhat blockchain.

## System Architecture

- **`client`**: React 18, Vite, Tailwind CSS, Lucide-style UI components, role-based dashboards (`student`, `recruiter`, `admin`), floating Gemini career assistant, and public credential verification with QR code rendering.
- **`server`**: Node.js & Express API, JWT authentication with token revocation, MongoDB/Mongoose schemas, Nodemailer password resets, ethers.js blockchain bridge.
- **`ai-service`**: Google Gemini API integration (`@google/genai`), resume skill extraction, intelligent job-candidate matching with gap analysis, and interactive multi-turn career chatbot.
- **`blockchain`**: Ethereum/EVM smart contract (`SkillChainCredential.sol`), Hardhat local network, deployment, issue, and public cryptographic verification scripts.
- **`docker`**: Multi-stage Docker builds (`client.Dockerfile`, `server.Dockerfile`), Nginx reverse proxy configuration, and complete `docker-compose.yml` service orchestration.

## Default Seed Accounts

Run `npm run seed` in `server` to populate the development database with demo data:

| Role | Email | Password |
|---|---|---|
| **Student** | `nikhil.student@skillchain.edu` | `Password@123` |
| **Student** | `om.student@skillchain.edu` | `Password@123` |
| **Recruiter** | `recruiter@skillchain.edu` | `Password@123` |
| **Faculty Admin** | `admin@skillchain.edu` | `Password@123` |

## Local Development

Requirements: Node.js 22+, MongoDB 7+, and an optional Gemini API key.

1. **Start MongoDB and seed initial data**:

   ```powershell
   # In server/
   cd server
   npm ci
   Copy-Item .env.example .env
   npm run seed
   npm start
   ```

2. **Start the React frontend**:

   ```powershell
   # In client/
   cd client
   npm ci
   Copy-Item .env.example .env
   npm run dev
   ```

   The client runs on `http://localhost:5173` and connects to `http://localhost:5000/api` by default.

## Local Blockchain (Optional)

In the `blockchain` directory:

```powershell
npm install
npm test
npm run node
```

In a separate terminal, deploy the contract to your local node:

```powershell
$env:DEPLOYER_PRIVATE_KEY="<private-key-from-hardhat-node>"
npm run deploy:local
```

Configure `BLOCKCHAIN_RPC_URL`, `BLOCKCHAIN_PRIVATE_KEY`, and `BLOCKCHAIN_CONTRACT_ADDRESS` in `server/.env` to enable on-chain credential issuance.

## Password Reset

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `CLIENT_BASE_URL` in `server/.env`. In local development mode without SMTP, password reset URLs are logged directly to the server terminal.

## Docker Deployment

To launch the full stack (Client + Server + MongoDB) with Docker:

```powershell
$env:AUTH_TOKEN_SECRET="generate_a_secure_32_char_random_secret_here"
docker compose -f docker/docker-compose.yml up --build
```

- Client (SPA + Nginx API proxy): `http://localhost:8080`
- API Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

## Test and Verification Suites

Run test and build checks across all subprojects:

- `server`: `npm test`
- `ai-service`: `npm test`
- `blockchain`: `npm test`
- `client`: `npm run build`

GitHub Actions runs continuous integration workflows across all packages on pushes and pull requests.
