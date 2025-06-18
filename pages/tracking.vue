<script setup lang="ts">
import { z } from "zod";
import type { TrackingOrderResponse, Order } from "@/types/common";

const orderStore = useOrderStore();

const schema = z.object({
	username: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
	order_no: z.string().min(4, "Mã đơn hàng phải có ít nhất 4 ký tự"),
});
const form = ref({ username: orderStore.tracking?.phone, order_no: orderStore.tracking?.order_no });

const isLoading = ref<boolean>(false);
const message = ref<string | null>(null);
const order = ref<Order | null>();

const onTracking = async () => {
	isLoading.value = true;
	message.value = null;
	order.value = null;
	try {
		orderStore.tracking = { phone: form.value.username ?? "", order_no: form.value.order_no ?? "" };

		await $fetch("/sanctum/csrf-cookie", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
		});
		const response = await $fetch<TrackingOrderResponse>("/api/tracking", {
			method: "POST",
			body: form.value,
			baseURL: useRuntimeConfig().public.apiBaseUrl,
		}).catch((err) => {
			message.value = err.data.message || "Đã có lỗi xảy ra";
			return;
		});

		if (response) {
			order.value = response.data;
			message.value = response.message;
		}
	}
	catch (err) {
		console.log(err);
		message.value = "Không thể kết nối đến server";
	}
	finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<UContainer class="my-5 md:my-10">
		<UForm
			:schema="schema"
			:state="form"
			class="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-6 md:place-items-baseline gap-y-4 md:gap-x-4 md:gap-y-0"
			@submit="onTracking"
		>
			<UFormField
				name="username"
				type="tel"
				required
				class="md:col-span-2 w-full"
			>
				<UInput
					v-model="form.username"
					class="w-full"
					icon="i-lucide-phone"
					placeholder=""
					:ui="{ base: 'peer', leadingIcon: 'size-4' }"
				>
					<label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium pl-7 pr-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
						<span class="inline-flex bg-default px-1">Số điện thoại</span>
					</label>
				</UInput>
			</UFormField>
			<UFormField
				name="order_no"
				required
				class="md:col-span-2 md:col-start-3 w-full"
			>
				<UInput
					v-model="form.order_no"
					icon="i-lucide-scan-barcode"
					placeholder=""
					class="w-full"
					:ui="{ base: 'peer', leadingIcon: 'size-4' }"
				>
					<label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium pl-7 pr-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
						<span class="inline-flex bg-default px-1">Mã đơn hàng</span>
					</label>
				</UInput>
			</UFormField>
			<div class="md:col-span-2 md:col-start-5 w-full flex items-center justify-end">
				<UButton
					:disabled="isLoading"
					trailing-icon="i-lucide:package-search"
					type="submit"
					class="hover:cursor-pointer"
				>
					Kiểm Tra
				</UButton>
			</div>
		</UForm>
		<div class="w-full max-w-3xl mx-auto mt-6">
			<div
				v-if="isLoading"
				class="text-center"
			>
				<UProgress
					:value="null"
					animation="carousel"
					class="mx-auto w-32"
				/>
				<p class="mt-2 text-gray-600">
					Đang tra cứu đơn hàng...
				</p>
			</div>

			<UAlert
				v-else-if="message && !order"
				:description="message"
				color="error"
				icon="i-lucide-alert-circle"
				class="mt-4"
			/>

			<div
				v-else-if="order"
				class="space-y-4"
			>
				<OrderCard
					:key="order.id"
					:order="order"
				/>
			</div>

			<div
				v-else
				class="text-center text-gray-500 mt-6"
			>
				Vui lòng nhập số điện thoại và mã đơn hàng để tra cứu.
			</div>
		</div>
	</UContainer>
</template>
