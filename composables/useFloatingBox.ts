import { useRoute } from "#app";

export function useFloatingBox() {
	const route = useRoute();

	// Define routes where FloatingBox should NOT be shown
	const hiddenRoutes = ["/order", "/another-route"];

	// Computed property to determine if FloatingBox should be visible
	const isFloatingBoxVisible = computed(() => !hiddenRoutes.includes(route.path));

	return {
		isFloatingBoxVisible,
	};
}
