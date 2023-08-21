document.addEventListener("DOMContentLoaded", async () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  // Fetch and populate the expense list
  try {
    const response = await axios.get(
      "http://localhost:3000/expense/getAllExpenses"
    );
    const expenses = response.data;

    expenses.forEach((expense) => {
      const expenseItem = createExpenseItem(expense);
      expenseList.appendChild(expenseItem);
    });
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
        }
      );

      if (response.status === 200) {
        const expenseItem = createExpenseItem({
          amount,
          description,
          category,
        });
        expenseList.appendChild(expenseItem);

        clearFormFields();

        alert("Expense added successfully");
      }
    } catch (error) {
      console.error("Expense addition error:", error);
      alert("Error adding expense");
    }
  });

  expenseList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-button")) {
      const expenseItem = e.target.parentElement;
      const expenseId = expenseItem.dataset.expenseId;

      try {
        await axios.delete(
          `http://localhost:3000/expense/deleteExpense/${expenseId}`
        );
        expenseItem.remove();
        alert("Expense deleted successfully");
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Error deleting expense");
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

  function clearFormFields() {
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "Food";
  }
});
