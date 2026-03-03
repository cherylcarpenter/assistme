// swift-tools-version: 6.2
// Package manifest for the AssistMe macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "AssistMe",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "AssistMeIPC", targets: ["AssistMeIPC"]),
        .library(name: "AssistMeDiscovery", targets: ["AssistMeDiscovery"]),
        .executable(name: "AssistMe", targets: ["AssistMe"]),
        .executable(name: "assistme-mac", targets: ["AssistMeMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/AssistMeKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "AssistMeIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "AssistMeDiscovery",
            dependencies: [
                .product(name: "AssistMeKit", package: "AssistMeKit"),
            ],
            path: "Sources/AssistMeDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "AssistMe",
            dependencies: [
                "AssistMeIPC",
                "AssistMeDiscovery",
                .product(name: "AssistMeKit", package: "AssistMeKit"),
                .product(name: "AssistMeChatUI", package: "AssistMeKit"),
                .product(name: "AssistMeProtocol", package: "AssistMeKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/AssistMe.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "AssistMeMacCLI",
            dependencies: [
                "AssistMeDiscovery",
                .product(name: "AssistMeKit", package: "AssistMeKit"),
                .product(name: "AssistMeProtocol", package: "AssistMeKit"),
            ],
            path: "Sources/AssistMeMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "AssistMeIPCTests",
            dependencies: [
                "AssistMeIPC",
                "AssistMe",
                "AssistMeDiscovery",
                .product(name: "AssistMeProtocol", package: "AssistMeKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
