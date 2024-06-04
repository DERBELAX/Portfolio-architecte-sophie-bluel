const baseApiUrl = "http://localhost:5678/api/";
//EventListener
document.addEventListener("submit", (e) => {
// Prevent the form from auto-submitting
  e.preventDefault();
  let form = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
  };
  // Get the user input
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
// Request Post to login with the user input
  fetch(`${baseApiUrl}users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ email, password}),

  }).then((response) => {
    if (response.status !== 200) {
      alert("Email ou mot de passe erronés");
    } else {
      response.json().then((data) => {
        sessionStorage.setItem("token", data.token); //STORE TOKEN
        window.location.replace("index.html");
      });
    }
  });
})