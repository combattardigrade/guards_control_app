import { SAVE_CHAT_MESSAGES, SAVE_NEW_CHAT_MESSAGE } from '../actions/chatMessages'

export default function accessLogs(state = null, action) {
    switch (action.type) {
        case SAVE_CHAT_MESSAGES:
            return {
                ...state,
                ...action.messages
            }
        case SAVE_NEW_CHAT_MESSAGE:
            return {
                ...state,
                [action.message.id]: action.message
            }
        default:
            return state
    }
}