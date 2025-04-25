<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="success-container" fluid>
        <v-card class="success-card" elevation="10">
          <v-card-text class="text-center">
            <v-icon size="96" color="success" class="mb-4 bounce">mdi-check-circle</v-icon>
            <h1 class="text-h4 font-weight-bold text-success mb-4">Честитки!</h1>
            <p class="text-white text-body-1 mb-6">
              Вашиот мајстор профил е успешно креиран.<br />
              Сега може да започнете со привлекување клиенти.
            </p>
            <v-btn color="success" class="text-white font-weight-bold" large @click="goToDashboard">
              Однеси ме на мојата контролна табла
            </v-btn>
          </v-card-text>
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
</script>

<style scoped>
.background {
  background-color: #212529;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}
.success-container {
  z-index: 1;
  display: flex;
  justify-content: center;
}
.success-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 30px 20px;
  max-width: 480px;
  width: 100%;
  color: white;
}
.bounce {
  animation: bounce 1.5s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
