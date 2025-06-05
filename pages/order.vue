<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";

interface Dish {
	id: number;
	name: string;
	image: string | undefined;
	created_at: string;
	updated_at: string;
	selected: boolean;
}
interface MenuResponse {
	data: {
		status: string;
		dishes: Dish[];
	};
}
interface SimpleTab {
	value: number;
	label: string;
}

const user = useUserStore();
const toast = useToast();
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const loading = ref<boolean>(true);
const error = ref<string>("");
const openAlert = ref(true);
const redirectUrl = ref<string>("/order");

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
const activeStep = ref<number>(1);
const activeSet = ref<number>(1);
const sets = ref<SimpleTab[]>([{ value: 1, label: "Suất 1" }]);
const menu = ref<Dish[]>([]);
const dishesOfSet = ref<Dish[][]>([]);

const getDayOfWeek = () => {
	const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	const today = new Date();
	return days[today.getDay()];
};
const fetchMenu = async () => {
	const dayOfWeek = getDayOfWeek();
	try {
		const response = await $fetch<MenuResponse>(`${apiBaseUrl}/api/menu/${dayOfWeek}`);
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
		if (typeof err === "object" && err !== null && "status" in err) {
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
	}
	finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchMenu();
	setTimeout(() => {
		openAlert.value = false;
	}, 6000);
});

