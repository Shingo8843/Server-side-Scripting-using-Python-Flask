companySymbol = "";

function searchCompany() {
  var inputSymbol = document.getElementById("searchinput");
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
  companySymbol = symbol;
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
  document.getElementById("tradingday").innerText = stock.t;
  document.getElementById("previousclosingprice").innerText = stock.pc;
  document.getElementById("openingprice").innerText = stock.o;
  document.getElementById("highprice").innerText = stock.h;
  document.getElementById("lowprice").innerText = stock.l;
  document.getElementById("change").innerText = stock.d;
  document.getElementById("changepercent").innerText = stock.dp;
  if (stock.d > 0) {
    document.getElementById("valuearrow").src = "static/img/GreenArrowUp.png";
  } else {
    document.getElementById("valuearrow").src = "static/img/RedArrowDown.png";
  }
  if (stock.dp > 0) {
    document.getElementById("percentarrow").src = "static/img/GreenArrowUp.png";
  } else {
    document.getElementById("percentarrow").src = "static/img/RedArrowDown.png";
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
function UpdateChart(data, companySymbol) {
  const stockPrice = [],
    volume = [],
    dataLength = data["open"].length,
    // set the allowed units for data grouping
    groupingUnits = [
      [
        "day", // unit name
        [7, 15], // allowed multiples
      ],
      ["month", [1, 3, 6]],
    ];

  for (let i = 0; i < dataLength; i += 1) {
    stockPrice.push([
      data["timestamp"][i], // the date
      data["close"][i], // close
    ]);

    volume.push([
      data["timestamp"][i], // the date
      data["volume"][i], // the volume
    ]);
  }

  // create the chart
  Highcharts.stockChart("chartsummary", {
    rangeSelector: {
      selected: 4,
    },

    title: {
      text: companySymbol + " Historical",
    },

    yAxis: [
      {
        labels: {
          align: "left",
          x: -3,
        },
        title: {
          text: "Stock Price",
        },
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        opposite: true,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
    ],
    tooltip: {
      split: true,
    },

    series: [
      {
        type: "area",
        name: "AAPL",
        data: stockPrice,
        yAxis: 0,
        dataGrouping: {
          units: groupingUnits,
        },
      },
      {
        type: "column",
        name: "Volume",
        data: volume,
        yAxis: 1,
        dataGrouping: {
          units: groupingUnits,
        },
      },
    ],
  });
}
function getLatestNews() {
  fetch("/api/News" + "?value=" + companySymbol + "&limit=5")
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
  for (i = 0; i < news.length; i++) {
    var newsdata = document.createElement("div");
    newsdata.className = "newsdata";
    newsdata.innerHTML = `
      <div>
        <img src="${news[i].image}" />
        <div>
          <h3>${news[i].headline}</h3>
          <p>${news[i].datetime}</p>
          <a href="${news[i].url}" target="_blank">See Original Post</a>
        </div>
      </div>
    `;
    document.getElementById("latestnews").appendChild(newsdata);
  }
}
