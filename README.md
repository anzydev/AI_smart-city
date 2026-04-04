<div align="center">

# 🏙️ Smart City AI Citizen Dashboard

### *Live Data • Context-Grounded AI • Hand-Drawn Design*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HuggingFace](https://img.shields.io/badge/🤗_Hugging_Face-FFD21E?style=for-the-badge)](https://huggingface.co/)
[![Mistral AI](https://img.shields.io/badge/Mistral_7B-5A67D8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiBmaWxsPSIjNUE2N0Q4Ii8+PHRleHQgeD0iNSIgeT0iMTciIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5NPC90ZXh0Pjwvc3ZnPg==&logoColor=white)](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)

<br/>

> **A context-grounded AI dashboard** that fetches live data from real-time APIs and powers an intelligent chatbot that answers **only** based on the dashboard's current data — no hallucinations, no general knowledge.

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌤️ **Live Weather** | Real-time temperature, wind speed & conditions for Pune (via WeatherAPI.com) |
| 💱 **Currency Rates** | Live USD → INR, EUR, GBP exchange rates (via ExchangeRate API) |
| 👤 **Citizen Profile** | Random citizen with name, city & email (via JSONPlaceholder + pravatar) |
| 💡 **City Fact** | Fun fact of the day displayed as a post-it note (via Useless Facts API) |
| 🤖 **AI Chatbot** | Context-grounded assistant using Mistral-7B — answers **only** from dashboard data |
| 🔐 **Secure Token** | HF token is XOR-encrypted + base64-encoded, never exposed in source |
| ✏️ **Hand-Drawn UI** | Unique wobbly borders, paper textures, Kalam & Patrick Hand fonts |

---

## 🧠 How the AI Works

This is **not** a generic chatbot. It's a **context-grounded system**:

```
┌─────────────────────────────────────────────┐
│              LIVE DATA SOURCES              │
│  Weather API → Currency API → Citizen API   │
│              → Facts API                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          GLOBAL STATE VARIABLES             │
│  weatherData · rates · citizen · factData   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         CONTEXT PROMPT (liveContext)         │
│  System prompt built from live variables    │
│  "Answer ONLY based on this data..."        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         MISTRAL-7B (via HuggingFace)        │
│  Receives: [system: liveContext,            │
│             user: question]                 │
│  Returns: grounded answer                   │
└─────────────────────────────────────────────┘
```

> 💡 The chatbot **refuses** to answer questions outside the dashboard data — it politely says it only knows about the current dashboard information.

---

## 🚀 Quick Start

### Prerequisites

- A modern web browser
- [Node.js](https://nodejs.org/) (for token generation only)
- A [Hugging Face](https://huggingface.co/) account with an API token

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/anzydev/AI_smart-city.git
cd AI_smart-city

# 2. Create your .env file with your HuggingFace token
echo "HF_TOKEN=hf_your_token_here" > .env

# 3. Generate the encrypted config
node generate-config.js

# 4. Start a local server (needed for API calls)
python3 -m http.server 8080

# 5. Open in browser
open http://localhost:8080
```

---

## 📁 Project Structure

```
AI_smart-city/
├── index.html           # Dashboard layout & chatbot UI
├── style.css            # Hand-drawn design system (CSS)
├── script.js            # API fetching, global state, chatbot logic
├── generate-config.js   # Reads .env → writes encrypted config.js
├── .gitignore           # Protects .env, config.js, sensitive files
│
├── .env                 # 🔒 YOUR HF token (git-ignored)
├── config.js            # 🔒 Auto-generated encrypted token (git-ignored)
├── prompt.txt           # 🔒 Design system reference (git-ignored)
└── pre-data.txt         # 🔒 API reference snippets (git-ignored)
```

---

## 🔐 Token Security

The HuggingFace API token is **never** hardcoded or exposed:

| Layer | Protection |
|-------|------------|
| `.env` | Raw token stored locally, **git-ignored** |
| `generate-config.js` | XOR cipher + Base64 encoding |
| `config.js` | Contains **only** the encrypted blob — auto-generated, **git-ignored** |
| `script.js` | Uses `HF_TOKEN` variable from `config.js` at runtime |
| Frontend | Token is **never** displayed in the UI |

```
Raw Token → XOR with key → Base64 encode → config.js (encrypted blob)
                                              ↓
                              Browser decodes at runtime → API calls
```

---

## 🌐 APIs Used

| API | Endpoint | Data |
|-----|----------|------|
| **WeatherAPI.com** | `api.weatherapi.com/v1/current.json` | Temperature, wind, condition + icon |
| **ExchangeRate** | `open.er-api.com/v6/latest/USD` | INR, EUR, GBP rates |
| **JSONPlaceholder** | `jsonplaceholder.typicode.com/users` | Name, email, city (+ pravatar image) |
| **Useless Facts** | `uselessfacts.jsph.pl/api/v2/facts/random` | Random fun fact |
| **HuggingFace** | `router.huggingface.co/v1/chat/completions` | Mistral-7B chat |

---

## 🎨 Design System

The UI follows a **Hand-Drawn / Sketchbook** aesthetic:

- **Fonts**: `Kalam` (headings) + `Patrick Hand` (body)
- **Borders**: Wobbly, irregular `border-radius` — no straight lines
- **Shadows**: Hard offset (`4px 4px 0px`) — no blur
- **Background**: Paper dot-grid texture via `radial-gradient`
- **Colors**: Warm paper `#fdfbf7`, pencil black `#2d2d2d`, correction red `#ff4d4d`, post-it yellow `#fff9c4`
- **Decorations**: Tape strips, thumbtack pins, dashed borders

---

## 📝 Notes

- If the **Citizen Profile** card doesn't load data, hit **Refresh** 3–4 times — the RandomUser API can be slow sometimes.
- The chatbot needs a valid HuggingFace token to function. Free-tier tokens work.
- The page must be served via `localhost` (not `file://`) for API calls to work due to CORS.

---

<div align="center">

### Built by **Khushagra** ✏️

</div>
