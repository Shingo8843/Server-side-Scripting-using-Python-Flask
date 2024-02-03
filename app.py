from flask import Flask, render_template, request, redirect, url_for, jsonify
import finnhub
import os
from dotenv import load_dotenv
from polygon import RESTClient
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

app = Flask(__name__)
load_dotenv()  # This loads the environment variables from .env.

companySymbol = ""
@app.route("/")
@app.route("/Home/")
def Index():
    return render_template("index.html")

# get request to https://finnhub.io
@app.route("/api/Company/", methods=["GET", "POST"])
def Company():
    companySymbol = request.args.get('value', default=None, type=str)
    SECRET_KEY = os.getenv('finnhub_api_key')
    finnhub_client = finnhub.Client(api_key=SECRET_KEY)
    company = finnhub_client.company_profile2(symbol=companySymbol)
    print(company)
    if company == {}:
        return jsonify([])
    return jsonify(company)

# get request to https://finnhub.io
@app.route("/api/Stocks/", methods=["GET", "POST"])
def Stocks():
    companySymbol = request.args.get('value', default=None, type=str)
    SECRET_KEY = os.getenv('finnhub_api_key')
    finnhub_client = finnhub.Client(api_key=SECRET_KEY)
    stock = finnhub_client.quote(symbol=companySymbol)
    if stock == {}:
        return jsonify([])
    return jsonify(stock)
# get request to https://finnhub.io
@app.route("/api/Recommendation/", methods=["GET", "POST"])
def Recommendation():
    companySymbol = request.args.get('value', default=None, type=str)
    SECRET_KEY = os.getenv('finnhub_api_key')
    finnhub_client = finnhub.Client(api_key=SECRET_KEY)
    recommendation = finnhub_client.recommendation_trends(symbol=companySymbol)
    if recommendation == {}:
        return jsonify([])
    return jsonify(recommendation)

# get request to https://polygon.io/
@app.route("/api/Chart/", methods=["GET", "POST"])
def Chart():
    companySymbol = request.args.get('value', default=None, type=str)
    print(companySymbol)

    #Get the date 6 months ago
    today = datetime.now().date()
    six_months_ago = today - relativedelta(months=6, days=1)
    today_str = today.strftime('%Y-%m-%d')
    six_months_and_one_day_ago_str = six_months_ago.strftime('%Y-%m-%d')
    
    # Initialize the chart dictionary
    chart = {
        'open': [], 'high': [], 'low': [],
        'close': [], 'volume': [], 'vwap': [],
        'timestamp': [], 'transactions': [], 'otc': []
    }

    # Get the stock data
    SECRET_KEY = os.getenv('polygon_api_key')
    client = RESTClient(api_key=SECRET_KEY)

    # Use the Pythonic way to append data to the lists within the chart dictionary
    for agg in client.list_aggs(ticker=companySymbol, multiplier=1, timespan="day", from_=six_months_and_one_day_ago_str, to=today_str):
        chart['open'].append(agg.open)
        chart['high'].append(agg.high)
        chart['low'].append(agg.low)
        chart['close'].append(agg.close)
        chart['volume'].append(agg.volume)
        chart['vwap'].append(agg.vwap)
        chart['timestamp'].append(agg.timestamp)
        chart['transactions'].append(agg.transactions)
        chart['otc'].append(agg.otc)
    print(chart)
    # if companySymbol == "TSLA":
    #     chart = [
    #         {
    #             "c": 75.0875,
    #             "h": 75.15,
    #             "l": 73.7975,
    #             "n": 1,
    #             "o": 74.06,
    #             "t": 1577941200000,
    #             "v": 135647456,
    #             "vw": 74.6099
    #         }
    #     ]

    if chart == {'open': [], 'high': [], 'low':[], 'close':[], 'volume':[], 'vwap':[], 'timestamp':[], 'transactions':[], 'otc':[]}:
        return jsonify([])
    return jsonify(chart)

# get request to https://finnhub.io
@app.route("/api/News/", methods=["GET", "POST"])
def News():
    companySymbol = request.args.get('value', default=None, type=str)
    limit = request.args.get('limit', default=None, type=int)
    print(companySymbol, limit)
    if companySymbol == "TSLA":
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
    else:
        articles = {}
    if articles == {}:
        return jsonify([])
    return jsonify(articles)