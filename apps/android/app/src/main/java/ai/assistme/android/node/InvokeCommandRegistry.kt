package ai.assistme.android.node

import ai.assistme.android.protocol.AssistMeCalendarCommand
import ai.assistme.android.protocol.AssistMeCanvasA2UICommand
import ai.assistme.android.protocol.AssistMeCanvasCommand
import ai.assistme.android.protocol.AssistMeCameraCommand
import ai.assistme.android.protocol.AssistMeCapability
import ai.assistme.android.protocol.AssistMeContactsCommand
import ai.assistme.android.protocol.AssistMeDeviceCommand
import ai.assistme.android.protocol.AssistMeLocationCommand
import ai.assistme.android.protocol.AssistMeMotionCommand
import ai.assistme.android.protocol.AssistMeNotificationsCommand
import ai.assistme.android.protocol.AssistMePhotosCommand
import ai.assistme.android.protocol.AssistMeScreenCommand
import ai.assistme.android.protocol.AssistMeSmsCommand
import ai.assistme.android.protocol.AssistMeSystemCommand

data class NodeRuntimeFlags(
  val cameraEnabled: Boolean,
  val locationEnabled: Boolean,
  val smsAvailable: Boolean,
  val voiceWakeEnabled: Boolean,
  val motionActivityAvailable: Boolean,
  val motionPedometerAvailable: Boolean,
  val debugBuild: Boolean,
)

enum class InvokeCommandAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  MotionActivityAvailable,
  MotionPedometerAvailable,
  DebugBuild,
}

enum class NodeCapabilityAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  VoiceWakeEnabled,
  MotionAvailable,
}

data class NodeCapabilitySpec(
  val name: String,
  val availability: NodeCapabilityAvailability = NodeCapabilityAvailability.Always,
)

data class InvokeCommandSpec(
  val name: String,
  val requiresForeground: Boolean = false,
  val availability: InvokeCommandAvailability = InvokeCommandAvailability.Always,
)

object InvokeCommandRegistry {
  val capabilityManifest: List<NodeCapabilitySpec> =
    listOf(
      NodeCapabilitySpec(name = AssistMeCapability.Canvas.rawValue),
      NodeCapabilitySpec(name = AssistMeCapability.Screen.rawValue),
      NodeCapabilitySpec(name = AssistMeCapability.Device.rawValue),
      NodeCapabilitySpec(name = AssistMeCapability.Notifications.rawValue),
      NodeCapabilitySpec(name = AssistMeCapability.System.rawValue),
      NodeCapabilitySpec(name = AssistMeCapability.AppUpdate.rawValue),
      NodeCapabilitySpec(
        name = AssistMeCapability.Camera.rawValue,
        availability = NodeCapabilityAvailability.CameraEnabled,
      ),
      NodeCapabilitySpec(
        name = AssistMeCapability.Sms.rawValue,
        availability = NodeCapabilityAvailability.SmsAvailable,
      ),
      NodeCapabilitySpec(
        name = AssistMeCapability.VoiceWake.rawValue,
        availability = NodeCapabilityAvailability.VoiceWakeEnabled,
      ),
      NodeCapabilitySpec(
        name = AssistMeCapability.Location.rawValue,
        availability = NodeCapabilityAvailability.LocationEnabled,
      ),
      NodeCapabilitySpec(name = AssistMeCapability.Photos.rawValue),
      NodeCapabilitySpec(name = AssistMeCapability.Contacts.rawValue),
      NodeCapabilitySpec(name = AssistMeCapability.Calendar.rawValue),
      NodeCapabilitySpec(
        name = AssistMeCapability.Motion.rawValue,
        availability = NodeCapabilityAvailability.MotionAvailable,
      ),
    )

  val all: List<InvokeCommandSpec> =
    listOf(
      InvokeCommandSpec(
        name = AssistMeCanvasCommand.Present.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeCanvasCommand.Hide.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeCanvasCommand.Navigate.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeCanvasCommand.Eval.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeCanvasCommand.Snapshot.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeCanvasA2UICommand.Push.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeCanvasA2UICommand.PushJSONL.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeCanvasA2UICommand.Reset.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeScreenCommand.Record.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = AssistMeSystemCommand.Notify.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeCameraCommand.List.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = AssistMeCameraCommand.Snap.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = AssistMeCameraCommand.Clip.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = AssistMeLocationCommand.Get.rawValue,
        availability = InvokeCommandAvailability.LocationEnabled,
      ),
      InvokeCommandSpec(
        name = AssistMeDeviceCommand.Status.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeDeviceCommand.Info.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeDeviceCommand.Permissions.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeDeviceCommand.Health.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeNotificationsCommand.List.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeNotificationsCommand.Actions.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMePhotosCommand.Latest.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeContactsCommand.Search.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeContactsCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeCalendarCommand.Events.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeCalendarCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = AssistMeMotionCommand.Activity.rawValue,
        availability = InvokeCommandAvailability.MotionActivityAvailable,
      ),
      InvokeCommandSpec(
        name = AssistMeMotionCommand.Pedometer.rawValue,
        availability = InvokeCommandAvailability.MotionPedometerAvailable,
      ),
      InvokeCommandSpec(
        name = AssistMeSmsCommand.Send.rawValue,
        availability = InvokeCommandAvailability.SmsAvailable,
      ),
      InvokeCommandSpec(
        name = "debug.logs",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(
        name = "debug.ed25519",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(name = "app.update"),
    )

  private val byNameInternal: Map<String, InvokeCommandSpec> = all.associateBy { it.name }

  fun find(command: String): InvokeCommandSpec? = byNameInternal[command]

  fun advertisedCapabilities(flags: NodeRuntimeFlags): List<String> {
    return capabilityManifest
      .filter { spec ->
        when (spec.availability) {
          NodeCapabilityAvailability.Always -> true
          NodeCapabilityAvailability.CameraEnabled -> flags.cameraEnabled
          NodeCapabilityAvailability.LocationEnabled -> flags.locationEnabled
          NodeCapabilityAvailability.SmsAvailable -> flags.smsAvailable
          NodeCapabilityAvailability.VoiceWakeEnabled -> flags.voiceWakeEnabled
          NodeCapabilityAvailability.MotionAvailable -> flags.motionActivityAvailable || flags.motionPedometerAvailable
        }
      }
      .map { it.name }
  }

  fun advertisedCommands(flags: NodeRuntimeFlags): List<String> {
    return all
      .filter { spec ->
        when (spec.availability) {
          InvokeCommandAvailability.Always -> true
          InvokeCommandAvailability.CameraEnabled -> flags.cameraEnabled
          InvokeCommandAvailability.LocationEnabled -> flags.locationEnabled
          InvokeCommandAvailability.SmsAvailable -> flags.smsAvailable
          InvokeCommandAvailability.MotionActivityAvailable -> flags.motionActivityAvailable
          InvokeCommandAvailability.MotionPedometerAvailable -> flags.motionPedometerAvailable
          InvokeCommandAvailability.DebugBuild -> flags.debugBuild
        }
      }
      .map { it.name }
  }
}
