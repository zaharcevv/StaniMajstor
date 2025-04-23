<template>
  <v-app>
    <div class="background">
      <div class="overlay"></div>
      <v-container class="form-container" fluid>
        <v-card class="form-card" elevation="10">
          <v-card-title class="text-center text-yellow-darken-2 text-h5 font-weight-bold">
            Изберете Услуга
          </v-card-title>
          <v-card-subtitle class="text-center mb-7 text-white">
            Изберете што нудите и додадете детали за себе.
          </v-card-subtitle>

          <v-form @submit.prevent="submitMasterProfile" class="px-4">
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
              label="Краток опис за вас"
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
              class="mb-5"
              required
            />

            <v-btn
              type="submit"
              color="warning"
              class="mt-2"
              block
              size="large"
            >
              Поднеси профил
            </v-btn>

            <v-btn
              @click="redirectToPreviousForm"
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
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore'
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
  'Електричар',
  'Водоводџија',
  'Каменорезец',
  'Автомеханичар',
  'Дизајн на ентериери',
  'Фотограф',
  'Писател',
  'Илустратор',
  'Консултант',
  'Копирајтер',
  'Преведувач',
  'Графички Дизајн',
  'Брендинг Специјалист',
  'Видео Продуцент',
  'Друго',
]

const submitMasterProfile = async () => {
  if (!form.value.service) {
    alert('Изберете услуга.')
    return
  }

  const user = auth.currentUser
  if (!user) {
    alert('User is not logged in')
    return
  }

  try {
    // 1. Add service
    const docRef = await addDoc(collection(db, 'services'), {
      ...form.value,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    })
    console.log('Service added with ID:', docRef.id)

    // 2. Update user profile to set isSeller: true
    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, { isSeller: true })

    // 3. Redirect
    router.push('/success')
  } catch (e) {
    console.error('Error:', e)
    alert('Настана грешка. Обидете се повторно.')
  }
}

const redirectToPreviousForm = () => {
  router.push('/apply')
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
</style>
