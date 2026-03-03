---
summary: "CLI reference for `assistme devices` (device pairing + token rotation/revocation)"
read_when:
  - You are approving device pairing requests
  - You need to rotate or revoke device tokens
title: "devices"
---

# `assistme devices`

Manage device pairing requests and device-scoped tokens.

## Commands

### `assistme devices list`

List pending pairing requests and paired devices.

```
assistme devices list
assistme devices list --json
```

### `assistme devices remove <deviceId>`

Remove one paired device entry.

```
assistme devices remove <deviceId>
assistme devices remove <deviceId> --json
```

### `assistme devices clear --yes [--pending]`

Clear paired devices in bulk.

```
assistme devices clear --yes
assistme devices clear --yes --pending
assistme devices clear --yes --pending --json
```

### `assistme devices approve [requestId] [--latest]`

Approve a pending device pairing request. If `requestId` is omitted, AssistMe
automatically approves the most recent pending request.

```
assistme devices approve
assistme devices approve <requestId>
assistme devices approve --latest
```

### `assistme devices reject <requestId>`

Reject a pending device pairing request.

```
assistme devices reject <requestId>
```

### `assistme devices rotate --device <id> --role <role> [--scope <scope...>]`

Rotate a device token for a specific role (optionally updating scopes).

```
assistme devices rotate --device <deviceId> --role operator --scope operator.read --scope operator.write
```

### `assistme devices revoke --device <id> --role <role>`

Revoke a device token for a specific role.

```
assistme devices revoke --device <deviceId> --role node
```

## Common options

- `--url <url>`: Gateway WebSocket URL (defaults to `gateway.remote.url` when configured).
- `--token <token>`: Gateway token (if required).
- `--password <password>`: Gateway password (password auth).
- `--timeout <ms>`: RPC timeout.
- `--json`: JSON output (recommended for scripting).

Note: when you set `--url`, the CLI does not fall back to config or environment credentials.
Pass `--token` or `--password` explicitly. Missing explicit credentials is an error.

## Notes

- Token rotation returns a new token (sensitive). Treat it like a secret.
- These commands require `operator.pairing` (or `operator.admin`) scope.
- `devices clear` is intentionally gated by `--yes`.
- If pairing scope is unavailable on local loopback (and no explicit `--url` is passed), list/approve can use a local pairing fallback.
