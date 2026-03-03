import Foundation

public enum AssistMeCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum AssistMeCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum AssistMeCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum AssistMeCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct AssistMeCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: AssistMeCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: AssistMeCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: AssistMeCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: AssistMeCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct AssistMeCameraClipParams: Codable, Sendable, Equatable {
    public var facing: AssistMeCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: AssistMeCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: AssistMeCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: AssistMeCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
