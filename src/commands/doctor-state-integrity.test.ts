import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AssistMeConfig } from "../config/config.js";
import { resolveStorePath, resolveSessionTranscriptsDirForAgent } from "../config/sessions.js";
import { note } from "../terminal/note.js";
import { noteStateIntegrity } from "./doctor-state-integrity.js";

vi.mock("../terminal/note.js", () => ({
  note: vi.fn(),
}));

type EnvSnapshot = {
  HOME?: string;
  ASSISTME_HOME?: string;
  ASSISTME_STATE_DIR?: string;
  ASSISTME_OAUTH_DIR?: string;
};

function captureEnv(): EnvSnapshot {
  return {
    HOME: process.env.HOME,
    ASSISTME_HOME: process.env.ASSISTME_HOME,
    ASSISTME_STATE_DIR: process.env.ASSISTME_STATE_DIR,
    ASSISTME_OAUTH_DIR: process.env.ASSISTME_OAUTH_DIR,
  };
}

function restoreEnv(snapshot: EnvSnapshot) {
  for (const key of Object.keys(snapshot) as Array<keyof EnvSnapshot>) {
    const value = snapshot[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function setupSessionState(cfg: AssistMeConfig, env: NodeJS.ProcessEnv, homeDir: string) {
  const agentId = "main";
  const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId, env, () => homeDir);
  const storePath = resolveStorePath(cfg.session?.store, { agentId });
  fs.mkdirSync(sessionsDir, { recursive: true });
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
}

function stateIntegrityText(): string {
  return vi
    .mocked(note)
    .mock.calls.filter((call) => call[1] === "State integrity")
    .map((call) => String(call[0]))
    .join("\n");
}

const OAUTH_PROMPT_MATCHER = expect.objectContaining({
  message: expect.stringContaining("Create OAuth dir at"),
});

async function runStateIntegrity(cfg: AssistMeConfig) {
  setupSessionState(cfg, process.env, process.env.HOME ?? "");
  const confirmSkipInNonInteractive = vi.fn(async () => false);
  await noteStateIntegrity(cfg, { confirmSkipInNonInteractive });
  return confirmSkipInNonInteractive;
}

function writeSessionStore(
  cfg: AssistMeConfig,
  sessions: Record<string, { sessionId: string; updatedAt: number }>,
) {
  setupSessionState(cfg, process.env, process.env.HOME ?? "");
  const storePath = resolveStorePath(cfg.session?.store, { agentId: "main" });
  fs.writeFileSync(storePath, JSON.stringify(sessions, null, 2));
}

async function runStateIntegrityText(cfg: AssistMeConfig): Promise<string> {
  await noteStateIntegrity(cfg, { confirmSkipInNonInteractive: vi.fn(async () => false) });
  return stateIntegrityText();
}

describe("doctor state integrity oauth dir checks", () => {
  let envSnapshot: EnvSnapshot;
  let tempHome = "";

  beforeEach(() => {
    envSnapshot = captureEnv();
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "assistme-doctor-state-integrity-"));
    process.env.HOME = tempHome;
    process.env.ASSISTME_HOME = tempHome;
    process.env.ASSISTME_STATE_DIR = path.join(tempHome, ".assistme");
    delete process.env.ASSISTME_OAUTH_DIR;
    fs.mkdirSync(process.env.ASSISTME_STATE_DIR, { recursive: true, mode: 0o700 });
    vi.mocked(note).mockClear();
  });

  afterEach(() => {
    restoreEnv(envSnapshot);
    fs.rmSync(tempHome, { recursive: true, force: true });
  });

  it("does not prompt for oauth dir when no whatsapp/pairing config is active", async () => {
    const cfg: AssistMeConfig = {};
    const confirmSkipInNonInteractive = await runStateIntegrity(cfg);
    expect(confirmSkipInNonInteractive).not.toHaveBeenCalledWith(OAUTH_PROMPT_MATCHER);
    const text = stateIntegrityText();
    expect(text).toContain("OAuth dir not present");
    expect(text).not.toContain("CRITICAL: OAuth dir missing");
  });

  it("prompts for oauth dir when whatsapp is configured", async () => {
    const cfg: AssistMeConfig = {
      channels: {
        whatsapp: {},
      },
    };
    const confirmSkipInNonInteractive = await runStateIntegrity(cfg);
    expect(confirmSkipInNonInteractive).toHaveBeenCalledWith(OAUTH_PROMPT_MATCHER);
    expect(stateIntegrityText()).toContain("CRITICAL: OAuth dir missing");
  });

  it("prompts for oauth dir when a channel dmPolicy is pairing", async () => {
    const cfg: AssistMeConfig = {
      channels: {
        telegram: {
          dmPolicy: "pairing",
        },
      },
    };
    const confirmSkipInNonInteractive = await runStateIntegrity(cfg);
    expect(confirmSkipInNonInteractive).toHaveBeenCalledWith(OAUTH_PROMPT_MATCHER);
  });

  it("prompts for oauth dir when ASSISTME_OAUTH_DIR is explicitly configured", async () => {
    process.env.ASSISTME_OAUTH_DIR = path.join(tempHome, ".oauth");
    const cfg: AssistMeConfig = {};
    const confirmSkipInNonInteractive = await runStateIntegrity(cfg);
    expect(confirmSkipInNonInteractive).toHaveBeenCalledWith(OAUTH_PROMPT_MATCHER);
    expect(stateIntegrityText()).toContain("CRITICAL: OAuth dir missing");
  });

  it("detects orphan transcripts and offers archival remediation", async () => {
    const cfg: AssistMeConfig = {};
    setupSessionState(cfg, process.env, process.env.HOME ?? "");
    const sessionsDir = resolveSessionTranscriptsDirForAgent("main", process.env, () => tempHome);
    fs.writeFileSync(path.join(sessionsDir, "orphan-session.jsonl"), '{"type":"session"}\n');
    const confirmSkipInNonInteractive = vi.fn(async (params: { message: string }) =>
      params.message.includes("orphan transcript file"),
    );
    await noteStateIntegrity(cfg, { confirmSkipInNonInteractive });
    expect(stateIntegrityText()).toContain("orphan transcript file");
    expect(confirmSkipInNonInteractive).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("orphan transcript file"),
      }),
    );
    const files = fs.readdirSync(sessionsDir);
    expect(files.some((name) => name.startsWith("orphan-session.jsonl.deleted."))).toBe(true);
  });

  it("prints assistme-only verification hints when recent sessions are missing transcripts", async () => {
    const cfg: AssistMeConfig = {};
    writeSessionStore(cfg, {
      "agent:main:main": {
        sessionId: "missing-transcript",
        updatedAt: Date.now(),
      },
    });
    const text = await runStateIntegrityText(cfg);
    expect(text).toContain("recent sessions are missing transcripts");
    expect(text).toMatch(/assistme sessions --store ".*sessions\.json"/);
    expect(text).toMatch(/assistme sessions cleanup --store ".*sessions\.json" --dry-run/);
    expect(text).toMatch(
      /assistme sessions cleanup --store ".*sessions\.json" --enforce --fix-missing/,
    );
    expect(text).not.toContain("--active");
    expect(text).not.toContain(" ls ");
  });

  it("ignores slash-routing sessions for recent missing transcript warnings", async () => {
    const cfg: AssistMeConfig = {};
    writeSessionStore(cfg, {
      "agent:main:telegram:slash:6790081233": {
        sessionId: "missing-slash-transcript",
        updatedAt: Date.now(),
      },
    });
    const text = await runStateIntegrityText(cfg);
    expect(text).not.toContain("recent sessions are missing transcripts");
  });
});
