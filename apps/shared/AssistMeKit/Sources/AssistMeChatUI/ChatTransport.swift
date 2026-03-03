import Foundation

public enum AssistMeChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(AssistMeChatEventPayload)
    case agent(AssistMeAgentEventPayload)
    case seqGap
}

public protocol AssistMeChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> AssistMeChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [AssistMeChatAttachmentPayload]) async throws -> AssistMeChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> AssistMeChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<AssistMeChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension AssistMeChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "AssistMeChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> AssistMeChatSessionsListResponse {
        throw NSError(
            domain: "AssistMeChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
