import "dotenv/config";
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Declare your Neon services here
  auth: false,

  functions: {
    mikrotikmonitor: {
      name: "MikroTik Monitor",
      source: "./functions/mikrotik-monitor.ts",
      env: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN!,
      },
    },
  },

  triggers: {
    mikrotikMonitorSchedule: {
      type: "schedule",
      function: "mikrotikmonitor",
      cron: "* * * * *",
      functionPath: "/",
      enabled: true,
    },
  },

  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
