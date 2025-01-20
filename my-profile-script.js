import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// DOM Elements
const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");
const profilePictureElement = document.getElementById("profilePicture");
const uploadButton = document.getElementById("uploadPicture");

// Fetch user profile from Firestore
async function fetchUserProfile(userId) {
  try {
    const userDoc = doc(db, "users", userId); // Replace "users" with your Firestore collection name
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      // Populate profile data
      usernameElement.textContent = userData.username || "N/A";
      emailElement.textContent = userData.email || "N/A";

      if (userData.profilePicture) {
        profilePictureElement.style.backgroundImage = `url(${userData.profilePicture})`;
        profilePictureElement.textContent = ""; // Remove placeholder text
      }
    } else {
      console.error("No user profile found!");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Listen for authenticated user
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Fetch and display user profile
    fetchUserProfile(user.uid);
  } else {
    console.log("No user is signed in.");
    alert("You must be signed in to view your profile.");
    window.location.href = "login.html"; // Redirect to login page
  }
});

// Placeholder for upload picture button functionality
uploadButton.addEventListener("click", () => {
  alert("Upload picture functionality not implemented yet.");
});