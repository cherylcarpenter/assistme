import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-assistme writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.assistme.mac"
let gatewayLaunchdLabel = "ai.assistme.gateway"
let onboardingVersionKey = "assistme.onboardingVersion"
let onboardingSeenKey = "assistme.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "assistme.pauseEnabled"
let iconAnimationsEnabledKey = "assistme.iconAnimationsEnabled"
let swabbleEnabledKey = "assistme.swabbleEnabled"
let swabbleTriggersKey = "assistme.swabbleTriggers"
let voiceWakeTriggerChimeKey = "assistme.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "assistme.voiceWakeSendChime"
let showDockIconKey = "assistme.showDockIcon"
let defaultVoiceWakeTriggers = ["assistme"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "assistme.voiceWakeMicID"
let voiceWakeMicNameKey = "assistme.voiceWakeMicName"
let voiceWakeLocaleKey = "assistme.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "assistme.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "assistme.voicePushToTalkEnabled"
let talkEnabledKey = "assistme.talkEnabled"
let iconOverrideKey = "assistme.iconOverride"
let connectionModeKey = "assistme.connectionMode"
let remoteTargetKey = "assistme.remoteTarget"
let remoteIdentityKey = "assistme.remoteIdentity"
let remoteProjectRootKey = "assistme.remoteProjectRoot"
let remoteCliPathKey = "assistme.remoteCliPath"
let canvasEnabledKey = "assistme.canvasEnabled"
let cameraEnabledKey = "assistme.cameraEnabled"
let systemRunPolicyKey = "assistme.systemRunPolicy"
let systemRunAllowlistKey = "assistme.systemRunAllowlist"
let systemRunEnabledKey = "assistme.systemRunEnabled"
let locationModeKey = "assistme.locationMode"
let locationPreciseKey = "assistme.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "assistme.peekabooBridgeEnabled"
let deepLinkKeyKey = "assistme.deepLinkKey"
let modelCatalogPathKey = "assistme.modelCatalogPath"
let modelCatalogReloadKey = "assistme.modelCatalogReload"
let cliInstallPromptedVersionKey = "assistme.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "assistme.heartbeatsEnabled"
let debugPaneEnabledKey = "assistme.debugPaneEnabled"
let debugFileLogEnabledKey = "assistme.debug.fileLogEnabled"
let appLogLevelKey = "assistme.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
