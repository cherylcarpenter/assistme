package ai.assistme.android.ui

import androidx.compose.runtime.Composable
import ai.assistme.android.MainViewModel
import ai.assistme.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
