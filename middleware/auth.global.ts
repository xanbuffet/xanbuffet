export default defineNuxtRouteMiddleware(async (to) => {
	const publicPages = ["/login", "/register"];
	if (publicPages.includes(to.path)) {
		return;
	}

	const userStore = useUserStore();

	if (userStore.isAuthenticated) {
		const isValid = await userStore.checkAuth();
		if (!isValid) {
			return;
		}
	}
});
