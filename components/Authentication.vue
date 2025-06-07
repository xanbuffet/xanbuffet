<script setup lang="ts">
const auth = useAuthStore();
</script>

<template>
	<UModal
		v-model:open="auth.isVisible"
	>
		<template #content>
			Someone know
		</template>
	</UModal>
</template>
