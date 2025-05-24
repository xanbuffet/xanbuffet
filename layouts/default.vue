<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main content -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Route Announcer for accessibility -->
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup>
// Không cần script nếu không có logic
</script>

<style scoped>
/* CSS cho layout */
.min-h-screen {
    min-height: 100vh;
}
</style>
