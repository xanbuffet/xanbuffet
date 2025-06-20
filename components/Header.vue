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
		slot: "order" as const,
	},
	{
		label: "Địa chỉ",
		icon: "i-lucide-map-pin",
		to: "/address",
		onSelect: () => open.value = false,
	},
	{
		label: "Tracking",
		icon: "i-lucide-package-search",
		to: "/tracking",
		onSelect: () => open.value = false,
	},
	{
		label: "Liên hệ",
		icon: "i-lucide-hand-heart",
		children: [
			{
				label: "Zalo",
				icon: "i-simple-icons-zalo",
				badge: "0927733111",
				to: "https://zalo.me/0927733111",
				target: "_blank",
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
				to: "https://www.facebook.com/share/12Kvqw56LZ2",
				target: "_blank",
			},
		],
	},
]);
const userMenuItems: DropdownMenuItem[] = [
	{
		label: "Profile",
		icon: "i-lucide-user",
		to: "/user/profile",
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

const open = ref<boolean>(false);
const openUserMenu = ref<boolean>(false);
</script>

<template>
	<header class="bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) sticky top-0 z-50">
		<nav class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full">
			<div class="lg:flex-1 flex items-center gap-1.5">
				<NuxtLink to="/">
					<p class="font-bold text-xl md:text-2xl text-primary">Xan Buffet</p>
				</NuxtLink>
			</div>
			<div class="hidden lg:flex">
				<UNavigationMenu
					highlight
					:items="navMenuItems"
					variant="link"
					:ui="{
						list: 'flex gap-x-1.5 justify-center',
					}"
					class="w-full justify-center"
				>
					<template #order="{ item }: { item: NavigationMenuItem }">
						<div class="group relative p-1.5 text-sm/6 text-sky-800 dark:text-sky-300">
							<span class="absolute inset-0 border border-dashed border-sky-300/60 bg-sky-400/10 group-hover:bg-sky-400/15 dark:border-sky-300/30" />
							<div class="flex items-center justify-center gap-1.5">
								<UIcon
									:name="item.icon ?? ''"
									class="shrink-0 size-5"
								/>
								{{ item.label }}
							</div>
							<svg
								viewBox="0 0 5 5"
								class="w-[5px] h-[5px] absolute top-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"
							>
								<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
							</svg>
							<svg
								viewBox="0 0 5 5"
								class="w-[5px] h-[5px] absolute top-[-2px] right-[-2px] fill-sky-300 dark:fill-sky-300/50"
							>
								<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
							</svg>
							<svg
								viewBox="0 0 5 5"
								class="w-[5px] h-[5px] absolute bottom-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"
							>
								<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
							</svg>
							<svg
								viewBox="0 0 5 5"
								class="w-[5px] h-[5px] absolute right-[-2px] bottom-[-2px] fill-sky-300 dark:fill-sky-300/50"
							>
								<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
							</svg>
						</div>
					</template>
				</UNavigationMenu>
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
					>
						<template #order="{ item }: { item: NavigationMenuItem }">
							<div class="group relative p-1.5 text-sm/6 text-sky-800 dark:text-sky-300">
								<span class="absolute inset-0 border border-dashed border-sky-300/60 bg-sky-400/10 group-hover:bg-sky-400/15 dark:border-sky-300/30" />
								<div class="flex items-center justify-center gap-1.5">
									<UIcon
										:name="item.icon ?? ''"
										class="shrink-0 size-5"
									/>
									{{ item.label }}
								</div>
								<svg
									viewBox="0 0 5 5"
									class="w-[5px] h-[5px] absolute top-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"
								>
									<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
								</svg>
								<svg
									viewBox="0 0 5 5"
									class="w-[5px] h-[5px] absolute top-[-2px] right-[-2px] fill-sky-300 dark:fill-sky-300/50"
								>
									<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
								</svg>
								<svg
									viewBox="0 0 5 5"
									class="w-[5px] h-[5px] absolute bottom-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"
								>
									<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
								</svg>
								<svg
									viewBox="0 0 5 5"
									class="w-[5px] h-[5px] absolute right-[-2px] bottom-[-2px] fill-sky-300 dark:fill-sky-300/50"
								>
									<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
								</svg>
							</div>
						</template>
					</UNavigationMenu>
				</template>
			</USlideover>
		</nav>
	</header>
</template>
