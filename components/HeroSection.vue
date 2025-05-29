<script setup lang="ts">
const containerRef = ref(null);
const slides = ref([
	{ src: "/images/slide1.jpg", caption: "Buffet cơm nhà 35k" },
	{ src: "/images/slide2.jpg", caption: "Món thay đổi mỗi ngày" },
	{ src: "/images/slide3.jpg", caption: "16 món tự chọn" },
]);
const swiper = useSwiper(containerRef, {
	effect: "creative",
	loop: true,
	autoplay: {
		delay: 3500,
		disableOnInteraction: false,
	},
	creativeEffect: {
		prev: {
			shadow: true,
			translate: [0, 0, -400],
		},
		next: {
			translate: ["100%", 0, 0],
		},
	},
});
onMounted(() => {
	console.log(swiper.instance);
});
</script>

<template>
	<ClientOnly>
		<swiper-container
			ref="containerRef"
			:init="false"
		>
			<swiper-slide
				v-for="(slide, idx) in slides"
				:key="idx"
			>
				<div class="relative w-full h-full">
					<NuxtImg
						:src="slide.src"
						:alt="slide.caption"
						class="w-full h-auto max-h-[70vh] aspect-video md:aspect-auto object-cover blur-2xs"
						:placeholder="true"
						quality="80"
						format="webp"
					/>
					<h3 class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-3xl md:text-6xl text-primary text-center uppercase">
						{{ slide.caption }}
					</h3>
				</div>
			</swiper-slide>
		</swiper-container>
	</ClientOnly>
</template>
