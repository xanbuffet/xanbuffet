export default defineNuxtRouteMiddleware(() => {
	const user = useUserStore();

	if (!user.isAuthenticated) {
		return navigateTo("/");
	}
});
