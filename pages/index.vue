<script setup>
useHead({
	title: "Trang chủ",
	meta: [
		{
			name: "description",
			content: "Xan Buffet - Thưởng thức cơm nhà ngon miệng chỉ với 35k. Đa dạng món ăn, không gian ấm cúng, giá cả hợp lý!",
		},
		{
			name: "keywords",
			content: "Xan Buffet, cơm buffet 35k, quán cơm giá rẻ, buffet Hà Nội, cơm nhà ngon",
		},
		{ property: "og:title", content: "Xan Buffet - Cơm nhà 35k" },
		{
			property: "og:description",
			content: "Thưởng thức cơm nhà ngon miệng tại Xan Buffet với giá chỉ 35k. Đa dạng món ăn, không gian thân thiện!",
		},
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://xanbuffet.com" },
		{ property: "og:image", content: "/images/logo.jpg" },
	],
});
</script>

<template>
	<div>
		<HeroSection />
		<div class="container mx-auto py-8 w-[90%] lg:max-w-2xl -mt-24 relative z-10">
			<div class="p-4 rounded-lg ring ring-default shadow-xl bg-blue-400 text-white dark:text-gray-200 dark:bg-gray-900">
				<div class="flex">
					<div class="py-3 w-1/3 text-center">
						<h5 class="pb-3 lg:pb-6 text-sm lg:text-2xl">
							ĐẶT HÀNG
						</h5>
						<h5 class="pb-3 lg:pb-6 text-sm lg:text-2xl">
							(Order)
						</h5>
						<h4 class="text-sm lg:text-3xl font-semibold">
							<a href="tel:0927733111">0927733111</a>
						</h4>
					</div>
					<div class="py-3 w-2/3 border-l border-default">
						<h5 class="pb-3 lg:pb-6 text-sm lg:text-2xl text-center">
							GIỜ MỞ CỬA
						</h5>
						<h5 class="pb-3 lg:pb-6 text-sm lg:text-2xl text-center">
							(Opening time)
						</h5>
						<div class="flex justify-around items-center pl-[2%] lg:pl-[10%]">
							<div class="text-xs lg:text-base text-left lg:text-center">
								<h6>TRƯA: 10h30</h6>
								<h6>
									(Fill đến 11:30)
								</h6>
							</div>
							<div class="text-xs lg:text-base text-left lg:text-center">
								<h6>TỐI: 17h30</h6>
								<h6>
									(Fill đến 18:30)
								</h6>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Description section -->
		<section class="relative isolate">
			<div class="w-full px-4 sm:px-6 flex flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16 lg:grid-cols-2 lg:items-center lg:px-20 mx-0 max-w-none md:mr-10">
				<div class="lg:order-last">
					<h2 class="text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted">
						<div class="sm:*:leading-11">
							<p class="mb-5 lg:mb-8 text-pretty">
								Câu chuyện của <span class="text-primary">Xan Buffet</span>
							</p>
						</div>
					</h2>
					<div
						class="relative"
						style="transform: translateZ(0px); opacity: 1;"
					>
						<div class="relative text-base sm:text-lg md:text-3xl 2xl:text-4xl text-pretty italic leading-tight md:leading-tight dark:text-gray-100 text-wrap-[balance] dark:drop-shadow">
							<p>
								Là một đứa con trong gia đình Việt, Xan hiểu lắm giá trị của một bữa cơm ngon sau những giờ làm việc, học tập mệt nhoài. Đôi lúc cần gì nhiều đâu, chỉ cơm trắng canh rau, mà như được nạp 1000% năng lượng.
								Xan cơm nhà - Xan cơm bình dân - có thể chẳng là sơn hào hải vị, nhưng nó có thể là “vị nhà”, là “vị mẹ nấu”, là bữa cơm từ tấm bé theo ta, bình dị - đủ đầy
							</p>
						</div>
						<UIcon
							name="i-material-symbols:format-quote-rounded"
							class="absolute h-14 w-14 md:w-20 md:h-20 rotate-180 -left-4 md:-left-8 text-primary/20 -top-8"
						/>
					</div>
				</div>
				<img
					src="/images/about_us.jpg"
					alt="Xan buffet cơm nhà"
					class="w-full md:w-full lg:max-w-xl 2xl:max-w-lg mx-auto rounded-2xl lg:rounded-4xl"
				>
			</div>
		</section>
		<!-- Buffet section -->
		<section class="isolate relative overflow-hidden">
			<div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16">
				<div class="absolute rounded-full -left-10 top-10 size-[300px] z-10 bg-primary opacity-40 blur-[200px]" />
				<div class="absolute rounded-full -right-10 -bottom-10 size-[300px] z-10 bg-primary opacity-40 blur-[200px]" />
				<div>
					<h2 class="text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted text-center">
						<div class="">
							<p class="my-5 text-pretty">
								Buffet cơm nhà ăn thả ga với <span class="text-primary">35k</span>
							</p>
						</div>
					</h2>
					<div class="text-base sm:text-lg text-muted text-center text-balance mt-6">
						Đồ ăn, cơm, canh lấy thoải mái, có thể lấy thêm nhiều lần.
					</div>
					<ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
						<UCard
							:ui="{ body: 'relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-4 overflow-hidden' }"
						>
							<img
								src="/images/dung-cu-an-uong.webp"
								onerror="this.setAttribute('data-error', 1)"
								alt="Dụng cụ ăn uống - Xan buffet"
								class="aspect-[5/4] object-cover hover:scale-105 transition-all ease-in-out duration-400"
							>
							<div class="flex flex-col gap-2">
								<span class="text-lg font-semibold">Sạch sẽ - An toàn</span>
								<span class="text-sm text-muted">Chúng tôi sử dụng dụng cụ ăn uống dùng một lần, thân thiện môi trường. Không gian sạch sẽ thoáng mát.</span>
							</div>
						</UCard>
						<UCard :ui="{ body: 'relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-4 overflow-hidden' }">
							<img
								src="/images/quay-line-16-mon.jpg"
								onerror="this.setAttribute('data-error', 1)"
								alt="Quầy line 16 món - Xan buffet"
								class="aspect-[5/4] object-cover hover:scale-105 transition-all ease-in-out duration-400"
							>
							<div class="flex flex-col gap-2">
								<span class="text-lg font-semibold">Quầy line 16 món</span>
								<span class="text-sm text-muted">Đa dạng các món ăn, menu thay đổi hàng ngày.</span>
							</div>
						</UCard>
						<UCard :ui="{ body: 'relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-4 overflow-hidden' }">
							<img
								src="/images/chuoi-quan-com.jpg"
								onerror="this.setAttribute('data-error', 1)"
								alt="Chi nhánh mọi nơi - Xan buffet"
								class="aspect-[5/4] object-cover hover:scale-105 transition-all ease-in-out duration-400"
							>
							<div class="flex flex-col gap-2">
								<span class="text-lg font-semibold">Tìm địa chỉ gần bạn</span>
								<span class="text-sm text-muted">Chúng tôi có chuỗi quán cơm rộng khắp.</span>
							</div>
						</UCard>
					</ul>
				</div>
			</div>
		</section>
	</div>
</template>
