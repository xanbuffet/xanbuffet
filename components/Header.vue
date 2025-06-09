<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";

const auth = useAuthStore();
const user = useUserStore();

const navMenuItems = ref<NavigationMenuItem[]>([
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
const userMenuItems: DropdownMenuItem[] = [
	{
		label: "Profile",
		icon: "i-lucide-user",
		to: "/user",
	}, {
		label: "Đơn hàng",
		icon: "i-lucide-shopping-cart",
		to: "/user/order",
	}, {
		label: "Đăng xuất",
		icon: "i-lucide-log-out",
		onSelect() {
			user.logout();
		},
	},
];

const open = ref(false);
const openUserMenu = ref(false);
</script>

<template>
	<header class="bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) sticky top-0 z-50">
		<nav class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full">
			<div class="lg:flex-1 flex items-center gap-1.5">
				<NuxtLink to="/">Xan Buffet</NuxtLink>
			</div>
			<div class="hidden lg:flex">
				<UNavigationMenu
					:items="navMenuItems"
					variant="link"
					:ui="{
						list: 'flex gap-x-1.5 justify-center',
					}"
					class="w-full justify-center"
				/>
			</div>
			<div class="flex items-center justify-end lg:flex-1 gap-2">
				<UDropdownMenu
					v-if="user.isAuthenticated"
					v-model:open="openUserMenu"
					arrow
					:items="userMenuItems"
					:ui="{
						content: 'w-48',
					}"
					:content="{
						align: 'end',
						side: 'bottom',
					}"
				>
					<UButton
						size="xl"
						variant="ghost"
						icon="i-lucide-circle-user-round"
						label="openUserMenu"
					>
						{{ user.userUsername }}
					</UButton>
				</UDropdownMenu>
				<div v-else>
					<UButton
						variant="subtle"
						@click="auth.isVisible = true"
					>
						<span class="hidden md:block">Đăng nhập / Đăng ký</span>
						<UIcon
							class="block md:hidden size-5"
							name="i-lucide-circle-user-round"
						/>
					</UButton>
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
						:items="navMenuItems"
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
