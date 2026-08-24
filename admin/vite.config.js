import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "[IP_ADDRESS]",
    port: 5173,
  },
});
