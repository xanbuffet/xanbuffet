export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "nuxt-swiper"],
	ssr: true,

	devtools: { enabled: true },

	css: ["~/assets/css/main.css"],

	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.API_BASE_URL || "https://localhost:8000",
		},
	},
	compatibilityDate: "2025-05-25",

	nitro: {
		preset: "node-server",
	},

	eslint: {
		checker: true,
		config: {
			stylistic: {
				semi: true,
				quotes: "double",
				indent: "tab",
				commaDangle: "always-multiline",
			},
		},
	},

	image: {
		format: ["webp, png, jpg"],
		dir: "public",
		provider: "none",
		domains: [
			"images.unsplash.com",
			"res.cloudinary.com",
			"gravatar.com",
			"admin.xanbuffet.com",
		],
		alias: {
			unsplash: "https://images.unsplash.com",
		},
	},
});
