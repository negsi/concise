"""
MIT License
Copyright (c) 2026 Christian Siewert

Concise – An AI News Summarizer
Main Flask application entry point.
"""

from flask import Flask, render_template

app = Flask(__name__)

# Root route: renders the main news overview page
@app.route("/")
def index():
    return render_template("concise.html")

# Development entry point
if __name__ == "__main__":
    app.run(debug=True)
