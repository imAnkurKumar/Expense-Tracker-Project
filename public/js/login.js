document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Send the data to the server using Axios
    const response = await axios.post("http://localhost:3000/user/signUP", {
      username,
      email,
      password,
    });
    // Handle the response, e.g., show a success message or redirect to another page
    console.log("Sign-up successful:", response.data);
  } catch (error) {
    // Handle errors, e.g., show an error message to the user
    console.error("Sign-up error:", error.response.data.message);
  }
});
