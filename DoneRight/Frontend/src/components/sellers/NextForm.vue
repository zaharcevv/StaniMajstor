<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="10">
          <v-card-title class="text-center text-yellow-darken-2 text-h5 font-weight-bold">
            Додади Услуга
          </v-card-title>
          <v-card-subtitle class="text-center mb-7 text-white">
            Пополнете ги деталите за новата услуга.
          </v-card-subtitle>

          <v-form @submit.prevent="submitService" class="px-4">
            <v-select
              v-model="form.service"
              :items="availableServices"
              label="Изберете услуга"
              color="warning"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              required
            />

            <v-text-field
              v-model="form.description"
              label="Краток опис за услугата"
              color="warning"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              required
            />

            <v-text-field
              v-model="form.experience"
              label="Искуство (години)"
              type="number"
              color="warning"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              required
            />

            <v-text-field
              v-model="form.price"
              label="Цена за услуга ($)"
              type="number"
              color="warning"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-3"
              required
            />

            <!-- Error message -->
            <p v-if="errorMessage" class="error-text text-center mt-4 mb-4">
              {{ errorMessage }}
            </p>

            <v-btn
              type="submit"
              color="warning"
              class="mt-2"
              block
              size="large"
              :loading="loading"
            >
              Поднеси Услуга
            </v-btn>

            <v-btn
              @click="redirectBack"
              class="mt-2"
              block
              variant="text"
              color="white"
            >
              Назад
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()

const form = ref({
  service: '',
  description: '',
  experience: '',
  price: '',
})

const availableServices = [
  'Електричар', 'Водоводџија', 'Каменорезец', 'Автомеханичар',
  'Дизајн на ентериери', 'Фотограф', 'Писател', 'Илустратор',
  'Консултант', 'Копирајтер', 'Преведувач', 'Графички Дизајн',
  'Брендинг Специјалист', 'Видео Продуцент', 'Друго'
]

const errorMessage = ref('')
const loading = ref(false)

const submitService = async () => {
  errorMessage.value = ''
  loading.value = true

  const { service, description, experience, price } = form.value

  if (!service || !description || !experience || !price) {
    errorMessage.value = 'Ве молиме пополнете ги сите полиња.'
    loading.value = false
    return
  }

  const user = auth.currentUser
  if (!user) {
    errorMessage.value = 'Корисникот не е најавен.'
    loading.value = false
    return
  }

  try {
    await addDoc(collection(db, 'services'), {
      ...form.value,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    })

    router.push('/success-service')
  } catch (e) {
    console.error('Error:', e)
    errorMessage.value = 'Настана грешка. Обидете се повторно.'
  } finally {
    loading.value = false
  }
}

const redirectBack = () => {
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
  backdrop-filter: blur(8px);
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
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 24px 16px;
  max-width: 420px;
  width: 100%;
  color: white;
}
.error-text {
  color: #ff5252;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
