// Function to handle fetching company details
function getCompanyDetail() {
  fetch("/api/Company/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error fetching company details:", error));
}

// Function to handle fetching stock summary
function getStockSummary() {
  fetch("/api/Stocks/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error fetching stock summary:", error));
  fetch("/api/Recommendation/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error fetching recommendation:", error));
}

// Function to handle fetching charts
function getChart() {
  fetch("/api/Chart/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error fetching charts:", error));
}

// Function to handle fetching the latest news
function getLatestNews() {
  fetch("/api/News/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error fetching latest news:", error));
}
