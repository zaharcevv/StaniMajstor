<template>
  <v-container class="profile-wrapper" fluid>
    <v-row justify="center">
      <v-col cols="12" md="7" lg="5">
        <v-card class="profile-card" elevation="8">
          <v-card-text>
            <div class="profile-header">
              <v-avatar size="100">
                <v-img :src="user?.profilePicture || defaultImage" cover />
              </v-avatar>
              <div class="profile-name">
                <h2>{{ user?.firstName }} {{ user?.lastName }}</h2>
                <p>{{ user?.email }}</p>
              </div>
            </div>

            <v-divider class="my-4" />

            <v-row class="mb-4" dense>
              <v-col cols="12" sm="6">
                <div class="profile-field">
                  <label>Град</label>
                  <p>{{ user?.city || '—' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="profile-field">
                  <label>Телефон</label>
                  <p>{{ user?.phone || '—' }}</p>
                </div>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12" sm="6">
                <v-btn block color="#ff9800" variant="flat" style="color: white;" @click="goToEditProfile">Ажурирај</v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn block color="error" variant="flat" @click="logout">Одјави се</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { db } from '@/firebase'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const user = ref(null)
const defaultImage = new URL('@/assets/lok.png', import.meta.url).href

onMounted(() => {
  loadUser()
})

const loadUser = async () => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        const userQuery = query(collection(db, 'users'), where('uid', '==', currentUser.uid))
        const snapshot = await getDocs(userQuery)

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data()
          const profilePicRef = doc(db, 'userProfilePictures', currentUser.uid)
          const profilePicSnap = await getDoc(profilePicRef)

          let profilePicture = ''
          if (profilePicSnap.exists()) {
            profilePicture = profilePicSnap.data().profilePicture || ''
          }

          user.value = {
            ...userData,
            email: currentUser.email,
            profilePicture
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
  })
}

const logout = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    user.value = null
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const goToEditProfile = () => {
  router.push('/edit')
}
</script>

<style scoped>
.profile-wrapper {
  background-color: #0f0f0f;
  min-height: 100vh;
  padding: 80px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card {
  background-color: #ffffff0a;
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-name h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.profile-name p {
  margin-top: 4px;
  font-size: 0.95rem;
  color: #ccc;
}

.profile-field label {
  font-size: 0.75rem;
  color: #999;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  display: block;
}

.profile-field p {
  font-size: 1rem;
  font-weight: 500;
  color: #f5f5f5;
  margin: 0;
}

</style>
