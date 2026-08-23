# Epoch Nexus Academy (ENA) — History, Civics & Codecraft Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688.svg)](https://fastapi.tiangolo.com/)
[![Web3 ERC-5192](https://img.shields.io/badge/Web3-Soulbound%20ERC--5192-purple.svg)](https://eips.ethereum.org/EIPS/eip-5192)
[![Compliance](https://img.shields.io/badge/Compliance-SOC2%20Type%20II%20%7C%20FERPA-emerald.svg)](#)

> **Epoch Nexus Academy (ENA)** is an educational statecraft platform synthesizing **World History**, **Political Science & Civics**, and **STEM Computer Science**. Students navigate historical inflection points through interactive branching narratives, real-time procedural simulations, and safe in-browser Python coding sandboxes. Completed mastery milestones issue verifiable Soulbound digital credentials on EVM-compatible L2 networks.

---

## 🏛️ Interactive Media & Visual Guides

- 🎬 **[Interactive Simulation Video Tutorial](simulation_tutorial_video.html)**: 7-Chapter automated video walkthrough with Web Speech audio narration and live code execution.
- 🖼️ **[Visual Architecture & Blueprint Gallery](system_architecture_gallery.html)**: High-resolution system topology, data flow diagrams, and Tri-Pillar state machine schematics.
- 📖 **[Official Field Manual (MANUAL.md)](MANUAL.md)**: Deep architectural specification, educator rubrics, and security standards.
- 📊 **[Executive Investor Overview](investor_overview.md)**: Market analysis, unit economics, and GTM strategy.

---

## ⚡ Core System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. PRESENTATION LAYER (Client PWA & WebGL)                                               │
│ React 18 • Monaco Code Editor • 4+ Simulation Viewports (Agora, Maritime, Factory, UN)    │
│ Teacher Orchestration Portal • Real-Time Multiplayer Lobby • Infinite AI Studio         │
└────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                         │  (Code Submissions & Real-Time State)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. DUAL SAFE CODE EXECUTION SANDBOX ENGINE                                               │
│ ├─ Tier 1: In-Browser Pyodide WebAssembly (96%+ instant execution offload, 0ms queue)   │
│ ├─ Tier 2: AST Static Security Guard (Blocks __subclasses__, imports, and DoS loops)     │
│ ├─ Tier 3: Async Worker Queue (5,000+ concurrency rate limiting & telemetry)            │
│ └─ AI Scenario Synthesizer Engine (Natural Language Prompts -> Runnable Tracks & Tests)   │
└────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                         │  (Execution Verification Hashes & Telemetry)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. ENTERPRISE DATA TRUST, COMPLIANCE & WEB3 PROTOCOL                                     │
│ ├─ SOC2 Type II Audit Ledger: SHA-256 tamper-evident cryptographic hash chain            │
│ ├─ FERPA Privacy Vault: AES-256-GCM encryption, salted pseudonyms & instant erasure API  │
│ ├─ Institutional Standards Engine: AP Euro, AP Gov, AP CSP, and Canvas/Google LMS export │
│ └─ EVM Layer 2 Blockchain: ERC-5192 Non-Transferable Soulbound Digital Mastery Badges    │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧭 Tri-Pillar Curriculum Framework

| Module Series | Historical & Civics Focus | Technical & Coding Mastery | Practical Interactive Scenario |
|---|---|---|---|
| **Track 1: Classical Antiquity & Logic** | Athenian Direct Democracy vs. Roman Senate structures. | Boolean logic, conditional branching (`if/else`), state registers. | Program an automated vote-counting and civic debate tally system under historical legal constraints (6,000 quorum, Tribunician Veto). |
| **Track 2: The Age of Discovery & Cryptography** | Renaissance trade routes, diplomatic alliances, and espionage. | String manipulation, modulo arithmetic, Caesar & Vigenère ciphers. | Decrypt intercepted diplomatic cables to balance resources and maintain trade treaties across Mediterranean ports. |
| **Track 3: Industrial & Digital Revolutions** | Victorian labor movements, Factory Acts, public health smog scrubbers. | Object-Oriented Programming (`IndustrialEconomySim`), discrete-time simulation loops. | Simulate factory labor equilibria, mitigate strike probabilities, install smog scrubbers, and compute Ada Lovelace's 1843 Bernoulli sequence. |
| **Track 4: Modern Governance & Decentralized Systems** | Multilateral treaties, institutional checks and balances, Web3 civics. | Quadratic Voting ($\text{Cost} = V^2$), budget constraint guards, smart contracts. | Build a decentralized voting protocol implementing Quadratic Voting to simulate multilateral UN treaty ratifications. |
| **Track 5+: Infinite Track Studio & AI Synthesizer** | User-created & AI-generated eras (Ancient Egypt, Feudal Japan, Space Race). | Universal procedural node graph state visualizer & dynamic assertion testing. | Type any historical prompt to synthesize runnable code challenges, tests, and procedural state simulations in 1 click. |

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **Docker** (optional for containerized deployment)

### 1. Clone & Setup Repository
```bash
git clone https://github.com/YOUR_USERNAME/epoch-nexus-academy.git
cd epoch-nexus-academy
```

### 2. Start Backend Microservices
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 3. Start Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173`

### 4. Run Automated Test Suites
```bash
python backend/tests/test_evaluator.py
python backend/tests/test_scalability_and_privacy.py
python backend/tests/test_educator_and_track3.py
python backend/tests/test_multiplayer_and_assessment.py
python backend/tests/test_infinite_studio.py
```

---

## 🛠️ Tech Stack & Microservices

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, Lucide Icons, Monaco Editor (`@monaco-editor/react`), Pyodide WebAssembly.
- **Backend API**: FastAPI, Uvicorn, Pydantic v2, WebSockets, Python Cryptography (`cryptography`).
- **Security & Privacy**: Abstract Syntax Tree (`ast`) static analysis, AES-256-GCM encryption, salted pseudonymization, SHA-256 hash-chained audit logging.
- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin ERC-5192 Soulbound standard, Foundry / Hardhat.
- **Deployment**: Docker Compose, Nginx, Redis, PostgreSQL.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
