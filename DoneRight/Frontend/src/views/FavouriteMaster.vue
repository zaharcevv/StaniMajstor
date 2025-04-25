<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const router = useRouter();
const favorites = ref([]);
const recentlyRemoved = ref(null);
const showSnackbar = ref(false);
let snackbarTimeout = null;

const loadFavoritesFromFirestore = async (uid) => {
  try {
    const userSnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const favoriteIds = userDoc.data().favourites || [];

      const enriched = await Promise.all(favoriteIds.map(async (serviceId) => {
        const serviceDoc = await getDoc(doc(db, "services", serviceId));
        if (!serviceDoc.exists()) return null;

        const serviceData = serviceDoc.data();
        const userUid = serviceData.userId;

        let name = "Име";
        let lastName = "Презиме";
        let image = new URL("@/assets/lok.png", import.meta.url).href;
        let location = "Непознато";

        const providerQuery = query(collection(db, "users"), where("uid", "==", userUid));
        const providerSnap = await getDocs(providerQuery);

        if (!providerSnap.empty) {
          const providerData = providerSnap.docs[0].data();
          name = providerData.firstName || name;
          lastName = providerData.lastName || lastName;
          location = providerData.city || location;
          image = providerData.image || image;

          const profilePicDoc = await getDoc(doc(db, "userProfilePictures", userUid));
          if (profilePicDoc.exists()) {
            const profilePic = profilePicDoc.data();
            if (profilePic.profilePicture) {
              image = profilePic.profilePicture;
            }
          }
        }

        return {
          id: serviceDoc.id,
          name,
          lastName,
          job: serviceData.service || "Услуга",
          image,
          location,
          rating: 5
        };
      }));

      favorites.value = enriched.filter(Boolean);
    }
  } catch (err) {
    console.error("Failed to load favorites:", err);
  }
};

const removeFromFavorites = async (serviceId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
  const userSnap = await getDocs(userQuery);

  if (!userSnap.empty) {
    const userDoc = userSnap.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    const currentFavs = userDoc.data().favourites || [];
    const updatedFavs = currentFavs.filter(id => id !== serviceId);

    const removed = favorites.value.find(f => f.id === serviceId);
    recentlyRemoved.value = removed;
    favorites.value = favorites.value.filter(f => f.id !== serviceId);
    showSnackbar.value = true;

    snackbarTimeout = setTimeout(() => {
      showSnackbar.value = false;
      recentlyRemoved.value = null;
    }, 5000);

    await updateDoc(userRef, { favourites: updatedFavs });
  }
};

const undoRemove = async () => {
  if (!recentlyRemoved.value) return;

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
  const userSnap = await getDocs(userQuery);

  if (!userSnap.empty) {
    const userDoc = userSnap.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const currentFavs = userDoc.data().favourites || [];

    if (!currentFavs.includes(recentlyRemoved.value.id)) {
      const updatedFavs = [...currentFavs, recentlyRemoved.value.id];
      await updateDoc(userRef, { favourites: updatedFavs });
      favorites.value.unshift(recentlyRemoved.value);
    }
  }

  recentlyRemoved.value = null;
  showSnackbar.value = false;
  clearTimeout(snackbarTimeout);
};

const goToDetails = (id) => {
  router.push(`/service/${id}`);
};

const isFavorite = (id) => favorites.value.find(f => f.id === id);

const goToAllServices = () => {
  router.push("/services");
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadFavoritesFromFirestore(user.uid);
    }
  });
});
</script>

<template>
  <DefaultLayout>
    <div class="favourites-container">
      <h2>Омилени Мајстори</h2>

      <div v-if="favorites.length === 0" class="empty-state">
        <i class="mdi mdi-account-off empty-icon" />
        <p class="empty-message">Немате додадено омилени мајстори.</p>
        <button class="all-services-btn" @click="goToAllServices">
          Погледни сите мајстори
        </button>
      </div>

      <div v-else class="services-container">
        <div
          v-for="service in favorites"
          :key="service.id"
          class="service-card-glass"
        >
          <button
            class="favorite-btn"
            @click="removeFromFavorites(service.id)"
            title="Отстрани од омилени"
          >
            <i
              class="mdi"
              :class="[
                'mdi-star',
                isFavorite(service.id) ? 'favorite-active' : 'favorite-inactive'
              ]"
            />
          </button>

          <img
            :src="service.image"
            class="profile-img"
            :alt="`${service.name} ${service.lastName}`"
          />

          <div class="card-body">
            <h3 class="name">{{ service.name }} {{ service.lastName }}</h3>
            <p class="meta">📍 {{ service.location || "Непознато" }}</p>
            <p class="meta">💼 {{ service.job }}</p>
            <p class="meta">⭐ {{ service.rating }}/5</p>

            <button
              class="contact-btn"
              @click="goToDetails(service.id)"
            >
              Контактирај ме
            </button>
          </div>
        </div>
      </div>

      <!-- Snackbar / Undo -->
      <transition name="fade">
        <div v-if="showSnackbar" class="snackbar">
          Мајсторот е тргнат.
          <button class="undo-btn" @click="undoRemove">Врати</button>
        </div>
      </transition>
    </div>
  </DefaultLayout>
</template>

<style scoped>
@import "@mdi/font/css/materialdesignicons.min.css";

.favourites-container {
  padding: 110px 20px 40px; /* added top padding here */
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #181818, #101010);
}


h2 {
  font-size: 3.4rem;
  font-weight: 900;
  color: #ffc107;
  text-shadow: 0 0 12px rgba(255, 193, 7, 0.4), 0 0 24px rgba(255, 193, 7, 0.2);
  letter-spacing: -1px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
}

.empty-icon {
  font-size: 72px;
  color: #555;
  margin-bottom: 16px;
}

.empty-message {
  font-size: 18px;
  color: #bbb;
  margin-bottom: 20px;
}

.all-services-btn {
  padding: 10px 20px;
  background-color: #ffc107;
  border: none;
  border-radius: 8px;
  color: black;
  font-weight: 600;
  cursor: pointer;
}

.services-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px;
  gap: 20px; /* slightly bigger for better breathing room */
  justify-items: center;
  margin-top: 25px;
}


.service-card-glass {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  width: 100%;
  max-width: 320px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card-glass:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 12px 28px rgba(255, 193, 7, 0.2);
}

.profile-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 16px;
  color: white;
  text-align: left;
}

.name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffc107;
}

.meta {
  font-size: 0.95rem;
  color: #ccc;
  margin-bottom: 4px;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #000;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s ease;
}

.favorite-btn:hover {
  background-color: #111;
}

.favorite-btn .mdi {
  font-size: 20px;
  transition: color 0.2s ease;
}

.favorite-active {
  color: #ffc107;
}

.favorite-inactive {
  color: white;
}

.contact-btn {
  display: block;
  width: 100%;
  background-color: #ffc107;
  color: black;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.contact-btn:hover {
  background-color: #ffcf3f;
}

.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
}

.undo-btn {
  background: none;
  border: none;
  color: #ffc107;
  font-weight: bold;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



</style>
