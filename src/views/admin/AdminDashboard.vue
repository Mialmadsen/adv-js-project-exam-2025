<script setup>
</script>

<template>
  <div class="min-h-[60vh] px-4 sm:px-6">
    <h1 class="font-title text-3xl text-accent mb-6">Admin dashboard</h1>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <RouterLink to="/admin/races"
        class="admin-card hover:bg-teal/50">
        <h2 class="font-title text-xl text-text mb-2">Races</h2>
        <p class="font-body text-text/70 text-sm">Create, edit, delete races.</p>
      </RouterLink>

      <RouterLink to="/"
        class="admin-card  hover:bg-teal/50">
        <h2 class="font-title text-xl text-text mb-2">Front page</h2>
        <p class="font-body text-text/70 text-sm">Hero image, welcome text, leaders, sponsors.</p>
      </RouterLink>

      <RouterLink to="/admin/users"
        class="admin-card  hover:bg-teal/50">
        <h2 class="font-title text-xl text-text mb-2">Users</h2>
        <p class="font-body text-text/70 text-sm">Manage user accounts.</p>
      </RouterLink>

      <RouterLink to="participants"
        class="admin-card  hover:bg-teal/50">
        <h2 class="font-title text-xl text-text mb-2">Participants</h2>
        <p class="font-body text-text/70 text-sm">Registrations & bibs.</p>
      </RouterLink>
    </div>
  </div>
</template>
