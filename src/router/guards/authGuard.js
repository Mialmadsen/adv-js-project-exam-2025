import { useAuth } from '@/modules/useAuth'
import { useRole } from '@/composables/useRole'

export function installAuthGuards(router) {
  router.beforeEach((to) => {
    const { isLoggedIn } = useAuth()
    const { isAdmin }   = useRole()

    // send guests to login if route needs auth
    if (to.meta?.requiresAuth && !isLoggedIn.value) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
      // admin-only?
     if (to.meta?.requiresAdmin && !isAdmin.value) {
     return { path: '/' }   // or show 404/unauthorized
}
 // admin forbidden (e.g., register page)
    if (to.meta?.forbidAdmin && isAdmin.value) {
      return { path: '/' } // or { name: 'admin-dashboard' }
    }

    // keep authed users away from guest-only pages (like /auth/login)
    if (to.meta?.guestOnly && isLoggedIn.value) {
      return { path: '/' }
    }
  })
}
