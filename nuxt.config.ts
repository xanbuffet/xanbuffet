export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui"],
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
		provider: "static", // Sử dụng provider local cho tài nguyên tĩnh
		domains: ["<laravel_api_domain>"], // Cho phép tải hình ảnh từ Laravel API
		dir: "public", // Thư mục chứa hình ảnh tĩnh
		// Nếu dùng Cloudinary (tùy chọn):
		// provider: 'cloudinary',
		// cloudinary: {
		//   baseURL: 'https://res.cloudinary.com/<your_cloud_name>',
		// },
	},
});
