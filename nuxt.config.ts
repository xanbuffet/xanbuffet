export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "nuxt-swiper", "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],
	ssr: true,

	devtools: { enabled: false },

	css: ["~/assets/css/main.css"],

	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.API_BASE_URL || "https://localhost:8000",
		},
	},
	experimental: {
		cookieStore: true,
	},
	compatibilityDate: "2025-05-25",

	nitro: {
		preset: "node-server",
	},
	typescript: {
		typeCheck: true,
		strict: true,
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
