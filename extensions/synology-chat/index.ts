import type { AssistMePluginApi } from "assistme/plugin-sdk";
import { emptyPluginConfigSchema } from "assistme/plugin-sdk";
import { createSynologyChatPlugin } from "./src/channel.js";
import { setSynologyRuntime } from "./src/runtime.js";

const plugin = {
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for AssistMe",
  configSchema: emptyPluginConfigSchema(),
  register(api: AssistMePluginApi) {
    setSynologyRuntime(api.runtime);
    api.registerChannel({ plugin: createSynologyChatPlugin() });
  },
};

export default plugin;
