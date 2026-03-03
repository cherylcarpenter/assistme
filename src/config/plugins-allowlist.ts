import type { AssistMeConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: AssistMeConfig, pluginId: string): AssistMeConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
