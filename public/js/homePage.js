document.addEventListener("DOMContentLoaded", async () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  const buyPremiumButton = document.getElementById("buy-premium-button");
  let token;

  try {
    token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing");
    } else {
      const response = await axios.get(
        "http://localhost:3000/expense/getAllExpenses",
        { headers: { Authorization: token } }
      );
      const expenses = response.data;

      expenses.forEach((expense) => {
        const expenseItem = createExpenseItem(expense);
        expenseList.appendChild(expenseItem);
      });
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }

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
        expenseList.appendChild(expenseItem);

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
        await axios.post(
          "http://localhost:3000/purchase/updateTransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("You are a Premium User Now");
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
