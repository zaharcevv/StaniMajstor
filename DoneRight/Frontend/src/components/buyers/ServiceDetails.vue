<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  getDoc, doc, getDocs, query, collection, where, updateDoc, arrayUnion, arrayRemove
} from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "@/firebase"
import DefaultLayout from "@/layouts/DefaultLayout.vue"

const route = useRoute()
const router = useRouter()

const service = ref(null)
const userInfo = ref(null)
const currentUser = ref(null)
const reviews = ref([])

const newReviewText = ref("")
const newRating = ref(5)
const showReviewForm = ref(false)
const isEditing = ref(false)
const loginDialog = ref(false)

const currentPage = ref(1)
const reviewsPerPage = 5

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

const profileImage = computed(() => userInfo.value?.image || fallbackImage)

const userReview = computed(() =>
  reviews.value.find(r => r.uid === currentUser.value?.uid)
)

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * reviewsPerPage
  return reviews.value.slice(start, start + reviewsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(reviews.value.length / reviewsPerPage)
})

const fetchServiceDetails = async () => {
  const serviceId = route.params.id
  if (!serviceId) return

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
}

const submitReview = async () => {
  if (!currentUser.value || userReview.value) return

  if (newReviewText.value.trim().length < 10) {
    alert("Рецензијата мора да содржи најмалку 10 карактери.")
    return
  }

  const review = {
    uid: currentUser.value.uid,
    name: currentUser.value.displayName || "Анонимен",
    rating: newRating.value,
    comment: newReviewText.value.trim()
  }

  try {
    const ref = doc(db, "services", service.value.id)
    await updateDoc(ref, { comments: arrayUnion(review) })
    reviews.value.push(review)
    resetForm()
  } catch (e) {
    console.error(e)
  }
}

const updateReview = async () => {
  if (!userReview.value) return

  const updated = {
    ...userReview.value,
    rating: newRating.value,
    comment: newReviewText.value.trim()
  }

  try {
    const ref = doc(db, "services", service.value.id)
    await updateDoc(ref, {
      comments: arrayRemove(userReview.value)
    })
    await updateDoc(ref, {
      comments: arrayUnion(updated)
    })

    const idx = reviews.value.findIndex(r => r.uid === currentUser.value.uid)
    reviews.value[idx] = updated
    resetForm()
  } catch (e) {
    console.error(e)
  }
}

const resetForm = () => {
  newReviewText.value = ""
  newRating.value = 5
  showReviewForm.value = false
  isEditing.value = false
}

const editReview = () => {
  newReviewText.value = userReview.value.comment
  newRating.value = userReview.value.rating
  showReviewForm.value = true
  isEditing.value = true
}

const handleWriteReviewClick = () => {
  if (!currentUser.value) {
    loginDialog.value = true
  } else {
    showReviewForm.value = true
  }
}

onMounted(async () => {
  const auth = getAuth()
  onAuthStateChanged(auth, async user => {
    currentUser.value = user
    await fetchServiceDetails()
  })
})

const goBack = () => {
  router.push("/services")
}


</script>
<template>
  <DefaultLayout>
    <section class="details-wrapper">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <!-- Профил секција -->
            <div class="profile-box">
              <v-avatar size="130" class="avatar-img">
                <v-img :src="profileImage" />
              </v-avatar>
              <h2 class="name">{{ userInfo?.firstName }} {{ userInfo?.lastName }}</h2>
              <p class="job">{{ service?.service }}</p>
              <p class="location">📍 {{ userInfo?.city || 'Непознато' }}</p>
              <span class="badge" :class="availability.toLowerCase()">{{ availability }}</span>
            </div>

            <!-- Резиме на оценки -->
            <div class="rating-summary mb-6">
              <h3 class="rating-number">⭐ {{ averageRating.toFixed(1) }}/5</h3>
              <p class="text-muted">{{ reviews.length }} корисници го оценија овој мајстор</p>
            </div>

            <!-- Информации -->
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
              <p>🌐 Профил: 
                <a :href="route.query.website || '#'" target="_blank" class="text-link">Веб страна</a>
              </p>
            </div>

            <!-- Рецензии -->
            <div class="section">
              <h3>Рецензии</h3>

              <div class="review" v-for="(r, i) in paginatedReviews" :key="i">
                <strong>{{ r.name }}</strong> - ⭐ {{ r.rating }}/5
                <p>{{ r.comment }}</p>
                <v-icon
  v-if="currentUser && r.uid === currentUser.uid"
  class="mt-1"
  @click="editReview"
>
  mdi-pencil
</v-icon>
              </div>

              <v-pagination
                v-if="totalPages > 1"
                v-model="currentPage"
                :length="totalPages"
                total-visible="5"
                color="yellow-darken-2"
                class="mt-4"
              />

              <v-btn
                v-if="!userReview && !showReviewForm"
                class="write-review mt-3"
                color="warning"
                variant="flat"
                @click="handleWriteReviewClick"
              >
                Напиши рецензија
              </v-btn>

              <div v-if="showReviewForm" class="mt-4">
                <v-rating
                  v-model="newRating"
                  color="yellow-darken-2"
                  background-color="grey"
                  hover
                  size="28"
                />
                <v-textarea
                  v-model="newReviewText"
                  label="Вашата рецензија"
                  auto-grow
                  rows="3"
                  color="warning"
                  class="mt-2"
                />
                <v-btn
                  v-if="isEditing"
                  color="yellow-darken-2"
                  class="mt-2 text-black font-weight-bold"
                  @click="updateReview"
                >
                  Ажурирај рецензија
                </v-btn>
                <v-btn
                  v-else
                  color="yellow-darken-2"
                  class="mt-2 text-black font-weight-bold"
                  @click="submitReview"
                >
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

      <!-- Дијалог ако не е најавен -->
      <v-dialog v-model="loginDialog" max-width="420" transition="dialog-bottom-transition">
        <v-card class="pa-4">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center text-warning">
            <v-icon class="me-2" color="warning" size="24">mdi-alert-circle-outline</v-icon>
            Најава потребна
          </v-card-title>
          <v-card-text class="text-white text-body-1 mt-2">
            За да напишете рецензија, мора да сте најавени на вашиот профил.
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn variant="text" color="white" @click="loginDialog = false">Подоцна</v-btn>
            <v-btn color="warning" variant="elevated" @click="router.push('/login')">Најави се</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

.v-dialog .v-card {
  background-color: #2c2c2c;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}
</style>
