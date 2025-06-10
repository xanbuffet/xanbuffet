<script setup lang="ts">
import { z } from "zod";
import type { AuthResponse } from "@/types/common";

definePageMeta({
	middleware: ["auth"],
});

const toast = useToast();
const user = useUserStore();
const isLoading = ref(false);
// const errorInfo = ref<string | null>(null);
// const errorPw = ref<string | null>(null);
const showPw = ref(false);
const showPw2 = ref(false);
const showPw3 = ref(false);
const userInfoForm = ref({
	name: user.userFullName ?? "",
	username: user.userUsername ?? "",
	address: user.userAddress ?? "",
});
const userInfoSchema = z.object({
	name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
	username: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
	address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
});
const userPwForm = ref({
	current_pw: "",
	new_pw: "",
	confirm_new_pw: "",
});
const userPwSchema = z.object({
	current_pw: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	new_pw: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	confirm_new_pw: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
}).refine(data => data.new_pw === data.confirm_new_pw, {
	message: "Mật khẩu và xác nhận mật khẩu không khớp",
	path: ["confirm_new_pw"],
});

const userInfoFormRef = useTemplateRef("userInfoFormRef");
const userPwFormRef = useTemplateRef("userPwFormRef");

const onUpdateInfo = async () => {
	const isAuth = await user.checkAuth();
	console.log(isAuth);
	if (userInfoFormRef.value?.dirtyFields.size == 0) {
		toast.add({
			title: "Không cần cập nhật",
			description: "Bạn chưa thực hiện bất kỳ thay đổi nào",
			color: "info",
		});
		return;
	}
	isLoading.value = true;
	try {
		const { data, error } = await useFetch<AuthResponse>(`/api/users/${user.userUsername}`, {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: userInfoForm.value,
			credentials: "include",
		});

		if (data.value?.data) {
			user.setUser(data.value.data);
			toast.add({
				title: data.value.message,
				description: "Hãy kiểm tra các thay đổi để xác nhận",
				color: "success",
			});
		}

		if (error.value) {
			toast.add({
				title: "Oh! Cập nhật thất bại",
				description: error.value.data?.message || "Đã có lỗi xảy ra",
				color: "error",
			});
			return;
		}
	}
	catch (err) {
		console.log(err);
		toast.add({
			title: "Oh! Cập nhật thất bại",
			description: "Không thể kết nối đến server",
			color: "error",
		});
		return;
	}
	finally {
		isLoading.value = false;
	}
};
const onUpdatePassword = () => {

};
</script>

<template>
	<UContainer class="my-5 md:my-10">
		<div class="w-full rounded-md bg-default border border-default px-4 py-2 md:p-4">
			<div class="w-full md:max-w-xl mx-auto space-y-2 text-left md:text-center">
				<h4 class="font-bold text-xl md:text-2xl">
					{{ user.userFullName }}
				</h4>
				<div class="flex items-center md:justify-center gap-x-3 md:text-lg text-primary/80">
					<UIcon name="i-lucide-phone" />
					<p class="tracking-wider">
						{{ user.userUsername }}
					</p>
				</div>
				<div class="flex items-center md:justify-center gap-x-3 md:text-lg">
					<UIcon name="i-lucide-map-pinned" />
					<p>{{ user.userAddress }}</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col md:flex-row gap-4 my-5 md:my-10">
			<div class="flex-1 w-full rounded-md bg-default border border-default px-4 py-2 md:p-4">
				<h4 class="font-bold">
					Thông tin cơ bản
				</h4>
				<UForm
					ref="userInfoFormRef"
					class="mx-auto space-y-4 my-3 md:my-6"
					:schema="userInfoSchema"
					:state="userInfoForm"
					:validate-on="[]"
					@submit="onUpdateInfo"
				>
					<UFormField
						label="Họ và tên"
						name="name"
						required
					>
						<UInput
							v-model="userInfoForm.name"
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
							v-model="userInfoForm.username"
							type="tel"
							variant="soft"
							class="w-full"
							autocomplete="tel"
							placeholder="Nhập số điện thoại"
						/>
					</UFormField>
					<UFormField
						label="Địa chỉ nhận hàng"
						name="address"
						required
					>
						<UInput
							v-model="userInfoForm.address"
							variant="soft"
							class="w-full"
							placeholder="Nhập địa chỉ nhận hàng"
							:ui="{ trailing: 'pe-1' }"
						>
							<template
								v-if="userInfoForm.address?.length"
								#trailing
							>
								<UButton
									color="neutral"
									variant="link"
									size="sm"
									icon="i-lucide-circle-x"
									aria-label="Clear input"
									@click="userInfoForm.address = ''"
								/>
							</template>
						</UInput>
					</UFormField>
					<div class="flex justify-end my-3 md:my-6">
						<UButton
							type="submit"
							:disabled="isLoading"
						>
							{{ isLoading ? 'Đang xử lý...' : 'Xác Nhận' }}
						</UButton>
					</div>
				</UForm>
			</div>
			<div class="flex-1 w-full rounded-md bg-default border border-default px-4 py-2 md:p-4">
				<h4 class="font-bold">
					Thay đổi mật khẩu
				</h4>
				<UForm
					ref="userPwFormRef"
					class="mx-auto space-y-4 my-3 md:my-6"
					:schema="userPwSchema"
					:state="userPwForm"
					:validate-on="[]"
					@submit="onUpdatePassword"
				>
					<UFormField
						label="Mật khẩu hiện tại"
						required
						name="current_pw"
					>
						<UInput
							v-model="userPwForm.current_pw"
							placeholder="Nhập mật khẩu hiện tại"
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
						label="Mật khẩu mới"
						required
						name="new_pw"
					>
						<UInput
							v-model="userPwForm.new_pw"
							placeholder="Nhập mật khẩu mới"
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
					<UFormField
						label="Xác nhận mật khẩu"
						required
						name="confirm_new_pw"
					>
						<UInput
							v-model="userPwForm.confirm_new_pw"
							placeholder="Nhập lại mật khẩu"
							variant="soft"
							class="w-full"
							:type="showPw3 ? 'text' : 'password'"
							:ui="{ trailing: 'pe-1' }"
						>
							<template #trailing>
								<UButton
									color="neutral"
									variant="link"
									size="sm"
									:icon="showPw3 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
									:aria-label="showPw3 ? 'Hide password' : 'Show password'"
									:aria-pressed="showPw3"
									aria-controls="password"
									@click="showPw3 = !showPw3"
								/>
							</template>
						</UInput>
					</UFormField>
					<div class="flex justify-end my-3 md:my-6">
						<UButton type="submit">
							Xác Nhận
						</UButton>
					</div>
				</UForm>
			</div>
		</div>
	</UContainer>
</template>
