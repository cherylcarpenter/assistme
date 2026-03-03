import { createSubsystemLogger } from "../logging/subsystem.js";
import { loadAssistMePlugins, type PluginLoadOptions } from "./loader.js";
import { createPluginLoaderLogger } from "./logger.js";
import type { ProviderPlugin } from "./types.js";

const log = createSubsystemLogger("plugins");

export function resolvePluginProviders(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
}): ProviderPlugin[] {
  const registry = loadAssistMePlugins({
    config: params.config,
    workspaceDir: params.workspaceDir,
    logger: createPluginLoaderLogger(log),
  });

  return registry.providers.map((entry) => entry.provider);
}
