import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "assistme",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "assistme", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "assistme", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "assistme", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "assistme", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "assistme", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "assistme", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "assistme", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "assistme", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".assistme-dev");
    expect(env.ASSISTME_PROFILE).toBe("dev");
    expect(env.ASSISTME_STATE_DIR).toBe(expectedStateDir);
    expect(env.ASSISTME_CONFIG_PATH).toBe(path.join(expectedStateDir, "assistme.json"));
    expect(env.ASSISTME_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      ASSISTME_STATE_DIR: "/custom",
      ASSISTME_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.ASSISTME_STATE_DIR).toBe("/custom");
    expect(env.ASSISTME_GATEWAY_PORT).toBe("19099");
    expect(env.ASSISTME_CONFIG_PATH).toBe(path.join("/custom", "assistme.json"));
  });

  it("uses ASSISTME_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      ASSISTME_HOME: "/srv/assistme-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/assistme-home");
    expect(env.ASSISTME_STATE_DIR).toBe(path.join(resolvedHome, ".assistme-work"));
    expect(env.ASSISTME_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".assistme-work", "assistme.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "assistme doctor --fix",
      env: {},
      expected: "assistme doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "assistme doctor --fix",
      env: { ASSISTME_PROFILE: "default" },
      expected: "assistme doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "assistme doctor --fix",
      env: { ASSISTME_PROFILE: "Default" },
      expected: "assistme doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "assistme doctor --fix",
      env: { ASSISTME_PROFILE: "bad profile" },
      expected: "assistme doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "assistme --profile work doctor --fix",
      env: { ASSISTME_PROFILE: "work" },
      expected: "assistme --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "assistme --dev doctor",
      env: { ASSISTME_PROFILE: "dev" },
      expected: "assistme --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("assistme doctor --fix", { ASSISTME_PROFILE: "work" })).toBe(
      "assistme --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("assistme doctor --fix", { ASSISTME_PROFILE: "  jbassistme  " })).toBe(
      "assistme --profile jbassistme doctor --fix",
    );
  });

  it("handles command with no args after assistme", () => {
    expect(formatCliCommand("assistme", { ASSISTME_PROFILE: "test" })).toBe(
      "assistme --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm assistme doctor", { ASSISTME_PROFILE: "work" })).toBe(
      "pnpm assistme --profile work doctor",
    );
  });
});
