<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="10">
          <v-card-title class="success-title">
            ✅ Успешно додадовте услуга!
          </v-card-title>

          <v-card-text class="success-text">
            Вашата услуга е успешно зачувана во системот. <br />
            Сега можете да додадете уште една услуга или да се вратите на почетната табла.
          </v-card-text>

          <v-card-actions class="button-group">
            <v-btn
              color="warning"
              class="text-black font-weight-bold"
              block
              @click="goToDashboard"
            >
              🏠 Врати се на Дашборд
            </v-btn>

            <v-btn
              color="white"
              variant="outlined"
              class="text-white mt-3"
              block
              @click="addAnother"
            >
              ➕ Додади уште една услуга
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
  background-color: #212529;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}
.form-container {
  z-index: 1;
  display: flex;
  justify-content: center;
}
.form-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 30px 24px;
  max-width: 440px;
  width: 100%;
  color: white;
  text-align: center;
}
.success-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ffc107;
}
.success-text {
  margin-top: 16px;
  font-size: 1rem;
  line-height: 1.6;
  color: #ffffff;
}
.button-group {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
}
</style>
