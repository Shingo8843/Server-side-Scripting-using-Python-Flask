from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)
articles = []
chart = []
stocks = []
company = []
recommendation = []
@app.route("/")
@app.route("/Home/")
def Index():
    return render_template("index.html")

# get request to https://finnhub.io
@app.route("/api/Company/", methods=["GET", "POST"])
def Company():
    company = [
        {
        "country": "US",
        "currency": "USD",
        "exchange": "NASDAQ NMS - GLOBAL MARKET",
        "finnhubIndustry": "Automobiles",
        "ipo": "2010-06-09",
        "logo": "https://finnhub.io/api/logo?symbol=TSLA",
        "marketCapitalization": 1000519,
        "name": "Tesla Inc",
        "phone": "+16506815000.",
        "shareOutstanding": 1004.26,
        "ticker": "TSLA",
        "weburl": "https://www.tesla.com/"
        }
    ]
    return jsonify(company)

# get request to https://finnhub.io
@app.route("/api/Stocks/", methods=["GET", "POST"])
def Stocks():
    stock = [
        {
            "c": 75.0875,
            "h": 75.15,
            "l": 73.7975,
            "n": 1,
            "o": 74.06,
            "t": 1577941200000,
            "v": 135647456,
            "vw": 74.6099
        }
    ]
    return jsonify(stocks)
# get request to https://finnhub.io
@app.route("/api/Recommendation/", methods=["GET", "POST"])
def Recommendation():
    recommendation = [
        {
            "buy": 9,
            "hold": 15,
            "period": "2022-01-01",
            "sell": 6,
            "strongBuy": 13,
            "strongSell": 4,
            "symbol": "TSLA"
        }
    ]
    return jsonify(recommendation)

# get request to https://polygon.io/
@app.route("/api/Chart/", methods=["GET", "POST"])
def Chart():
    chart = [
        {
            "c": 75.0875,
            "h": 75.15,
            "l": 73.7975,
            "n": 1,
            "o": 74.06,
            "t": 1577941200000,
            "v": 135647456,
            "vw": 74.6099
        }
        ]
    return jsonify(chart)

# get request to https://finnhub.io
@app.route("/api/News/", methods=["GET", "POST"])
def News():
    articles = [
        {
            "category": "company",
            "datetime": 1642867200,
            "headline": "Bitcoin drops below $35,000 Saturday as global market selloff spreads",
            "id": "95112175",
            "image": "https://s.yimg.com/ny/api/res/1.2/QSz447Gxee8mVgnlMtQX3Q--/YYxBwalWQ9aGlna...",
            "related": "TSLA",
            "source": "Yahoo",
            "summary": "Cryptocurrency prices tumbled Friday night, with bitcoin hitting its l...",
            "url": "https://finnhub.io/api/news?id=a889402cc5e86397f7ec1173fbebb770fb5abbb64621",
        },
        {
            "category": "company",
            "datetime": 1642859520,
            "headline": "Why Does Bitcoin's Price Rise and Fall?",
            "id": "95112199",
            "image": "https://s.yimg.com/uu/api/res/1.2/Ankmgjy5S15TS6wlV_Psig--~B/aD0yNzU7dz0...",
            "related": "TSLA",
            "source": "Yahoo",
            "summary": "Bitcoin's price has gone from $32,983 on Jan. 22, 2021 to $35,811 on t...",
            "url": "https://finnhub.io/api/news?id=2809b72a2a1ea11972dbe1424dd85a0340beaa73f2e",
        },
        ]
    return jsonify(articles)