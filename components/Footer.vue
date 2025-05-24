<template>
  <footer class="bg-gray-800 text-white p-4 mt-auto">
    <div class="container mx-auto text-center">
      <p>
        &copy; {{ new Date().getFullYear() }} My App. All rights
        reserved.
      </p>
      <ul class="flex justify-center space-x-4 mt-2">
        <li>
          <NuxtLink
            to="/privacy"
            aria-label="Privacy policy"
          >Privacy Policy</NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/terms"
            aria-label="Terms of service"
          >Terms of Service</NuxtLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
// Không cần script nếu không có logic
</script>

<style scoped>
/* Nếu không dùng Tailwind, thêm CSS thủ công */
footer {
    background-color: #1f2937;
}
</style>
