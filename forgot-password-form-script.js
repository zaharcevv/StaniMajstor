import { auth } from "./firebaseConfig.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// DOM Elements
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const messageElement = document.getElementById("message");

// Handle Password Reset Form Submission
forgotPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get the email address from the form
  const email = document.getElementById("email").value;

  try {
    // Send the password reset email
    await sendPasswordResetEmail(auth, email);
    messageElement.textContent = `Password reset email sent to ${email}. Please check your inbox.`;
    console.log("Password reset email sent to:", email);
    window.location.href = "login-form.html";
  } catch (error) {
    // Handle errors
    messageElement.textContent = `Error: ${error.message}`;
    console.error("Password reset error:", error);
  }
});
