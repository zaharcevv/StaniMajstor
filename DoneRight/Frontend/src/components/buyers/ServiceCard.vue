<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase'

const router = useRouter()
const services = ref([])
const favorites = ref([])
const isLoading = ref(true)

const searchName = ref('')
const searchService = ref('')
const searchCity = ref('')
const currentPage = ref(1)
const itemsPerPage = 4
const userDocId = ref(null)
const dialog = ref(false) // 🔔 Дијалог за најавување

const allServices = ['Електричар', 'Водоводџија', 'Молер', 'Механичар', 'Дрводелец', 'Техничар', 'Инженер', 'Монтер', 'Чистач']
const cities = ['Скопје', 'Битола', 'Тетово', 'Куманово', 'Прилеп', 'Охрид', 'Гостивар', 'Штип', 'Кавадарци', 'Велес']

const filteredServicesList = computed(() =>
  services.value.filter(s =>
    (!searchCity.value || s.location === searchCity.value) &&
    (!searchService.value || String(s.job || '').toLowerCase().includes(searchService.value.toLowerCase())) &&
    (!searchName.value || `${s.name} ${s.lastName}`.toLowerCase().includes(searchName.value.toLowerCase()))
  )
)

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredServicesList.value.slice(start, start + itemsPerPage)
})

const pageCount = computed(() =>
  Math.ceil(filteredServicesList.value.length / itemsPerPage)
)

const getJobIcon = (job) => {
  const icons = {
    'Електричар': '⚡', 'Водоводџија': '🔧', 'Дрводелец': '🪚', 'Механичар': '🔩'
  }
  return icons[job] || '💼'
}

const toggleFavorite = async (service) => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  if (!currentUser) {
    dialog.value = true // 👈 Прикажи дијалог ако не е најавен
    return
  }

  if (!userDocId.value) return

  const userRef = doc(db, 'users', userDocId.value)
  const currentFavorites = [...favorites.value]
  const index = currentFavorites.indexOf(service.id)

  if (index === -1) {
    currentFavorites.push(service.id)
    favorites.value.push(service.id)
  } else {
    currentFavorites.splice(index, 1)
    favorites.value = favorites.value.filter(id => id !== service.id)
  }

  await updateDoc(userRef, { favourites: currentFavorites })
}

const isFavorite = (service) => favorites.value.includes(service.id)

const goToDetails = (service) => {
  router.push({ path: `/service/${service.id}` })
}

const loadUserFavorites = async (uid) => {
  const userQuery = query(collection(db, 'users'), where('uid', '==', uid))
  const userSnap = await getDocs(userQuery)

  if (!userSnap.empty) {
    const userDoc = userSnap.docs[0]
    userDocId.value = userDoc.id
    favorites.value = userDoc.data().favourites || []
  }
}

const loadServices = async () => {
  isLoading.value = true
  try {
    const serviceSnapshot = await getDocs(collection(db, 'services'))

    const enriched = await Promise.all(serviceSnapshot.docs.map(async docSnap => {
      const data = docSnap.data()
      const uid = data.userId

      let firstName = 'Име'
      let lastName = ''
      let image = new URL('@/assets/lok.png', import.meta.url).href
      let location = 'Непознато'

      if (uid) {
        const q = query(collection(db, 'users'), where('uid', '==', uid))
        const userSnap = await getDocs(q)
        if (!userSnap.empty) {
          const user = userSnap.docs[0].data()
          firstName = user.firstName || firstName
          lastName = user.lastName || lastName
          image = user.image || image
          location = user.city || location
        }

        const picSnap = await getDoc(doc(db, 'userProfilePictures', uid))
        if (picSnap.exists()) {
          const picData = picSnap.data()
          if (picData.profilePicture) {
            image = picData.profilePicture
          }
        }
      }

      return {
        id: docSnap.id,
        name: firstName,
        lastName,
        job: data.service || 'Услуга',
        image,
        location,
        rating: 5
      }
    }))

    services.value = enriched
  } catch (error) {
    console.error('Error loading services:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  const auth = getAuth()
  await loadServices()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loadUserFavorites(user.uid)
    }
  })
})
</script>



