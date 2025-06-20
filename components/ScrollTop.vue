<script setup lang="ts">
const showScrollTop = ref(false);

const handleScroll = () => {
	showScrollTop.value = window.scrollY > 200;
};

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
	<UButton
		v-if="showScrollTop"
		icon="i-heroicons-arrow-up"
		color="neutral"
		variant="solid"
		class="fixed bottom-6 right-6 z-50 rounded-full"
		aria-label="Scroll to top"
		@click="scrollToTop"
	/>
</template>
