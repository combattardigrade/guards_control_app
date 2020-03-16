import { SAVE_CHAT_MEMBERS } from '../actions/chatMembers'

export default function chatMembers(state = null, action) {
    switch (action.type) {
        case SAVE_CHAT_MEMBERS:
            return {
                ...state,
                ...action.members
            }        
        default:
            return state
    }
}