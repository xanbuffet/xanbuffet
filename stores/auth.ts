export const useAuthStore = defineStore("auth", {
	state: () => ({
		isVisible: false as boolean,
		mode: "login" as "login" | "signup",
	}),

	actions: {
		showModal(mode: "login" | "signup" = "login") {
			this.isVisible = true;
			this.mode = mode;
		},
		hideModal() {
			this.isVisible = false;
		},
		toggleMode() {
			this.mode = this.mode === "login" ? "signup" : "login";
		},
	},
});
