---
summary: "CLI reference for `assistme daemon` (legacy alias for gateway service management)"
read_when:
  - You still use `assistme daemon ...` in scripts
  - You need service lifecycle commands (install/start/stop/restart/status)
title: "daemon"
---

# `assistme daemon`

Legacy alias for Gateway service management commands.

`assistme daemon ...` maps to the same service control surface as `assistme gateway ...` service commands.

## Usage

```bash
assistme daemon status
assistme daemon install
assistme daemon start
assistme daemon stop
assistme daemon restart
assistme daemon uninstall
```

## Subcommands

- `status`: show service install state and probe Gateway health
- `install`: install service (`launchd`/`systemd`/`schtasks`)
- `uninstall`: remove service
- `start`: start service
- `stop`: stop service
- `restart`: restart service

## Common options

- `status`: `--url`, `--token`, `--password`, `--timeout`, `--no-probe`, `--deep`, `--json`
- `install`: `--port`, `--runtime <node|bun>`, `--token`, `--force`, `--json`
- lifecycle (`uninstall|start|stop|restart`): `--json`

## Prefer

Use [`assistme gateway`](/cli/gateway) for current docs and examples.
