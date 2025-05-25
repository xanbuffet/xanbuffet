<script setup>
</script>

<template>
	<footer class="p-4 mt-auto">
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
