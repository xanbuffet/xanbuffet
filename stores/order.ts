import type { OrderResponse, Order, JustTracking } from "~/types/common";

export const useOrderStore = defineStore("order", {
	state: () => ({
		orders: [] as Order[],
		loading: false,
		error: null as string | null,
		tracking: null as JustTracking | null,
	}),

	actions: {
		async fetchOrders() {
			this.loading = true;
			this.error = null;

			try {
				const response = await $fetch<OrderResponse>("/api/orders", {
					baseURL: useRuntimeConfig().public.apiBaseUrl,
					credentials: "include",
					headers: {
						Accept: "application/json",
					},
				});

				this.orders = response.data || [];
			}
			catch (err) {
				this.error = "Không thể tải danh sách đơn hàng";
				console.error("Fetch orders failed:", err);
			}
			finally {
				this.loading = false;
			}
		},

		async refreshOrder(orderId: number) {
			this.loading = true;
			this.error = null;

			try {
				const response = await $fetch<Order>(`/api/orders/${orderId}`, {
					baseURL: useRuntimeConfig().public.apiBaseUrl,
					credentials: "include",
					headers: {
						Accept: "application/json",
					},
				});

				const index = this.orders.findIndex(order => order.id === orderId);
				if (index !== -1) {
					this.orders[index] = response;
				}
				else {
					this.orders.push(response);
				}
				return response;
			}
			catch (err) {
				console.log("Refresh order failed:", err);
				throw Error;
			}
			finally {
				this.loading = false;
			}
		},

		clearError() {
			this.error = null;
		},

		setTracking(tracking: JustTracking | null) {
			this.tracking = tracking;
		},
	},

	persist: {
		storage: piniaPluginPersistedstate.localStorage(),
	},
});
