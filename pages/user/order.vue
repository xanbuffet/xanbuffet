<script setup lang="ts">
import type { TabsItem, BadgeProps } from "@nuxt/ui";
import type { OrderResponse, Order } from "@/types/common";

definePageMeta({
	middleware: ["auth"],
});

const orderStatusTabs = [
	{
		value: "0",
		icon: "i-lucide-circle-fading-arrow-up",
		label: "Đang xử lý",
		slot: "pending" as const,
	},
	{
		value: "1",
		icon: "i-lucide-clock-4",
		label: "Đang chờ ship",
		slot: "processing" as const,
	},
	{
		value: "2",
		icon: "i-lucide-truck",
		label: "Đang giao",
		slot: "shipping" as const,
	},
	{
		value: "3",
		icon: "i-lucide-check-check",
		label: "Hoàn thành",
		slot: "completed" as const,
	},
] satisfies TabsItem[];
const activeTab = ref<string>("0");
const orders = ref<Order[]>([]);
const isLoading = ref<boolean>(false);
const message = ref<string | null>(null);

const fetchOrders = async () => {
	isLoading.value = true;
	try {
		const { data, error } = await useFetch<{ data: Order[] }>("/api/orders", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			credentials: "include",
		});

		if (error.value) {
			message.value = error.value.data?.message || "Đã có lỗi xảy ra";
			return;
		}

		if (data.value) {
			orders.value = data.value.data;
		}
	}
	catch (err) {
		console.log(err);
		message.value = "Không thể tải danh sách đơn hàng";
	}
	finally {
		isLoading.value = false;
	}
};

// Lọc đơn hàng theo trạng thái
const filteredOrders = computed(() => {
	const statusMap: { [key: string]: Order["status"] } = {
		0: "pending",
		1: "processing",
		2: "shipping",
		3: "completed",
	};
	const currentStatus = statusMap[activeTab.value];
	return orders.value.filter(order => order.status === currentStatus);
});

