companySymbol = "";
document
  .getElementById("searchinput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchCompany();
    }
  });
function searchCompany() {
  var inputSymbol = document.getElementById("searchinput");
  // inputSymbol.value = inputSymbol.value.toUpperCase();
  if (inputSymbol.value.trim() === "") {
    console.log("Please enter a valid stock symbol");
    inputSymbol.focus();
    inputSymbol.reportValidity();
    document.getElementById("errormessage").classList.remove("active");
    document.getElementById("errormessage").classList.add("inactive");
    document.getElementById("resultcontainer").classList.remove("active");
    document.getElementById("resultcontainer").classList.add("inactive");
  } else {
    console.log("Searching for Stock: " + inputSymbol.value);
    SetCompanySymbol(inputSymbol.value);
    getCompanyDetail();
  }
}
function ClearSearchInput() {
  document.getElementById("searchinput").value = "";
  document.getElementById("searchinput").focus();
  ClearResult();
}
function ClearResult() {
  document.getElementById("errormessage").classList.remove("active");
  document.getElementById("errormessage").classList.add("inactive");
  document.getElementById("resultcontainer").classList.remove("active");
  document.getElementById("resultcontainer").classList.add("inactive");
}
function showResult() {
  document.getElementById("errormessage").classList.remove("active");
  document.getElementById("errormessage").classList.add("inactive");
  document.getElementById("resultcontainer").classList.remove("inactive");
  document.getElementById("resultcontainer").classList.add("active");
}
function showError() {
  document.getElementById("errormessage").classList.remove("inactive");
  document.getElementById("errormessage").classList.add("active");
  document.getElementById("resultcontainer").classList.remove("active");
  document.getElementById("resultcontainer").classList.add("inactive");
}
function SetCompanySymbol(symbol) {
  companySymbol = symbol.toUpperCase();
}
function ActivateTab(activeTab) {
  tabs = ["companydetail", "stocksummary", "chartsummary", "latestnews"];
  tabnames = ["company", "stock", "chart", "news"];
  for (i = 0; i < tabs.length; i++) {
    if (tabs[i] != activeTab) {
      document.getElementById(tabs[i]).classList.remove("active");
      document.getElementById(tabs[i]).classList.add("inactive");
      document.getElementById(tabnames[i]).classList.remove("active");
      document.getElementById(tabnames[i]).classList.add("inactive");
    } else {
      document.getElementById(tabs[i]).classList.remove("inactive");
      document.getElementById(tabs[i]).classList.add("active");
      document.getElementById(tabnames[i]).classList.remove("inactive");
      document.getElementById(tabnames[i]).classList.add("active");
    }
  }
}
function getCompanyDetail() {
  fetch("/api/Company" + "?value=" + companySymbol)
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        showError();
      } else {
        console.log(data);
        UpdateCompanyDetail(data);
        ActivateTab("companydetail");
        showResult();
      }
    })
    .catch((error) => console.error("Error fetching company details:", error));
}
function UpdateCompanyDetail(company) {
  document.getElementById("companyicon").src = company.logo;
  document.getElementById("companyname").innerText = company.name;
  document.getElementById("stocktickersymbol").innerText = company.ticker;
  document.getElementById("stocktickersymbol2").innerText = company.ticker;
  document.getElementById("stockexchangecode").innerText = company.exchange;
  document.getElementById("companyipodate").innerText = company.ipo;
  document.getElementById("category").innerText = company.finnhubIndustry;
}
function getStockSummary() {
  fetch("/api/Stocks" + "?value=" + companySymbol)
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        showError();
      } else {
        console.log(data);
        UpdateStockSummary(data);
        showResult();
      }
    })
    .catch((error) => console.error("Error fetching stock summary:", error));
  fetch("/api/Recommendation" + "?value=" + companySymbol)
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        showError();
      } else {
        console.log(data);
        UpdateRecommendation(data[0]);
        ActivateTab("stocksummary");
        showResult();
      }
    })
    .catch((error) => console.error("Error fetching recommendation:", error));
}
function UpdateStockSummary(stock) {
  document.getElementById("tradingday").innerText = formatDate(stock.t);
  document.getElementById("previousclosingprice").innerText = stock.pc;
  document.getElementById("openingprice").innerText = stock.o;
  document.getElementById("highprice").innerText = stock.h;
  document.getElementById("lowprice").innerText = stock.l;
  document.getElementById("change").innerText = stock.d;
  document.getElementById("changepercent").innerText = stock.dp;
  if (stock.d > 0) {
    document.getElementById("valuearrow").src =
      "../static/img/GreenArrowUp.png";
  } else {
    document.getElementById("valuearrow").src =
      "../static/img/RedArrowDown.png";
  }
  if (stock.dp > 0) {
    document.getElementById("percentarrow").src =
      "../static/img/GreenArrowUp.png";
  } else {
    document.getElementById("percentarrow").src =
      "../static/img/RedArrowDown.png";
  }
}
function UpdateRecommendation(recommendation) {
  document.getElementById("strongbuy").innerText = recommendation.strongBuy;
  document.getElementById("buy").innerText = recommendation.buy;
  document.getElementById("hold").innerText = recommendation.hold;
  document.getElementById("sell").innerText = recommendation.sell;
  document.getElementById("strongsell").innerText = recommendation.strongSell;
}
function getChart() {
  fetch("/api/Chart" + "?value=" + companySymbol)
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        showError();
      } else {
        console.log(data);
        UpdateChart(data, companySymbol);
        ActivateTab("chartsummary");
        showResult();
      }
    })
    .catch((error) => console.error("Error fetching charts:", error));
}
function getTodaysDate() {
  var today = new Date();
  return (
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );
}
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}
function UpdateChart(data, companySymbol) {
  const today = getTodaysDate();
  const stockPrice = [],
    volume = [],
    dataLength = data["open"].length;
  for (let i = 0; i < dataLength; i += 1) {
    stockPrice.push([data["timestamp"][i], data["close"][i]]);

    volume.push([data["timestamp"][i], data["volume"][i]]);
  }
  Highcharts.stockChart("chartsummary", {
    rangeSelector: {
      buttons: [
        {
          type: "day",
          count: 7,
          text: "7d",
        },
        {
          type: "day",
          count: 15,
          text: "15d",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
        },
      ],
      selected: 0,
      inputEnabled: false,
    },

    title: {
      text: companySymbol + " Stock Price " + today,
    },
    subtitle: {
      useHTML: true,
      text: '<a href="https://polygon.io" target="_blank" style="color: blue; text-decoration: underline; cursor: pointer;">Source: Polygon.io</a>',
    },

    yAxis: [
      {
        title: {
          text: "Stock Price",
        },
        opposite: false,
      },
      {
        title: {
          text: "Volume",
        },
        opposite: true,
        maxPadding: 2.0,
      },
    ],
    xAxis: {
      tickInterval: 24 * 3600 * 1000,
      dateTimeLabelFormats: {
        day: "%e. %b",
      },
    },
    series: [
      {
        name: companySymbol,
        data: stockPrice,
        type: "area",
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
      },
      {
        type: "column",
        name: "Volume",
        data: volume,
        yAxis: 1,
        color: "black",
        pointWidth: 4,
      },
    ],
  });
}
function getLatestNews() {
  fetch("/api/News" + "?value=" + companySymbol)
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        showError();
      } else {
        console.log(data);
        UpdateNews(data);
        ActivateTab("latestnews");
        showResult();
      }
    })
    .catch((error) => console.error("Error fetching latest news:", error));
}
function UpdateNews(news) {
  document.getElementById("latestnews").innerHTML = "";
  for (var i = 0; i < Math.min(5, news.length); i++) {
    var newsdata = document.createElement("div");
    newsdata.className = "newsdata";
    if (news[i].image == "") {
      newsdata.innerHTML = `
      <div class="articlecontainer">
        <div class="articleimgcontainer">
          <div class = "noimage">No Image Available</div>
        </div>
        <div>
          <p class="articletitle">${news[i].headline}</p>
          <p class="articledate">${formatDate(news[i].datetime)}</p>
          <a class="articleURL" href="${
            news[i].url
          }" target="_blank">See Original Post</a>
        </div>
      </div>
    `;
    } else {
      newsdata.innerHTML = `
      <div class="articlecontainer">
        <div class="articleimgcontainer">
          <img class = "articleimg" src="${news[i].image}" />
        </div>
        <div>
          <p class="articletitle">${news[i].headline}</p>
          <p class="articledate">${formatDate(news[i].datetime)}</p>
          <a class="articleURL" href="${
            news[i].url
          }" target="_blank">See Original Post</a>
        </div>
      </div>
    `;
    }

    document.getElementById("latestnews").appendChild(newsdata);
  }
}
