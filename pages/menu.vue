<script setup lang="ts">
useHead({
	title: "Menu",
	meta: [
		{
			name: "description",
			content: "Khám phá menu hàng ngày tại Xan Buffet! Xem thực đơn cơm nhà ngon miệng giá 35k cho 7 ngày trong tuần.",
		},
		{
			name: "keywords",
			content: "menu Xan Buffet, menu buffet 35k, thực đơn cơm nhà, buffet Hà Nội, món ăn hàng ngày",
		},
		{ property: "og:title", content: "Menu - Xan Buffet cơm nhà 35k" },
		{
			property: "og:description",
			content: "Xem menu cơm nhà 35k tại Xan Buffet cho cả tuần. Đa dạng món ăn, cập nhật hàng ngày!",
		},
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://xanbuffet.com/menu" },
		{ property: "og:image", content: "/images/logo.jpg" },
	],
});
</script>

<template>
	<div class="isolate relative overflow-hidden">
		<div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
			Menu Page
		</div>
	</div>
</template>
