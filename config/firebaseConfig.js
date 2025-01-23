        //         // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
        import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
        import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; // Add Firestore
        import { getStorage } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";



        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries
      
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
          apiKey: "AIzaSyBkc4S8nJ0AaGL0jhhf4wImevzeU0IGYwc",
          authDomain: "stanimajstor-4c444.firebaseapp.com",
          projectId: "stanimajstor-4c444",
          storageBucket: "stanimajstor-4c444.firebasestorage.app",
          messagingSenderId: "275539088354",
          appId: "1:275539088354:web:920a5dae6bb71538221fbb",
          measurementId: "G-TMJ17CBH93"
        };
      
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const storage = getStorage(app);

      
        export { app, analytics, auth, db, storage};