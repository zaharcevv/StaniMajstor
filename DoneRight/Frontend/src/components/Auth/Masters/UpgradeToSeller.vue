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
            Пополнете ги информациите за да станете мајстор.
          </v-card-subtitle>

          <v-form @submit.prevent="submitApplication" class="px-4">
            <v-text-field
              v-model="form.phone"
              label="Телефонски број"
              variant="outlined"
              density="comfortable"
              color="warning"
              class="mb-4"
              hide-details
              required
            />
            <v-select
              v-model="form.city"
              :items="cities"
              label="Град"
              variant="outlined"
              density="comfortable"
              color="warning"
              class="mb-4"
              hide-details
              required
            />

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <v-btn color="warning" block size="large" class="text-white font-weight-bold mt-2" type="submit">
              Поднеси
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
import { getAuth } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const router = useRouter()
const auth = getAuth()

const form = ref({
  phone: '',
  city: ''
})

const errorMessage = ref('')

const cities = ['Скопје', 'Битола', 'Тетово', 'Прилеп', 'Охрид']

const submitApplication = async () => {
  const user = auth.currentUser

  if (!user) {
    errorMessage.value = 'Мора да сте најавени.'
    return
  }

  const { phone, city } = form.value

  if (!phone || !city) {
    errorMessage.value = 'Пополнете ги сите полиња.'
    return
  }

  try {
    await updateDoc(doc(db, 'users', user.uid), {
      phone,
      city,
      isSeller: true
    })

    router.push('/success')
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Настана грешка. Обидете се повторно.'
  }
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

.v-card-subtitle {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}


.error-text {
  color: #ff5252;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 16px;
  margin-bottom: 8px;
  text-align: center;
}
</style>
