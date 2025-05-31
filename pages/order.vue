<script setup lang="ts">
import type { StepperItem, TabsItem } from "@nuxt/ui";

interface Dish {
	id: number;
	name: string;
	image: string | null;
	created_at: string;
	updated_at: string;
	selected: boolean;
}

const toast = useToast();
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

const openAlert = ref(true);

const steps: StepperItem[] = [
	{
		slot: "shopping" as const,
		title: "Chọn món",
		icon: "i-lucide-house",
	},
	{
		slot: "info" as const,
		title: "Thông tin giao hàng",
		icon: "i-lucide-truck",
	},
	{
		slot: "confirm" as const,
		title: "Xác nhận",
		icon: "i-lucide-check-circle",
	},
];
const stepper = useTemplateRef("stepper");

const activeTab = ref<string>("1");
const meals = ref<TabsItem[]>([{ value: "1", label: "Suất 1" }]);
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
		toast.add({
			title: "Uh oh! Có lỗi xảy ra.",
			description: "Không thể tải thực đơn. Vui lòng thử lại sau.",
			icon: "i-lucide-wifi",
			color: "error",
		});
	}
};

onMounted(() => {
	fetchMenu();
	console.log("Mounted and fetching menu for the day:", getDayOfWeek());
});

const onAddTab = () => {
	const maxValue = meals.value.length > 0 ? Math.max(...meals.value.map(tab => Number(tab.value))) : null;
	const newTabIndex = maxValue + 1;

	meals.value.push({ value: String(newTabIndex), label: `Suất ${newTabIndex}` });

	activeTab.value = String(newTabIndex);

	// if (menu.value.dishes?.length) {
	//     dishesByTab.value[newTabIndex] = menu.value.dishes.map((dish) => ({
	//         ...dish,
	//         selected: false,
	//     }));
	// }
};
const onRemoveTab = (value: string) => {
	if (meals.value.length <= 1) return;

	const newTabs = meals.value.filter(tab => tab.value !== value);
	meals.value = newTabs;

	activeTab.value = meals.value[0].value;
};
</script>

<template>
	<div class="isolate relative overflow-hidden">
		<div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
			<UAlert
				v-if="openAlert"
				color="neutral"
				variant="soft"
				description="Mỗi suất bao gồm dụng cụ ăn uống, cơm và canh. Khách đặt online vui lòng chọn tối thiểu 3 món và tối đa 6 món."
				icon="i-lucide-info"
				close
				@update:open="openAlert = false"
			/>
			<section class="my-5 lg:my-10">
				<UStepper
					ref="stepper"
					disabled
					:items="steps"
				>
					<template #shopping>
						<UButton
							icon="i-lucide-plus"
							color="warning"
							size="sm"
							variant="subtle"
							@click.prevent="onAddTab"
						>
							Thêm suất
						</UButton>
						<UTabs
							v-model="activeTab"
							:items="meals"
							variant="link"
							:ui="{
								list: 'tabs-scrollable',
								trigger: 'flex-none -bottom-0 text-sm md:text-base',
								indicator: '-bottom-0',
							}"
						>
							<template #trailing="{ item }">
								<UIcon
									name="i-heroicons-x-mark"
									class="ml-1 cursor-pointer hover:text-error size-4"
									@click.stop="onRemoveTab(item.value)"
								/>
							</template>
							<template #content="{ item }">
								<p>Nội dung của {{ item.label }}</p>
							</template>
						</UTabs>
					</template>

					<template #info>
						Info
					</template>

					<template #confirm>
						Confirm
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
