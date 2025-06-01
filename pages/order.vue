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
const loading = ref<boolean>(true);
const error = ref<string>("");

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

const activeTab = ref<number>(1);
const sets = ref<TabsItem[]>([{ value: 1, label: "Suất 1" }]);
const menu = ref<Dish[]>();
const dishesOfSet = ref<Dish[][]>([]);

const getDayOfWeek = () => {
	const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	const today = new Date();
	return days[today.getDay()];
};
const fetchMenu = async () => {
	const dayOfWeek = getDayOfWeek();
	try {
		const response = await $fetch(`${apiBaseUrl}/api/menu/${dayOfWeek}`);
		menu.value = response.data.dishes.map(dish => ({
			id: dish.id,
			name: dish.name,
			image: "https://placehold.co/800x800.png?text=Dish",
			created_at: dish.created_at,
			updated_at: dish.updated_at,
			selected: false,
		}));
		dishesOfSet.value[1] = menu.value;
	}
	catch (err) {
		console.error("Error fetching menu:", err);
		let errorMessage = "Không thể tải thực đơn. Vui lòng thử lại sau.";
		if (err.status === 404) {
			errorMessage = "Không tìm thấy thực đơn cho ngày này.";
		}
		else if (err.status === 500) {
			errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
		}
		error.value = errorMessage;
		toast.add({
			title: "Uh oh! Có lỗi xảy ra.",
			description: errorMessage,
			icon: "i-lucide-wifi",
			color: "error",
		});
	}
	finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchMenu();
});

const onAddTab = () => {
	const maxValue = sets.value.length > 0 ? Math.max(...sets.value.map(tab => tab.value)) : null;
	const newTabIndex = maxValue + 1;

	sets.value.push({ value: newTabIndex, label: `Suất ${newTabIndex}` });

	activeTab.value = newTabIndex;

	if (menu.value.length > 0) {
		dishesOfSet.value[newTabIndex] = menu.value.map(dish => ({ ...dish }));
	}
};
const onRemoveTab = (value: number) => {
	if (sets.value.length <= 1) return;

	const newTabs = sets.value.filter(tab => tab.value !== value);
	sets.value = newTabs;

	activeTab.value = sets.value[0].value;
};
const onSelectDish = (dish: Dish, set: number) => {
	console.log(`Selected dish: ${dish.name} for set ${set}`);
	dish.selected = !dish.selected;
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
							:items="sets"
							variant="link"
							:ui="{
								list: 'tabs-scrollable',
								trigger: 'flex-none -bottom-0 text-sm md:text-base border-r',
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
								<div
									v-if="loading || error !== ''"
									class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
								>
									<div
										v-for="n in 6"
										:key="n"
										class="space-y-2"
									>
										<USkeleton class="w-full h-48 rounded" />
										<USkeleton class="w-3/4 h-6 rounded" />
									</div>
								</div>
								<div
									v-else
									class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 my-5 md:my-8"
								>
									<div
										v-for="dish in dishesOfSet[activeTab]"
										:key="dish.id"
									>
										<UCard :ui="{ body: 'relative flex flex-col flex-1 gap-y-2 md:gap-y-4 p-0 sm:p-0 rounded-lg' }">
											<NuxtImg
												placeholder
												:src="dish.image"
												:alt="dish.name"
												preload
												loading="lazy"
												fit="cover"
												class="rounded-t-lg"
											/>
											<div class="min-h-12 shrink px-2 flex-1 md:font-semibold">
												{{ dish.name }}
											</div>
											<UButton
												:variant="dish.selected ? 'outlined' : 'solid'"
												:color="dish.selected ? 'neutral' : 'primary'"
												class="w-full rounded-b-lg rounded-t-none items-center justify-center"
												@click.prevent="onSelectDish(dish, item.value)"
											>
												{{ dish.selected ? "Đã chọn" : "Chọn" }}
											</UButton>
										</UCard>
									</div>
								</div>
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
