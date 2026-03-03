---
summary: "CLI reference for `assistme reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `assistme reset`

Reset local config/state (keeps the CLI installed).

```bash
assistme reset
assistme reset --dry-run
assistme reset --scope config+creds+sessions --yes --non-interactive
```
