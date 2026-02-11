"""
MIT License
Copyright (c) 2026 Christian Siewert

Concise – An AI News Summarizer
Main Flask application entry point.
"""

from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Root route: renders the main news overview page
@app.route("/")
def index():
    return render_template("concise.html")

# Endpoint that receives a feed URL from the frontend and triggers 
# server-side fetching and processing of the RSS feed.
@app.route('/fetch_feed', methods=['POST'])
def fetch_feed():
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


# Development entry point
if __name__ == "__main__":
    app.run(debug=True)
