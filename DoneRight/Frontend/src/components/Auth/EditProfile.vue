<template>
  <v-app>
    <v-container class="edit-profile-wrapper" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="edit-profile-card pa-6" elevation="10">
            <h2 class="text-h5 text-yellow font-weight-bold text-center mb-6">Aжурирај Профил</h2>

            <div class="text-center mb-6">
              <label for="imageUpload" class="cursor-pointer avatar-upload">
                <v-avatar size="110" class="mx-auto avatar-glow">
                  <v-img :src="profile.profilePicture || defaultImage" cover />
                </v-avatar>
                <p class="upload-hint">Смени слика</p>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleImageChange"
              />
            </div>

            <v-form @submit.prevent="submitChanges" ref="formRef">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profile.firstName"
                    label="Име"
                    color="warning"
                    variant="outlined"
                    density="comfortable"
                    :rules="[v => !!v || 'Внеси име']"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profile.lastName"
                    label="Презиме"
                    color="warning"
                    variant="outlined"
                    density="comfortable"
                    :rules="[v => !!v || 'Внеси презиме']"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="profile.email"
                    label="Е-пошта"
                    color="warning"
                    variant="outlined"
                    density="comfortable"
                    type="email"
                    :rules="[v => !!v || 'Внеси е-пошта']"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profile.phone"
                    label="Телефон"
                    color="warning"
                    variant="outlined"
                    density="comfortable"
                    :rules="[v => !!v || 'Внеси телефон']"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profile.city"
                    label="Град"
                    color="warning"
                    variant="outlined"
                    density="comfortable"
                    :rules="[v => !!v || 'Внеси град']"
                  />
                </v-col>
              </v-row>

              <v-btn
                type="submit"
                block
                class="mt-6 gradient-btn text-white font-weight-bold"
                height="50"
              >
                💾 Зачувај Промени
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, updateEmail } from 'firebase/auth'
import {
  collection, getDocs, query, where, doc, updateDoc, getDoc
} from 'firebase/firestore'
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL
} from 'firebase/storage'
import { db } from '@/firebase'

const router = useRouter()
const formRef = ref(null)

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  profilePicture: ''
})

const defaultImage = new URL('@/assets/lok.png', import.meta.url).href
const userDocId = ref(null)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      profile.value.email = user.email
      const q = query(collection(db, 'users'), where('uid', '==', user.uid))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data()
        userDocId.value = snapshot.docs[0].id
        Object.assign(profile.value, { ...userData, email: user.email })

        const picRef = doc(db, 'userProfilePictures', user.uid)
        const picSnap = await getDoc(picRef)
        if (picSnap.exists()) {
          profile.value.profilePicture = picSnap.data().profilePicture || ''
        }
      }
    }
  })
})

const handleImageChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const auth = getAuth()
  const user = auth.currentUser
  const storage = getStorage()
  const fileRef = storageRef(storage, `profile_pictures/${user.uid}`)

  try {
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    profile.value.profilePicture = url

    await updateDoc(doc(db, 'userProfilePictures', user.uid), {
      profilePicture: url
    })
  } catch (err) {
    console.error('Error uploading image:', err)
    alert('Неуспешно поставување на слика.')
  }
}

const submitChanges = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  try {
    if (profile.value.email !== user.email) {
      await updateEmail(user, profile.value.email)
    }
    await updateDoc(doc(db, 'users', userDocId.value), {
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      phone: profile.value.phone,
      city: profile.value.city,
      email: profile.value.email
    })

    alert('✅ Промените се успешно зачувани!')
    router.push('/user-profile')
  } catch (err) {
    if (err.code === 'auth/requires-recent-login') {
      alert('⛔ За да ја промените е-поштата, најавете се повторно.')
    } else {
      console.error('Error updating profile:', err)
      alert('❌ Неуспешно ажурирање на профилот.')
    }
  }
}
</script>

<style scoped>
.edit-profile-wrapper {
  background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
  padding-top: 100px;
  padding-bottom: 80px;
  min-height: 100vh;
}

.edit-profile-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  color: white;
}

.gradient-btn {
  background: linear-gradient(90deg, #ffc107, #ff9800);
  box-shadow: 0 4px 14px rgba(255, 193, 7, 0.3);
  transition: 0.3s ease;
}
.gradient-btn:hover {
  background: linear-gradient(90deg, #ffdd57, #ffab40);
  transform: scale(1.02);
}

.avatar-glow {
  border: 3px solid #ffc107;
  box-shadow: 0 0 12px rgba(255, 193, 7, 0.4);
}

.upload-hint {
  font-size: 0.9rem;
  color: #aaa;
  margin-top: 6px;
}
</style>
