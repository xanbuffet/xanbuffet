<script setup lang="ts">
import { z } from "zod";
import type { BadgeProps } from "@nuxt/ui";
import type { OrderResponse, Order } from "@/types/common";

const schema = z.object({
	username: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
	order_no: z.string().min(4, "Mã đơn hàng phải có ít nhất 4 ký tự"),
});
const form = ref({ username: "", order_no: "" });

const isLoading = ref<boolean>(false);
const message = ref<string | null>(null);
const order = ref<Order | null>();

const onTracking = async () => {
	isLoading.value = true;
	message.value = null;
	order.value = null;
	try {
		await useFetch("/sanctum/csrf-cookie", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});
		const { data, error } = await useFetch<OrderResponse>("/api/tracking", {
			method: "POST",
			body: form.value,
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});

		if (error.value) {
			message.value = error.value.data?.message || "Đã có lỗi xảy ra";
			return;
		}

		if (data.value) {
			order.value = data.value.order[0];
			message.value = data.value.message;
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

const formatTime = (dateString: string): string => {
	return new Date(dateString).toLocaleString("vi-VN", {
		timeZone: "Asia/Ho_Chi_Minh",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
};
const getStatusDisplay = (status: Order["status"]) => {
	const statusMap: Record<Order["status"], { label: string; color: BadgeProps["color"] }> = {
		pending: { label: "Đang chờ xử lý", color: "neutral" },
		processing: { label: "Đang chờ ship tới lấy", color: "warning" },
		completed: { label: "Hoàn thành", color: "success" },
		cancelled: { label: "Đã hủy", color: "error" },
		shipping: { label: "Ship đang giao tới cho bạn", color: "info" },
	};
	return statusMap[status] || { label: "Không xác định", color: "neutral" };
};
const groupDishesBySet = (dishes: Order["dishes"]) => {
	const grouped = dishes.reduce((acc, dish) => {
		const meal = dish.meal_number;
		if (!acc[meal]) acc[meal] = [];
		acc[meal].push(dish.name);
		return acc;
	}, {} as Record<number, string[]>);

	return Object.entries(grouped)
		.sort(([mealA], [mealB]) => Number(mealA) - Number(mealB))
		.map(([meal, names]) => ({
			meal: Number(meal),
			names: names.join(", "),
		}));
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
				<UCard
					:ui="{ body: 'px-2 py-4 sm:px-4' }"
				>
					<template #header>
						<div class="flex justify-between items-center">
							<h3 class="text-lg font-semibold">
								Thông tin đơn hàng
							</h3>
							<UButton
								variant="ghost"
								icon="i-lucide-refresh-cw"
								label="Tra cứu lại"
								@click="onTracking"
							/>
						</div>
					</template>

					<div class="space-y-4">
						<div class="flex items-start mb-2">
							<span class="text-muted w-32 md:w-40 text-left">Mã đơn hàng:</span>
							<span class="font-medium">{{ order.order_no }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-32 md:w-40 text-left">Trạng thái:</span>
							<UBadge
								class="ml-0"
								:color="getStatusDisplay(order.status).color"
							>
								{{ getStatusDisplay(order.status).label }}
							</UBadge>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-32 md:w-40 text-left">Thành tiền:</span>
							<span class="font-medium">{{ new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total_price) }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-32 md:w-40 text-left">Ngày đặt:</span>
							<span class="font-medium">{{ formatTime(order.created_at) }}</span>
						</div>
						<div>
							<span class="text-muted">Chi tiết món ăn:</span>
							<ul class="list-disc pl-5 mt-2">
								<li
									v-for="{ meal, names } in groupDishesBySet(order.dishes)"
									:key="meal"
								>
									Suất {{ meal }}: {{ names }}
								</li>
							</ul>
						</div>
					</div>
				</UCard>
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
