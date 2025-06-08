class ConversationManager:
    def __init__(self):
        # Store conversations as a dictionary:
        # key = user_id, value = list of messages [{role, content}, ...]
        self.conversations = {}

    def update_context(self, user_id: str, role: str, message: str):
        """
        Add a new message to the conversation history.

        Args:
            user_id (str): Identifier for the user/conversation.
            role (str): Role of the message sender: "user" or "assistant".
            message (str): The message content.
        """
        if user_id not in self.conversations:
            self.conversations[user_id] = []

        self.conversations[user_id].append({
            "role": role,
            "content": message
        })

        # Keep only the last max_history messages to limit context size
        max_history = 20
        if len(self.conversations[user_id]) > max_history:
            self.conversations[user_id] = self.conversations[user_id][-max_history:]

    def get_context(self, user_id: str):
        """
        Retrieve the message history for a user.

        Args:
            user_id (str): Identifier for the user/conversation.

        Returns:
            List[dict]: List of messages with 'role' and 'content'.
        """
        return self.conversations.get(user_id, [])
