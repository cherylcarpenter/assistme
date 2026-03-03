import CoreLocation
import Foundation
import AssistMeKit
import UIKit

typealias AssistMeCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias AssistMeCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: AssistMeCameraSnapParams) async throws -> AssistMeCameraSnapResult
    func clip(params: AssistMeCameraClipParams) async throws -> AssistMeCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: AssistMeLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: AssistMeLocationGetParams,
        desiredAccuracy: AssistMeLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: AssistMeLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> AssistMeDeviceStatusPayload
    func info() -> AssistMeDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: AssistMePhotosLatestParams) async throws -> AssistMePhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: AssistMeContactsSearchParams) async throws -> AssistMeContactsSearchPayload
    func add(params: AssistMeContactsAddParams) async throws -> AssistMeContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: AssistMeCalendarEventsParams) async throws -> AssistMeCalendarEventsPayload
    func add(params: AssistMeCalendarAddParams) async throws -> AssistMeCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: AssistMeRemindersListParams) async throws -> AssistMeRemindersListPayload
    func add(params: AssistMeRemindersAddParams) async throws -> AssistMeRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: AssistMeMotionActivityParams) async throws -> AssistMeMotionActivityPayload
    func pedometer(params: AssistMePedometerParams) async throws -> AssistMePedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: AssistMeWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
