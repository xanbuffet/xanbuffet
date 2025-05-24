<template>
  <header class="bg-blue-600 text-white p-4 shadow-md">
    <nav class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">
        <NuxtLink
          to="/"
          aria-label="Home page"
        >My App</NuxtLink>
      </h1>
      <ul class="flex space-x-4">
        <li>
          <NuxtLink
            to="/"
            aria-label="Navigate to home"
          >Home</NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/about"
            aria-label="Navigate to about"
          >About</NuxtLink>
        </li>
        <li v-if="user">
          <button
            aria-label="Log out"
            @click="logout"
          >
            Logout
          </button>
        </li>
        <li v-else>
          <NuxtLink
            to="/login"
            aria-label="Navigate to login"
          >Login</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
const user = ref(null) // Giả lập trạng thái đăng nhập
// Logic đăng xuất (gọi API Laravel)
const logout = async () => {
  try {
    await $fetch('http://<laravel_api_domain>/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    user.value = null
    localStorage.removeItem('token')
    navigateTo('/login')
  }
  catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
/* Nếu không dùng Tailwind, thêm CSS thủ công */
header {
    background-color: #2563eb;
}
</style>