// Gọi API khi component được mount
onMounted(() => {
	fetchOrders();
});

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
const formatPrice = (price: number) => {
	return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
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
	<UContainer class="my-5 md:my-10 px-2">
		<h4 class="uppercase font-bold text-center text-2xl md:text-3xl my-5 md:my-10">
			ĐƠN HÀNG CỦA BẠN
		</h4>
		<UTabs
			v-model="activeTab"
			:items="orderStatusTabs"
			variant="pill"
			class="my-5"
			:ui="{
				trigger: 'flex flex-col md:inline-flex md:flex-row text-xs md:text-sm',
				label: 'overflow-visible',
				content: 'mt-4 md:mt-6',
			}"
		>
			<template #pending>
				<div
					v-if="isLoading"
					class="text-center"
				>
					<USpinner />
				</div>
				<div
					v-else-if="message"
					class="text-center text-red-500"
				>
					{{ message }}
				</div>
				<div
					v-else-if="filteredOrders.length === 0"
					class="text-center text-gray-500"
				>
					Không có đơn hàng đang xử lý
				</div>
				<div
					v-else
					class="space-y-4"
				>
					<div
						v-for="order in filteredOrders"
						:key="order.id"
						class="border rounded-lg p-4"
					>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Mã đơn hàng:</span>
							<span class="font-medium">{{ order.order_no }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Trạng thái:</span>
							<UBadge
								:color="getStatusDisplay(order.status).color"
								class="ml-0"
							>
								{{ getStatusDisplay(order.status).label }}
							</UBadge>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Thành tiền:</span>
							<span class="font-medium">{{ formatPrice(order.total_price) }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Ngày đặt:</span>
							<span class="font-medium">{{ formatTime(order.created_at) }}</span>
						</div>
						<div class="flex items-start">
							<span class="text-muted w-[120px] text-left">Món ăn:</span>
							<div class="font-medium">
								<div
									v-for="dish in order.dishes"
									:key="dish.id"
									class="flex items-center gap-2"
								>
									<img
										:src="dish.image"
										alt="dish"
										class="w-10 h-10 object-cover rounded"
									>
									<span>{{ dish.name }} (x{{ dish.meal_number }})</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template #processing>
				<div
					v-if="isLoading"
					class="text-center"
				>
					<USpinner />
				</div>
				<div
					v-else-if="message"
					class="text-center text-red-500"
				>
					{{ message }}
				</div>
				<div
					v-else-if="filteredOrders.length === 0"
					class="text-center text-gray-500"
				>
					Không có đơn hàng đang chờ ship
				</div>
				<div
					v-else
					class="space-y-4"
				>
					<div
						v-for="order in filteredOrders"
						:key="order.id"
						class="border rounded-lg p-4"
					>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Mã đơn hàng:</span>
							<span class="font-medium">{{ order.order_no }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Trạng thái:</span>
							<UBadge
								:color="getStatusDisplay(order.status).color"
								class="ml-0"
							>
								{{ getStatusDisplay(order.status).label }}
							</UBadge>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Thành tiền:</span>
							<span class="font-medium">{{ formatPrice(order.total_price) }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Ngày đặt:</span>
							<span class="font-medium">{{ formatTime(order.created_at) }}</span>
						</div>
						<div class="flex items-start">
							<span class="text-muted w-[120px] text-left">Món ăn:</span>
							<div class="font-medium">
								<div
									v-for="dish in order.dishes"
									:key="dish.id"
									class="flex items-center gap-2"
								>
									<img
										:src="dish.image"
										alt="dish"
										class="w-10 h-10 object-cover rounded"
									>
									<span>{{ dish.name }} (x{{ dish.meal_number }})</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template #shipping>
				<div
					v-if="isLoading"
					class="text-center"
				>
					<USpinner />
				</div>
				<div
					v-else-if="message"
					class="text-center text-red-500"
				>
					{{ message }}
				</div>
				<div
					v-else-if="filteredOrders.length === 0"
					class="text-center text-gray-500"
				>
					Không có đơn hàng đang giao
				</div>
				<div
					v-else
					class="space-y-4"
				>
					<div
						v-for="order in filteredOrders"
						:key="order.id"
						class="border rounded-lg p-4"
					>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Mã đơn hàng:</span>
							<span class="font-medium">{{ order.order_no }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Trạng thái:</span>
							<UBadge
								:color="getStatusDisplay(order.status).color"
								class="ml-0"
							>
								{{ getStatusDisplay(order.status).label }}
							</UBadge>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Thành tiền:</span>
							<span class="font-medium">{{ formatPrice(order.total_price) }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Ngày đặt:</span>
							<span class="font-medium">{{ formatTime(order.created_at) }}</span>
						</div>
						<div class="flex items-start">
							<span class="text-muted w-[120px] text-left">Món ăn:</span>
							<div class="font-medium">
								<div
									v-for="dish in order.dishes"
									:key="dish.id"
									class="flex items-center gap-2"
								>
									<img
										:src="dish.image"
										alt="dish"
										class="w-10 h-10 object-cover rounded"
									>
									<span>{{ dish.name }} (x{{ dish.meal_number }})</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template #completed>
				<div
					v-if="isLoading"
					class="text-center"
				>
					<USpinner />
				</div>
				<div
					v-else-if="message"
					class="text-center text-red-500"
				>
					{{ message }}
				</div>
				<div
					v-else-if="filteredOrders.length === 0"
					class="text-center text-gray-500"
				>
					Không có đơn hàng hoàn thành
				</div>
				<div
					v-else
					class="space-y-4"
				>
					<div
						v-for="order in filteredOrders"
						:key="order.id"
						class="border rounded-lg p-4"
					>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Mã đơn hàng:</span>
							<span class="font-medium">{{ order.order_no }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Trạng thái:</span>
							<UBadge
								:color="getStatusDisplay(order.status).color"
								class="ml-0"
							>
								{{ getStatusDisplay(order.status).label }}
							</UBadge>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Thành tiền:</span>
							<span class="font-medium">{{ formatPrice(order.total_price) }}</span>
						</div>
						<div class="flex items-start mb-2">
							<span class="text-muted w-[120px] text-left">Ngày đặt:</span>
							<span class="font-medium">{{ formatTime(order.created_at) }}</span>
						</div>
						<div class="flex items-start">
							<span class="text-muted w-[120px] text-left">Món ăn:</span>
							<div class="font-medium">
								<div
									v-for="dish in order.dishes"
									:key="dish.id"
									class="flex items-center gap-2"
								>
									<img
										:src="dish.image"
										alt="dish"
										class="w-10 h-10 object-cover rounded"
									>
									<span>{{ dish.name }} (x{{ dish.meal_number }})</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</UTabs>
	</UContainer>
</template>
