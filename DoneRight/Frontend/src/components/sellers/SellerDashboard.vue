<template>
  <v-app>
    <div class="layout-wrapper d-flex">
      <!-- Sidebar -->
      <v-navigation-drawer app v-model="drawer" class="sidebar" color="#1e1e1e" width="240">
        <v-list dense>
          <v-list-item @click="router.push('/')">
            <v-list-item-icon><v-icon color="yellow">mdi-view-dashboard</v-icon></v-list-item-icon>
            <v-list-item-title class="text-white">Дашборд</v-list-item-title>
          </v-list-item>
          <v-list-item @click="router.push('/profile')">
            <v-list-item-icon><v-icon color="yellow">mdi-account</v-icon></v-list-item-icon>
            <v-list-item-title class="text-white">Профил</v-list-item-title>
          </v-list-item>
          <v-list-item @click="router.push('/logout')">
            <v-list-item-icon><v-icon color="red">mdi-logout</v-icon></v-list-item-icon>
            <v-list-item-title class="text-white">Одјави се</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="main-area">
        <v-container fluid>
          <v-btn icon @click="drawer = !drawer" class="mb-4">
            <v-icon color="white">mdi-menu</v-icon>
          </v-btn>
          <h1 class="dashboard-title">Добредојде назад, {{ username }} 👋</h1>

          <!-- Status & Quick Info -->
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-card class="stat-card status-card">
                <v-icon size="28" color="green">mdi-checkbox-marked-circle-outline</v-icon>
                <div>
                  <h4 class="status-text">Онлајн</h4>
                  <p class="status-sub">Статус на достапност</p>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3" v-for="metric in metrics" :key="metric.title">
              <v-card class="stat-card">
                <v-icon :color="metric.color" size="28" class="mb-2">{{ metric.icon }}</v-icon>
                <h3 class="stat-number">{{ metric.value }}</h3>
                <p class="stat-label">{{ metric.title }}</p>
              </v-card>
            </v-col>
          </v-row>

          <!-- My Services -->
          <section class="my-services mt-10">
            <div class="d-flex justify-space-between align-center mb-4">
              <h2 class="section-title">Мои објавени услуги</h2>
              <v-btn color="warning" @click="router.push('/next-form')">
                ➕ Објави нова услуга
              </v-btn>
            </div>

            <v-row v-if="userServices.length" dense>
              <v-col
                v-for="service in userServices"
                :key="service.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card class="my-service-card" elevation="6">
                  <v-card-title class="text-yellow font-weight-bold">
                    {{ service.service || 'Без име' }}
                  </v-card-title>
                  <v-card-text>
                    <div><strong>Опис:</strong> {{ service.description || 'Немате внесено опис' }}</div>
                    <div><strong>Град:</strong> {{ service.location || 'Непознато' }}</div>
                    <div><strong>Цена:</strong> {{ service.price || 'Н/П' }}</div>
                    <v-btn class="mt-3" variant="text" color="warning" @click="router.push(`/edit-service/${service.id}`)">
                      Уреди услуга / Слики
                    </v-btn>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="error" variant="tonal" @click="deleteService(service.id)">
                      Избриши
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <v-row v-else justify="center" class="mt-6">
              <v-col cols="12" class="text-center text-grey">
                <v-icon size="48" class="mb-2">mdi-wrench</v-icon>
                <p>Сё уште немате објавено ниедна услуга.</p>
              </v-col>
            </v-row>
          </section>

          <!-- Upcoming Jobs -->
          <div class="section">
            <h2 class="section-title">Закажани работи</h2>
            <v-table class="custom-table">
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th>Услуга</th>
                  <th>Датум</th>
                  <th>Локација</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in upcomingJobs" :key="job.id">
                  <td>{{ job.client }}</td>
                  <td>{{ job.service }}</td>
                  <td>{{ job.date }}</td>
                  <td>{{ job.location }}</td>
                  <td><v-chip :color="job.statusColor" small>{{ job.status }}</v-chip></td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <!-- Reviews -->
          <div class="section">
            <h2 class="section-title">Најнови рецензии</h2>
            <v-row>
              <v-col cols="12" sm="6" md="4" v-for="r in latestReviews" :key="r.name">
                <v-card class="review-card">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <strong>{{ r.name }}</strong>
                    <v-rating :value="r.rating" readonly dense color="yellow-darken-2" />
                  </div>
                  <p class="text-white">{{ r.comment }}</p>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'

