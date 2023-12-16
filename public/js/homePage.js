document.addEventListener("DOMContentLoaded", async () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  const buyPremiumButton = document.getElementById("buy-premium-button");
  const messageDiv = document.getElementById("message");
  const downloadList = document.getElementById("download-list");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const currentPageDisplay = document.getElementById("currentPage");

  let token;
  let currentPage = 1;
  let totalPages;

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  // Function to create buttons
  function createStyledButton(text, className, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
  }

  function showPremiumuserMember() {
    buyPremiumButton.style.visibility = "hidden";
    document.getElementById("message").innerHTML = "PREMIUM USER";
    showLeaderboard();
    showReport();
    downloadExpense();
    fetchDownloadHistory();
  }

  const fetchExpenses = async (page) => {
    token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3000/expense/getAllExpenses?page=${page}`,
        { headers: { Authorization: token } }
      );
      const { expenses, totalExpenses } = response.data;

      expenseList.innerHTML = "";
      expenses.forEach((expense) => {
        const expenseItem = createExpenseItem(expense);
        expenseList.appendChild(expenseItem);
      });

      totalPages = Math.ceil(totalExpenses / 5);
      currentPageDisplay.innerHTML = `Page ${page} of ${totalPages}`;
      prevPageBtn.disabled = page === 1;
      nextPageBtn.disabled = page === totalPages;
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  try {
    token = localStorage.getItem("token");
    const decodedToken = parseJwt(token);
    // console.log(decodedToken);
    const isPremiumUser = decodedToken.isPremiumUser;
    if (isPremiumUser) {
      showPremiumuserMember();
    }
    if (!token) {
      console.error("Token is missing");
    } else {
      await fetchExpenses(currentPage);
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchExpenses(currentPage);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchExpenses(currentPage);
    }
  });

  expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    try {
      const response = await axios.post(
        "http://localhost:3000/expense/addExpenses",
        {
          amount,
          description,
          category,
        },
        { headers: { Authorization: token } } // Include the token in headers
      );

      if (response.status === 200) {
        const newExpense = { amount, description, category };
        const expenseItem = createExpenseItem(newExpense);
        fetchExpenses(currentPage);

        document.getElementById("amount").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "Food";

        alert("Expense added successfully");
      }
    } catch (error) {
      console.error("Expense addition error:", error);
      // Handle the error, e.g., show an error message to the user.
    }
  });

  expenseList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-button")) {
      const expenseItem = e.target.parentElement;
      const expenseId = expenseItem.dataset.expenseId;

      try {
        await axios.delete(
          `http://localhost:3000/expense/deleteExpense/${expenseId}`,
          { headers: { Authorization: token } } // Include the token in headers
        );
        expenseItem.remove();
        alert("Expense deleted successfully");
      } catch (error) {
        console.error("Error deleting expense:", error);
        // Handle the error, e.g., show an error message to the user.
      }
    }
  });

  function createExpenseItem(expense) {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense-item");
    expenseItem.dataset.expenseId = expense.id;

    expenseItem.innerHTML = `
      <span class="amount">Rs ${expense.amount}</span>
      <span class="category">${expense.category}</span>
      <p class="description">${expense.description}</p>
      <button class="delete-button">Delete</button>
    `;

    return expenseItem;
  }

  function showLeaderboard() {
    const showLeaderboardButton = createStyledButton(
      "Show Leaderboard",
      "show-leaderboard-button",
      () => {
        window.open("leaderboard.html", "_blank");
      }
    );
    messageDiv.appendChild(showLeaderboardButton);
  }

  function showReport() {
    const showReportButton = createStyledButton(
      "View Report",
      "show-report-button",
      () => {
        window.open("reports.html", "_blank");
      }
    );
    messageDiv.appendChild(showReportButton);
  }

  function downloadExpense() {
    const showDownloadButton = createStyledButton(
      "Download Expense",
      "download-button",
      async () => {
        try {
          token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:3000/expense/downloadExpense",
            { headers: { Authorization: token } }
          );
          if (response.status === 200) {
            const a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = "myexpense.csv";
            a.click();
          } else {
            throw new Error(response.data.message);
          }
        } catch (err) {
          console.error("error downloading Expense:", err);
        }
      }
    );
    messageDiv.appendChild(showDownloadButton);
  }

  function fetchDownloadHistory() {
    const showDownloadHistoryButton = createStyledButton(
      "Download History",
      "show-download-button",
      async () => {
        try {
          token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:3000/expense/downloadHistory",
            { headers: { Authorization: token } }
          );
          const downloadHistory = response.data;
          downloadList.innerHTML = "";
          downloadHistory.forEach((download, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<span>${index + 1}.</span><a href="${
              download.fileURL
            }" target="_blank">${download.downloadDate}</a>`;
            downloadList.appendChild(listItem);
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
    messageDiv.appendChild(showDownloadHistoryButton);
  }

  buyPremiumButton.addEventListener("click", async (e) => {
    e.preventDefault();
    token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/purchase/premiumMembership",
      { headers: { Authorization: token } }
    );
    // console.log(response);
    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        const res = await axios.post(
          "http://localhost:3000/purchase/updateTransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("You are a Premium User Now");
        buyPremiumButton.style.visibility = "hidden";
        document.getElementById("message").innerHTML = "PREMIUM USER";
        localStorage.setItem("token", res.data.token);
        showLeaderboard();
        showReport();
        downloadExpense();
        fetchDownloadHistory();
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", async function (response) {
      console.log(response);
      alert("something went wrong");
    });
  });
});
