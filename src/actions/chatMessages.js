export const SAVE_CHAT_MESSAGES = 'SAVE_CHAT_MESSAGES'
export const SAVE_NEW_CHAT_MESSAGE = 'SAVE_NEW_CHAT_MESSAGE'


export function saveChatMessages(messages) {
    return {
        type: SAVE_CHAT_MESSAGES,
        messages
    }
}

export function saveNewChatMessage(message) {
    return {
        type: SAVE_NEW_CHAT_MESSAGE,
        message
    }
}