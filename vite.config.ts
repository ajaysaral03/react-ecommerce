import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/react-ecommerce/", // 👈 yeh repo name ke hisaab se fix hai
});
