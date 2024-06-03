//export function Form(){
    const form = document.getElementById("connexion");
    console.log (form);
    
    // ---------- EventListener ----------
    form.addEventListener("click", async (e) => {
      // Get the user input
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
    
      // Prevent the form from auto-submitting
      e.preventDefault();
    
      // Request POST to login with the user input
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Add user input into request body
      })
      
      // Check if the previous request is successful
      if (response.ok === true) {
        const data = await response.json(); // Get data from response
        sessionStorage.setItem("accessToken", data.token); // Save the token in sessionStorage
        window.location.href = "./index.html"; // Redirect to index.html
        console.log("Connexion mode admin : Successful");
      } else {
        const connexion = document.querySelector("div"); // Select HTML element where to display the error message
        const error = document.createElement("p"); // Create HTML element to display to display the error message
        error.innerText = "Erreur dans l’identifiant ou le mot de passe";
        error.style.color = "red";
        error.style.textAlign = "center";
        error.style.marginBottom = "25px";
        connexion.insertBefore(error, connexion.lastElementChild); // Position the error message
      };
    });

