const baseInfo = "http://localhost:5678/api/";

// Define displayMessage function outside the event listener
function displayMessage(msg, type) {
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = ""; // Clear previous messages
    const messageDiv = document.createElement("div");
    messageDiv.textContent = msg;
    messageDiv.classList.add("message", type);
    messageElement.appendChild(messageDiv);
}

// EventListener
document.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Simple validation
    if (!emailInput.value || !passwordInput.value) {
        displayMessage("Veuillez saisir votre e-mail et votre mot de passe.", "error");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;
    
    try {
        const response = await fetch(`${baseInfo}users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.status !== 200) {
            // Log response details for debugging
            const errorText = await response.text();
            console.log("Response status:", response.status);
            displayMessage("Email ou mot de passe erronés", "error");
        } else {
            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            window.location.replace("index.html");
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Une erreur s'est produite. Veuillez réessayer.", "error");
    }
});
