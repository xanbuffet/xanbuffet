<script setup lang="ts">
const props = defineProps({
	redirectUrl: String,
});

const router = useRouter();
const toast = useToast();
const user = useUserStore();

interface SignupForm {
	name: string;
	username: string;
	password: string;
	password_confirmation: string;
}
interface ApiResponse {
	message: string;
	data: {
		id: number;
		name: string;
		username: string;
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
		user.setUser({
			id: response.data.id,
			name: response.data.name,
			username: response.data.username,
			address: response.data.address,
			token: response.data.token,
		});
		router.push(props.redirectUrl ?? "/");
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
		<h4 class="mb-3 md:mb-5 text-center">
			<p class="uppercase text-lg md:text-xl font-semibold">
				Đăng Ký
			</p>
			<p class="text-muted text-sm font-normal">
				Nhận nhiều ưu đãi khi đăng ký thành viên
			</p>
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
				type="submit"
				class="w-full justify-center"
			>
				{{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
				<UIcon
					name="i-lucide-arrow-right"
					class="ml-2"
				/>
			</UButton>
		</form>
	</div>
</template>
