import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import FavouriteMaster from '@/views/FavouriteMaster.vue';
import ServicesView from '@/views/ServicesView.vue';
import ApplyView from '@/views/ApplyView.vue';

import NextForm from '@/components/sellers/NextForm.vue';
import EditProfile from '@/components/Auth/EditProfile.vue';
import SellerDashboard from '@/components/sellers/SellerDashboard.vue';
import ServiceDetails from '@/components/buyers/ServiceDetails.vue';
import SuccessPage from '@/components/sellers/SuccessPage.vue';
import ProfilePicturePage from '@/components/sellers/ProfilePicture.vue';
import UserProfile from '@/components/Auth/UserProfile.vue'
import Settings from '@/components/common/Settings.vue';
import HowItWorks from '@/components/HowItWorks/howItWorks.vue'

import RegisterSection from '@/components/Auth/RegisterSection.vue';
import LoginSection from '@/components/Auth/LoginSection.vue';
import ResetPassword from '@/components/Auth/ResetPassword.vue';
import ForgotPassword from '@/components/Auth/ForgotPassword.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/favourite', component: FavouriteMaster },
    { path: '/services', component: ServicesView },
    { path: '/apply', component: ApplyView },
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
    { path: '/forgot-password', component: ForgotPassword}
  ],
});

export default router;
