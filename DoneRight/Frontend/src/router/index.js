import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import FavouriteMaster from '@/views/FavouriteMaster.vue';
import ServicesView from '@/views/ServicesView.vue';

import NextForm from '@/components/sellers/NextForm.vue';
import EditProfile from '@/components/Auth/EditProfile.vue';
import SellerDashboard from '@/components/sellers/SellerDashboard.vue';
import ServiceDetails from '@/components/buyers/ServiceDetails.vue';
import SuccessPage from '@/components/sellers/SuccessPage.vue';
import SuccessService from '@/components/sellers/SuccessService.vue';
import ProfilePicturePage from '@/components/sellers/ProfilePicture.vue';
import UserProfile from '@/components/Auth/UserProfile.vue'
import Settings from '@/components/common/Settings.vue';
import HowItWorks from '@/components/HowItWorks/howItWorks.vue'
import EditService from '@/components/sellers/EditService.vue';

import ChooseRole from '@/components/Auth/ChooseRole.vue';
import RegisterMaster from '@/components/Auth/Masters/RegisterMaster.vue';
import RegisterSection from '@/components/Auth/RegisterSection.vue';
import UpgradeToSeller from '@/components/Auth/Masters/UpgradeToSeller.vue';
import LoginSection from '@/components/Auth/LoginSection.vue';
import ResetPassword from '@/components/Auth/ResetPassword.vue';
import ForgotPassword from '@/components/Auth/ForgotPassword.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/favourite', component: FavouriteMaster },
    { path: '/services', component: ServicesView },
    { path: '/login', component: LoginSection },
    { path: '/register', component: RegisterSection },
    { path: '/next-form', component: NextForm },
    { path: '/edit', component: EditProfile },
    { path: '/seller-dashboard', component: SellerDashboard },
    { path: '/service/:id', component: ServiceDetails },
    { path: '/success', component: SuccessPage },
    { path: '/profile-picture', component: ProfilePicturePage },
    { path: '/user-profile', component: UserProfile },
    { path: '/settings', component: Settings },
    { path: '/how-it-works', component: HowItWorks},
    { path: '/reset-password', component: ResetPassword},
    { path: '/forgot-password', component: ForgotPassword},
    { path: '/edit-service/:id', component: EditService},
    { path: '/choose-role', component: ChooseRole},
    { path: '/register-master', component: RegisterMaster},
    { path: '/upgrade-to-master', component: UpgradeToSeller},
    { path: '/success-service', component: SuccessService}
  ],
    scrollBehavior() {
      return { top: 0 }     // 🔽 Скрол до врвот на секоја навигација
    }
});

export default router;
