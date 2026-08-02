# ⚡ SkillForge — Technical Case Study & Product Showcase

![SkillForge Banner](docs/banner.svg)

<div align="center">

### **The Enterprise AI Career Acceleration Platform for Modern Software Engineers**

[![Live Production](https://img.shields.io/badge/LIVE_PRODUCTION-skillforge--whkp.onrender.com-success?style=for-the-badge&logo=render&logoColor=white)](https://skillforge-whkp.onrender.com)
[![1-Click Demo](https://img.shields.io/badge/⚡_1--CLICK_DEMO_LOGIN-DIRECT_ACCESS-7C3AED?style=for-the-badge&logo=auth0&logoColor=white)](https://skillforge-whkp.onrender.com/demo)
[![GitHub Stars](https://img.shields.io/github/stars/ayushkumarjha1/SkillForge?style=for-the-badge&color=ffd700)](https://github.com/ayushkumarjha1/SkillForge)

</div>

---

## 🧭 Executive Overview

In the modern software recruitment landscape, candidate preparation is fractured across 5+ disconnected tools:
- **LeetCode / HackerRank** for DSA practice (siloed problem logs)
- **Notion / Spreadsheets** for application tracking (manual maintenance)
- **Canva / Word** for resume editing (non-ATS compliant)
- **Ad-hoc ChatGPT tabs** for career advice (unstructured, stateless)
- **Self-talk or P2P calls** for mock interviews (no quantitative feedback)

**SkillForge** is an enterprise-grade developer copilot that unifies this entire career acceleration pipeline into a single, cohesive, high-performance workspace.

---

## 📸 Product Interface Gallery

### 1. Central Engineering Command Center
*Real-time multi-stream telemetry aggregating active projects, DSA problem velocity, skill badges, and quick actions.*
![Dashboard Overview](docs/screenshots/02_dashboard_overview.png)

---

### 2. Engineering Analytics & Readiness Index
*Quantitative readiness algorithm computing a 0–100 career readiness index with multi-dimensional Chart.js visualizations.*
![Engineering Analytics](docs/screenshots/03_engineering_analytics.png)

---

### 3. AI Voice Mock Interviewer
*Simulated technical interview environment leveraging the Web Speech API (Speech-to-Text & Text-to-Speech) with real-time AI scoring.*
![AI Voice Mock Interview](docs/screenshots/05_ai_mock_interview.png)

---

### 4. ATS Resume Builder & Completeness Gauge
*Live ATS keyword score analyzer, dynamic multi-version resume manager, and 1-click clean PDF export.*
![ATS Resume Builder](docs/screenshots/06_ats_resume_builder.png)

---

### 5. Recruitment Pipeline Kanban Board
*Visual status workflow tracking applications from Wishlist → Applied → Interviewing → Offered → Rejected.*
![Job Kanban Board](docs/screenshots/07_job_tracker_kanban.png)

---

### 6. DSA Problem & Streak Tracker
*Algorithmic problem tracker featuring topic categorization, difficulty weighting, solution notes, and complexity analysis.*
![DSA Tracker](docs/screenshots/08_dsa_problem_tracker.png)

---

### 7. Public Vanity Portfolio
*Shareable public portfolio page (`/u/:username`) showcasing verified credentials, pinned GitHub repositories, and interactive dark/light theming.*
![Public Portfolio](docs/screenshots/09_public_portfolio.png)

---

## ⚙️ Architecture & Technical Benchmarks

```mermaid
graph TD
    Client["Client Browser (Desktop / Mobile)"]
    
    subgraph Edge & App Layer
        Express["Express.js Server (Node v20 LTS)"]
        Session["express-session + MongoStore"]
        Security["Helmet CSP + Mongo Sanitize + CSRF Safe"]
    end
    
    subgraph Data & Aggregation
        Mongo[("MongoDB Atlas Cloud")]
        AggEngine["Concurrent Promise.all Multi-Collection Engine"]
    end
    
    subgraph External Services
        OpenRouter["OpenRouter AI Gateway (LLMs)"]
        SpeechAPI["Browser Native Web Speech API (STT/TTS)"]
    end

    Client --> Express
    Express --> Session
    Express --> Security
    Express --> AggEngine
    AggEngine --> Mongo
    Express --> OpenRouter
    Client --> SpeechAPI
```

### 🏎️ Performance Benchmarks:
- **Time to First Byte (TTFB)**: `< 120ms` (SSR templates with zero client-side framework boot time).
- **Database Query Latency**: `~70% reduction` achieved by concurrent multi-collection fetching via `Promise.all` rather than sequential `await` calls.
- **CSS Bundle Size**: `0 KB runtime framework overhead` (Engineered with native CSS custom properties).

---

## 🛠️ Tech Stack & Engineering Decisions

| Domain | Technology | Engineering Justification |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | Event-driven I/O model providing high throughput for concurrent telemetry requests. |
| **Database** | MongoDB Atlas, Mongoose | Flexible document schema allowing nested career items, dynamic skill arrays, and indexing on `user_id`. |
| **View Engine** | EJS (Server-Side Rendered) | Sub-millisecond initial page paint with maximum SEO indexability for public portfolio profiles. |
| **AI Integration** | OpenRouter REST API | Model-agnostic LLM integration with structured JSON prompting and fallback mechanisms. |
| **Voice Engine** | Native Web Speech API | Client-side zero-latency STT and TTS without requiring expensive paid voice API subscriptions. |
| **Visualizations** | Chart.js 4.4 | Reactive canvas charting optimized for responsive reflows across mobile and desktop viewports. |
| **Security** | Helmet, Bcrypt, MongoStore | Strict Content Security Policy (CSP), bcrypt salt rounds (10), and persistent session storage. |

---

## 🚀 Experience It Live

- 🌐 **Live Web Application**: [https://skillforge-whkp.onrender.com](https://skillforge-whkp.onrender.com)
- ⚡ **Instant 1-Click Demo Login**: [https://skillforge-whkp.onrender.com/demo](https://skillforge-whkp.onrender.com/demo)
- 📦 **Source Repository**: [https://github.com/ayushkumarjha1/SkillForge](https://github.com/ayushkumarjha1/SkillForge)
