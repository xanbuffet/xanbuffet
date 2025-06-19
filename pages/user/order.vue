<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { Order } from "@/types/common";

useHead({
	title: "Đơn hàng của bạn",
});

definePageMeta({
	middleware: ["auth"],
});

const orderStore = useOrderStore();
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
const isLoading = ref<boolean>(false);
const message = ref<string | null>(null);

const filteredOrders = computed(() => {
	const statusMap: { [key: string]: Order["status"] } = {
		0: "pending",
		1: "processing",
		2: "shipping",
		3: "completed",
	};
	const currentStatus = statusMap[activeTab.value];
	return orderStore.orders.filter(order => order.status === currentStatus);
});

onMounted(() => {
	orderStore.fetchOrders();
});
</script>

<template>
	<UContainer class="my-5 md:my-10 px-2">
		<h4 class="uppercase font-bold text-center text-2xl md:text-3xl mt-5 mb-8 md:mt-10 md:mb-12">
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
					<OrderCard
						v-for="order in filteredOrders"
						:key="order.id"
						:order="order"
					/>
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
					<OrderCard
						v-for="order in filteredOrders"
						:key="order.id"
						:order="order"
					/>
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
					<OrderCard
						v-for="order in filteredOrders"
						:key="order.id"
						:order="order"
					/>
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
					<OrderCard
						v-for="order in filteredOrders"
						:key="order.id"
						:order="order"
					/>
				</div>
			</template>
		</UTabs>
	</UContainer>
</template>
