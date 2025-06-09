class ConversationManager:
    def __init__(self):
        self.conversations = {}

    def update_context(self, user_id: str, role: str, message: str):

        if user_id not in self.conversations:
            self.conversations[user_id] = []

        self.conversations[user_id].append({
            "role": role,
            "content": message
        })

        max_history = 20
        if len(self.conversations[user_id]) > max_history:
            self.conversations[user_id] = self.conversations[user_id][-max_history:]

    def get_context(self, user_id: str):
        return self.conversations.get(user_id, [])
