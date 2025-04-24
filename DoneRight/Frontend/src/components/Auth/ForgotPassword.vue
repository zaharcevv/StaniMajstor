<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="10">
          <v-card-title class="text-center text-yellow-darken-2 text-h5 font-weight-bold mb-3">
            Заборавена лозинка
          </v-card-title>

          <v-form @submit.prevent="sendResetEmail" class="px-4">
            <v-text-field
              v-model="email"
              label="Емаил адреса"
              type="email"
              color="warning"
              variant="outlined"
              density="comfortable"
              required
              class="address"
            />

            <!-- Error or Success Message -->
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <v-btn
              type="submit"
              color="warning"
              block
              size="large"
              class="mt-4 font-weight-bold text-black"
              :loading="loading"
            >
              Испрати линк за ресет
            </v-btn>
          </v-form>
        </v-card>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
          {{ snackbar.message }}
        </v-snackbar>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

const email = ref('')
const errorMessage = ref('')
const loading = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const sendResetEmail = async () => {
  const auth = getAuth()
  errorMessage.value = ''
  try {
    loading.value = true
    await sendPasswordResetEmail(auth, email.value)
    snackbar.value = {
      show: true,
      message: '✅ Провери го емаилот за линк за ресет.',
      color: 'success'
    }
    email.value = ''
  } catch (error) {
    console.error(error)
    errorMessage.value = '❌ ' + (error.code === 'auth/user-not-found'
      ? 'Корисник со таа емаил адреса не постои.'
      : 'Настана грешка. Пробај повторно.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.background {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #212529;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  padding: 30px 20px;
  max-width: 420px;
  width: 100%;
  color: white;
}
.error-message {
  margin-top: 5px;
  margin-bottom: -7px;
  font-size: 0.9rem;
  color: #ff5252;
  font-weight: 500;
}

.address{
  margin-bottom: -20px;
}
</style>
