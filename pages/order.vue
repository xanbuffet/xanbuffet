<script setup lang="ts">
import { z } from "zod";
import type { StepperItem, TabsItem } from "@nuxt/ui";
import type { Dish, SimpleTab, OrderPayload, Order, PlacedOrderResponse } from "@/types/common";
import { useCopy } from "~/composables/useCopy";

const { copyText } = useCopy();
const auth = useAuthStore();
const user = useUserStore();
const menu = useMenuStore();
const orderStore = useOrderStore();
const toast = useToast();
const isSubmitting = ref(false);
const isOderSuccess = ref(false);
const orderCopied = ref(false);

const steps = [
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
] satisfies StepperItem[];
const checkoutModeTabs = [
	{
		value: "0",
		label: "Đặt hàng nhanh",
		description: "Tạo đơn hàng nhanh chóng, sử dụng mã đơn để theo dõi đơn hàng",
		slot: "guest" as const,
	},
	{
		value: "1",
		label: "Thành viên",
		description: "Đăng ký/Đăng nhập để nhận ưu đãi và theo dõi đơn hàng dễ dàng!",
		slot: "user" as const,
	},
] satisfies TabsItem[];
const checkoutMode = ref<string>("0");
const stepper = useTemplateRef("stepper");
const form = useTemplateRef("form");
const activeStep = ref<number>(0);
const activeSet = ref<number>(1);
const sets = ref<SimpleTab[]>([{ value: 1, label: "Suất 1" }]);

const dishesOfSet = ref<Dish[][]>([]);
const order = ref<OrderPayload>({
	type: "guest",
	guest_name: "",
	guest_phone: "",
	address: user.userAddress ?? "",
	notes: "",
	dishes: [],
});
const orderRes = ref<Order | null>(null);
const guestSchema = z.object({
	guest_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
	guest_phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
	address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
});
const authSchema = z.object({
	address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
});

