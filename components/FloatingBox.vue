<script setup lang="ts"></script>

<template>
	<div class="fixed z-50 right-3 md:right-6 bottom-1/5">
		<div class="flex flex-col gap-y-4">
			<div>
				<UButton
					class="font-bold rounded-full animate-wiggle"
					icon="i-lucide-phone-incoming"
					color="error"
					variant="subtle"
					size="xl"
					to="tel:0927733111"
				/>
			</div>
			<div class="relative flex">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
				<UButton
					class="font-bold rounded-full"
					size="xl"
					icon="i-lucide-shopping-cart"
					variant="solid"
					to="/order"
				/>
			</div>
		</div>
	</div>
</template>
