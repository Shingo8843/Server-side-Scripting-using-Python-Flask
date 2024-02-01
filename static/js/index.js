companySymbol = "";
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
// Function to handle fetching company details
function getCompanyDetail() {
  fetch("/api/Company")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      ActivateTab("companydetail");
      UpdateCompanyDetail(data[0]);
    })
    .catch((error) => console.error("Error fetching company details:", error));
}
function UpdateCompanyDetail(company) {
  // <div class="tabcontent inactive" id="companydetail"></div>, change this to tabcontent active
  document.getElementById("companyicon").src = company.logo;
  document.getElementById("companyname").innerText = company.name;
  document.getElementById("stocktickersymbol").innerText = company.ticker;
  document.getElementById("stocktickersymbol2").innerText = company.ticker;
  document.getElementById("stockexchangecode").innerText = company.exchange;
  document.getElementById("companyipodate").innerText = company.ipo;
  document.getElementById("category").innerText = company.finnhubIndustry;
}

// Function to handle fetching stock summary
function getStockSummary() {
  fetch("/api/Stocks")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      ActivateTab("stocksummary");
      UpdateStockSummary(data[0]);
    })
    .catch((error) => console.error("Error fetching stock summary:", error));
  fetch("/api/Recommendation/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      UpdateRecommendation(data[0]);
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
function UpdateRecommendation(recommendation) {}
// Function to handle fetching charts
function getChart() {
  fetch("/api/Chart/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      ActivateTab("chartsummary");
      UpdateChart(data[0]);
    })
    .catch((error) => console.error("Error fetching charts:", error));
}
function UpdateChart(chart) {}
// Function to handle fetching the latest news
function getLatestNews() {
  fetch("/api/News/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      ActivateTab("latestnews");
      UpdateNews(data);
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
