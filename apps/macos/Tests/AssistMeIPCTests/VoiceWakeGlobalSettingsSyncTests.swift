import Foundation
import AssistMeProtocol
import Testing
@testable import AssistMe

@Suite(.serialized) struct VoiceWakeGlobalSettingsSyncTests {
    private func voiceWakeChangedEvent(payload: AssistMeProtocol.AnyCodable) -> EventFrame {
        EventFrame(
            type: "event",
            event: "voicewake.changed",
            payload: payload,
            seq: nil,
            stateversion: nil)
    }

    private func applyTriggersAndCapturePrevious(_ triggers: [String]) async -> [String] {
        let previous = await MainActor.run { AppStateStore.shared.swabbleTriggerWords }
        await MainActor.run {
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(triggers)
        }
        return previous
    }

    @Test func appliesVoiceWakeChangedEventToAppState() async {
        let previous = await applyTriggersAndCapturePrevious(["before"])
        let evt = voiceWakeChangedEvent(payload: AssistMeProtocol.AnyCodable(["triggers": ["assistme", "computer"]]))

        await VoiceWakeGlobalSettingsSync.shared.handle(push: .event(evt))

        let updated = await MainActor.run { AppStateStore.shared.swabbleTriggerWords }
        #expect(updated == ["assistme", "computer"])

        await MainActor.run {
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(previous)
        }
    }

    @Test func ignoresVoiceWakeChangedEventWithInvalidPayload() async {
        let previous = await applyTriggersAndCapturePrevious(["before"])
        let evt = voiceWakeChangedEvent(payload: AssistMeProtocol.AnyCodable(["unexpected": 123]))

        await VoiceWakeGlobalSettingsSync.shared.handle(push: .event(evt))

        let updated = await MainActor.run { AppStateStore.shared.swabbleTriggerWords }
        #expect(updated == ["before"])

        await MainActor.run {
            AppStateStore.shared.applyGlobalVoiceWakeTriggers(previous)
        }
    }
}
