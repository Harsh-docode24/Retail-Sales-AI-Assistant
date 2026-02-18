# 🛒 Retail Sales AI Assistant

> **LLM-powered sales agent** with OpenAI tool-calling, integrated with simulated distributor & retailer REST APIs for order tracking, inventory management, and sales insights.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?logo=fastapi&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **AI Sales Agent** | Interactive CLI agent powered by OpenAI GPT-4o-mini with structured tool-calling |
| **Distributor API** | Simulated REST API for distributor info, inventory/stock levels, and orders |
| **Retailer API** | Simulated REST API for retailer management, order placement with credit validation, and sales analytics |
| **Multi-Step Reasoning** | Analyze → Plan → Execute → Synthesize pipeline with transparent logging |
| **8 Integrated Tools** | `get_distributors`, `get_distributor_inventory`, `get_retailers`, `get_retailer_details`, `get_order_status`, `place_order`, `get_sales_insights`, and more |
| **Sales Analytics** | Aggregated metrics: top products, revenue by region, revenue by retailer |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User (CLI)                       │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Sales Agent   │  ← OpenAI GPT-4o-mini
              │  (tool-calling) │     with function calling
              └───┬────────┬────┘
                  │        │
     ┌────────────▼─┐  ┌───▼────────────┐
     │ Distributor  │  │   Retailer     │
     │   API :8001  │  │   API :8002    │
     │  (FastAPI)   │  │  (FastAPI)     │
     └──────┬───────┘  └───┬────────────┘
            │              │
     ┌──────▼──────────────▼──────┐
     │     Mock Data Layer        │
     │  (Products, Distributors,  │
     │   Retailers, Orders)       │
     └────────────────────────────┘
```

### Multi-Step Reasoning Workflow

```
1. ANALYZE  →  Understand user intent, extract entities
2. PLAN     →  Select tools needed, determine call order
3. EXECUTE  →  Call tools via REST APIs, chain results
4. SYNTHESIZE → Combine data into actionable response
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/Harsh-docode24/Retail-Sales-AI-Assistant.git
cd Retail-Sales-AI-Assistant

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Run

```bash
python main.py
```

This will:
1. Start the **Distributor API** on `http://127.0.0.1:8001`
2. Start the **Retailer API** on `http://127.0.0.1:8002`
3. Launch the **interactive CLI** sales agent

---

## 💬 Usage Examples

```
You ▸ Show me all distributors
You ▸ What's the inventory status for distributor D001?
You ▸ Check the credit status for FreshMart SuperStore (R001)
You ▸ What are the current sales insights and top products?
You ▸ Place an order of 100 units of Premium Basmati Rice for retailer R001 from distributor D001
You ▸ Show me order history for retailer R003
```

### CLI Commands

| Command | Action |
|---------|--------|
| `quit` / `exit` | End the session |
| `reset` | Clear conversation history |
| `trace` | Show reasoning trace for last query |

---

## 📁 Project Structure

```
Retail sales/
├── main.py                 # Entry point — starts APIs + agent CLI
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
├── .gitignore
├── README.md
├── api/
│   ├── __init__.py
│   ├── mock_data.py        # Simulated datasets (products, distributors, retailers, orders)
│   ├── distributor_api.py  # FastAPI — distributor endpoints
│   └── retailer_api.py     # FastAPI — retailer endpoints + sales insights
├── agent/
│   ├── __init__.py
│   ├── sales_agent.py      # Core AI agent with OpenAI tool-calling loop
│   ├── tools.py            # Tool definitions + REST API dispatcher
│   └── reasoning.py        # Multi-step reasoning orchestrator
└── utils/
    ├── __init__.py
    └── helpers.py           # Rich console utilities for display + logging
```

---

## 🔧 API Endpoints

### Distributor API (`:8001`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/distributors` | List all distributors |
| GET | `/distributors/{id}` | Distributor details |
| GET | `/distributors/{id}/inventory` | Stock levels |
| GET | `/distributors/{id}/orders` | Orders for distributor |

### Retailer API (`:8002`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/retailers` | List all retailers |
| GET | `/retailers/{id}` | Retailer details + credit status |
| GET | `/retailers/{id}/orders` | Order history |
| POST | `/retailers/{id}/orders` | Place new order |
| GET | `/sales/insights` | Aggregated sales analytics |

---

## 🧠 Technology Stack

- **Python 3.11+** — Core language
- **OpenAI API** — GPT-4o-mini with structured function/tool calling
- **FastAPI** — Simulated REST API servers
- **Uvicorn** — ASGI server
- **httpx** — HTTP client for tool → API communication
- **Rich** — Beautiful terminal UI and logging
- **python-dotenv** — Environment configuration

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
