import type { Dish, Menu } from "@/types/common";

export const useMenuStore = defineStore("menu", {
	state: () => ({
		menu: ref<Dish[]>([]),
		error: ref<string | null>(null),
		loading: ref<boolean>(false),
	}),

	actions: {
		async fetchMenu() {
			const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
			const today = new Date();
			const dayOfWeek = days[today.getDay()];

			this.loading = true;
			this.error = null;

			try {
				const response = await $fetch<Menu>(`/api/menus/${dayOfWeek}`, {
					baseURL: useRuntimeConfig().public.apiBaseUrl,
					headers: {
						Accept: "application/json",
					},
				});

				this.menu = response.data.dishes.map(dish => ({
					id: dish.id,
					name: dish.name,
					image: dish.image,
					selected: false,
				}));
			}
			catch (err) {
				console.error("Error fetching menu:", err);
				let errorMessage = "Không thể tải thực đơn. Vui lòng thử lại sau.";
				if (typeof err === "object" && err !== null && "status" in err) {
					if (err.status === 404) {
						errorMessage = "Không tìm thấy thực đơn cho ngày này.";
					}
					else if (err.status === 500) {
						errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
					}
				}
				this.error = errorMessage;

				const toast = useToast();
				toast.add({
					title: "Uh oh! Có lỗi xảy ra.",
					description: errorMessage,
					icon: "i-lucide-wifi",
					color: "error",
				});
			}
			finally {
				this.loading = false;
			}
		},
		clearMenu() {
			this.menu = [];
		},
	},

	getters: {
		getMenu: state => state.menu,
		isLoading: state => state.loading,
		getError: state => state.error,
	},

	persist: {
		storage: piniaPluginPersistedstate.localStorage(),
	},
});
