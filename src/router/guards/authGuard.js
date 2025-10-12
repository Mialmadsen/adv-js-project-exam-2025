import { useAuth } from '@/modules/useAuth'

export function installAuthGuards(router) {
  router.beforeEach((to) => {
    const { isLoggedIn } = useAuth()

    // send guests to login if route needs auth
    if (to.meta?.requiresAuth && !isLoggedIn.value) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // keep authed users away from guest-only pages (like /auth/login)
    if (to.meta?.guestOnly && isLoggedIn.value) {
      return { path: '/' }
    }
  })
}
