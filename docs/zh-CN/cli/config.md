---
read_when:
  - 你想以非交互方式读取或编辑配置
summary: "`assistme config` 的 CLI 参考（获取/设置/取消设置配置值）"
title: config
x-i18n:
  generated_at: "2026-02-03T10:04:13Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: d60a35f5330f22bc99a0df090590586109d329ddd2ca294aeed191a22560c1c2
  source_path: cli/config.md
  workflow: 15
---

# `assistme config`

配置辅助命令：通过路径获取/设置/取消设置值。不带子命令运行将打开
配置向导（与 `assistme configure` 相同）。

## 示例

```bash
assistme config get browser.executablePath
assistme config set browser.executablePath "/usr/bin/google-chrome"
assistme config set agents.defaults.heartbeat.every "2h"
assistme config set agents.list[0].tools.exec.node "node-id-or-name"
assistme config unset tools.web.search.apiKey
```

## 路径

路径使用点号或括号表示法：

```bash
assistme config get agents.defaults.workspace
assistme config get agents.list[0].id
```

使用智能体列表索引来定位特定智能体：

```bash
assistme config get agents.list
assistme config set agents.list[1].tools.exec.node "node-id-or-name"
```

## 值

值会尽可能解析为 JSON5；否则将被视为字符串。
使用 `--json` 强制要求 JSON5 解析。

```bash
assistme config set agents.defaults.heartbeat.every "0m"
assistme config set gateway.port 19001 --json
assistme config set channels.whatsapp.groups '["*"]' --json
```

编辑后请重启 Gateway 网关。
