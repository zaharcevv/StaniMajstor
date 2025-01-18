import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const logoutSection = document.getElementById("logoutSection");
const logoutButton = document.getElementById("logoutButton");
const messageElement = document.getElementById("message");
const welcomeMessage = document.getElementById("welcomeMessage");

// Handle Login Form Submission
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get email and password
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Log in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    messageElement.textContent = `Welcome back, ${user.email}!`;
    console.log("User logged in:", user);
  } catch (error) {
    // Handle errors during login
    messageElement.textContent = `Error: ${error.message}`;
    console.error("Login error:", error);
  }
});

// Handle Logout Button
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("User signed out.");
    messageElement.textContent = "You have been logged out." + user.username;
  } catch (error) {
    console.error("Error signing out:", error);
    messageElement.textContent = `Error: ${error.message}`;
  }
});

// Listen for Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    loginForm.style.display = "none";
    logoutSection.style.display = "block";
    welcomeMessage.textContent = `Hello, ${user.email}!`;
    console.log("User is signed in:", user);
  } else {
    // User is signed out
    loginForm.style.display = "block";
    logoutSection.style.display = "none";
    welcomeMessage.textContent = "";
    console.log("No user signed in.");
  }
});
