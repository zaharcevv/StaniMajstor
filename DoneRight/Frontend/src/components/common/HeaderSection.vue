<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

const drawer = ref(false)
const isLoggedIn = ref(false)
const isSeller = ref(false)

onMounted(() => {
  const auth = getAuth()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true

      try {
        const docRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(docRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          isSeller.value = userData.isSeller === true
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    } else {
      isLoggedIn.value = false
      isSeller.value = false
    }
  })
})
</script>

<template>
  <v-app-bar app flat height="96" class="custom-app-bar">
    <v-toolbar-title class="d-flex align-center">
      <RouterLink to="/" class="d-inline-flex align-center text-decoration-none">
        <img src="@/assets/logo.png" alt="Најди Мајстор" height="50" class="mr-3" />
        <span class="text-white font-weight-bold text-h5 d-none d-sm-inline">DoneRight</span>
      </RouterLink>
    </v-toolbar-title>

    <v-spacer />

    <!-- Desktop Nav -->
    <div class="d-none d-md-flex align-center gap-6">
      <v-btn to="/" variant="text" class="nav-btn">Почетна</v-btn>
      <v-btn to="/services" variant="text" class="nav-btn">Услуги</v-btn>
      <v-btn v-if="isLoggedIn" to="/favourite" variant="text" class="nav-btn">Омилени</v-btn>
      <v-btn v-if="isLoggedIn && isSeller" to="/seller-dashboard" variant="text" class="nav-btn">Дашборд</v-btn>
      <v-btn v-else-if="isLoggedIn && !isSeller" to="/how-it-works" variant="text" class="nav-btn">Стани Мајстор</v-btn>

      <v-btn v-if="!isLoggedIn" to="/login" class="login-btn-gradient text-capitalize" height="44" rounded elevation="4">
        <v-icon start size="20">mdi-login</v-icon>
        <span class="font-weight-bold">Најави се</span>
      </v-btn>

      <v-btn v-else to="/user-profile" icon class="text-yellow-darken-2">
        <v-icon size="32">mdi-account</v-icon>
      </v-btn>
    </div>

    <!-- Mobile Nav Toggle -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none text-yellow-darken-2" />
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer v-model="drawer" app temporary color="black" class="mobile-drawer">
    <v-list nav dense class="text-white">
      <v-list-item to="/" @click="drawer = false">
        <v-list-item-title>Почетна</v-list-item-title>
      </v-list-item>
      <v-list-item to="/services" @click="drawer = false">
        <v-list-item-title>Услуги</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="isLoggedIn" to="/favourite" @click="drawer = false">
        <v-list-item-title>Омилени</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="isLoggedIn && isSeller" to="/seller-dashboard" @click="drawer = false">
        <v-list-item-title>Дашборд</v-list-item-title>
      </v-list-item>
      <v-list-item v-else-if="isLoggedIn && !isSeller" to="/how-it-works" @click="drawer = false">
        <v-list-item-title>Стани Мајстор</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="!isLoggedIn" to="/login" @click="drawer = false">
        <v-list-item-title>Најави се</v-list-item-title>
      </v-list-item>

      <v-list-item v-else to="/user-profile" @click="drawer = false">
        <v-list-item-title>Профил</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.custom-app-bar {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-btn {
  color: white;
  font-weight: 600;
  font-size: 1.15rem;
  text-transform: none;
  letter-spacing: 0.5px;
  position: relative;
  transition: all 0.3s ease;
}

.nav-btn::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 0;
  background-color: #ffc107;
  transition: width 0.3s ease;
}

.nav-btn:hover::after {
  width: 100%;
}

.nav-btn:hover {
  color: #ffc107;
  text-shadow: 0 0 10px #ffc107;
}

.login-btn-gradient {
  background: linear-gradient(135deg, #ffc107, #ff8c00);
  color: #212529;
  font-size: 1rem;
  padding: 0 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(255, 193, 7, 0.3);
}

.login-btn-gradient:hover {
  background: linear-gradient(135deg, #ffdd33, #e3a600);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 193, 7, 0.4);
}

.mobile-drawer {
  transition: transform 0.4s ease;
}

.v-list-item-title {
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.v-list-item-title:hover {
  color: #ffc107;
}
</style>
