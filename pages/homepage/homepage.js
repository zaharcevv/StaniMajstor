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
          window.location.href = "../auth/login/login-form.html"; // Adjust this path to your login page
      });
      console.log("Event listener attached to loginIcon");
  } else {
      console.error("loginIcon not found");
  }
});
