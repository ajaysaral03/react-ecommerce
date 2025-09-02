import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/react-ecommerce/",  // 👈 Make sure this exactly matches your GitHub repo name
  plugins: [react()]
})
