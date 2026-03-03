import Foundation
import Testing
@testable import AssistMe

@Suite(.serialized)
struct AssistMeConfigFileTests {
    private func makeConfigOverridePath() -> String {
        FileManager().temporaryDirectory
            .appendingPathComponent("assistme-config-\(UUID().uuidString)")
            .appendingPathComponent("assistme.json")
            .path
    }

    @Test
    func configPathRespectsEnvOverride() async {
        let override = makeConfigOverridePath()

        await TestIsolation.withEnvValues(["ASSISTME_CONFIG_PATH": override]) {
            #expect(AssistMeConfigFile.url().path == override)
        }
    }

    @MainActor
    @Test
    func remoteGatewayPortParsesAndMatchesHost() async {
        let override = makeConfigOverridePath()

        await TestIsolation.withEnvValues(["ASSISTME_CONFIG_PATH": override]) {
            AssistMeConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "ws://gateway.ts.net:19999",
                    ],
                ],
            ])
            #expect(AssistMeConfigFile.remoteGatewayPort() == 19999)
            #expect(AssistMeConfigFile.remoteGatewayPort(matchingHost: "gateway.ts.net") == 19999)
            #expect(AssistMeConfigFile.remoteGatewayPort(matchingHost: "gateway") == 19999)
            #expect(AssistMeConfigFile.remoteGatewayPort(matchingHost: "other.ts.net") == nil)
        }
    }

    @MainActor
    @Test
    func setRemoteGatewayUrlPreservesScheme() async {
        let override = makeConfigOverridePath()

        await TestIsolation.withEnvValues(["ASSISTME_CONFIG_PATH": override]) {
            AssistMeConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "wss://old-host:111",
                    ],
                ],
            ])
            AssistMeConfigFile.setRemoteGatewayUrl(host: "new-host", port: 2222)
            let root = AssistMeConfigFile.loadDict()
            let url = ((root["gateway"] as? [String: Any])?["remote"] as? [String: Any])?["url"] as? String
            #expect(url == "wss://new-host:2222")
        }
    }

    @MainActor
    @Test
    func clearRemoteGatewayUrlRemovesOnlyUrlField() async {
        let override = makeConfigOverridePath()

        await TestIsolation.withEnvValues(["ASSISTME_CONFIG_PATH": override]) {
            AssistMeConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "wss://old-host:111",
                        "token": "tok",
                    ],
                ],
            ])
            AssistMeConfigFile.clearRemoteGatewayUrl()
            let root = AssistMeConfigFile.loadDict()
            let remote = ((root["gateway"] as? [String: Any])?["remote"] as? [String: Any]) ?? [:]
            #expect((remote["url"] as? String) == nil)
            #expect((remote["token"] as? String) == "tok")
        }
    }

    @Test
    func stateDirOverrideSetsConfigPath() async {
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("assistme-state-\(UUID().uuidString)", isDirectory: true)
            .path

        await TestIsolation.withEnvValues([
            "ASSISTME_CONFIG_PATH": nil,
            "ASSISTME_STATE_DIR": dir,
        ]) {
            #expect(AssistMeConfigFile.stateDirURL().path == dir)
            #expect(AssistMeConfigFile.url().path == "\(dir)/assistme.json")
        }
    }

    @MainActor
    @Test
    func saveDictAppendsConfigAuditLog() async throws {
        let stateDir = FileManager().temporaryDirectory
            .appendingPathComponent("assistme-state-\(UUID().uuidString)", isDirectory: true)
        let configPath = stateDir.appendingPathComponent("assistme.json")
        let auditPath = stateDir.appendingPathComponent("logs/config-audit.jsonl")

        defer { try? FileManager().removeItem(at: stateDir) }

        try await TestIsolation.withEnvValues([
            "ASSISTME_STATE_DIR": stateDir.path,
            "ASSISTME_CONFIG_PATH": configPath.path,
        ]) {
            AssistMeConfigFile.saveDict([
                "gateway": ["mode": "local"],
            ])

            let configData = try Data(contentsOf: configPath)
            let configRoot = try JSONSerialization.jsonObject(with: configData) as? [String: Any]
            #expect((configRoot?["meta"] as? [String: Any]) != nil)

            let rawAudit = try String(contentsOf: auditPath, encoding: .utf8)
            let lines = rawAudit
                .split(whereSeparator: \.isNewline)
                .map(String.init)
            #expect(!lines.isEmpty)
            guard let last = lines.last else {
                Issue.record("Missing config audit line")
                return
            }
            let auditRoot = try JSONSerialization.jsonObject(with: Data(last.utf8)) as? [String: Any]
            #expect(auditRoot?["source"] as? String == "macos-assistme-config-file")
            #expect(auditRoot?["event"] as? String == "config.write")
            #expect(auditRoot?["result"] as? String == "success")
            #expect(auditRoot?["configPath"] as? String == configPath.path)
        }
    }
}
