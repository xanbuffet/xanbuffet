<script setup lang="ts">
const router = useRouter();
const toast = useToast();
const user = useUserStore();

interface LoginForm {
	username: string;
	password: string;
}
interface ApiResponse {
	message: string;
	data: {
		name: string;
		username: string;
		is_admin: boolean;
		token: string;
		address: string | null;
	};
}
interface ApiError {
	message?: string;
}

const form = ref<LoginForm>({
	username: "",
	password: "",
});
const loading = ref<boolean>(false);
const error = ref<string>("");

const onLogin = async (): Promise<void> => {
	loading.value = true;
	error.value = "";
	try {
		// Lấy CSRF token
		await $fetch("/sanctum/csrf-cookie", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});
		// Gọi API đăng nhập
		const response = await $fetch<ApiResponse>("/api/login", {
			method: "POST",
			body: form.value,
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});
		user.setUser({
			name: response.data.name,
			username: response.data.username,
			address: response.data.address,
			is_admin: response.data.is_admin,
			token: response.data.token,
		});
		router.push("/dashboard");
	}
	catch (err) {
		const fetchError = err as { data?: ApiError };
		error.value = fetchError.data?.message || "Đăng nhập thất bại";
		toast.add({
			title: "Uh oh! Có lỗi xảy ra.",
			description: error.value,
			icon: "i-lucide-octagon-alert",
			color: "error",
		});
	}
	finally {
		loading.value = false;
	}
};
</script>

<template>
	<div>
		<h4 class="uppercase text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">
			Đăng Nhập
		</h4>
		<p
			v-if="error"
			class="text-red-500 my-3 md:my-5 text-center"
		>
			{{ error }}
		</p>
		<form
			class="mx-auto space-y-4"
			@submit.prevent="onLogin"
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
					type="password"
				/>
			</UFormField>
			<UButton
				type="submit"
				class="w-full justify-center"
			>
				Đăng nhập
				<UIcon
					name="i-lucide-arrow-right"
					class="ml-2"
				/>
			</UButton>
		</form>
	</div>
</template>
