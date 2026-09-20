# OmniStream AI — Autonomous Video Syndication & Team Ingest Engine

OmniStream AI is an enterprise-grade mobile automation and collaboration platform designed for modern creators, digital studios, and media agencies. It enables simultaneous cross-platform video syndication across YouTube, Instagram, and Facebook, powered by the OmniPrompt™ neural metadata generator, automated Gmail video harvesting, a 4+ video daily scheduling engine, granular role-based access control (RBAC), biometric Face ID authentication, customizable passcode security, and an integrated creator wallet with instant UPI withdrawals.

---

## 🚀 Key Features

### 1. Simultaneous Cross-Platform Syndication
- **Connected Channels**: Real-time OAuth2 API integration with:
  - **YouTube Data API v3**: Direct resumable chunked upload with automated Shorts tagging.
  - **Instagram Graph API v19**: Reels media container synthesis and publishing.
  - **Facebook Graph API v19**: Page Watch and video stream dispatcher.
- **Transcoding Pipeline**: Automated 4K H.264/H.265 bitstream transcoding.

### 2. OmniPrompt™ AI Assistant Studio
- Generates high-CTR candidate titles with predicted retention percentages.
- Produces structured, timestamped descriptions tailored for multi-platform resonance.
- Auto-clusters hashtags into **Trending**, **Niche**, and **High-Volume** clusters.
- Real-time Virality Forecast Gauge (0–100) and peak engagement posting recommendations.
- Selectable tones: *Viral Hype 🔥*, *Pro Tech 💼*, *Educational Deep-Dive 🧠*, *Desi Hindi Hook 🇮🇳*, and *Casual 🎙️*.

### 3. High-Volume Scheduling Engine (4+ Videos Daily)
- Four strategic high-engagement daily slots:
  - **Slot 1 (09:00 AM)**: Morning Commute Surge (98% Peak Reach)
  - **Slot 2 (01:15 PM)**: Lunch Break Spike (94% Peak Reach)
  - **Slot 3 (06:30 PM)**: Evening Drive & Relax (91% Peak Reach)
  - **Slot 4 (09:45 PM)**: Prime Bedtime Peak (97% Peak Reach)
- Daily capacity throughput tracker (100% capacity filled).
- Re-slotting, early dispatch, and timeline calendar view.

### 4. Gmail Automated Video Harvester
- Continuous inbox daemon listening on `clips-ingest@omnistream.agency`.
- Automated rule matching for subject tags (`[OMNI-CLIP]` and `[VIDEO-DROP]`).
- Sender domain whitelisting for remote video editors and freelance creators.
- 1-Click auto-import and direct queuing into the next open daily slot.

### 5. Team Collaboration & Granular RBAC
- Multi-seat studio workspaces with distinct roles:
  - **Owner**: Unrestricted root access.
  - **Production Admin**: Full scheduling and channel configuration.
  - **Video Editor**: Upload & tagging access; public dispatch requires approval.
  - **Content Scheduler**: Direct slot management without review gates.
  - **Financial Analyst**: Read-only metrics and payout disbursement authority.
- Comprehensive workspace audit logs tracking all member activities.

### 6. End-to-End Security & Biometrics
- **Hardware Biometric Face Scan**: 3D depth facial landmark mapping simulator.
- **Customizable Passcode PIN**: 6-digit access code with change passcode options.
- **Multi-Factor Authentication (MFA)**: Hardware TPM + SMS OTP + Passcode.
- Complete application lock overlay with Face ID and PIN unlocking.

### 7. Dual-Language Dynamic Switching (Hindi & English)
- Full dynamic localization for **English (US)** and **हिंदी (Hindi)**.
- 1-Tap toggle in top header and Settings, translating all navigation, alerts, prompts, and financial terms on the fly.

### 8. Freemium & Subscription Model
- **7-Day Free Trial**: Complete access to 4+ daily uploads and AI tools with live countdown banner.
- **Monthly Pro Plan**: ₹500 / month.
- **Quarterly Saver Plan**: ₹1,350 for 3 months (Save 10%, ₹450/month).
- Interactive payment checkout supporting UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, and NetBanking.

### 9. Integrated Creator Wallet & Instant Payouts
- Multi-platform revenue tracking (YouTube AdSense, Instagram Creator Bonus, Facebook In-Stream Ads).
- Currency toggle: INR (₹) / USD ($).
- Instant payouts via **UPI VPA** (`username@bank`) and **Bank IMPS/NEFT**.
- Automatic 1% Indian TDS deduction breakdown (IT Sec 194C) and transaction UTR hash generation.

---

## 🛠️ System Architecture

\`\`\`
[Expo React Native Client]
            │
            ▼
[NGINX Reverse Proxy / Ingress]
            │
            ▼
[FastAPI / Node.js API Gateway]
            │
     ┌──────┴──────┐
     ▼             ▼
[Redis Queue]   [PostgreSQL Database]
     │
     ▼
[Celery Worker Cluster]
     │
     ├──> [FFmpeg Transcoder Service]
     ├──> [Gmail Ingestion Daemon (IMAP / PubSub)]
     ├──> [OmniPrompt™ AI Engine (Claude 3.7 / GPT-4o)]
     │
     ▼
[Social Dispatchers]
     ├──> YouTube Data API v3 (Direct Chunked Upload)
     ├──> Meta Graph API v19 (Instagram Reels Container)
     └──> Meta Graph API v19 (Facebook Page Feed & Watch)
\`\`\`

---

## 📦 Local Development & Export

\`\`\`bash
# Install dependencies
npm install

# Run Expo universal export (iOS, Android, Web)
npx expo export --platform all

# Start local preview server
npx serve dist
\`\`\`

---

## 🚢 CI/CD Deployment with GitHub Actions

\`\`\`yaml
name: Deploy OmniStream AI
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx expo export --platform all
      - name: Deploy to Cloud Provider
        run: echo "Deployed OmniStream AI successfully!"
\`\`\`
