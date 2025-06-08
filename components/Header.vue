<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const auth = useAuthStore();
const user = useUserStore();

const items = ref<NavigationMenuItem[]>([
	{
		label: "Trang chủ",
		icon: "i-lucide-house",
		to: "/",
		onSelect: () => open.value = false,
	},
	{
		label: "Menu",
		icon: "i-lucide-utensils",
		to: "/menu",
		onSelect: () => open.value = false,
	},
	{
		label: "Đặt hàng",
		icon: "i-lucide-shopping-cart",
		to: "/order",
		onSelect: () => open.value = false,
	},
	{
		label: "Địa chỉ",
		icon: "i-lucide-map-pin",
		to: "/address",
		onSelect: () => open.value = false,
	},
	{
		label: "TikTok",
		icon: "i-logos-tiktok-icon",
		to: "https://tiktok.com/@xanbuffetcomnha35k",
		target: "_blank",
	},
	{
		label: "Facebook",
		icon: "i-logos-facebook",
		to: "https://facebook.com/@xanbuffetcomnha35k",
		target: "_blank",
	},
]);

const open = ref(false);
</script>

<template>
	<header class="bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) sticky top-0 z-50">
		<nav class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full">
			<div class="lg:flex-1 flex items-center gap-1.5">
				<NuxtLink to="/">Xan Buffet</NuxtLink>
			</div>
			<div class="hidden lg:flex">
				<UNavigationMenu
					:items="items"
					variant="link"
					:ui="{
						list: 'flex gap-x-1.5 justify-center',
					}"
					class="w-full justify-center"
				/>
			</div>
			<div class="flex items-center justify-end lg:flex-1 gap-2">
				<UButton
					v-if="user.isAuthenticated"
					size="xl"
					variant="ghost"
					icon="i-lucide-circle-user-round"
				>
					{{ user.userUsername }}
				</UButton>
				<div v-else>
					<UButton
						class="hidden md:block"
						variant="subtle"
						@click="auth.isVisible = true"
					>
						Đăng nhập / Đăng ký
					</UButton>
					<UButton
						class="inline-flex md:hidden"
						variant="ghost"
						size="xl"
						icon="i-lucide-circle-user-round"
					/>
				</div>
				<UButton
					class="inline-flex lg:hidden"
					variant="subtle"
					icon="i-lucide-align-justify"
					@click="open = true"
				/>
			</div>
			<USlideover
				v-model:open="open"
				class="w-80"
				title="Xan buffet cơm nhà 35k"
				close-icon="lucide:circle-x"
			>
				<template #body>
					<UNavigationMenu
						orientation="vertical"
						:items="items"
						variant="link"
						:ui="{
							list: 'flex flex-col gap-y-2 justify-center',
						}"
					/>
				</template>
			</USlideover>
		</nav>
	</header>
</template>
