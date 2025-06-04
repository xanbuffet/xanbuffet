<script setup lang="ts">
const router = useRouter();
const toast = useToast();

interface SignupForm {
	name: string;
	username: string;
	password: string;
	password_confirmation: string;
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

const form = ref<SignupForm>({
	name: "",
	username: "",
	password: "",
	password_confirmation: "",
});
const loading = ref<boolean>(false);
const error = ref<string>("");
const showPw = ref(false);
const showPw2 = ref(false);

const onSignup = async (): Promise<void> => {
	loading.value = true;
	error.value = "";
	try {
		// Lấy CSRF token
		await $fetch("/sanctum/csrf-cookie", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});
		// Gọi API đăng ký
		const response = await $fetch<ApiResponse>("/api/register", {
			method: "POST",
			body: form.value,
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});
		localStorage.setItem("token", response.data.token);
		localStorage.setItem("name", response.data.name);
		localStorage.setItem("username", response.data.username);
		localStorage.setItem("is_admin", response.data.is_admin.toString());
		router.push("/dashboard");
	}
	catch (err) {
		const fetchError = err as { data?: ApiError };
		error.value = fetchError.data?.message || "Đăng ký thất bại";
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
			Đăng Ký
		</h4>
		<p
			v-if="error"
			class="text-red-500 my-3 md:my-5 text-center"
		>
			{{ error }}
		</p>
		<form
			class="mx-auto space-y-4"
			@submit.prevent="onSignup"
		>
			<UFormField
				label="Họ và tên"
				name="name"
				required
			>
				<UInput
					type="text"
					variant="soft"
					class="w-full"
					autocomplete="tel"
					placeholder="Nhập tên của bạn"
				/>
			</UFormField>
			<UFormField
				label="Số điện thoại"
				name="username"
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
					v-model="form.password"
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
				type="submit"
				class="w-full justify-center"
			>
				Đăng ký
				<UIcon
					name="i-lucide-arrow-right"
					class="ml-2"
				/>
			</UButton>
		</form>
	</div>
</template>
