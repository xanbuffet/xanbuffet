<script setup lang="ts">
import type { BadgeProps } from "@nuxt/ui";
import type { Order } from "@/types/common";

const props = defineProps<{ order: Order }>();

const toast = useToast();
const route = useRoute();
const orderStore = useOrderStore();
const isRefreshing = ref(false);
const refreshError = ref<string | null>(null);

const onRefresh = async () => {
	isRefreshing.value = true;
	refreshError.value = null;

	try {
		const res = await orderStore.refreshOrder(props.order.id);

		if (res.status !== props.order.status) {
			const statusMap: { [key: string]: string } = {
				pending: "Đang xử lý",
				processing: "Đang chờ ship",
				shipping: "Đang giao",
				completed: "Hoàn thành",
			};
			const iconMap: { [key: string]: string } = {
				pending: "i-lucide-circle-fading-arrow-up",
				processing: "i-lucide-clock-4",
				shipping: "i-lucide-truck",
				completed: "i-lucide-check-check",
			};
			toast.add({
				title: statusMap[res.status],
				description: "Trạng thái đơn hàng đã được cập nhật.",
				icon: iconMap[res.status],
				color: "success",
			});
		}
	}
	catch (err) {
		refreshError.value = `Không thể làm mới đơn hàng #${props.order.order_no}`;
		console.error(err);
	}
	finally {
		isRefreshing.value = false;
	}
};
const clearRefreshError = () => {
	refreshError.value = null;
	orderStore.clearError();
};

const formatTime = (time: string): string => {
	return new Date(time).toLocaleString("vi-VN", {
		timeZone: "Asia/Ho_Chi_Minh",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
};
const formatStatus = (status: Order["status"]) => {
	const statusMap: Record<Order["status"], { label: string; color: BadgeProps["color"] }> = {
		pending: { label: "Đang chờ xử lý", color: "neutral" },
		processing: { label: "Đang chờ ship tới lấy", color: "warning" },
		completed: { label: "Hoàn thành", color: "success" },
		cancelled: { label: "Đã hủy", color: "error" },
		shipping: { label: "Ship đang giao tới cho bạn", color: "info" },
	};
	return statusMap[status] || { label: "Không xác định", color: "neutral" };
};
const formatPrice = (price: number) => {
	return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};
const formatDishes = (dishes: Order["dishes"]) => {
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
	<UCard
		:ui="{ body: 'px-2 py-4 sm:px-4' }"
	>
		<template #header>
			<div class="flex justify-between items-center">
				<h3 class="text-lg font-semibold">
					Thông tin đơn hàng
				</h3>
				<UButton
					v-if="route.name != 'tracking'"
					variant="ghost"
					icon="i-lucide-refresh-cw"
					label="Làm mới"
					:loading="isRefreshing"
					@click="onRefresh"
				/>
			</div>
		</template>

		<UAlert
			v-if="refreshError"
			class="mb-4"
			color="error"
			variant="solid"
			:title="refreshError"
			:close-button="{ icon: 'i-heroicons-x-mark-20-solid' }"
			@close="clearRefreshError"
		/>

		<div
			v-if="isRefreshing"
			class="space-y-4"
		>
			<USkeleton class="h-6 w-full" />
			<USkeleton class="h-6 w-full" />
			<USkeleton class="h-6 w-full" />
			<USkeleton class="h-6 w-full" />
			<USkeleton class="h-6 w-full" />
			<USkeleton class="h-10 w-full" />
		</div>

		<div
			v-else
			class="space-y-4"
		>
			<div class="flex items-start mb-2">
				<span class="text-muted min-w-32 md:min-w-40 text-left">Mã đơn hàng:</span>
				<span class="font-medium">{{ order.order_no }}</span>
			</div>
			<div class="flex items-start mb-2">
				<span class="text-muted min-w-32 md:min-w-40 text-left">Trạng thái:</span>
				<UBadge
					class="ml-0"
					:color="formatStatus(order.status).color"
				>
					{{ formatStatus(order.status).label }}
				</UBadge>
			</div>
			<div class="flex items-start mb-2">
				<span class="text-muted min-w-32 md:min-w-40 text-left">Thành tiền:</span>
				<span class="font-medium">{{ formatPrice(order.total_price) }}</span>
			</div>
			<div class="flex items-start mb-2">
				<span class="text-muted min-w-32 md:min-w-40 text-left">Ngày đặt:</span>
				<span class="font-medium">{{ formatTime(order.created_at) }}</span>
			</div>
			<div class="flex items-start mb-2">
				<span class="text-muted min-w-32 md:min-w-40 text-left">Địa chỉ:</span>
				<span class="font-medium">{{ order.address }}</span>
			</div>
			<div>
				<span class="text-muted">Chi tiết món ăn:</span>
				<ul class="list-disc pl-5 mt-2">
					<li
						v-for="{ meal, names } in formatDishes(order.dishes)"
						:key="meal"
					>
						Suất {{ meal }}: {{ names }}
					</li>
				</ul>
			</div>
		</div>
	</UCard>
</template>
