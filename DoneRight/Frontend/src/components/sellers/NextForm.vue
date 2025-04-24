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
              label="Изберете услуги (макс. 3)"
              multiple
              color="warning"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              :menu-props="{ maxHeight: '200' }"
              @update:modelValue="handleServiceChange"
              required
            />

            <v-text-field
              v-model="form.phone"
              label="Телефонски број"
              color="warning"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              required
            />

            <v-select
              v-model="form.city"
              :items="cities"
              label="Град"
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

    <!-- Dialog: Upgrade for more than 3 services -->
    <v-dialog v-model="showUpgradeDialog" max-width="420" persistent transition="dialog-bottom-transition">
      <v-card class="pa-4 upgrade-dialog">
        <v-card-title class="text-h6 font-weight-bold text-warning">
          Надградба потребна
        </v-card-title>
        <v-card-text class="text-white text-body-1 mt-2">
          Може да изберете најмногу 3 услуги бесплатно.<br />
          За повеќе, ве молиме контактирајте не за надградба на профилот.
        </v-card-text>
        <v-card-actions class="d-flex justify-end mt-3">
          <v-btn variant="text" class="text-white" @click="showUpgradeDialog = false">Затвори</v-btn>
          <v-btn color="warning" variant="elevated" @click="contactSupport">Контактирај не</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  service: [],
  description: '',
  experience: '',
  price: '',
  phone: '',
  city: '',
})

const availableServices = [
  'Електричар', 'Водоводџија', 'Каменорезец', 'Автомеханичар',
  'Дизајн на ентериери', 'Фотограф', 'Писател', 'Илустратор',
  'Консултант', 'Копирајтер', 'Преведувач', 'Графички Дизајн',
  'Брендинг Специјалист', 'Видео Продуцент', 'Друго'
]

const cities = [
  'Скопје', 'Битола', 'Тетово', 'Куманово', 'Прилеп', 'Охрид', 'Гостивар', 'Штип',
  'Кавадарци', 'Велес', 'Кочани', 'Струмица', 'Гевгелија', 'Кичево', 'Струга',
  'Неготино', 'Ресен', 'Кратово', 'Крива Паланка', 'Дебар', 'Берово', 'Делчево',
  'Виница', 'Пробиштип', 'Свети Николе', 'Богданци', 'Валандово', 'Демир Хисар',
  'Македонски Брод', 'Крушево', 'Пехчево', 'Радовиш'
]

const showUpgradeDialog = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const handleServiceChange = (selected) => {
  if (selected.length > 3) {
    form.value.service = selected.slice(0, 3)
    showUpgradeDialog.value = true
    return
  }
  form.value.service = selected
}

const submitMasterProfile = async () => {
  errorMessage.value = ''
  loading.value = true

  const { service, description, experience, price, phone, city } = form.value

  // Валидација за сите полиња
  if (!service.length || !description || !experience || !price || !phone || !city) {
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
    const docRef = await addDoc(collection(db, 'services'), {
      ...form.value,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    })

    console.log('Service added with ID:', docRef.id)

    await updateDoc(doc(db, 'users', user.uid), { isSeller: true })

    router.push('/success')
  } catch (e) {
    console.error('Error:', e)
    errorMessage.value = 'Настана грешка. Обидете се повторно.'
  } finally {
    loading.value = false
  }
}


const redirectToPreviousForm = () => {
  router.push('/')
}

const contactSupport = () => {
  router.push('/upgrade')
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
.upgrade-dialog {
  background-color: #2c2c2c;
  border-radius: 16px;
}
.error-text {
  color: #ff5252;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
