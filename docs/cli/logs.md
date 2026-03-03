---
summary: "CLI reference for `assistme logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `assistme logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
assistme logs
assistme logs --follow
assistme logs --json
assistme logs --limit 500
assistme logs --local-time
assistme logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
