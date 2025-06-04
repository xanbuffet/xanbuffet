export interface User {
	name: string | null;
	username: string | null;
	address: string | null;
	is_admin: boolean;
	token: string | null;
}

export const useUserStore = defineStore("user", {
	state: (): User => ({
		name: null,
		username: null,
		address: null,
		is_admin: false,
		token: null,
	}),
	actions: {
		setUser(user: Partial<User>) {
			this.name = user.name ?? null;
			this.username = user.username ?? null;
			this.address = user.address ?? null;
			this.is_admin = user.is_admin ?? false;
			this.token = user.token ?? null;
		},
		clearUser() {
			this.name = null;
			this.username = null;
			this.address = null;
			this.is_admin = false;
			this.token = null;
		},
	},
	persist: {
		storage: piniaPluginPersistedstate.localStorage(),
	},
});
