<template>
  <section id="mobile-app" class="mobile-app-section">
    <div class="mobile-app-container">
      <div class="left">
        <h1 class="headline">
          Преземете ја нашата мобилна апликација
        </h1>
        <p class="description">
          Најдете ги најдобрите професионалци во секое време и насекаде со нашата мобилна апликација.<br />
          Достапна за iOS и Android уреди.
        </p>
        <div class="buttons">
          <a href="#" class="store-btn">
            <font-awesome-icon :icon="['fab', 'apple']" />
            App Store
          </a>
          <a href="#" class="store-btn">
            <font-awesome-icon :icon="['fab', 'google-play']" />
            Google Play
          </a>
        </div>
      </div>

      <div class="right">
        <img :src="QrCodeImage" alt="QR" class="qr-img" />
      </div>
    </div>
  </section>
</template>

<script setup>
import QrCodeImage from '@/assets/QR.png'
</script>

<style scoped>
.mobile-app-section {
  background: linear-gradient(to bottom right, #2c2c2c, #1a1a1a);
  padding: 80px 20px;
  color: white;
}

.mobile-app-container {
  max-width: 1100px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  flex-wrap: wrap;
}

.left {
  flex: 1;
  min-width: 300px;
}

.right {
  flex: 0 0 auto;
  text-align: center;
}

.headline {
  font-size: 2.4rem;
  font-weight: 800;
  color: #ffc107;
  margin-bottom: 20px;
}

.description {
  font-size: 1.15rem;
  color: #ccc;
  margin-bottom: 30px;
  line-height: 1.6;
}

.buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.store-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffc107;
  color: #121212;
  font-weight: bold;
  font-size: 1rem;
  padding: 14px 24px;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.3);
  transition: 0.3s;
}

.store-btn:hover {
  background: #e3a300;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 193, 7, 0.5);
}

.qr-img {
  max-width: 200px;
  width: 100%;
  border-radius: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-app-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .left {
    text-align: center;
  }

  .buttons {
    justify-content: center;
  }
}
</style>
