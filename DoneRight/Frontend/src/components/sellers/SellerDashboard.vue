<template>
  <v-app>
    <!-- Topbar -->
    <v-app-bar flat color="#212121">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="logo-title">
  <span class="logo-text">DoneRight</span>
</v-toolbar-title>




      <v-spacer></v-spacer>

      <!-- User Profile Right -->
      <div class="d-flex align-center">
        <span class="text-white font-weight-medium mr-3">{{ firstName }}</span>
        <v-avatar size="36" class="mr-3">
          <v-img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
        </v-avatar>
      </div>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
  v-model="drawer"
  app
  color="#1c1c1c"
  dark
  class="drawer-style"
  :permanent="!$vuetify.display.smAndDown"
>
  <v-list dense nav>
    <!-- <v-divider class="my-4" /> -->
    <v-list-item
  v-for="item in menuItems"
  :key="item.title"
  link
  class="drawer-item"
  @click="router.push(item.route)"
>
  <v-row no-gutters align="center">
    <v-col cols="auto">
      <v-icon :color="item.color" size="26">{{ item.icon }}</v-icon>
    </v-col>
    <v-col>
      <v-list-item-title class="drawer-text">{{ item.title }}</v-list-item-title>
    </v-col>
  </v-row>
</v-list-item>

  </v-list>
</v-navigation-drawer>


    <!-- Main Content -->
    <v-main class="background-main">
      <v-container fluid>
        <h1 class="main-heading">Добредојде назад, {{ firstName }} 👋</h1>

        <!-- Metrics -->
        <v-row class="mb-8">
          <v-col cols="12" md="4" v-for="metric in metrics" :key="metric.title">
            <v-card class="card-metric">
              <v-card-text class="text-center">
                <v-icon :color="metric.color" size="40">{{ metric.icon }}</v-icon>
                <h3 class="metric-value mt-2">{{ metric.value }}</h3>
                <div class="metric-title">{{ metric.title }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- My Services -->
        <section>
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="section-title">Мои Услуги</h2>
            <v-btn color="warning" class="font-weight-bold" @click="router.push('/next-form')">
              Додади Услуга
            </v-btn>
          </div>

          <v-row v-if="userServices.length" dense>
            <v-col cols="12" sm="6" md="4" v-for="service in userServices" :key="service.id">
              <v-card class="card-service">
                <v-card-title class="text-yellow font-weight-bold">{{ service.service || 'Без име' }}</v-card-title>
                <v-card-text>
                  <p><strong>Опис:</strong> {{ service.description || 'Нема опис' }}</p>
                  <p><strong>Град:</strong> {{ service.location || 'Непознато' }}</p>
                  <p><strong>Цена:</strong> {{ service.price || 'Н/П' }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn variant="text" color="yellow" @click="router.push(`/edit-service/${service.id}`)">Уреди</v-btn>
                  <v-btn variant="text" color="error" @click="deleteService(service.id)">Избриши</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-else justify="center">
            <v-col cols="12" class="text-center text-grey">
              <v-icon size="48" class="mb-2">mdi-wrench</v-icon>
              <p>Немате објавено ниедна услуга.</p>
            </v-col>
          </v-row>
        </section>

        <!-- Reviews -->
        <section class="mt-12">
          <h2 class="section-title">Рецензии</h2>
          <v-row>
            <v-col cols="12" sm="6" md="4" v-for="review in reviews" :key="review.id">
              <v-card class="card-review">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>{{ review.name }}</strong>
                    <v-rating :value="review.rating" dense readonly color="yellow-darken-2" />
                  </div>
                  <p class="text-white">{{ review.comment }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </section>

      </v-container>
    </v-main>
</v-app>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useDisplay } from 'vuetify' // 📦 додадено

const router = useRouter()
const { smAndDown } = useDisplay()

const drawer = ref(!smAndDown.value) // 🛠️ затворен ако е мал екран
watch(smAndDown, (val) => {
  drawer.value = !val
})
const firstName = ref('Мајсторе')
const reviews = ref([])
const userServices = ref([])

const menuItems = [
  { title: 'Почетна', icon: 'mdi-view-dashboard', color: 'yellow', route: '/' },
  { title: 'Профил', icon: 'mdi-account', color: 'yellow', route: '/user-profile' },
  { title: 'Поставки', icon: 'mdi-cog', color: 'yellow', route: '/settings' },
  { title: 'Одјави се', icon: 'mdi-logout', color: 'red', route: '/logout' } // 🛠️ NEW
]


const metrics = [
  { title: 'Приходи', value: '$2,340', icon: 'mdi-cash', color: 'green' },
  { title: 'Завршени задачи', value: '14', icon: 'mdi-check-circle', color: 'yellow-darken-2' },
  { title: 'Активни понуди', value: '3', icon: 'mdi-briefcase-outline', color: 'blue' }
]

const fetchUserServices = async (uid) => {
  const q = query(collection(db, 'services'), where('userId', '==', uid))
  const snapshot = await getDocs(q)
  userServices.value = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
}

const fetchUserReviews = async (uid) => {
  const q = query(collection(db, 'reviews'), where('sellerId', '==', uid))
  const snapshot = await getDocs(q)
  reviews.value = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
}

const deleteService = async (id) => {
  await deleteDoc(doc(db, 'services', id))
  userServices.value = userServices.value.filter(service => service.id !== id)
}

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      firstName.value = user.displayName || 'Мајсторе'
      fetchUserServices(user.uid)
      fetchUserReviews(user.uid)
    }
  })
})
</script>

<style scoped>
.background-main {
  background: linear-gradient(135deg, #181818, #121212);
  min-height: 100vh;
  padding-top: 60px;
}

.drawer-style {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.main-heading {
  font-size: 2.5rem;
  color: #ffc107;
  font-weight: 900;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ffc107;
}

.card-metric {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 24px;
  color: white;
  text-align: center;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 8px;
}

.metric-title {
  color: #bbb;
  font-size: 1rem;
  margin-top: 4px;
}

.card-service {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px;
  color: white;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.card-service:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(255, 193, 7, 0.2);
}

.card-review {
  background: rgba(255, 255, 255, 0.04);
  padding: 20px;
  border-radius: 14px;
  backdrop-filter: blur(8px);
  color: white;
  transition: 0.3s;
}

.card-review:hover {
  transform: translateY(-3px);
}

.logo-title {
  flex: 0 1 auto !important;
  min-width: unset !important;
  max-width: unset !important;
  overflow: visible !important;
}

.logo-text {
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;
  font-style: italic;
  font-weight: 700;
  font-size: 1.7rem;
  color: #ffc107;
  animation: fadeInLogo 1.2s ease forwards;
  opacity: 0;
  transform: translateY(-8px);
}



/* Animation Keyframes */
@keyframes fadeInLogo {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffc107;
  margin-top: 20px;
  margin-bottom: 20px;
  font-style: italic;
  letter-spacing: 1px;
}

.drawer-brand {
  margin-left: 8px;
}

.drawer-item {
  padding: 12px 16px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.drawer-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.drawer-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: white;
  margin-left: 12px; /* мала дистанца помеѓу иконата и текстот */
}



</style>
