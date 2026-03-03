package ai.assistme.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class AssistMeProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", AssistMeCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", AssistMeCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", AssistMeCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", AssistMeCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", AssistMeCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", AssistMeCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", AssistMeCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", AssistMeCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", AssistMeCapability.Canvas.rawValue)
    assertEquals("camera", AssistMeCapability.Camera.rawValue)
    assertEquals("screen", AssistMeCapability.Screen.rawValue)
    assertEquals("voiceWake", AssistMeCapability.VoiceWake.rawValue)
    assertEquals("location", AssistMeCapability.Location.rawValue)
    assertEquals("sms", AssistMeCapability.Sms.rawValue)
    assertEquals("device", AssistMeCapability.Device.rawValue)
    assertEquals("notifications", AssistMeCapability.Notifications.rawValue)
    assertEquals("system", AssistMeCapability.System.rawValue)
    assertEquals("appUpdate", AssistMeCapability.AppUpdate.rawValue)
    assertEquals("photos", AssistMeCapability.Photos.rawValue)
    assertEquals("contacts", AssistMeCapability.Contacts.rawValue)
    assertEquals("calendar", AssistMeCapability.Calendar.rawValue)
    assertEquals("motion", AssistMeCapability.Motion.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", AssistMeCameraCommand.List.rawValue)
    assertEquals("camera.snap", AssistMeCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", AssistMeCameraCommand.Clip.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", AssistMeScreenCommand.Record.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", AssistMeNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", AssistMeNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", AssistMeDeviceCommand.Status.rawValue)
    assertEquals("device.info", AssistMeDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", AssistMeDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", AssistMeDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", AssistMeSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", AssistMePhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", AssistMeContactsCommand.Search.rawValue)
    assertEquals("contacts.add", AssistMeContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", AssistMeCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", AssistMeCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", AssistMeMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", AssistMeMotionCommand.Pedometer.rawValue)
  }
}
