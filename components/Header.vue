<script setup>
</script>

<template>
	<header class="p-4 shadow-md">
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
					>
						Home
					</NuxtLink>
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
