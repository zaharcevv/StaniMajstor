<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="10">
          <v-card-title class="text-center text-yellow-darken-2 text-h5 font-weight-bold mb-3">
             Промени лозинка
          </v-card-title>

          <v-form ref="passwordForm" @submit.prevent="changePassword" class="px-4">
            <v-text-field
  v-model="newPassword"
  :type="showNew ? 'text' : 'password'"
  label="Нова лозинка"
  color="warning"
  variant="outlined"
  density="comfortable"
  :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
  @click:append-inner="showNew = !showNew"
  class="lol"
/>

<v-text-field
  v-model="confirmPassword"
  :type="showConfirm ? 'text' : 'password'"
  label="Потврди лозинка"
  color="warning"
  variant="outlined"
  density="comfortable"
  :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
  @click:append-inner="showConfirm = !showConfirm"
  class="zoz"
/>

<!-- Error message directly under second input -->
<div v-if="errorMessage" class="error-message">
  {{ errorMessage }}
</div>


            <v-btn
              type="submit"
              color="warning"
              block
              size="large"
              class="font-weight-bold text-black"
              :loading="loading"
            >
               Ажурирај лозинка
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
import { getAuth, updatePassword } from 'firebase/auth'

const newPassword = ref('')
const confirmPassword = ref('')
const showNew = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const errorMessage = ref('')



const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const changePassword = async () => {
  const auth = getAuth()
  const user = auth.currentUser

  errorMessage.value = '' // reset

  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Внеси и потврди лозинка.'
    return
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Минимум 6 карактери.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Лозинките не се совпаѓаат.'
    return
  }

  try {
    loading.value = true
    await updatePassword(user, newPassword.value)
    newPassword.value = ''
    confirmPassword.value = ''
    snackbar.value = {
      show: true,
      message: '✅ Лозинката е успешно променета!',
      color: 'success'
    }
  } catch (error) {
    console.error('Error updating password:', error)
    snackbar.value = {
      show: true,
      message: error.code === 'auth/requires-recent-login'
        ? 'ℹ️ Најавете се повторно за да смените лозинка.'
        : '❌ Грешка при промена на лозинката.',
      color: error.code === 'auth/requires-recent-login' ? 'info' : 'error'
    }
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
  background: linear-gradient(135deg, #1e1e1e, #121212);
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

.lol{
  margin-bottom: -10px;
}

.zoz{
  margin-bottom: -8px;
}

.error-message {
  margin-top: -16px;
  font-size: 0.9rem;
  color: #ff5252; /* Vuetify црвена */
  font-weight: 500;
  margin-bottom: 6px;
}

</style>
