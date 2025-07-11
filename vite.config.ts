import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import officeAddin from "vite-plugin-office-addin";
import checker from "vite-plugin-checker";

const devCerts = require("office-addin-dev-certs");

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  plugins: [
    react(),
    officeAddin({
      devUrl: "https://localhost:3000",
      prodUrl: "https://www.contoso.com", // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION
    }),
    checker({ typescript: true }),
  ],
  root: "src",
  build: {
    rollupOptions: {
      input: {
        taskpane: "/taskpane/taskpane.html",
        commands: "/commands/commands.html",
      },
    },
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: mode !== "production" ? { https: await getHttpsOptions() } : {},
}));
