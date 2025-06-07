<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import type { Dish, MenuResponse } from "@/types/common";

interface SimpleTab {
	value: number;
	label: string;
}
interface Order {
	user_id: number | null;
	address: string;
	notes: string | null;
	dishes: number[][];
}

const user = useUserStore();
const toast = useToast();
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const loading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);
const error = ref<string>("");
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
const activeStep = ref<number>(0);
const activeSet = ref<number>(1);
const sets = ref<SimpleTab[]>([{ value: 1, label: "Suất 1" }]);
const menu = ref<Dish[]>([]);
const dishesOfSet = ref<Dish[][]>([]);
const order = ref<Order>({
	user_id: user.userId,
	address: user.userAddress ?? "",
	notes: null,
	dishes: [],
});

const getDayOfWeek = () => {
	const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	const today = new Date();
	return days[today.getDay()];
};
const fetchMenu = async () => {
	const dayOfWeek = getDayOfWeek();
	try {
		const response = await $fetch<MenuResponse>(`${apiBaseUrl}/api/menus/${dayOfWeek}`, {
			headers: {
				Accept: "application/json",
			},
		});
		menu.value = response.data.dishes.map(dish => ({
			id: dish.id,
			name: dish.name,
			image: dish.image,
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
const onRemoveSet = (value: number) => {
	if (sets.value.length <= 1) return;

	const newTabs = sets.value.filter(tab => tab.value !== value);
	sets.value = newTabs;

	activeSet.value = Number(sets.value[0].value);

	const { [value]: removed, ...rest } = dishesOfSet.value;
	dishesOfSet.value = rest;
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
	else if (stepper.value?.hasNext && activeStep.value === 1) {
		if (order.value.address.trim() == "") {
			toast.add({
				title: "Địa chỉ không được để trống",
				description: "Đơn hàng sẽ được gửi tới địa chỉ này.",
				icon: "i-lucide-alert-triangle",
				color: "error",
			});
			return;
		}
		order.value.dishes = sets.value.map((set) => {
			const dishes = selectedDishesOfSet.value[set.value] || [];
			return dishes.map(dish => dish.id);
		});
		stepper.value.next();
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
	else if (activeStep.value === 2) {
		onSubmit();
	}
};
const onSubmit = async () => {
	isSubmitting.value = true;
	try {
		const { data, error } = await useFetch("/api/orders", {
			baseURL: apiBaseUrl,
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: {
				user_id: order.value.user_id,
				address: order.value.address,
				notes: order.value.notes,
				dishes: order.value.dishes,
			},
			onResponseError({ response }) {
				if (response.status === 401) {
					// showLoginModal.value = true; // Mở UModal khi lỗi 401
					console.log(response);
				}
			},
		});
		// console.log(data.value);
		// console.log(error.value);

		// if (error.value) {
		// 	toast.add({
		// 		title: "Uh oh! Có lỗi xảy ra.",
		// 		description: error.value.data?.message,
		// 		icon: "i-lucide-wifi",
		// 		color: "error",
		// 	});
		// 	return;
		// }

		// if (data.value) {
		// 	toast.add({
		// 		title: "Đặt hàng thành công!",
		// 		description: "Đơn hàng đang được xử lý để giao tới cho bạn.",
		// 		icon: "i-lucide-party-popper",
		// 		color: "success",
		// 	});
		// 	order.value.address = user.address ?? "";
		// 	order.value.notes = null;
		// 	order.value.dishes = [];
		// 	navigateTo("/user/orders");
		// }
	}
	catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
			toast.add({
				title: "Uh oh! Có lỗi xảy ra.",
				description: err.message,
				icon: "i-lucide-wifi",
				color: "error",
			});
		}
	}
	finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div class="isolate relative overflow-hidden">
		<div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
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
												class="w-full rounded-b-lg rounded-t-none items-center justify-center hover:cursor-pointer"
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
							v-if="!user.isAuthenticated"
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
							<h4 class="mb-5 md:mb-8 text-center">
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
									v-model="user.userFullName"
									disabled
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
									v-model="user.userUsername"
									disabled
									type="tel"
									variant="soft"
									class="w-full"
									autocomplete="tel"
								/>
							</UFormField>
							<UFormField
								label="Địa chỉ nhận hàng"
								name="address"
								required
							>
								<UInput
									v-model="order.address"
									type="tel"
									variant="soft"
									class="w-full"
									placeholder="Nhập địa chỉ nhận hàng"
									:ui="{ trailing: 'pe-1' }"
								>
									<template
										v-if="order.address?.length"
										#trailing
									>
										<UButton
											color="neutral"
											variant="link"
											size="sm"
											icon="i-lucide-circle-x"
											aria-label="Clear input"
											@click="order.address = ''"
										/>
									</template>
								</UInput>
							</UFormField>
							<UFormField
								label="Ghi chú"
								name="note"
							>
								<UTextarea
									v-model="order.notes"
									type="tel"
									variant="soft"
									class="w-full"
									placeholder="Bạn có yêu cầu gì không?"
								/>
							</UFormField>
							<div class="flex justify-center md:justify-end my-3 md:my-6">
								<UButton
									trailing-icon="i-lucide-arrow-right"
									:disabled="!stepper?.hasNext"
									@click="onNextStep"
								>
									Xác nhận đặt hàng
								</UButton>
							</div>
						</div>
					</template>

					<template #confirm>
						<div class="flex flex-col-reverse md:flex-row items-start gap-4 my-4 md:my-8">
							<div class="block md:hidden w-full flex-none">
								<UButton
									:disabled="isSubmitting"
									icon="i-lucide-circle-check-big"
									color="primary"
									size="lg"
									class="w-full justify-center flex"
									@click="onSubmit"
								>
									Hoàn Tất Đặt Hàng
								</UButton>
							</div>
							<UCard
								:ui="{ body: 'p-2 sm:p-2 md:p-4' }"
								variant="soft"
								class="w-full md:w-8/12"
							>
								<h4 class=" font-semibold">
									Tổng số suất: {{ order.dishes?.length }}
								</h4>
								<div class="my-4 md:my-6">
									<ul class="list-inside leading-7">
										<li
											v-for="set in sets"
											:key="set.value"
										>
											<div class="inline-flex flex-wrap mb-2">
												<div class="flex items-center mr-2">
													<UIcon name="i-lucide-dot" />Suất {{ set.value }}:
												</div>
												<div
													v-for="(dish, index) in selectedDishesOfSet[set.value]"
													:key="dish.id"
												>
													<UBadge
														color="neutral"
														variant="soft"
													>
														{{ dish.name }}
													</UBadge>
													<span v-if="index < selectedDishesOfSet[set.value].length - 1">,</span>
												</div>
											</div>
										</li>
									</ul>
									<div class="mt-4 italic">
										Lưu ý: Mỗi suất đã bao gồm dụng cụ ăn uống, cơm và canh.
									</div>
								</div>
							</UCard>
							<UCard
								:ui="{ body: 'p-2 sm:p-2 md:p-4' }"
								variant="soft"
								class="w-full md:w-4/12"
							>
								<div class="flex gap-x-3">
									<UIcon
										name="i-lucide-map-pin-check"
										class="mt-1 text-primary size-5"
									/>
									<div class="overflow-hidden flex-1">
										<p class="font-bold">
											{{ user.userFullName }}
										</p>
										<p class="text-muted">
											{{ user.userUsername }}
										</p>
										<p class="text-muted">
											{{ order.address }}
										</p>
										<p
											v-if="order.notes"
											class="mt-2 text-muted italic line-clamp-1 text-sm md:text-base"
										>
											{{ order.notes }}
										</p>
									</div>
								</div>
								<div class="flex gap-x-3 mt-2 md:mt-4">
									<UIcon
										name="i-lucide-receipt-text"
										class="mt-1 text-primary size-5"
									/>
									<div class="overflow-hidden flex-1">
										<p>
											Tiền tạm tính:
											<span class="text-xl md:text-2xl font-semibold">
												{{ new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(35000*order.dishes?.length) }}
											</span>
										</p>
										<p class="text-muted italic text-sm">
											Phí ship: (Chưa được cập nhập)
										</p>
									</div>
								</div>
								<UButton
									:disabled="isSubmitting"
									icon="i-lucide-circle-check-big"
									color="primary"
									size="lg"
									class="w-full mt-5 justify-center hidden md:flex"
									@click="onSubmit"
								>
									Hoàn Tất Đặt Hàng
								</UButton>
							</UCard>
						</div>
					</template>
				</UStepper>
				<div class="w-full bg-default fixed bottom-0 left-0 right-0 z-20 border-t border-default shadow-md">
					<div class="max-w-(--ui-container) mx-auto flex justify-between px-4 sm:px-6 lg:px-8 py-4">
						<UButton
							variant="outline"
							leading-icon="i-lucide-arrow-left"
							:disabled="!stepper?.hasPrev || isSubmitting"
							@click="stepper?.prev()"
						>
							Quay lại
						</UButton>
						<div
							v-if="activeStep < 2"
							class="flex flex-col md:flex-row gap-x-2 text-center text-sm md:text-base"
						>
							<p>Suất {{ activeSet }}:</p>
							<p>{{ selectedDishesOfSet[activeSet]?.length || 0 }} món</p>
						</div>
						<UButton
							:disabled="isSubmitting"
							trailing-icon="i-lucide-arrow-right"
							@click="onNextStep"
						>
							{{ activeStep == 2 ? 'Hoàn Thành' : 'Tiếp' }}
						</UButton>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>
