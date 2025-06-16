<script setup lang="ts">
interface AddressType {
	lable: string;
	address: string;
	iframe: string;
	direct: string;
	share: string;
}
const items = ref<AddressType[]>([
	{
		lable: "Cầu Giấy",
		address: "Số 4, ngõ 27 Phan Văn Trường",
		iframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7448.065095054483!2d105.78105045115794!3d21.031383656460584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abee1ed9a66b%3A0x16c14d8bbb9df35c!2sXan%20-%20Buffet%20c%C6%A1m%20nh%C3%A0%2035K!5e0!3m2!1sen!2smy!4v1750081683717!5m2!1sen!2smy",
		direct: "https://maps.app.goo.gl/7TEsoYXELbDuxeYMA",
		share: "https://maps.app.goo.gl/7TEsoYXELbDuxeYMA",
	},
]);

const activeIframe = ref<string>(items.value[0].iframe);

const onChangeMap = (url: string) => {
	activeIframe.value = url;
	window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
	<UContainer class="my-0 md:my-10 px-0 md:px-4">
		<div class="isolate relative">
			<div class="h-[50svh] md:h-[60svh] z-0">
				<iframe
					:src="activeIframe"
					width="100%"
					height="100%"
					style="border:0;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				/>
			</div>
			<div class="w-full mb-10 md:mb-20 mt-0 md:-mt-10">
				<div class="z-10 flex flex-col md:flex-row overflow-x-auto overflow-y-visible hidden-scrollbar snap-x gap-y-1 md:gap-x-10 px-2 md:px-6 bg-elevated/80 md:bg-default">
					<div
						v-for="item, index in items"
						:key="index"
						class="md:py-0 py-2 md:rounded-xl flex-none flex flex-row md:flex-col md:bg-elevated snap-center"
					>
						<p class="pr-1.5 font-bold text-primary text-xl block md:hidden">
							CS.{{ index + 1 }}
						</p>
						<img
							class="w-[18rem] rounded-t-lg hidden md:block"
							src="/images/xan-cs1.png"
						>
						<div class="flex-1 pl-2 md:p-3.5 border-l border-inverted/20 border-dashed md:border-none">
							<h3 class="font-semibold">
								{{ item.lable }}
							</h3>
							<p>{{ item.address }}</p>
						</div>
						<div class="flex flex-col md:flex-row-reverse md:justify-start gap-2 md:gap-4 pr-2 md:pb-3.5 md:pr-3.5">
							<UButton
								size="sm"
								class="rounded-full"
								icon="i-mdi-directions-fork"
								@click="onChangeMap(item.iframe)"
							/>
							<UButton
								size="sm"
								color="neutral"
								variant="outline"
								class="rounded-full"
								icon="i-lucide-share-2"
							/>
						</div>
					</div>
					<USeparator
						color="primary"
						class="flex md:hidden"
						type="solid"
					/>
				</div>
			</div>
		</div>
	</UContainer>
</template>

<style scoped>
.hidden-scrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}
.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
