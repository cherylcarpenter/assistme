import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  isRootHelpInvocation,
  isRootVersionInvocation,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "assistme", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "assistme", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "assistme", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "assistme", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "assistme", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with log-level",
      argv: ["node", "assistme", "--log-level", "debug", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "assistme", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "assistme", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "assistme", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --version",
      argv: ["node", "assistme", "--version"],
      expected: true,
    },
    {
      name: "root -V",
      argv: ["node", "assistme", "-V"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "assistme", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "subcommand version flag",
      argv: ["node", "assistme", "status", "--version"],
      expected: false,
    },
    {
      name: "unknown root flag with version",
      argv: ["node", "assistme", "--unknown", "--version"],
      expected: false,
    },
  ])("detects root-only version invocations: $name", ({ argv, expected }) => {
    expect(isRootVersionInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --help",
      argv: ["node", "assistme", "--help"],
      expected: true,
    },
    {
      name: "root -h",
      argv: ["node", "assistme", "-h"],
      expected: true,
    },
    {
      name: "root --help with profile",
      argv: ["node", "assistme", "--profile", "work", "--help"],
      expected: true,
    },
    {
      name: "subcommand --help",
      argv: ["node", "assistme", "status", "--help"],
      expected: false,
    },
    {
      name: "help before subcommand token",
      argv: ["node", "assistme", "--help", "status"],
      expected: false,
    },
    {
      name: "help after -- terminator",
      argv: ["node", "assistme", "nodes", "run", "--", "git", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag before help",
      argv: ["node", "assistme", "--unknown", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag after help",
      argv: ["node", "assistme", "--help", "--unknown"],
      expected: false,
    },
  ])("detects root-only help invocations: $name", ({ argv, expected }) => {
    expect(isRootHelpInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "assistme", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "assistme", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "assistme", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "assistme", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "assistme"],
      expected: null,
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "assistme", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "assistme", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "assistme", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "assistme", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "assistme", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "assistme", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "assistme", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "assistme", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "assistme", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "assistme", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "assistme", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "assistme", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "assistme", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "assistme", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "assistme", "status"],
        expected: ["node", "assistme", "status"],
      },
      {
        rawArgs: ["node-22", "assistme", "status"],
        expected: ["node-22", "assistme", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "assistme", "status"],
        expected: ["node-22.2.0.exe", "assistme", "status"],
      },
      {
        rawArgs: ["node-22.2", "assistme", "status"],
        expected: ["node-22.2", "assistme", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "assistme", "status"],
        expected: ["node-22.2.exe", "assistme", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "assistme", "status"],
        expected: ["/usr/bin/node-22.2.0", "assistme", "status"],
      },
      {
        rawArgs: ["node24", "assistme", "status"],
        expected: ["node24", "assistme", "status"],
      },
      {
        rawArgs: ["/usr/bin/node24", "assistme", "status"],
        expected: ["/usr/bin/node24", "assistme", "status"],
      },
      {
        rawArgs: ["node24.exe", "assistme", "status"],
        expected: ["node24.exe", "assistme", "status"],
      },
      {
        rawArgs: ["nodejs", "assistme", "status"],
        expected: ["nodejs", "assistme", "status"],
      },
      {
        rawArgs: ["node-dev", "assistme", "status"],
        expected: ["node", "assistme", "node-dev", "assistme", "status"],
      },
      {
        rawArgs: ["assistme", "status"],
        expected: ["node", "assistme", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "assistme",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "assistme",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "assistme", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "assistme", "status"],
      ["node", "assistme", "health"],
      ["node", "assistme", "sessions"],
      ["node", "assistme", "config", "get", "update"],
      ["node", "assistme", "config", "unset", "update"],
      ["node", "assistme", "models", "list"],
      ["node", "assistme", "models", "status"],
      ["node", "assistme", "memory", "status"],
      ["node", "assistme", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "assistme", "agents", "list"],
      ["node", "assistme", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});
