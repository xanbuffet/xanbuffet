<script setup lang="ts">
import { z } from "zod";
import type { SignupForm, AuthResponse } from "@/types/common";

const props = defineProps({
	redirectUrl: String,
	message: String,
});

const user = useUserStore();
const auth = useAuthStore();
const form = ref<SignupForm>({ name: "", username: "", password: "", password_confirmation: "" });
const isisLoading = ref<boolean>(false);
const errorMsg = ref<string>("");
const showPw = ref(false);
const showPw2 = ref(false);

const schema = z.object({
	name: z
		.string()
		.min(1, "Vui lòng cung cấp họ và tên"),
	username: z
		.string()
		.min(1, "Vui lòng cung cấp số điện thoại")
		.regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
	password: z
		.string()
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	password_confirmation: z
		.string()
		.min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
}).refine(data => data.password === data.password_confirmation, {
	message: "Mật khẩu và xác nhận mật khẩu không khớp",
	path: ["password_confirmation"],
});

const onSignup = async (): Promise<void> => {
	isisLoading.value = true;
	errorMsg.value = "";
	try {
		await $fetch("/sanctum/csrf-cookie", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});
		const response = await $fetch<AuthResponse>("/api/register", {
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
		isisLoading.value = false;
	}
};
</script>

<template>
	<div>
		<h4 class="mb-5 md:mb-10 text-center">
			<p class="uppercase text-lg md:text-xl font-semibold">
				Đăng Ký
			</p>
			<p class="text-muted text-sm font-normal">
				{{ message ?? 'Nhận nhiều ưu đãi khi đăng ký thành viên' }}
			</p>
		</h4>
		<p
			v-if="errorMsg"
			class="text-red-500 my-3 md:my-5 text-center"
		>
			{{ errorMsg }}
		</p>
		<UForm
			class="mx-auto space-y-4"
			:schema="schema"
			:state="form"
			:validate-on="['change', 'input']"
			@submit="onSignup"
		>
			<UFormField
				label="Họ và tên"
				name="name"
				required
			>
				<UInput
					v-model="form.name"
					type="text"
					variant="soft"
					class="w-full"
					placeholder="Nhập tên của bạn"
				/>
			</UFormField>
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
					placeholder="Nhập mật khẩu"
					variant="soft"
					class="w-full"
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
			<UFormField
				label="Xác nhận mật khẩu"
				required
				name="password_confirmation"
			>
				<UInput
					v-model="form.password_confirmation"
					placeholder="Nhập lại mật khẩu"
					variant="soft"
					class="w-full"
					:type="showPw2 ? 'text' : 'password'"
					:ui="{ trailing: 'pe-1' }"
				>
					<template #trailing>
						<UButton
							color="neutral"
							variant="link"
							size="sm"
							:icon="showPw2 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
							:aria-label="showPw2 ? 'Hide password' : 'Show password'"
							:aria-pressed="showPw2"
							aria-controls="password"
							@click="showPw2 = !showPw2"
						/>
					</template>
				</UInput>
			</UFormField>
			<UButton
				:disabled="isisLoading"
				type="submit"
				class="w-full justify-center hover:cursor-pointer"
			>
				{{ isisLoading ? 'Đang xử lý...' : 'Đăng ký' }}
				<UIcon
					name="i-lucide-arrow-right"
					class="ml-2"
				/>
			</UButton>
		</UForm>
	</div>
</template>
