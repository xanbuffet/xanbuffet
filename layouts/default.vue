<script setup>
import { useFloatingBox } from "~/composables/useFloatingBox";

const { isFloatingBoxVisible } = useFloatingBox();
</script>

<template>
	<div class="flex flex-col min-h-screen relative">
		<Header />

		<main class="flex-grow">
			<NuxtPage />
		</main>

		<FloatingBox v-if="isFloatingBoxVisible" />
		<Authentication />

		<ScrollTop />
		<Footer />
		<NuxtRouteAnnouncer />
	</div>
</template>
