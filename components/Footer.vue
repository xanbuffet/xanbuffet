<script setup lang="ts">
</script>

<template>
	<USeparator
		icon="i-simple-icons-nuxtdotjs"
		class="h-px"
	/>
	<UContainer>
		<div class="flex flex-wrap justify-between gap-12 md:gap-24 py-8 lg:py-12 border-b border-default">
			<div class="mr-auto w-full md:w-3/7 lg:w-auto">
				<NuxtLink
					to="/"
					class="inline-flex items-center gap-2"
				>
					XAN LOGO
				</NuxtLink>
				<p class="mt-4 text-sm text-gray-700 xl:max-w-md">
					Website description
				</p>
			</div>
			<div class="w-3/7 lg:w-auto">
				<div class="mb-2 font-semibold">
					Thông tin
				</div>
				<div class="text-sm">
					<ULink
						to="/about"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Về chúng tôi
					</ULink>
					<ULink
						to="/careers"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Tuyển dụng
					</ULink>
					<ULink
						to="/address"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Địa chỉ
					</ULink>
				</div>
			</div>
			<div class="w-3/7 lg:w-auto">
				<div class="mb-1 font-semibold">
					Đặt hàng
				</div>
				<div class="text-sm">
					<ULink
						to="/order"
						class="py-1.5 block hover:text-success"
						inactive-class="text-primary"
					>
						Thông qua website
					</ULink>
					<ULink
						to="/order"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Grab Food
					</ULink>
					<ULink
						to="/address"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Bee Food
					</ULink>
					<ULink
						to="/address"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Shoppe Food
					</ULink>
				</div>
			</div>
			<div class="w-3/7 lg:w-auto">
				<div class="mb-1 font-semibold">
					Chăm sóc khách hàng
				</div>
				<div class="text-sm">
					<ULink
						to="/about"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Zalo
					</ULink>
					<ULink
						to="/about"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						Messenger
					</ULink>
					<ULink
						to="/about"
						class="py-1.5 block hover:text-primary"
						inactive-class="text-default"
					>
						TikTok
					</ULink>
				</div>
			</div>
		</div>
	</UContainer>
	<div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3">
		<div class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-3 lg:order-3">
			<UButton
				to="https://facebook.com/"
				icon="i-logos-facebook"
				target="_blank"
				variant="outline"
				aria-label="Facebook"
			/>
			<UButton
				to="#"
				target="_blank"
				icon="i-logos-tiktok-icon"
				aria-label="TikTok"
				color="neutral"
				variant="outline"
			/>
			<UButton
				to="#"
				target="_blank"
				icon="i-simple-icons-zalo"
				color="info"
				aria-label="Zalo"
				variant="outline"
			/>
		</div>
		<div class="mt-3 lg:mt-0 lg:order-2 flex items-center justify-center" />
		<div class="flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1">
			<p class="text-muted text-sm">
				&copy; {{ new Date().getFullYear() }} XanBuffet. All rights reserved.
			</p>
		</div>
	</div>
</template>
