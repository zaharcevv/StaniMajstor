<template>
  <v-app>
    <div class="edit-wrapper">
      <v-card class="edit-card pa-6" max-width="500" elevation="10">
        <h2 class="text-h6 font-weight-bold text-center text-yellow mb-6">Уреди услуга</h2>

        <v-text-field
          v-model="form.description"
          label="Опис"
          variant="outlined"
          color="warning"
          class="mb-4"
          hide-details
        />

        <v-text-field
          v-model="form.price"
          label="Цена ($)"
          type="number"
          variant="outlined"
          color="warning"
          class="mb-4"
          hide-details
        />

        <v-file-input
          v-model="form.images"
          label="Додади слики (макс. 5)"
          multiple
          show-size
          accept="image/*"
          prepend-icon="mdi-camera"
          :counter="5"
          :rules="[v => (v?.length || 0) <= 5 || 'Максимум 5 слики']"
          variant="outlined"
          color="warning"
          class="mb-4"
          hide-details
        />

        <div class="preview-wrapper mb-4">
          <v-img
            v-for="(img, i) in previewImages"
            :key="i"
            :src="img"
            height="100"
            width="100"
            class="mr-2 rounded"
            cover
          />
        </div>

        <v-btn color="warning" block class="text-black font-weight-bold" @click="submitForm">
          Зачувај промени
        </v-btn>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const form = ref({
  description: '',
  price: '',
  images: []
})
const previewImages = ref([])

const serviceId = route.params.id

onMounted(async () => {
  const docRef = doc(db, 'services', serviceId)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    const data = snap.data()
    form.value.description = data.description || ''
    form.value.price = data.price || ''
    previewImages.value = data.images || []
  }
})

watch(() => form.value.images, (val) => {
  if (val && val.length) {
    previewImages.value = Array.from(val).map(file => URL.createObjectURL(file))
  }
})

const submitForm = async () => {
  const docRef = doc(db, 'services', serviceId)
  await updateDoc(docRef, {
    description: form.value.description,
    price: form.value.price,
    // Uploading images to storage should go here
  })
  router.push('/seller-dashboard')
}
</script>

<style scoped>
.edit-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #121212;
  font-family: 'Inter', sans-serif;
}

.edit-card {
  background: #212121;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
  color: white;
}

.preview-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>