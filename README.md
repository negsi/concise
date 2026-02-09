# Concise - An AI News Summarizer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Concise allows users to subscribe to RSS feeds from various news portals and summarizes the articles concisely using AI.

## 🚀 Requirements

- Python 3.10 or newer
- pip (Python Package Installer)
- Optional: a virtual environment (recommended)

## 📦 Installation

### 1. Clone or download repository

```bash
git clone https://github.com/negsi/concise.git
cd concise
```

### 2. Create a virtual environment (optional, but recommended)

```bash
python3 -m venv venv
source venv/bin/activate   # macOS / Linux
venv\Scripts\activate      # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## ▶️ Running the application

```bash
flask --app app run --debug # Use this...
python app.py # ...or this
```

You can now access the application at:

```bash
http://127.0.0.1:5000
```