const router = useRouter()
const drawer = ref(true)

const username = 'Мајсторе'

const metrics = [
  { title: 'Приходи овој месец', value: '$2,340', icon: 'mdi-cash', color: 'green' },
  { title: 'Завршени задачи', value: '14', icon: 'mdi-check-circle', color: 'yellow-darken-2' },
  { title: 'Активни понуди', value: '3', icon: 'mdi-briefcase-outline', color: 'blue' }
]

const upcomingJobs = [
  { id: 1, client: 'Јана', service: 'Електричар', date: '25.04.2025', location: 'Скопје', status: 'Потврдено', statusColor: 'green' },
  { id: 2, client: 'Марко', service: 'Водовод', date: '27.04.2025', location: 'Битола', status: 'Во тек', statusColor: 'blue' }
]

const latestReviews = [
  { name: 'Стефан', rating: 5, comment: 'Супер работа, професионално и брзо!' },
  { name: 'Марија', rating: 4, comment: 'Малку доцнеше, но добра изведба.' }
]

const userServices = ref([])

const fetchUserServices = async (uid) => {
  const q = query(collection(db, 'services'), where('userId', '==', uid))
  const snapshot = await getDocs(q)

  const enriched = await Promise.all(snapshot.docs.map(async (docSnap) => {
    const serviceData = docSnap.data()
    let city = 'Непознато'

    try {
      const userQuery = query(collection(db, 'users'), where('uid', '==', uid))
      const userSnap = await getDocs(userQuery)
      if (!userSnap.empty) {
        city = userSnap.docs[0].data().city || city
      }
    } catch (error) {
      console.error('Error fetching city:', error)
    }

    return {
      id: docSnap.id,
      ...serviceData,
      location: city
    }
  }))

  userServices.value = enriched
}

const deleteService = async (id) => {
  await deleteDoc(doc(db, 'services', id))
  userServices.value = userServices.value.filter(s => s.id !== id)
}

onMounted(() => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    fetchUserServices(user.uid)
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserServices(user.uid)
      }
    })
  }
})
</script>

<style scoped>
.layout-wrapper {
  background: linear-gradient(135deg, #121212, #1b1b1b);
  min-height: 100vh;
  padding: 40px 24px;
  font-family: 'Inter', sans-serif;
}

.dashboard-title {
  font-size: 2.8rem;
  color: #ffc107;
  font-weight: 900;
  margin-bottom: 40px;
  letter-spacing: -0.5px;
  text-shadow: 0 0 6px rgba(255, 193, 7, 0.2);
}

.section {
  margin-top: 50px;
}

.section-title {
  font-size: 1.6rem;
  color: #ffc107;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 24px;
  text-align: center;
  color: white;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3);
  transition: all 0.25s ease;
}

.stat-card:hover {
  transform: scale(1.02);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin: 8px 0;
}

.stat-label {
  font-size: 1rem;
  color: #ccc;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  background-color: #1f1f1f;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
}

.status-text {
  font-size: 1.3rem;
  color: #4caf50;
  font-weight: 700;
}

.status-sub {
  font-size: 0.85rem;
  color: #aaa;
}

.my-service-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 16px;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}

.my-service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgba(255, 193, 7, 0.2);
}

.review-card {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.chart-placeholder {
  background: #1c1c1c;
  border-radius: 14px;
  color: #999;
  text-align: center;
  font-style: italic;
}

</style>
