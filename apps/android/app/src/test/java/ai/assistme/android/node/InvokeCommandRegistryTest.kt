package ai.assistme.android.node

import ai.assistme.android.protocol.AssistMeCalendarCommand
import ai.assistme.android.protocol.AssistMeCameraCommand
import ai.assistme.android.protocol.AssistMeCapability
import ai.assistme.android.protocol.AssistMeContactsCommand
import ai.assistme.android.protocol.AssistMeDeviceCommand
import ai.assistme.android.protocol.AssistMeLocationCommand
import ai.assistme.android.protocol.AssistMeMotionCommand
import ai.assistme.android.protocol.AssistMeNotificationsCommand
import ai.assistme.android.protocol.AssistMePhotosCommand
import ai.assistme.android.protocol.AssistMeSmsCommand
import ai.assistme.android.protocol.AssistMeSystemCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      AssistMeCapability.Canvas.rawValue,
      AssistMeCapability.Screen.rawValue,
      AssistMeCapability.Device.rawValue,
      AssistMeCapability.Notifications.rawValue,
      AssistMeCapability.System.rawValue,
      AssistMeCapability.AppUpdate.rawValue,
      AssistMeCapability.Photos.rawValue,
      AssistMeCapability.Contacts.rawValue,
      AssistMeCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      AssistMeCapability.Camera.rawValue,
      AssistMeCapability.Location.rawValue,
      AssistMeCapability.Sms.rawValue,
      AssistMeCapability.VoiceWake.rawValue,
      AssistMeCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      AssistMeDeviceCommand.Status.rawValue,
      AssistMeDeviceCommand.Info.rawValue,
      AssistMeDeviceCommand.Permissions.rawValue,
      AssistMeDeviceCommand.Health.rawValue,
      AssistMeNotificationsCommand.List.rawValue,
      AssistMeNotificationsCommand.Actions.rawValue,
      AssistMeSystemCommand.Notify.rawValue,
      AssistMePhotosCommand.Latest.rawValue,
      AssistMeContactsCommand.Search.rawValue,
      AssistMeContactsCommand.Add.rawValue,
      AssistMeCalendarCommand.Events.rawValue,
      AssistMeCalendarCommand.Add.rawValue,
      "app.update",
    )

  private val optionalCommands =
    setOf(
      AssistMeCameraCommand.Snap.rawValue,
      AssistMeCameraCommand.Clip.rawValue,
      AssistMeCameraCommand.List.rawValue,
      AssistMeLocationCommand.Get.rawValue,
      AssistMeMotionCommand.Activity.rawValue,
      AssistMeMotionCommand.Pedometer.rawValue,
      AssistMeSmsCommand.Send.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          smsAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(AssistMeMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(AssistMeMotionCommand.Pedometer.rawValue))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    smsAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      smsAvailable = smsAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
