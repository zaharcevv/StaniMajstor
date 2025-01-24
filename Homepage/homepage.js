// Smooth scrolling for navigation links
document.querySelectorAll('header nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          target.scrollIntoView({
              behavior: 'smooth'
          });
      }
  });
});

// Responsive menu toggle
document.querySelector('.menu-icon').addEventListener('click', function () {
  document.querySelector('header nav').classList.toggle('active');
});

// Close the menu on link click in responsive mode
document.querySelectorAll('header nav a').forEach(anchor => {
  anchor.addEventListener('click', function () {
      document.querySelector('header nav').classList.remove('active');
  });
});

// Navigate to the login page on icon click
document.addEventListener("DOMContentLoaded", function () {
  const loginIcon = document.getElementById("loginIcon");

  if (loginIcon) {
      loginIcon.addEventListener("click", function () {
          window.location.href = "login.html"; // Adjust this path to your login page
      });
      console.log("Event listener attached to loginIcon");
  } else {
      console.error("loginIcon not found");
  }
});

window.addEventListener('load', function () {
  // Wait for 1.5 seconds to allow preloader to finish
  setTimeout(function () {
      // Add transition to preloader to fade out
      document.getElementById('preloader').style.opacity = '0'; // Make preloader fade out
      document.getElementById('preloader').style.visibility = 'hidden'; // Hide it completely after fading
      document.body.style.overflow = 'auto'; // Allow scrolling after loading
      
      // Trigger the page content to smoothly fade in
      document.querySelector('.hero').classList.add('visible'); // Add class to trigger smooth transition
  }, 1500); // The preloader will last for 1.5 seconds before fading out
});

