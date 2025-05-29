export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "nuxt-swiper"],
	ssr: true,

	devtools: { enabled: false },

	css: ["~/assets/css/main.css"],

	runtimeConfig: {
		public: {
			apiBase:
				process.env.NUXT_API_URL || "https://admin.xanbuffet.com/api",
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
