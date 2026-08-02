# 🏛️ SkillForge System Architecture & Technical Deep-Dive

This document provides a comprehensive technical breakdown of **SkillForge**, detailing the software architecture, design patterns, security safeguards, database schema relationships, and performance engineering decisions.

---

## 1. High-Level Architectural Pattern

SkillForge implements the **Model-View-Controller (MVC)** architectural paradigm with clear separation of concerns across presentation, domain logic, and persistence.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Tier                           │
│  Browser DOM • EJS View Templates • CSS Tokens • Vanilla JS │
│         Web Speech API (STT/TTS) • Chart.js Engine          │
└──────────────────────────────▲──────────────────────────────┘
                               │  HTTP / HTTPS / REST
┌──────────────────────────────▼──────────────────────────────┐
│                    Middleware & Security                    │
│      Helmet CSP • Express Rate Limiter • Session Guard      │
│                Body Parsers • Static Router                 │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                      Controller Layer                       │
│    21 Domain Controllers (AI, Projects, Jobs, Analytics)    │
└──────────────────────▲──────────────────────▲───────────────┘
                       │                      │
       ┌───────────────▼───────────┐  ┌───────▼───────────────┐
       │   Persistence Tier (DB)   │  │   External AI Engine  │
       │   MongoDB Atlas / Mongoose│  │    OpenRouter LLM     │
       │    10 Relational Models   │  │ (gpt-4o-mini / claude)│
       └───────────────────────────┘  └───────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 The View Layer (Server-Side Rendered EJS)
- **Zero Heavyweight Client Frameworks**: Rendered server-side using **EJS (Embedded JavaScript)** for near-instant Time-To-First-Byte (TTFB) and First Contentful Paint (FCP).
- **Reusable Component Partials**: Modularized into `views/partials/`:
  - `app-sidebar.ejs`: Role-aware navigation with active-page indicators.
  - `app-topbar.ejs`: Real-time breadcrumbs, theme switcher, notification trigger.
  - `command-palette.ejs`: Raycast-style global search (`Ctrl + K`).
  - `head.ejs`: Local asset fallbacks, Google fonts, and stylesheet links.

### 2.2 The Business Logic & Controller Layer
- **Defensive Error Handling**: All asynchronous controller operations are wrapped in `try/catch` blocks with formatted error redirects or JSON responses.
- **Batch Query Execution**: Wherever multiple metrics are needed (such as in `dashboardController` and `analyticsController`), queries are executed concurrently using `Promise.all()`, cutting roundtrip latency by over 60%.

### 2.3 Persistence Layer (MongoDB + Mongoose)
- **Relational Integrity**: Models reference `User` ObjectIds with required constraints and automated `timestamps: true`.
- **Indexing**: Core query fields (e.g., `user`, `status`, `difficulty`) are structured for high index selectivity.

---

## 3. AI Copilot Integration Architecture

The AI subsystem integrates with **OpenRouter's Unified LLM API**, allowing dynamic model switching (GPT-4o-mini, Claude, Llama 3) through environment configuration:

1. **System Prompt Isolation**: Prompts in `utils/ai.js` enforce strict markdown or structured JSON output schemas.
2. **Context Window Optimization**: Only relevant user profile and repository fields are passed into prompt contexts.
3. **Resilient Parsing**: Custom regex extractors ensure malformed markdown backticks do not crash client parsers.

---

## 4. Security & Compliance Architecture

| Threat / Risk | Safeguard Implemented |
| :--- | :--- |
| **Cross-Site Scripting (XSS)** | Helmet CSP headers with script whitelisting; EJS auto-escaping (`<%= %>`). |
| **Brute Force Attacks** | `express-rate-limit` throttling login and registration attempts. |
| **Session Hijacking** | Signed cookies, `httpOnly: true`, `sameSite: 'lax'`, and dynamic `secure: true` in production. |
| **Credential Storage** | One-way password hashing using `bcryptjs` with salt work factor of 10. |
| **Unauthorized Access** | `ensureAuth` and `ensureAdmin` gatekeeper middleware on all protected routes. |

---

## 5. Scalability & Deployment Roadmap

1. **Database Tier**: Transition from single-region MongoDB Atlas to multi-region replica sets with read-preference routing.
2. **Caching Tier**: Implement **Redis** for session storage and caching GitHub API responses and static user profile pages.
3. **Containerization**: Deploy via **Docker** and orchestrate with Kubernetes or AWS ECS for horizontal auto-scaling.
