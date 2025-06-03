<script setup lang="ts"></script>

<template>
	<div>
		<h4 class="uppercase text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">
			Đăng Ký
		</h4>
		<UForm class="mx-auto space-y-4">
			<UFormField
				label="Số điện thoại"
				name="phone"
				required
			>
				<UInput
					type="tel"
					variant="soft"
					class="w-full"
					autocomplete="tel"
					placeholder="Nhập số điện thoại"
				/>
			</UFormField>
			<UFormField
				label="Mật khẩu"
				required
				name="password"
			>
				<UInput
					variant="soft"
					class="w-full"
					type="password"
				/>
			</UFormField>
			<UFormField
				label="Xác nhận mật khẩu"
				required
				name="confirm_password"
			>
				<UInput
					variant="soft"
					class="w-full"
					type="password"
				/>
			</UFormField>
			<UButton
				type="submit"
				class="w-full justify-center"
			>
				Đăng ký
				<UIcon
					name="i-lucide-arrow-right"
					class="ml-2"
				/>
			</UButton>
		</UForm>
	</div>
</template>
