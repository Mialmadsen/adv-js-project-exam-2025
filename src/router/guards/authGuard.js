import { useAuth } from '@/modules/useAuth'
import { useRole } from '@/composables/useRole'
import { watch } from 'vue'

export function installAuthGuards(router) {
  const { isLoggedIn, authReady } = useAuth()
  const { isAdmin }   = useRole()

  router.beforeEach(async (to) => {
    // Vent på at Firebase Auth er klar
    if (!authReady.value) {
      await new Promise(resolve => {
        const unwatch = watch(authReady, ready => {
          if (ready) {
            unwatch()
            resolve(true)
          }
        })
      })
    }

    // send guests to login if route needs auth
    if (to.meta?.requiresAuth && !isLoggedIn.value) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // admin-only
    if (to.meta?.requiresAdmin && !isAdmin.value) {
      return { path: '/' }
    }

    // admin forbidden
    if (to.meta?.forbidAdmin && isAdmin.value) {
      return { path: '/' }
    }

    // keep authed users away from guest-only pages
    if (to.meta?.guestOnly && isLoggedIn.value) {
      return { path: '/' }
    }
  })
}
