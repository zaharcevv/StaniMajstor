<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="10">
          <v-card-title class="text-center text-yellow-darken-2 text-h5 font-weight-bold">
            Стани Мајстор
          </v-card-title>
          <v-card-subtitle class="text-center mb-6 text-white">
            Придружете се и споделете ги вашите знаења со нас.
          </v-card-subtitle>

          <v-form @submit.prevent="nextStep" class="px-4">
            <template v-if="step === 1">
              <v-text-field v-model="form.firstName" label="Име" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-text-field v-model="form.lastName" label="Презиме" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-text-field v-model="form.email" label="Емајл адреса" type="email" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-text-field v-model="form.password" label="Лозинка" type="password" variant="outlined" density="comfortable" color="warning" class="mb-5" hide-details required />
              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
              <v-btn type="submit" color="warning" block size="large" class="text-white font-weight-bold">
                Продолжи
              </v-btn>
            </template>

            <template v-else-if="step === 2">
              <v-select v-model="form.service" :items="availableServices" label="Изберете услуга" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-text-field v-model="form.phone" label="Телефонски број" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-select v-model="form.city" :items="cities" label="Град" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-text-field v-model="form.description" label="Краток опис за вас" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-text-field v-model="form.experience" label="Искуство (години)" type="number" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />
              <v-text-field v-model="form.price" label="Цена за услуга ($)" type="number" variant="outlined" density="comfortable" color="warning" class="mb-4" hide-details required />

              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
              <v-btn @click="goBack" block variant="text" class="text-white">Назад</v-btn>
              <v-btn type="button" color="warning" block size="large" class="text-white font-weight-bold mt-2" @click="submitApplication">
                Поднеси
              </v-btn>
            </template>

            <div v-if="step === 1" class="account-link text-white text-caption mt-4">
              Имате веќе сметка?
              <span class="link" @click="redirectToLogin">Логирајте се тука</span>
            </div>
          </v-form>
        </v-card>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const router = useRouter()
const step = ref(1)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  service: '',
  description: '',
  experience: '',
  price: '',
  phone: '',
  city: '',
})

const errorMessage = ref('')

const availableServices = [
  'Електричар', 'Водоводџија', 'Каменорезец', 'Автомеханичар',
  'Фотограф', 'Графички дизајн', 'Преведувач'
]

const cities = ['Скопје', 'Битола', 'Тетово', 'Прилеп', 'Охрид']

const nextStep = () => {
  const { firstName, lastName, email, password } = form.value
  if (!firstName || !lastName || !email || !password) {
    errorMessage.value = 'Пополнете ги сите полиња.'
    return
  }
  if (!email.includes('@')) {
    errorMessage.value = 'Внеси валидна емајл адреса.'
    return
  }
  if (password.length < 6) {
    errorMessage.value = 'Лозинката мора да има минимум 6 карактери.'
    return
  }
  errorMessage.value = ''
  step.value++
}

const goBack = () => {
  errorMessage.value = ''
  step.value--
}

const submitApplication = async () => {
  const { firstName, lastName, email, password, service, description, experience, price, phone, city } = form.value
  if (!service || !description || !experience || !price || !phone || !city) {
    errorMessage.value = 'Пополнете ги сите полиња.'
    return
  }

  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    })

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      firstName,
      lastName,
      phone,
      city,
      isSeller: true
    })

    await setDoc(doc(db, 'services', user.uid), {
      userId: user.uid,
      service,
      description,
      experience,
      price,
      createdAt: new Date()
    })

    router.push('/success')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'Оваа емајл адреса веќе е користена.'
    } else {
      errorMessage.value = 'Грешка при регистрација: ' + error.message
    }
  }
}

const redirectToLogin = () => {
  router.push('/login')
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
.error-text {
  color: #ff5252;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 8px;
  margin-bottom: 20px;
  text-align: center;
}
.account-link {
  text-align: center;
}
.account-link .link {
  color: #ffc107;
  cursor: pointer;
  font-weight: 600;
}
.account-link .link:hover {
  text-decoration: underline;
}
</style>
