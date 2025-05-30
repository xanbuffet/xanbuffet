<script setup lang="ts">
import type { StepperItem, TabsItem } from "@nuxt/ui";

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

interface Dish {
	id: number;
	name: string;
	image: string | null;
	created_at: string;
	updated_at: string;
	selected: boolean;
}

const steps: StepperItem[] = [
	{
		title: "Chọn món",
		icon: "i-lucide-house",
	},
	{
		title: "Thông tin giao hàng",
		icon: "i-lucide-truck",
	},
	{
		title: "Xác nhận",
		icon: "i-lucide-check-circle",
	},
];
const stepper = useTemplateRef("stepper");

const activeMeal = ref<TabsItem | null>(null);
const meals = ref<TabsItem[]>([{ id: 1, title: "Suất 1" }]);
const dishesOfMeal = ref<Dish[]>([]);

const getDayOfWeek = () => {
	const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	const today = new Date();
	return days[today.getDay()];
};
const fetchMenu = async () => {
	const dayOfWeek = getDayOfWeek();
	const { data, pending, error } = await useFetch(`${apiBaseUrl}/api/menu/${dayOfWeek}`, {
		transform: (response: any) => {
			return response.dishes.map((dish: any) => ({
				id: dish.id,
				name: dish.name,
				image: dish.image,
				created_at: dish.created_at,
				updated_at: dish.updated_at,
				selected: false,
			}));
		},
	});

	if (data.value) {
		dishesOfMeal.value = data.value;
	}

	if (error.value) {
		console.error("Error fetching menu:", error.value);
	}
};

onMounted(() => {
	fetchMenu();
});
</script>

<template>
	<div class="isolate relative overflow-hidden">
		<div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
			<UAlert
				color="neutral"
				variant="soft"
				description="Mỗi suất bao gồm dụng cụ ăn uống, cơm và canh. Khách đặt online vui lòng chọn tối thiểu 3 món và tối đa 6 món."
				icon="i-lucide-info"
			/>
			<section class="my-5 lg:my-10">
				<UStepper
					ref="stepper"
					disabled
					:items="steps"
				>
					<template #content>
						<Placeholder class="aspect-video flex h-80 w-full">
							item.title
						</Placeholder>
					</template>
				</UStepper>
				<div class="flex gap-2 justify-between mt-4">
					<UButton
						leading-icon="i-lucide-arrow-left"
						:disabled="!stepper?.hasPrev"
						@click="stepper?.prev()"
					>
						Quay lại
					</UButton>

					<UButton
						trailing-icon="i-lucide-arrow-right"
						:disabled="!stepper?.hasNext"
						@click="stepper?.next()"
					>
						Tiếp
					</UButton>
				</div>
			</section>
		</div>
	</div>
</template>
