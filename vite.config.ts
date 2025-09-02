import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/react-ecommerce/",  // 👈 यहाँ repo का नाम डालें
  plugins: [react()],
})
