document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await axios.post("http://localhost:3000/user/login", {
          email,
          password,
        });

        if (response.status === 200) {
          alert("Login successful: " + response.data.message);
        }
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      } catch (error) {
        if (error.response.status === 401) {
          alert("Error: " + error.response.data.message);
        } else {
          console.error("Login error:", error.response.data.message);
        }
      }
    });
});
