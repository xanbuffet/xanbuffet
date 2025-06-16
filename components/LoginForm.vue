<script setup lang="ts">
import { z } from "zod";
import type { LoginForm, AuthResponse } from "@/types/common";

const props = defineProps({
	redirectUrl: String,
	message: String,
});

const user = useUserStore();
const auth = useAuthStore();
const form = ref<LoginForm>({ username: "", password: "" });
const isLoading = ref<boolean>(false);
const errorMsg = ref<string>("");
const showPw = ref(false);

const schema = z.object({
	username: z
		.string()
		.min(1, "Vui lòng cung cấp số điện thoại")
		.regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
	password: z
		.string()
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const onLogin = async (): Promise<void> => {
	isLoading.value = true;
	errorMsg.value = "";
	try {
		await $fetch("/sanctum/csrf-cookie", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});
		const response = await $fetch<AuthResponse>("/api/login1", {
			method: "POST",
			body: form.value,
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		}).catch(err => errorMsg.value = err.data.message || "Đã có lỗi xảy ra");

		if (response) {
			user.setUser(response.data);
			auth.isVisible = false;
			refreshCookie("xan_buffet_session");
			await navigateTo(props.redirectUrl ?? "/");
		}
	}
	catch (err) {
		console.log(err);
		errorMsg.value = "Không thể kết nối đến server";
	}
	finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<div>
		<h4 class="mb-5 md:mb-10 text-center">
			<p class="uppercase text-lg md:text-xl font-semibold">
				Đăng Nhập
			</p>
			<p class="text-muted text-sm font-normal">
				{{ message ?? 'Theo dõi đơn hàng và nhận nhiều ưu đãi thành viên' }}
			</p>
		</h4>
		<p
			v-if="errorMsg"
			class="text-red-500 my-3 md:my-5 text-center"
		>
			{{ errorMsg }}
		</p>
		<UForm
			:schema="schema"
			:state="form"
			class="mx-auto space-y-4"
			:validate-on="['change', 'input']"
			@submit="onLogin"
		>
			<UFormField
				label="Số điện thoại"
				name="username"
				required
			>
				<UInput
					v-model="form.username"
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
					v-model="form.password"
					variant="soft"
					class="w-full"
					placeholder="Nhập mật khẩu"
					:type="showPw ? 'text' : 'password'"
					:ui="{ trailing: 'pe-1' }"
				>
					<template #trailing>
						<UButton
							color="neutral"
							variant="link"
							size="sm"
							:icon="showPw ? 'i-lucide-eye-off' : 'i-lucide-eye'"
							:aria-label="showPw ? 'Hide password' : 'Show password'"
							:aria-pressed="showPw"
							aria-controls="password"
							@click="showPw = !showPw"
						/>
					</template>
				</UInput>
			</UFormField>
			<UButton
				:disabled="isLoading"
				type="submit"
				class="w-full justify-center hover:cursor-pointer"
			>
				{{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
				<UIcon
					name="i-lucide-arrow-right"
					class="ml-2"
				/>
			</UButton>
		</UForm>
	</div>
</template>
