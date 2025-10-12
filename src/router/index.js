import { createRouter, createWebHistory } from 'vue-router'
import SeedView from '@/views/dev/SeedView.vue'
// Lazy views
const HomeView         = () => import('@/views/HomeView.vue')
const RaceDetailView   = () => import('@/views/RaceDetailView.vue')
const RegisterView     = () => import('@/views/RegisterView.vue')
const ParticipantsView = () => import('@/views/ParticipantsView.vue')
const LoginView        = () => import('@/views/LoginView.vue')
const SignupView       = () => import('@/views/RegisterView.vue') // reuse for now
const ProfileView      = () => import('@/views/ProfileView.vue')
const NotFoundView     = () => import('@/views/NotFoundView.vue')

const routes = [
  { path: '/',            name: 'home',     component: HomeView },

  // Only race detail pages (linked from Home)
  // Example ids we’ll use on Home: "hard" and "light"
  { path: '/races/:id',   name: 'race',     component: RaceDetailView, props: true },

  { path: '/register/:raceId', name: 'register', component: RegisterView, props: true, meta: { requiresAuth: true } },

  { path: '/participants', name: 'participants', component: ParticipantsView },

  { path: '/auth/login',    name: 'login',    component: LoginView,  meta: { guestOnly: true } },
  { path: '/auth/signup',   name: 'signup',   component: SignupView, meta: { guestOnly: true } },

  { path: '/profile',       name: 'profile',  component: ProfileView, meta: { requiresAuth: true } },

  { path: '/:pathMatch(.*)*', name: '404', component: NotFoundView },
  ...(import.meta.env.DEV
    ? [{ path: '/dev/seed', name: 'dev-seed', component: SeedView }]
    : []),
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
