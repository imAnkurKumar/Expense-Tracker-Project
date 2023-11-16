document.addEventListener("DOMContentLoaded", () => {
  const resetPassword = document.getElementById("reset-password-form");

  resetPassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    try {
      const response = await axios.post(
        "http://localhost:3000/password/forgotpassword",
        {
          email: email,
        }
      );
      if (response.status === 201) {
        alert("Message: " + response.data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
});
