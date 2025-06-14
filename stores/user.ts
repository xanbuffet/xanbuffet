import type { User, UserResponse } from "@/types/common";

export const useUserStore = defineStore("user", {
	state: () => ({
		user: null as User | null,
	}),
	getters: {
		isAuthenticated: (state): boolean => !!state.user,
		userId: (state): number | null => state.user?.id || null,
		userFullName: (state): string | null => state.user?.name || null,
		userUsername: (state): string | null => state.user?.username || null,
		userAddress: (state): string | null => state.user?.address || null,
	},
	actions: {
		setUser(user: User | null) {
			this.user = user;
		},
		async initCsrf() {
			try {
				await useFetch("/sanctum/csrf-cookie", {
					baseURL: useRuntimeConfig().public.apiBaseUrl,
					credentials: "include",
				});
			}
			catch (err) {
				console.error("Failed to initialize CSRF token:", err);
			}
		},
		async checkAuth() {
			try {
				const data = await $fetch<UserResponse>("/api/users", {
					baseURL: useRuntimeConfig().public.apiBaseUrl,
					credentials: "include",
					headers: {
						Accept: "application/json",
					},
				});

				if (data) {
					this.setUser(data.data);
					return true;
				}
			}
			catch (err) {
				await this.logout();
				console.error("Auth check failed:", err);
				this.user = null;
				return false;
			}
		},
		async refreshAuth() {
			return await this.checkAuth();
		},
		async logout() {
			try {
				await useFetch("/api/logout", {
					baseURL: useRuntimeConfig().public.apiBaseUrl,
					method: "POST",
					credentials: "include",
					headers: {
						Accept: "application/json",
					},
				});

				this.user = null;
				return navigateTo("/");
			}
			catch (err) {
				console.error("Logout failed:", err);
				return false;
			}
		},
	},
	persist: {
		storage: piniaPluginPersistedstate.localStorage(),
	},
});
