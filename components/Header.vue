<script setup lang="ts">
import { ref } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
	{
		label: "Trang chủ",
		icon: "i-lucide-house",
		to: "/",
	},
	{
		label: "Menu",
		icon: "i-lucide-utensils",
		to: "/menu",
		children: [
			{
				label: "Thứ Hai",
				icon: "i-lucide-dot",
				description: "Menu các món ăn của thứ Hai",
				to: "/menu/monday",
			},
			{
				label: "Thứ Ba",
				icon: "i-lucide-dot",
				description: "Menu các món ăn của thứ Ba",
				to: "/menu/tuesday",
			},
			{
				label: "Thứ Tư",
				icon: "i-lucide-dot",
				description: "Menu các món ăn của thứ Tư",
				to: "/menu/wednesday",
			},
			{
				label: "Thứ Năm",
				icon: "i-lucide-dot",
				description: "Menu các món ăn của thứ Năm",
				to: "/menu/thursday",
			},
			{
				label: "Thứ Sáu",
				icon: "i-lucide-dot",
				description: "Menu các món ăn của thứ Sáu",
				to: "/menu/friday",
			},
			{
				label: "Thứ Bảy",
				icon: "i-lucide-dot",
				description: "Menu các món ăn của thứ Bảy",
				to: "/menu/saturday",
			},
			{
				label: "Chủ Nhật",
				icon: "i-lucide-dot",
				description: "Menu các món ăn của Chủ Nhật",
				to: "/menu/sunday",
			},
		],
	},
	{
		label: "Đặt hàng",
		icon: "i-lucide-shopping-cart",
		to: "/order",
	},
	{
		label: "Địa chỉ",
		icon: "i-lucide-map-pin",
		to: "/address",
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
			<div class="flex items-center justify-end lg:flex-1 gap-1.5">
				<UButton
					class="hidden lg:block"
					variant="subtle"
				>
					Đăng nhập / Đăng ký
				</UButton>
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
