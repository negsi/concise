"""
MIT License
Copyright (c) 2026 Christian Siewert

Concise – An AI News Summarizer

|======================================================|
| FOR TESTING PURPOSES WE ONLY SUPPORT OPENAI LLMs ATM |
|      AND FOR NOW YOU >>>MUST<<< PROVIDE A VALID      |
|   OPENAI_API_KEY IN YOUR .env FILE TO RUN THE APP.   |
|======================================================|
"""

# --- Standard library imports ---
import os

# --- Third‑party imports ---
import requests
from openai import OpenAI
from bs4 import BeautifulSoup
from dotenv import load_dotenv 
from flask import Flask, request, jsonify, render_template

# --- Load environment variables ---
load_dotenv()

# --- Validate required variables ---
if not os.getenv("OPENAI_API_KEY"):
    raise RuntimeError("OPENAI_API_KEY is not set. Please configure your .env file.")

# --- Initialize clients ---
client = OpenAI()

# --- Initialize Flask ---
app = Flask(__name__)

# --- Load system prompt ---
def load_system_prompt():
    with open("prompts/system_prompt.txt", "r", encoding="utf-8") as f:
        return f.read().strip()

SYSTEM_PROMPT = load_system_prompt()
OPENAI_MODEL  = os.getenv("OPENAI_MODEL", "gpt-5-nano") 

@app.route("/")
def index():
    """
    Render the main application interface for Concise.

    Purpose:
        Serve the root page that displays the feed overview,
        including subscribed RSS feeds and their entries.

    Behavior:
        - Delivers the frontend HTML for the Concise UI
        - Acts as the entry point for all client-side interactions

    Returns:
        Rendered HTML template for the main overview page.
    """
    return render_template("concise.html")


@app.route('/fetch_feed', methods=['POST'])
def fetch_feed():
    """
    Receive an RSS feed URL from the frontend and trigger server-side
    fetching, parsing, and extraction of feed metadata and entries.

    Expected JSON payload:
        {
            "url": "<RSS feed URL>"
        }

    Processing:
        - Fetch the RSS/Atom feed from the given URL
        - Parse feed metadata (e.g. title)
        - Extract entries including title, link, summary, and published date

    Returns:
        JSON response containing:
            - status: processing status
            - feed_title: title of the RSS feed
            - entries: list of parsed feed items
    """
    data = request.get_json()
    feed_url = data.get('url')

    import feedparser
    feed = feedparser.parse(feed_url)

    # Extract basic feed info
    feed_title = feed.feed.get('title', 'No title')
    feed_entries = []

    for entry in feed.entries:
        feed_entries.append({
            "title": entry.get("title", "No title"),
            "link": entry.get("link", ""),
            "summary": entry.get("summary", ""),
            "published": entry.get("published", "")
        })

    return jsonify({
        "status": "ok",
        "feed_title": feed_title,
        "entries": feed_entries
    })

@app.route('/fetch_article', methods=['POST'])
def fetch_article():
    """
    Receive an article link from the frontend and trigger server-side
    fetching and extraction of the article content.

    Expected JSON payload:
        {
            "link": "<article URL>"
        }

    Returns:
        JSON response containing:
            - status: processing status
            - url_received: the URL sent by the client
            - article_text: extracted article content
    """
    data = request.get_json()
    url = data.get("link")

    try:
        # Fetch the HTML content of the article
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to fetch URL: {e}"
    }), 400

    soup = BeautifulSoup(response.text, "html.parser")

    # Very simple text extraction for now
    paragraphs = soup.find_all("p")
    article_text = "\n".join(p.get_text(strip=True) for p in paragraphs)

    # Call AI LLM to summarize the article text
    summary = summarize_with_ai(article_text)

    return jsonify({
        "status": "ok",
        "url_received": url,
        "summary": summary
    })

def summarize_with_ai(text):
    """
    Generate a concise summary of the provided article text using
    an attached AI language model.

    Parameters:
        text (str): The full article content extracted by the crawler.

    Returns:
        str: A compact, coherent summary produced by the configured
             language model.

    Notes:
        - This function acts as an abstraction layer so the backend
          remains independent of the specific AI provider.
        - The actual model request should be implemented here.
    """

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ]
    )

    return response.choices[0].message.content


# Development entry point
if __name__ == "__main__":
    app.run(debug=True)
