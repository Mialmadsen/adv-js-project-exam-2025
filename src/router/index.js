import { createRouter, createWebHistory } from 'vue-router'

import { installAuthGuards } from './guards/authGuard'

// Lazy views
const HomeView         = () => import('@/views/HomeView.vue')
const RaceDetailView   = () => import('@/views/RaceDetailView.vue')
const RegisterView     = () => import('@/views/RegisterView.vue')
const ParticipantsView = () => import('@/views/ParticipantsView.vue')
const LoginView        = () => import('@/views/LoginView.vue')
const SignupView       = () => import('@/views/RegisterView.vue') // reuse for now
const ProfileView      = () => import('@/views/ProfileView.vue')
const NotFoundView     = () => import('@/views/NotFoundView.vue')
const AdminDashboard = () => import('@/views/admin/AdminDashboard.vue')
const AdminRaces     = () => import('@/views/admin/AdminRaces.vue')
const AdminRaceEditor  = () => import('@/views/admin/AdminRaceEditor.vue')
const ThankYouView = () => import('@/views/ThankYouView.vue')

const routes = [
  { path: '/', name: 'home', component: HomeView },

  { path: '/races/:id', name: 'race', component: RaceDetailView, props: true },

  { path: '/register/:raceId', name: 'register', component: RegisterView, props: true,
    meta: { requiresAuth: true, forbidAdmin: true} },

  { path: '/participants', name: 'participants', component: ParticipantsView },

  { path: '/auth/login',  name: 'login',  component: LoginView,  meta: { guestOnly: true } },
  { path: '/auth/signup', name: 'signup', component: SignupView, meta: { guestOnly: true } },

  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin',   component: AdminDashboard,  meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/races', name: 'admin-races',   component: AdminRaces,   meta: { requiresAuth: true, requiresAdmin: true } },
   { path: '/admin/races/:id',    name: 'admin-race-edit',  component: AdminRaceEditor, props: true, meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', name: '404', component: NotFoundView },

  { path: '/thankyou', name: 'thankyou', component: ThankYouView },


]

// 1) create the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 2) install guards ON the router (not on routes)
installAuthGuards(router)

// 3) export the router
export default router
