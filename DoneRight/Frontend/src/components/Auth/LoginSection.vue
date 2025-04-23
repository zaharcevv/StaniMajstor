<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="10">
          <v-card-title class="text-center text-yellow-darken-2 text-h5 font-weight-bold">
            Најава
          </v-card-title>

          <v-form @submit.prevent="handleLogin" class="px-4">
            <!-- Email -->
            <v-text-field
              v-model="form.email"
              label="Емајл адреса"
              type="email"
              variant="outlined"
              density="comfortable"
              color="warning"
              hide-details
              class="mb-4"
              required
            />

            <!-- Password -->
            <v-text-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Лозинка"
              variant="outlined"
              density="comfortable"
              color="warning"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              hide-details
              required
            />

            <!-- Remember + Forgot in one row -->
            <div class="remember-forgot d-flex justify-space-between align-center mt-2 mb-5">
              <span class="link text-caption" @click="redirectToForgot">Заборавена лозинка?</span>
            </div>

            <p v-if="errorMessage" class="error-text text-center mb-3">{{ errorMessage }}</p>

            <div class="account-link text-white text-caption mb-3">
              Немате профил?
              <span class="link" @click="redirectToRegister">Регистрирај се</span>
            </div>

            <!-- Submit Button -->
            <v-btn
              type="submit"
              color="warning"
              block
              size="large"
              class="text-white font-weight-bold"
              :loading="loading"
            >
              Најави се
            </v-btn>
          </v-form>
        </v-card>

<!-- Dialog after 5 failed attempts -->
<v-dialog v-model="showResetDialog" max-width="420" transition="dialog-bottom-transition">
  <v-card class="pa-4">
    <v-card-title class="text-h6 font-weight-bold d-flex align-center text-warning">
      <v-icon class="me-2" color="warning" size="24">mdi-alert-circle-outline</v-icon>
      Предупредување
    </v-card-title>
    <v-card-text class="text-white text-body-1 mt-2">
      Забележавме 5 неуспешни обиди за најава.
      Дали сакате да ја ресетирате вашата лозинка за полесен пристап?
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn variant="text" color="grey-lighten-1" @click="showResetDialog = false">Подоцна</v-btn>
      <v-btn color="warning" variant="elevated" @click="redirectToForgot">Ресетирај</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Dialog after 7 failed attempts -->
<v-dialog v-model="showBlockedDialog" max-width="420" persistent transition="dialog-bottom-transition">
  <v-card class="pa-4">
    <v-card-title class="text-h6 font-weight-bold d-flex align-center text-error">
      <v-icon class="me-2" color="error" size="24">mdi-lock-alert</v-icon>
      Најавата е блокирана
    </v-card-title>
    <v-card-text class="text-white text-body-1 mt-2">
      Го надмина лимитот на обиди за најава.<br />
      За да продолжиш, мора да ја ресетираш лозинката.
    </v-card-text>
    <v-card-actions class="d-flex justify-end mt-2">
      <v-btn block color="error" variant="elevated" @click="redirectToForgot">
        Ресетирај лозинка
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>




      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'

const router = useRouter()
const form = ref({ email: '', password: '' })
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref('')

// NEW: login attempt tracking
const loginAttempts = ref(0)
const showResetDialog = ref(false)
const showBlockedDialog = ref(false)

const redirectToForgot = () => router.push('/forgot-password')
const redirectToRegister = () => router.push('/register')

const handleLogin = async () => {
  const auth = getAuth()
  loading.value = true
  errorMessage.value = ''

  // BLOCK after 7th attempt
  if (loginAttempts.value >= 7) {
    showBlockedDialog.value = true
    loading.value = false
    return
  }

  try {
    const persistence = rememberMe.value ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistence)

    await signInWithEmailAndPassword(auth, form.value.email, form.value.password)

    // success: reset attempts
    loginAttempts.value = 0
    router.push('/')
  } catch (err) {
    loginAttempts.value++

    switch (err.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Внеси валидна емајл адреса.'
        break
      case 'auth/user-not-found':
        errorMessage.value = 'Нема корисник со таа емајл адреса.'
        break
      case 'auth/wrong-password':
        errorMessage.value = 'Погрешна лозинка. Обиди се повторно.'
        break
      default:
        errorMessage.value = 'Погрешен емајл или лозинка. Обиди се повторно.'
        break
    }

    if (loginAttempts.value === 5) {
      showResetDialog.value = true
    }

    if (loginAttempts.value >= 7) {
      showBlockedDialog.value = true
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
.account-link {
  text-align: center;
  color: #ddd;
}
.account-link .link {
  color: #ffc107;
  cursor: pointer;
  font-weight: 600;
}
.account-link .link:hover {
  text-decoration: underline;
}

.remember-forgot {
  padding-inline: 4px;
}

.remember-forgot .link {
  color: #ffc107;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}

.remember-forgot .link:hover {
  text-decoration: underline;
}

.error-text {
  color: #ff5252;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: -16px;
}

.v-dialog .v-card {
  background-color: #2c2c2c;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

.v-card-title {
  align-items: center;
}

.v-card-text {
  line-height: 1.6;
}



</style>
