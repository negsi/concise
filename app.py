"""
MIT License
Copyright (c) 2026 Christian Siewert

Concise – An AI News Summarizer
Main Flask application entry point.
"""

import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

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

    return jsonify({
        "status": "ok",
        "url_received": url,
        "article_text": article_text
    })


# Development entry point
if __name__ == "__main__":
    app.run(debug=True)
