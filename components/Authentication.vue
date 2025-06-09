<script setup lang="ts">
const auth = useAuthStore();
</script>

<template>
	<UModal
		v-model:open="auth.isVisible"
		:ui="{ content: 'max-w-4xl' }"
	>
		<template #content>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
				<div
					class="hidden md:block bg-primary/20 dark:bg-primary/10 rounded-l-lg bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10"
				>
					<div class="p-4 py-10 px-5 flex flex-col items-center justify-start h-full gap-4">
						<div v-if="auth.mode == 'login'">
							<NuxtImg
								placeholder
								src="/images/logo.jpg"
								preload
								class="rounded-full aspect-square object-cover mx-auto"
							/>
							<h3 class="text-4xl font-bold tracking-wide text-center mb-8 mt-2">
								Xan nhớ bạn rồi!
							</h3>
							<p class="flex items-center justify-center gap-x-1">
								<UIcon
									name="i-lucide-message-circle-heart"
									class="size-5 text-error"
								/>
								Tiếp tục ăn cùng XAN nhé
							</p>
						</div>
						<div v-else>
							<NuxtImg
								placeholder
								src="/images/logo.jpg"
								preload
								class="rounded-full aspect-square object-cover mx-auto my-8"
							/>
							<h3 class="text-4xl font-bold tracking-wide text-center mb-8 mt-2">
								Hi, Chào bạn!
							</h3>
							<p class="flex items-center justify-center gap-x-1">
								<UIcon
									name="i-lucide-message-circle-heart"
									class="size-5 text-error"
								/>
								Xan rất vui khi được phục vụ bạn.
							</p>
						</div>
					</div>
				</div>
				<div class="py-4 pr-4 pl-4 md:pl-0">
					<div
						v-if="auth.mode == 'login'"
						class="py-5 md:py-10 flex flex-col gap-4"
					>
						<LoginForm message="Chào mừng bạn quay trở lại" />
						<USeparator label="Hoặc" />
						<div>
							Bạn chưa có tài khoản? Hãy
							<UButton
								color="primary"
								variant="link"
								@click="auth.toggleMode()"
							>
								Đăng Ký
							</UButton>
						</div>
					</div>
					<div
						v-else
						class="py-5 md:py-10 flex flex-col gap-4"
					>
						<SignupForm message="Đặt hàng và nhận nhiều ưu đãi khi đăng ký thành viên" />
						<USeparator label="Hoặc" />
						<div>
							Bạn đã có tài khoản?
							<UButton
								color="primary"
								variant="link"
								@click="auth.toggleMode()"
							>
								Đăng nhập
							</UButton>
						</div>
					</div>
				</div>
				<div class=" absolute right-4 top-2">
					<UButton
						icon="i-lucide-circle-x"
						color="neutral"
						variant="link"
						size="xl"
						class="p-0"
						@click="auth.hideModal()"
					/>
				</div>
			</div>
		</template>
	</UModal>
</template>
