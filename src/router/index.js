import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import HomeView from '../views/User/HomeView.vue';
import FeedView from '../views/User/FeedView.vue';
import SignupView from '../views/User/SignupView.vue';
import LoginView from '../views/LoginView.vue';
import SearchView from '../views/User/SearchView.vue';
import ProfileView from '../views/User/ProfileView.vue';
import FriendsView from '../views/User/FriendsView.vue';
import PostView from '../views/User/PostView.vue';
import ChatView from '../views/User/ChatView.vue';
import TrendView from '../views/User/TrendView.vue';
import EditProfileView from '../views/User/EditProfileView.vue';
import EditPasswordView from '../views/User/EditPasswordView.vue';
import NotificationsView from '../views/User/NotificationsView.vue';
import ForgotPasswordView from '../views/User/ForgotPasswordView.vue';
import VerifyOtpPasswordView from '../views/User/VerifyOtpPasswordView.vue';
import VerifyOtpSignupView from '../views/User/VerifyOtpSignupView.vue';
import ResetPasswordView from '../views/User/ResetPasswordView.vue';
import UnauthorizedView from '../views/Error/UnauthorizedView.vue';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/feed',
      name: 'feed',
      component: FeedView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/profile/edit',
      name: 'editprofile',
      component: EditProfileView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/profile/edit/password',
      name: 'editpassword',
      component: EditPasswordView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/profile/:id/friends',
      name: 'friends',
      component: FriendsView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/:id',
      name: 'postview',
      component: PostView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/trends/:id',
      name: 'trendview',
      component: TrendView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/forgot-password',
      name: 'forgotpassword',
      component: ForgotPasswordView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/User/AboutView.vue')
    },
    {
      path: '/verify-otp-password',
      name: 'verifyotppassword',
      component: VerifyOtpPasswordView
    },
    {
      path: '/verify-otp-signup',
      name: 'verifyotpsignup',
      component: VerifyOtpSignupView
    },
    {
      path: '/reset-password',
      name: 'resetpassword',
      component: ResetPasswordView
    },

    {
      path: "/401",
      name: "unauthorized",
      component: UnauthorizedView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Admin/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/Admin/UsersView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/Admin/PostsView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/posts/:id',
      name: 'PostDetail',
      component:() => import('../views/Admin/PostDetail.vue'),
      props: true, 
    },
  ]
});


router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const userRole = userStore.user.role_id;

  if (to.meta.requiresAuth) {
    const access = userStore.user.access;

    if (!access) {
      console.warn('🔒 Không có token, chuyển hướng đến trang đăng nhập');
      return next({ name: 'login' });
    }

    try {
      const payload = JSON.parse(atob(access.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const now = Date.now();

      if (expiryTime - now < 60000) {
        await userStore.refreshToken();
      }

      if (to.meta.role) {
        console.log(`🛡 Kiểm tra quyền truy cập: ${userRole}, cần: ${to.meta.role}`);

        if ((to.meta.role === 'admin' && userRole != 1) || (to.meta.role === 'user' && userRole != 2)) {
          console.warn('❌ Không có quyền truy cập vào trang này, quay về login');
          return next({ name: 'login' });
        }
      }
      return next();
    } catch (error) {
      console.error('❌ Token không hợp lệ, chuyển hướng đến trang đăng nhập', error);
      userStore.removeToken();
      return next({ name: 'login' });
    }
  }

  next();
});


export default router;