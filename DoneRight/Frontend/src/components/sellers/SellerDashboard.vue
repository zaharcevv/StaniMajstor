<template>
  <v-app>
    <div class="layout-wrapper">
      <!-- Sidebar, AppBar ... како што веќе имаш -->

      <v-main class="main-area">
        <v-container fluid>
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
              <p>Сѐ уште немате објавено ниедна услуга.</p>
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

          <!-- Chart (Activity Overview Placeholder) -->
          <div class="section">
            <h2 class="section-title">Активности</h2>
            <v-sheet height="200" class="chart-placeholder d-flex align-center justify-center">
              <p class="text-grey">📊 Тука можеш да вметнеш график за активности (bar/line chart)</p>
            </v-sheet>
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

    // Fetch city from users collection
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

// ✅ Fetch user services on mount if logged in
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
  background: #121212;
  min-height: 100vh;
  padding: 30px 20px;
}

.dashboard-title {
  font-size: 2.2rem;
  color: #ffc107;
  font-weight: 800;
  margin-bottom: 30px;
}

.section {
  margin-top: 40px;
}

.section-title {
  font-size: 1.4rem;
  color: #ffc107;
  font-weight: bold;
  margin-bottom: 16px;
}

.stat-card {
  background: #1e1e1e;
  border-radius: 14px;
  padding: 20px;
  color: white;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.95rem;
  color: #bbb;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  background-color: #1f1f1f;
}

.status-text {
  font-size: 1.2rem;
  color: #4caf50;
  font-weight: bold;
}

.status-sub {
  color: #ccc;
  font-size: 0.8rem;
}

.review-card {
  background-color: #1a1a1a;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-placeholder {
  background: #1c1c1c;
  border-radius: 12px;
}

.my-service-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
  transition: transform 0.3s ease;
}
.my-service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.15);
}

</style>
