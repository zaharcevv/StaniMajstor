<template>
  <div class="how-it-works">
    <div class="overlay" />
    <div class="container">
      <h1 class="main-title">Како да станеш мајстор?</h1>
      <p class="description">
        Никогаш не било полесно! Креирај профил, постави ја твојата услуга и започни да работиш!
      </p>

      <v-row class="steps-grid" justify="center" align="stretch">
        <!-- Step 1 -->
        <v-col cols="12" md="6" lg="4">
          <v-card class="step-card" elevation="4">
            <div class="step-icon">
              <i class="mdi mdi-account-plus" />
            </div>
            <v-card-title class="step-title">Креирај профил</v-card-title>
            <v-card-text class="step-text">
              Регистрирај се како мајстор за да започнеш да ги нудиш твоите услуги преку нашата платформа.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Step 2 -->
        <v-col cols="12" md="6" lg="4">
          <v-card class="step-card" elevation="4">
            <div class="step-icon">
              <i class="mdi mdi-briefcase-plus" />
            </div>
            <v-card-title class="step-title">Објави услуга</v-card-title>
            <v-card-text class="step-text">
              Додај ги твоите вештини и информации за да те најдат клиентите што им треба токму твојата услуга.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Big button -->
      <div class="register-btn-wrapper mt-8">
        <v-btn color="warning" size="large" class="text-black font-weight-bold" @click="router.push('/register-master')">
          Регистрирај се
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
@import '@mdi/font/css/materialdesignicons.min.css';

.how-it-works {
  background-color: #212529;
  color: white;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 50px 20px;
  text-align: center;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
}

.main-title {
  font-size: 36px;
  color: #ffc107;
  font-weight: 700;
  margin-bottom: 10px;
}

.description {
  font-size: 18px;
  color: #ddd;
  margin-bottom: 30px;
}

.steps-grid {
  margin-top: 20px;
}

.step-card {
  background-color: rgba(255, 255, 255, 0.06);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 10px;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}
.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
}

.step-title {
  color: #ffc107;
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.step-text {
  font-size: 16px;
  color: #ddd;
  padding: 10px 0;
}

.step-icon {
  font-size: 48px;
  margin-top: 10px;
  color: #ffc107;
  position: relative;
}

.step-number {
  position: absolute;
  top: -12px;
  right: -12px;
  background: #ffc107;
  color: black;
  font-weight: 700;
  width: 34px;
  height: 34px;
  font-size: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.register-btn-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>
