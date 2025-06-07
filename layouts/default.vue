<template>
	<div class="flex flex-col min-h-screen relative">
		<Header />

		<main class="flex-grow">
			<NuxtPage />
		</main>

		<FloatingBox v-if="isFloatingBoxVisible" />
		<Authentication />

		<Footer />
		<NuxtRouteAnnouncer />
	</div>
</template>

<script setup>
import { useFloatingBox } from "~/composables/useFloatingBox";

const { isFloatingBoxVisible } = useFloatingBox();
</script>
