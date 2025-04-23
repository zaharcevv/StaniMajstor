<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getDoc, doc, getDocs, query, collection, where, updateDoc, arrayUnion } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "@/firebase"
import DefaultLayout from "@/layouts/DefaultLayout.vue"

const route = useRoute()
const router = useRouter()

const service = ref(null)
const userInfo = ref(null)
const loading = ref(true)
const currentUser = ref(null)

const newReviewText = ref("")
const newRating = ref(5)
const showReviewForm = ref(false)
const reviews = ref([])

const portfolioImages = [
  new URL('@/assets/workers.png', import.meta.url).href,
  new URL('@/assets/workers.png', import.meta.url).href
]

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  return reviews.value.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.value.length
})

const availability = "Онлајн"
const fallbackImage = new URL('@/assets/lok.png', import.meta.url).href

const profileImage = computed(() => {
  return userInfo.value?.image || fallbackImage
})

const goBack = () => {
  router.push("/services")
}

const fetchServiceDetails = async () => {
  const serviceId = route.params.id
  if (!serviceId) return

  try {
    const serviceDoc = await getDoc(doc(db, "services", serviceId))
    if (!serviceDoc.exists()) return

    service.value = { id: serviceDoc.id, ...serviceDoc.data() }
    reviews.value = service.value.comments || []

    const userQuery = query(collection(db, "users"), where("uid", "==", service.value.userId))
    const userSnap = await getDocs(userQuery)

    if (!userSnap.empty) {
      userInfo.value = userSnap.docs[0].data()

      const profilePicDoc = await getDoc(doc(db, "userProfilePictures", service.value.userId))
      if (profilePicDoc.exists()) {
        const profileData = profilePicDoc.data()
        if (profileData.profilePicture) {
          userInfo.value.image = profileData.profilePicture
        }
      }
    }
  } catch (err) {
    console.error("Failed to load service:", err)
  } finally {
    loading.value = false
  }
}

const submitReview = async () => {
  if (!service.value || !service.value.id || !newReviewText.value.trim()) return

  const name = currentUser.value?.displayName || "Анонимен"
  const review = {
    name,
    rating: newRating.value,
    comment: newReviewText.value.trim()
  }

  try {
    const serviceRef = doc(db, "services", service.value.id)
    await updateDoc(serviceRef, {
      comments: arrayUnion(review)
    })
    reviews.value.push(review)
    newReviewText.value = ""
    newRating.value = 5
    showReviewForm.value = false
  } catch (err) {
    console.error("Failed to submit review:", err)
  }
}

onMounted(async () => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
  })
  await fetchServiceDetails()
})
</script>

<template>
  <DefaultLayout>
    <section class="details-wrapper">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <div class="profile-box">
              <v-avatar size="130" class="avatar-img">
                <v-img :src="profileImage" />
              </v-avatar>
              <h2 class="name">{{ userInfo?.firstName }} {{ userInfo?.lastName }}</h2>
              <p class="job">{{ service?.service }}</p>
              <p class="location">📍 {{ userInfo?.city || 'Непознато' }}</p>
              <span class="badge" :class="availability.toLowerCase()">{{ availability }}</span>
            </div>

            <div class="rating-summary mb-6">
              <h3 class="rating-number">⭐ {{ averageRating.toFixed(1) }}/5</h3>
              <p class="text-muted">{{ reviews.length }} корисници го оценија овој мајстор</p>
            </div>

            <div class="section">
              <h3>Oпис на услугата</h3>
              <p>{{ service?.description || "Описот не е достапен." }}</p>
            </div>

            <div class="section">
              <h3>Биографија</h3>
              <p>{{ route.query.description || "Описот не е достапен." }}</p>
            </div>

            <div class="section">
              <h3>Други услуги</h3>
              <ul class="services-list">
                <li v-for="s in service?.services || ['Не е наведено']" :key="s">🔧 {{ s }}</li>
              </ul>
            </div>

            <div class="section">
              <h3>Проекти</h3>
              <v-row dense>
                <v-col v-for="(img, i) in portfolioImages" :key="i" cols="6">
                  <v-img :src="img" height="140" class="rounded" cover />
                </v-col>
              </v-row>
            </div>

            <div class="section">
              <h3>Контакт информации</h3>
              <p>📞 {{ userInfo?.phone || 'Нема информација' }} </p>
              <p>✉️ {{ userInfo?.email || 'Нема информација' }} </p>
              <p>🌐 Профил: <a :href="route.query.website || '#'" target="_blank" class="text-link">Веб страна</a></p>
            </div>

            <div class="section">
              <h3>Рецензии</h3>
              <div class="review" v-for="(r, i) in reviews" :key="i">
                <strong>{{ r.name }}</strong> - ⭐ {{ r.rating }}/5
                <p>{{ r.comment }}</p>
              </div>

              <v-btn class="write-review mt-3" color="warning" variant="flat" @click="showReviewForm = true">
                Напиши рецензија
              </v-btn>

              <div v-if="showReviewForm" class="mt-4">
                <v-rating v-model="newRating" color="yellow-darken-2" background-color="grey" hover size="28" />
                <v-textarea
                  v-model="newReviewText"
                  label="Вашата рецензија"
                  auto-grow
                  rows="3"
                  color="warning"
                  class="mt-2"
                />
                <v-btn color="yellow-darken-2" class="mt-2 text-black font-weight-bold" @click="submitReview">
                  Објави рецензија
                </v-btn>
              </div>
            </div>

            <v-btn class="back-btn mt-6" size="large" rounded @click="goBack">
              <v-icon start>mdi-arrow-left</v-icon>
              Назад кон мајсторите
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </DefaultLayout>
</template>


<style scoped>
.details-wrapper {
  background: linear-gradient(135deg, #1c1c1c, #101010);
  padding-top: 130px;
  padding-bottom: 80px;
  color: #fff;
  min-height: 100vh;
}

.profile-box {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-img {
  border: 4px solid #ffc107;
  box-shadow: 0 6px 18px rgba(255, 193, 7, 0.3);
  margin: 0 auto 16px;
}

.name {
  font-size: 2rem;
  font-weight: 800;
  color: #ffc107;
}

.job {
  font-size: 1.1rem;
  color: #ccc;
}

.location {
  font-size: 0.95rem;
  color: #aaa;
  margin-bottom: 8px;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-top: 6px;
  text-transform: uppercase;
}

.badge.онлајн {
  background-color: #4caf50;
  color: white;
}
.badge.зафатен {
  background-color: #ff9800;
  color: white;
}
.badge.недостапен {
  background-color: #f44336;
  color: white;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #ffc107;
}

.services-list {
  padding-left: 20px;
  color: #eee;
}

.services-list li {
  margin-bottom: 8px;
  list-style: none;
}

.review {
  background: rgba(255, 255, 255, 0.04);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 14px;
  color: #eee;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rating-summary {
  text-align: center;
  margin-bottom: 20px;
}

.rating-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ffc107;
}

.text-muted {
  color: #aaa;
  font-size: 0.95rem;
}

.write-review {
  font-weight: bold;
}

.back-btn {
  background-color: #ffc107 !important;
  color: black !important;
  font-weight: 600;
}

.text-link {
  color: #ffc107;
  text-decoration: underline;
}
</style>
