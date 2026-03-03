// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "AssistMeKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "AssistMeProtocol", targets: ["AssistMeProtocol"]),
        .library(name: "AssistMeKit", targets: ["AssistMeKit"]),
        .library(name: "AssistMeChatUI", targets: ["AssistMeChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "AssistMeProtocol",
            path: "Sources/AssistMeProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "AssistMeKit",
            dependencies: [
                "AssistMeProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/AssistMeKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "AssistMeChatUI",
            dependencies: [
                "AssistMeKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/AssistMeChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "AssistMeKitTests",
            dependencies: ["AssistMeKit", "AssistMeChatUI"],
            path: "Tests/AssistMeKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
