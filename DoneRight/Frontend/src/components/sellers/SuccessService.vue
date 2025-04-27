<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="14">
          <div class="icon-wrapper">
            <v-icon size="64" color="warning">mdi-check-decagram</v-icon>
          </div>

          <v-card-title class="success-title">
            Успешно додадена услуга!
          </v-card-title>

          <v-card-text class="success-text">
            Вашата услуга е успешно зачувана.<br />
            Можете да додадете нова услуга или да се вратите на таблата.
          </v-card-text>

          <v-card-actions class="button-group">
            <v-btn
              color="white"
              class="dashboard-btn"
              block
              size="large"
              @click="goToDashboard"
            >
              Врати се на Дашборд
            </v-btn>

            <v-btn
              variant="outlined"
              class="add-btn"
              block
              size="large"
              @click="addAnother"
            >
              Додади нова услуга
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/seller-dashboard')
}

const addAnother = () => {
  router.push('/next-form')
}
</script>

<style scoped>
.background {
  background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.form-container {
  z-index: 1;
  display: flex;
  justify-content: center;
}

.form-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 460px;
  width: 100%;
  text-align: center;
  backdrop-filter: blur(16px);
  color: white;
  box-shadow: 0 10px 28px rgba(255, 193, 7, 0.25);
  animation: fadeIn 0.8s ease;
}

.icon-wrapper {
  margin-bottom: 20px;
}

.success-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffc107;
  margin-bottom: 16px;
}

.success-text {
  font-size: 1.15rem;
  line-height: 1.7;
  color: #dddddd;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-btn {
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffc107, #ff8c00);
  color: #212529;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(255, 193, 7, 0.4);
}

.dashboard-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.5);
}

.add-btn {
  font-size: 1rem;
  font-weight: 700;
  color: #ffc107;
  border: 2px solid #ffc107;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: rgba(255, 193, 7, 0.08);
  border-color: #ffdd33;
  transform: translateY(-2px);
}

.success-title {
  font-size: 2rem;
  font-weight: 900;
  color: #ffc107;
  margin-bottom: 16px;
  white-space: normal !important; /* дозволи текстот да оди во повеќе редови */
  overflow: visible !important;   /* отстрани скривање на текстот */
  text-overflow: unset !important; /* отстрани три точки (...) */
}


/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
