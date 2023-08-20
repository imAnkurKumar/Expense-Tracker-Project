document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await axios.post("http://localhost:3000/user/signUp", {
          name,
          email,
          password,
        });

        if (response.status === 201) {
          alert("Sign-up successful: " + response.data.message);

          // Clear input fields after successful signup
          document.getElementById("username").value = "";
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
        }
      } catch (error) {
        if (error.response.status === 400) {
          alert("Error: " + error.response.data.message);
        } else {
          console.error("Sign-up error:", error.response.data.message);
        }
      }
    });
});