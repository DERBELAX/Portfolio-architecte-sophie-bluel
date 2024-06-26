const baseInfo = "http://localhost:5678/api/";
//EventListener
document.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageElement = document.getElementById("message");

    // Réinitialise le message à chaque soumission
    messageElement.innerHTML = "";

    // Simple validation
    if (!emailInput.value || !passwordInput.value) {
        displayMessage("Veuillez saisir votre e-mail et votre mot de passe.", "error");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    fetch(`${baseInfo}users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    }).then((response) => {
        if (response.status === 401) {
          displayMessage("Email ou mot de passe incorrects. Veuillez réessayer.", "error");
      } else if (response.status !== 200) {
            displayMessage("Email ou mot de passe erronés", "error");
        } else {
          response.json().then((data) => {
            sessionStorage.setItem("token", data.token);
            window.location.replace("index.html");
        });
        }
    }).catch((error) => {
        console.error("Error:", error);
        displayMessage("Une erreur s'est produite. Veuillez réessayer.", "error");
    });

    function displayMessage(msg, type) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = msg;
        messageDiv.classList.add("message", type);
        messageElement.appendChild(messageDiv);
    }
});


 



 