<template>
  <v-app>
    <section class="search-section">
      <v-container>
        <div class="header text-center mb-5 animate-header">
          <h1 class="main-title">Најди Мајстор</h1>
          <p class="subtitle-text">Пронајди професионалци по локација и услуга</p>
        </div>

        <!-- Name Search Field -->
        <v-row justify="center" class="compact-gap" >
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchName"
              label="Пребарај по име"
              density="comfortable"
              variant="outlined"
              color="warning"
              prepend-inner-icon="mdi-account-search"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row justify="center" class="mb-3 gap-inputs" >
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="searchService"
              :items="allServices"
              label="Тип на услуга"
              density="comfortable"
              variant="outlined"
              color="warning"
              hide-no-data
              clearable
              menu-icon="mdi-chevron-down"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="searchCity"
              :items="cities"
              label="Одбери град"
              density="comfortable"
              variant="outlined"
              color="warning"
              clearable
              menu-icon="mdi-chevron-down"
            />
          </v-col>
        </v-row>

        <!-- Service Cards -->
        <v-row v-if="paginatedServices.length">
          <v-col
            v-for="service in paginatedServices"
            :key="service.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="profile-card"
                elevation="8"
                :class="{ 'hovered': isHovering }"
              >
                <v-img :src="service.image" height="260px" cover />
                <v-card-text>
                  <div class="d-flex justify-space-between align-center mb-1">
                    <h3 class="text-yellow text-subtitle-1 font-weight-bold">
                      {{ service.name }} {{ service.lastName }}
                    </h3>
                    <v-btn icon variant="plain" @click="toggleFavorite(service)">
                      <v-icon :color="isFavorite(service) ? 'yellow' : 'grey'">mdi-star</v-icon>
                    </v-btn>
                  </div>
                  <div class="text-grey-lighten-2 text-body-2 mb-1">📍 {{ service.location }}</div>
                  <div class="text-white text-body-2 mb-1">{{ getJobIcon(service.job) }} {{ service.job }}</div>
                  <div class="text-white text-body-2 mb-3">⭐ {{ service.rating }}/5</div>
                  <v-btn
                    block
                    color="warning"
                    class="font-weight-bold text-black"
                    @click="goToDetails(service)"
                  >
                    Контактирај ме
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <!-- No Results -->
        <v-row v-else justify="center" class="text-center mt-10">
          <v-col cols="12">
            <v-icon size="64" color="grey-lighten-1" class="mb-2 bounce">mdi-account-search</v-icon>
            <h3 class="text-grey-lighten-1">Нема пронајдени мајстори</h3>
            <p class="text-grey-lighten-1">Промени ги филтрите и пробај повторно</p>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <v-row justify="center" class="mt-6">
          <v-pagination
            v-model="currentPage"
            :length="pageCount"
            color="yellow-darken-2"
            total-visible="5"
          />
        </v-row>
      </v-container>

      <v-dialog v-model="dialog" max-width="420" transition="dialog-bottom-transition">
  <v-card class="pa-4">
    <v-card-title class="text-h6 font-weight-bold d-flex align-center text-warning">
      <v-icon class="me-2" color="warning" size="24">mdi-alert-circle-outline</v-icon>
      Најава потребна
    </v-card-title>
    <v-card-text class="text-white text-body-1 mt-2">
      Мора да сте најавени за да додадете мајстор во омилени.
      Ве молиме најавете се или креирајте профил.
    </v-card-text>
    <v-card-actions clas  s="d-flex justify-end">
      <v-btn variant="text" color="white" @click="dialog = false">Подоцна</v-btn>
      <v-btn color="warning" variant="elevated" @click="router.push('/login')">Најави се</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



    </section>
  </v-app>
</template>

<style scoped>
.search-section {
  background: linear-gradient(135deg, #1c1c1c, #101010);
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 60px;
  color: white;
}

.header {
  padding-top: 10px;
  animation: fadeInUp 1s ease-out;
}

.main-title {
  font-size: 3.4rem;
  font-weight: 900;
  color: #ffc107;
  text-shadow: 0 0 12px rgba(255, 193, 7, 0.4), 0 0 24px rgba(255, 193, 7, 0.2);
  letter-spacing: -1px;
}

.subtitle-text {
  color: #bbb;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 720px;
  margin: 0 auto;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  color: white;
}

.profile-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 12px 24px rgba(255, 193, 7, 0.3);
}

.bounce {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.compact-gap {
  margin-bottom: -35px;
}

.v-dialog .v-card {
  background-color: #2c2c2c;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}


</style>
