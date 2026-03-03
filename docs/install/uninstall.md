---
summary: "Uninstall AssistMe completely (CLI, service, state, workspace)"
read_when:
  - You want to remove AssistMe from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `assistme` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
assistme uninstall
```

Non-interactive (automation / npx):

```bash
assistme uninstall --all --yes --non-interactive
npx -y assistme uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
assistme gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
assistme gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${ASSISTME_STATE_DIR:-$HOME/.assistme}"
```

If you set `ASSISTME_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.assistme/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g assistme
pnpm remove -g assistme
bun remove -g assistme
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/AssistMe.app
```

Notes:

- If you used profiles (`--profile` / `ASSISTME_PROFILE`), repeat step 3 for each state dir (defaults are `~/.assistme-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `assistme` is missing.

### macOS (launchd)

Default label is `ai.assistme.gateway` (or `ai.assistme.<profile>`; legacy `com.assistme.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.assistme.gateway
rm -f ~/Library/LaunchAgents/com.assistme.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.assistme.<profile>`. Remove any legacy `com.assistme.*` plists if present.

### Linux (systemd user unit)

Default unit name is `assistme-gateway.service` (or `assistme-gateway-<profile>.service`):

```bash
systemctl --user disable --now assistme-gateway.service
rm -f ~/.config/systemd/user/assistme-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `AssistMe Gateway` (or `AssistMe Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "AssistMe Gateway"
Remove-Item -Force "$env:USERPROFILE\.assistme\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.assistme-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://assistme.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g assistme@latest`.
Remove it with `npm rm -g assistme` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `assistme ...` / `bun run assistme ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
