<script setup>
import consImage from "@/assets/lok.png"
import { useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import { getAuth, onAuthStateChanged } from "firebase/auth"

const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
  })
})

const handleJoinClick = () => {
  if (isLoggedIn.value) {
    router.push('/next-form') // веќе логнат – оди директно на апликацијата
  } else {
    router.push('/register') // не е логнат – оди на регистрација
  }
}

</script>

<template>
<section id="apply" class="apply-section">
    <div class="content">
      <div class="left-content">
        <div class="header">

          <h1>Зошто да станеш мајстор?      <font-awesome-icon :icon="['fas', 'briefcase']" class="brief-case-icon" /></h1>
               
        </div>
        <p>
          Дали си професионалец кој сака да ја прошири својата кариера и да се поврзе со повеќе клиенти?
          Придружи се на нашата платформа денес и отклучи свет на можности!
        </p>
        <button @click="handleJoinClick">
  Приклучи се сега
  <font-awesome-icon :icon="['fas', 'arrow-right']" class="arrow-icon" />
</button>
      </div>

      <div class="right-content">
        <img :src="consImage" alt="Професионална слика" />
      </div>
    </div>

    <!-- How It Works Section -->
    <div id="how-it-works" class="how-it-works-section">
      <div class="container">
        <h2>Како функционира</h2>
        <div class="steps">
          <div class="step">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="apply-icon" />
            <h3>Регистрирај се</h3>
            <p>
              Регистрирај се на нашата платформа со пополнување на едноставна форма. Ќе ти одземе само неколку минути.
            </p>
          </div>
          <div class="step">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="apply-icon" />
            <h3>Креирај профил</h3>
            <p>
              Постави професионален профил со твоите вештини, искуство и услугите што ги нудиш.
            </p>
          </div>
          <div class="step">
            <font-awesome-icon :icon="['fas', 'search']" class="apply-icon" />
            <h3>Стекни клиенти</h3>
            <p>
              Клиентите лесно ќе те пронајдат преку нашиот пребарувачки алгоритам, врз основа на твојата локација и експертиза.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.apply-section {
  position: relative;
  padding: 120px 20px;
  color: white;
  overflow: hidden;
  z-index: 1;
  background: linear-gradient(135deg, #1f1f1f, #121212); /* updated */
}



/* Content Layout */
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  gap: 50px;
  margin: 0 auto;
}

/* Left Side */
.left-content {
  max-width: 600px;
}

.left-content .header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.brief-case-icon {
  font-size: 3rem;
  color: #ffc107;
}

.left-content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 25px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
}

.left-content p {
  font-size: 1.3rem;
  line-height: 1.8;
  margin-bottom: 30px;
  color: #e0e0e0;
}

.left-content button {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 16px 36px;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(255, 193, 7, 0.3);
}

.left-content button:hover {
  transform: translateY(-3px) scale(1.03);
  background: #e6a700;
  box-shadow: 0 8px 18px rgba(255, 193, 7, 0.5);
}

.arrow-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

button:hover .arrow-icon {
  transform: translateX(6px);
}

/* Right Side */
.right-content {
  flex: 1;
  text-align: center;
}

.right-content img {
  max-width: 420px;
  border-radius: 12px;
  object-fit: cover;
}

/* How It Works */
.how-it-works-section {
  margin-top: 100px;
}

.how-it-works-section h2 {
  text-align: center;
  font-size: 2.7rem;
  margin-bottom: 50px;
  color: #ffc107;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.step {
  background-color: #1a1a1a;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.step:hover {
  transform: translateY(-8px);
  box-shadow: 0 14px 32px rgba(255, 193, 7, 0.2);
}

.apply-icon {
  font-size: 2.8rem;
  color: #ffc107;
  margin-bottom: 20px;
  transition: 0.3s;
}

.step h3 {
  font-size: 1.6rem;
  margin-bottom: 12px;
  font-weight: 600;
}

.step p {
  font-size: 1rem;
  color: #ccc;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1024px) {
  .content {
    flex-direction: column;
    align-items: center;
  }

  .right-content img {
    display: none;
  }

  .steps {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .left-content {
    text-align: center;
  }

  .header {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .left-content h1 {
    font-size: 2.4rem;
  }

  .left-content p {
    font-size: 1.1rem;
  }

  .left-content button {
    font-size: 16px;
    padding: 14px 26px;
  }

  .how-it-works-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .left-content h1 {
    font-size: 2rem;
  }

  .left-content p {
    font-size: 1rem;
  }

  .left-content button {
    font-size: 15px;
    padding: 12px 24px;
  }

  .step h3 {
    font-size: 1.3rem;
  }

  .step p {
    font-size: 0.95rem;
  }
}
</style>
