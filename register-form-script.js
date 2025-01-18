import { app, auth } from "./firebaseConfig.js"; // Import Firebase from firebaseConfig.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

// Get the registration form and message elements
const registrationForm = document.getElementById("registrationForm");
const messageElement = document.getElementById("message");

// Handle form submission
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get email, password, and username from the form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a new user document in Firestore
    const userData = {
      userId: user.uid,
      username: username,
      email: email,
      birthdate: null, // This will be null initially
      profilePicture: null, // This will be null initially
      favourites: null, // This will be null initially
      isSeller: false // Default value
    };

    // Set the user data in Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    // Display success message
    messageElement.textContent = "Registration successful! You can now sign in.";
    console.log("User registered and added to Firestore:", user);
  } catch (error) {
    // Handle errors during registration
    const errorCode = error.code;
    const errorMessage = error.message;
    messageElement.textContent = `Error: ${errorMessage}`;
    console.error("Registration error:", error);
  }
});