watch(
	() => menu.getMenu,
	(newMenu) => {
		dishesOfSet.value[1] = newMenu;
	},
	{ deep: true },
);
watch(
	() => user.isAuthenticated,
	(newState) => {
		if (newState) {
			order.value.address = user.userAddress ?? "";
		}
		else {
			order.value.guest_name = "";
			order.value.guest_phone = "";
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	},
	{ deep: true },
);
watch(
	() => checkoutMode.value,
	(newValue) => {
		if (newValue == "0") {
			order.value.type = "guest";
			order.value.address = "";
		}
		else {
			order.value.type = "user";
			order.value.address = user.userAddress ?? "";
		}
	},
	{ deep: true },
);

onMounted(() => {
	menu.fetchMenu();
	if (user.isAuthenticated) {
		checkoutMode.value = "1";
	}
});

const onAddSet = () => {
	const values = sets.value.map(tab => Number(tab.value)).filter(v => !isNaN(v));
	const maxValue = sets.value.length > 0 ? Math.max(...values) : 0;
	const newTabIndex = maxValue + 1;

	sets.value.push({ value: newTabIndex, label: `Suất ${newTabIndex}` });

	activeSet.value = newTabIndex;

	if (menu.getMenu.length > 0) {
		dishesOfSet.value[newTabIndex] = menu.getMenu.map(dish => ({ ...dish, selected: false }));
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
const onNextStep = async () => {
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
		if (checkoutMode.value == "1" && !user.isAuthenticated) {
			toast.add({
				title: "Oh! Bạn cần đăng nhập/đăng ký để tiếp tục.",
				icon: "i-lucide-fish-off",
				color: "warning",
			});
			return;
		}
		await form.value?.validate();

		if (form.value?.getErrors().length == 0) {
			order.value.dishes = sets.value.map((set) => {
				const dishes = selectedDishesOfSet.value[set.value] || [];
				return dishes.map(dish => dish.id);
			});
			stepper.value.next();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}
	else if (activeStep.value === 2) {
		onOrderSubmit();
	}
};
const onOrderSubmit = async () => {
	isSubmitting.value = true;
	isOderSuccess.value = false;
	try {
		const response = await $fetch<PlacedOrderResponse>("/api/orders", {
			baseURL: useRuntimeConfig().public.apiBaseUrl,
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: order.value,
			credentials: "include",
		}).catch((err) => {
			toast.add({
				title: "Uh oh! Có lỗi xảy ra.",
				description: err.data.message || "Đã có lỗi xảy ra",
				icon: "i-lucide-wifi",
				color: "error",
			});
			return;
		});
		if (response) {
			orderRes.value = response.data;
			isOderSuccess.value = true;
			orderStore.setTracking({
				phone: orderRes.value.user?.username || orderRes.value.guest_phone || "",
				order_no: orderRes.value.order_no,
			});
		}
	}
	catch (err) {
		console.error(err);
		toast.add({
			title: "Uh oh! Có lỗi xảy ra.",
			description: "Không thể kết nối đến server",
			icon: "i-lucide-wifi",
			color: "error",
		});
	}
	finally {
		isSubmitting.value = false;
	}
};
const onGuestSubmit = () => {
	onNextStep();
};
const onAuthSubmit = () => {
	onNextStep();
};
</script>

<template>
	<div class="isolate relative overflow-hidden">
		<div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
			<section class="my-5 lg:my-8">
				<UStepper
					ref="stepper"
					v-model="activeStep"
					as="div"
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
									v-if="menu.isLoading || menu.getError"
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
										<UCard :ui="{ body: 'relative flex flex-col flex-1 gap-y-2 md:gap-y-4 p-0 sm:p-0 rounded-lg rounded-t-full' }">
											<NuxtImg
												placeholder="/images/xan_dish404.webp"
												:src="dish.image"
												preload
												loading="lazy"
												fit="cover"
												class="aspect-square object-cover rounded-full"
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
						<UTabs
							v-model="checkoutMode"
							:items="checkoutModeTabs"
							variant="pill"
							class="my-5"
						>
							<template #guest="{ item }">
								<div class="flex flex-col items-center mt-2">
									<p class="italic text-sm md:text-base text-muted">
										{{ item.description }}
									</p>
									<div class="w-full max-w-md mx-auto space-y-4 my-4 md:my-8">
										<UForm
											ref="form"
											:state="order"
											:schema="guestSchema"
											:validate-on="['blur', 'change', 'input']"
											class="mx-auto space-y-4"
											@submit="onGuestSubmit"
										>
											<UFormField
												label="Tên người nhận"
												name="guest_name"
												required
											>
												<UInput
													v-model="order.guest_name"
													type="text"
													variant="soft"
													class="w-full"
													autofocus
												/>
											</UFormField>
											<UFormField
												label="Số điện thoại"
												name="guest_phone"
												required
											>
												<UInput
													v-model="order.guest_phone"
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
												name="notes"
											>
												<UTextarea
													v-model="order.notes"
													type="tel"
													variant="soft"
													class="w-full"
													placeholder="Bạn có yêu cầu gì không?"
												/>
											</UFormField>
											<div class="flex justify-end my-3 md:my-6">
												<UButton
													trailing-icon="i-lucide-arrow-right"
													type="submit"
												>
													Xác nhận đặt hàng
												</UButton>
											</div>
										</UForm>
									</div>
								</div>
							</template>
							<template #user="{ item }">
								<div
									v-if="!user.isAuthenticated"
									class="flex flex-col items-center mt-2"
								>
									<p class="italic text-sm md:text-base text-muted">
										{{ item.description }}
									</p>
									<div class="w-full max-w-md ">
										<div
											v-if="auth.mode == 'login'"
											class="py-5 md:py-10 flex flex-col gap-4"
										>
											<LoginForm
												redirect-url="/order"
												message="Chào mừng bạn quay trở lại"
											/>
											<USeparator label="Hoặc" />
											<div>
												Bạn chưa có tài khoản? Hãy
												<UButton
													color="primary"
													variant="link"
													@click="auth.toggleMode()"
												>
													Đăng Ký
												</UButton>
											</div>
										</div>
										<div
											v-else
											class="py-5 md:py-10 flex flex-col gap-4"
										>
											<SignupForm
												redirect-url="/order"
												message="Đăng ký để nhận ưu đãi và theo dõi đơn hàng dễ dàng!"
											/>
											<USeparator label="Hoặc" />
											<div>
												Bạn đã có tài khoản?
												<UButton
													color="primary"
													variant="link"
													@click="auth.toggleMode()"
												>
													Đăng nhập
												</UButton>
											</div>
										</div>
									</div>
								</div>
								<div
									v-else
									class="w-full max-w-md mx-auto space-y-4 my-4 md:my-8"
								>
									<UForm
										ref="form"
										:state="order"
										:schema="authSchema"
										:validate-on="['blur', 'change', 'input']"
										class="mx-auto space-y-4"
										@submit="onAuthSubmit"
									>
										<UFormField
											label="Tên người nhận"
											name="name"
											required
										>
											<UInput
												v-model="user.userFullName"
												type="text"
												variant="soft"
												class="w-full"
												disabled
											/>
										</UFormField>
										<UFormField
											label="Số điện thoại"
											name="username"
											required
										>
											<UInput
												v-model="user.userUsername"
												type="tel"
												variant="soft"
												class="w-full"
												disabled
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
											name="notes"
										>
											<UTextarea
												v-model="order.notes"
												type="tel"
												variant="soft"
												class="w-full"
												placeholder="Bạn có yêu cầu gì không?"
											/>
										</UFormField>
										<div class="flex justify-end my-3 md:my-6">
											<UButton
												trailing-icon="i-lucide-arrow-right"
												type="submit"
											>
												Xác nhận đặt hàng
											</UButton>
										</div>
									</UForm>
								</div>
							</template>
						</UTabs>
					</template>

					<template #confirm>
						<div class="flex flex-col-reverse md:flex-row items-start gap-4 my-4 md:my-8">
							<div class="block md:hidden w-full flex-none">
								<UButton
									:disabled="isSubmitting || isOderSuccess"
									icon="i-lucide-circle-check-big"
									color="primary"
									size="lg"
									class="w-full justify-center flex"
									@click="onOrderSubmit"
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
											{{ checkoutMode == "0" ? order.guest_name : user.userFullName }}
										</p>
										<p class="text-muted">
											{{ checkoutMode == "0" ? order.guest_phone : user.userUsername }}
										</p>
										<p class="text-muted">
											{{ checkoutMode == "0" ? order.address : user.userAddress }}
										</p>
										<p
											v-if="order.notes"
											class="mt-2 text-muted italic line-clamp-1 text-sm md:text-base"
										>
											{{ order.notes }}
										</p>
									</div>
								</div>
								<div class="flex gap-x-3 mt-3 md:mt-6">
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
									:disabled="isSubmitting || isOderSuccess"
									icon="i-lucide-circle-check-big"
									color="primary"
									size="lg"
									class="w-full mt-8 justify-center hidden md:flex hover:cursor-pointer"
									@click="onOrderSubmit"
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
							v-if="activeStep < 1"
							class="flex flex-col md:flex-row gap-x-2 text-center text-sm md:text-base"
						>
							<p>Suất {{ activeSet }}:</p>
							<p>{{ selectedDishesOfSet[activeSet]?.length || 0 }} món</p>
						</div>
						<UButton
							:disabled="isSubmitting || isOderSuccess || !menu.isLoading"
							trailing-icon="i-lucide-arrow-right"
							@click="onNextStep"
						>
							{{ activeStep == 2 ? 'Hoàn Thành' : 'Tiếp' }}
						</UButton>
					</div>
				</div>
			</section>
			<UModal
				v-model:open="isSubmitting"
				:dismissible="false"
			>
				<template #content>
					<div class="p-6">
						<h2 class="text-lg font-semibold">
							Đang xử lý đơn hàng...
						</h2>
						<UProgress
							:value="null"
							animation="carousel"
							class="my-4"
						/>
						<p>Vui lòng chờ trong giây lát.</p>
					</div>
				</template>
			</UModal>
			<UModal
				v-model:open="isOderSuccess"
				title="Tạo đơn hàng thành công"
				:ui="{ footer: 'justify-end' }"
				:dismissible="false"
				@close:prevent="navigateTo('/tracking')"
			>
				<template #body>
					<div class="flex flex-col">
						<p>Cảm ơn bạn, đơn hàng đang được quán chuẩn bị và giao tới cho bạn sớm nhất.</p>
						<p class="my-4">
							Mã đơn hàng của bạn là: {{ orderRes?.order_no }}
						</p>
						<span class="text-sm text-right">Ấn để copy</span>
						<UButton
							color="success"
							variant="subtle"
							:trailing-icon="orderCopied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
							class="w-full justify-center"
							@click="copyText(orderRes?.order_no ?? '')"
						>
							{{ orderRes?.order_no }}
						</UButton>
					</div>
				</template>
				<template #footer>
					<UButton
						label="Về trang chủ"
						color="neutral"
						variant="outline"
						to="/"
					/>
					<UButton
						label="Kiểm tra đơn hàng"
						color="neutral"
						:to="user.isAuthenticated ? '/user/order' : '/tracking'"
					/>
				</template>
			</UModal>
		</div>
	</div>
</template>
