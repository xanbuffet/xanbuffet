export default defineNuxtRouteMiddleware(async () => {
	const userStore = useUserStore();

	const isValid = await userStore.checkAuth();

	if (!isValid) {
		return navigateTo("/");
	}
});
