import Foundation

public enum AssistMeRemindersCommand: String, Codable, Sendable {
    case list = "reminders.list"
    case add = "reminders.add"
}

public enum AssistMeReminderStatusFilter: String, Codable, Sendable {
    case incomplete
    case completed
    case all
}

public struct AssistMeRemindersListParams: Codable, Sendable, Equatable {
    public var status: AssistMeReminderStatusFilter?
    public var limit: Int?

    public init(status: AssistMeReminderStatusFilter? = nil, limit: Int? = nil) {
        self.status = status
        self.limit = limit
    }
}

public struct AssistMeRemindersAddParams: Codable, Sendable, Equatable {
    public var title: String
    public var dueISO: String?
    public var notes: String?
    public var listId: String?
    public var listName: String?

    public init(
        title: String,
        dueISO: String? = nil,
        notes: String? = nil,
        listId: String? = nil,
        listName: String? = nil)
    {
        self.title = title
        self.dueISO = dueISO
        self.notes = notes
        self.listId = listId
        self.listName = listName
    }
}

public struct AssistMeReminderPayload: Codable, Sendable, Equatable {
    public var identifier: String
    public var title: String
    public var dueISO: String?
    public var completed: Bool
    public var listName: String?

    public init(
        identifier: String,
        title: String,
        dueISO: String? = nil,
        completed: Bool,
        listName: String? = nil)
    {
        self.identifier = identifier
        self.title = title
        self.dueISO = dueISO
        self.completed = completed
        self.listName = listName
    }
}

public struct AssistMeRemindersListPayload: Codable, Sendable, Equatable {
    public var reminders: [AssistMeReminderPayload]

    public init(reminders: [AssistMeReminderPayload]) {
        self.reminders = reminders
    }
}

public struct AssistMeRemindersAddPayload: Codable, Sendable, Equatable {
    public var reminder: AssistMeReminderPayload

    public init(reminder: AssistMeReminderPayload) {
        self.reminder = reminder
    }
}
