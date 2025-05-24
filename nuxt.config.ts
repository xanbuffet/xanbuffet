export default defineNuxtConfig({
  // Thêm các module
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],

  // Bật SSR
  ssr: true,

  // Cấu hình devtools (tùy chọn)
  devtools: { enabled: true },

  // Cấu hình @nuxt/ui
  css: ['~/assets/css/main.css'],

  // Cấu hình runtimeConfig để gọi Laravel API
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_API_URL || 'https://admin.xanbuffet.com/api',
    },
  },

  // Cấu hình Nitro cho SSR
  nitro: {
    preset: 'node-server', // Đảm bảo tương thích với SSR trên VPS
  },

  // Cấu hình @nuxt/eslint
  eslint: {
    checker: true,
    config: {
      stylistic: {
        quotes: 'single', // Dấu nháy đơn
        indent: 2, // Thụt lề 2 spaces
        semi: true,
      },
    },
  },

  // Cấu hình @nuxt/image
  image: {
    provider: 'static', // Sử dụng provider local cho tài nguyên tĩnh
    domains: ['<laravel_api_domain>'], // Cho phép tải hình ảnh từ Laravel API
    dir: 'public', // Thư mục chứa hình ảnh tĩnh
    // Nếu dùng Cloudinary (tùy chọn):
    // provider: 'cloudinary',
    // cloudinary: {
    //   baseURL: 'https://res.cloudinary.com/<your_cloud_name>',
    // },
  },
})
