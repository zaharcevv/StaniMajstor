// Import Firebase from firebaseConfig.js
import { app, auth } from "./firebaseConfig.js"; // Adjust the path if needed
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Get the registration form and message elements
const registrationForm = document.getElementById("registrationForm");
const messageElement = document.getElementById("message");

// Handle form submission
registrationForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get email and password from the form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Create a new user with email and password
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      messageElement.textContent = "Registration successful! You can now sign in.";
      console.log("User registered:", user);
    })
    .catch((error) => {
      // Handle errors during registration
      const errorCode = error.code;
      const errorMessage = error.message;
      messageElement.textContent = `Error: ${errorMessage}`;
      console.error("Registration error:", error);
    });
});
