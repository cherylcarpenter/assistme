import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/assistme" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchAssistMeChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveAssistMeUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopAssistMeChrome: vi.fn(async () => {}),
}));