const onAddSet = () => {
	const values = sets.value.map(tab => Number(tab.value)).filter(v => !isNaN(v));
	const maxValue = sets.value.length > 0 ? Math.max(...values) : 0;
	const newTabIndex = maxValue + 1;

	sets.value.push({ value: newTabIndex, label: `Suất ${newTabIndex}` });

	activeSet.value = newTabIndex;

	if (menu.value.length > 0) {
		dishesOfSet.value[newTabIndex] = menu.value.map(dish => ({ ...dish, selected: false }));
	}
};
const onRemoveSet = (value: number | string | undefined) => {
	if (sets.value.length <= 1) return;

	const newTabs = sets.value.filter(tab => tab.value !== value);
	sets.value = newTabs;

	activeSet.value = Number(sets.value[0].value);
};
const selectedDishesOfSet = computed(() => {
	const result: Record<number, Dish[]> = {};
	Object.keys(dishesOfSet.value).forEach((setValue) => {
		const setIndex = Number(setValue);
		result[setIndex] = dishesOfSet.value[setIndex].filter(dish => dish.selected);
	});
	return result;
});
const onSelectDish = (dish: Dish, set: number | string | undefined) => {
	console.log(`Selected dish: ${dish.name} for set ${set}`);

	if (set === undefined || set === null) return;
	set = Number(set);

	const selected = selectedDishesOfSet.value[set] || [];
	const index: number = selected.findIndex((d: Dish) => d.id === dish.id);
	if (index > -1) {
		selected.splice(index, 1);
		dish.selected = false;
	}
	else {
		if (selected.length >= 6) {
			toast.add({
				title: "Oh! Giới hạn món.",
				description: "Mỗi suất chỉ được chọn tối đa 6 món.",
				icon: "i-lucide-message-circle-warning",
				color: "warning",
			});
			return;
		}
		selected.push(dish);
		dish.selected = true;
	}

	selectedDishesOfSet.value[set] = [...selected];
};
const onNextStep = () => {
	if (stepper.value?.hasNext && activeStep.value === 0) {
		const allTabsValid = Object.values(selectedDishesOfSet.value).every(dishes => dishes.length >= 3);
		if (!allTabsValid) {
			toast.add({
				title: "Oh! Chưa chọn đủ món.",
				description: "Mỗi suất cần chọn ít nhất 3 món.",
				icon: "i-lucide-alert-triangle",
				color: "warning",
			});
			return;
		}
		stepper.value.next();
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
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
			<section class="my-5 lg:my-8">
				<UStepper
					ref="stepper"
					v-model="activeStep"
					disabled
					:items="steps"
				>
					<template #shopping>
						<UButton
							class="mb-2 md:mb-4"
							icon="i-lucide-plus"
							color="warning"
							size="sm"
							variant="subtle"
							@click.prevent="onAddSet"
						>
							Thêm suất
						</UButton>
						<UTabs
							v-model="activeSet"
							:items="sets"
							variant="link"
							:ui="{
								list: 'tabs-scrollable',
								trigger: 'flex-none -bottom-0 text-sm md:text-base rounded-none rounded-tr-lg border-r',
								indicator: '-bottom-0',
							}"
						>
							<template #trailing="{ item }">
								<UIcon
									name="i-heroicons-x-mark"
									class="ml-1 cursor-pointer hover:text-error size-4"
									@click.stop="onRemoveSet(item.value)"
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
										v-for="dish in dishesOfSet[activeSet]"
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
												:variant="dish.selected ? 'solid' : 'outline'"
												color="primary"
												size="lg"
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
						<div
							v-if="!user.token"
							class="flex flex-col md:flex-row items-stretch md:items-center gap-y-2 my-4 md:my-8"
						>
							<div class="flex-1 flex items-center justify-center">
								<div class="p-2 md:p-4 w-sm">
									<LoginForm :redirect-url="redirectUrl" />
								</div>
							</div>
							<USeparator
								orientation="vertical"
								label="Hoặc"
								class="hidden md:flex h-60"
							/>
							<USeparator
								orientation="horizontal"
								label="Hoặc"
								class="flex md:hidden w-full"
							/>
							<div class="flex-1 flex items-center justify-center">
								<div class="p-2 md:p-4 w-sm">
									<SignupForm :redirect-url="redirectUrl" />
								</div>
							</div>
						</div>
						<div
							v-else
							class="max-w-md mx-auto space-y-4  my-4 md:my-8"
						>
							<h4 class="mb-3 md:mb-5 text-center">
								<p class="uppercase text-lg md:text-xl font-semibold">
									Thông Tin Nhận Hàng
								</p>
								<p class="text-muted text-sm font-normal">
									Đơn hàng sẽ được ship tới bạn qua thông tin phía dưới
								</p>
							</h4>
							<UFormField
								label="Tên người nhận"
								name="name"
								required
							>
								<UInput
									v-model="user.name"
									type="text"
									variant="soft"
									class="w-full"
								/>
							</UFormField>
							<UFormField
								label="Số điện thoại"
								name="username"
								required
							>
								<UInput
									v-model="user.username"
									type="tel"
									variant="soft"
									class="w-full"
									autocomplete="tel"
								/>
							</UFormField>
							<UFormField
								label="Địa chỉ"
								name="address"
								required
							>
								<UInput
									v-model="user.address"
									type="tel"
									variant="soft"
									class="w-full"
									placeholder="Nhập địa chỉ nhận hàng"
								/>
							</UFormField>
							<UFormField
								label="Ghi chú"
								name="note"
							>
								<UTextarea
									v-model="user.address"
									type="tel"
									variant="soft"
									class="w-full"
									placeholder="Bạn có yêu cầu gì không?"
								/>
							</UFormField>
						</div>
					</template>

					<template #confirm>
						Confirm
					</template>
				</UStepper>
				<div class="w-full bg-default fixed bottom-0 left-0 right-0 z-20 border-t border-default shadow-md">
					<div class="max-w-(--ui-container) mx-auto flex justify-between px-4 sm:px-6 lg:px-8 py-4">
						<UButton
							variant="outline"
							leading-icon="i-lucide-arrow-left"
							:disabled="!stepper?.hasPrev"
							@click="stepper?.prev()"
						>
							Quay lại
						</UButton>
						<div class="flex flex-col md:flex-row gap-x-2 text-center text-sm md:text-base">
							<p>Suất {{ activeSet }}:</p>
							<p>{{ selectedDishesOfSet[activeSet]?.length || 0 }} món</p>
						</div>
						<UButton
							trailing-icon="i-lucide-arrow-right"
							:disabled="!stepper?.hasNext"
							@click="onNextStep"
						>
							Tiếp
						</UButton>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>
