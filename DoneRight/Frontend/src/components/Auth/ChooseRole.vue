<template>
  <v-app>
    <div class="role-choice-container">
      <v-container class="text-center">
        <h1 class="title">Како сакате да продолжите?</h1>
        <p class="subtitle">Изберете тип на профил за регистрација.</p>

        <v-row class="mt-8" justify="center" align="center" dense>
          <v-col cols="12" md="4">
            <v-card class="role-card" @click="router.push('/register')">
              <v-icon size="48" color="warning">mdi-account</v-icon>
              <h3 class="mt-3">Обичен корисник</h3>
              <p>Регистрирај се за да прегледуваш мајстори и оставаш рецензии.</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="role-card" @click="router.push('/register-master')">
              <v-icon size="48" color="warning">mdi-hammer-screwdriver</v-icon>
              <h3 class="mt-3">Мајстор</h3>
              <p>Регистрирај се како мајстор и понуди свои услуги на платформата.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.role-choice-container {
  padding: 120px 20px 60px;
  background: linear-gradient(135deg, #1e1e1e, #121212);
  min-height: 100vh;
  color: white;
}

.title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #ffc107;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.1rem;
  color: #bbb;
  margin-bottom: 40px;
}

.role-card {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  padding: 24px;
  border-radius: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(255, 193, 7, 0.2);
}

.role-card h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 12px 0 8px;
}

.role-card p {
  font-size: 0.95rem;
  color: #ccc;
}
</style>
