import { SAVE_LAST_CHAT_VISIT_TIME } from '../actions/notifications'

const initialState = {
    lastChatVisitTime: new Date()
}

export default function notifications(state = initialState, action) {
    switch (action.type) {
        case SAVE_LAST_CHAT_VISIT_TIME:
            return {
                ...action.state,
                lastChatVisitTime: new Date()

            }        
        default:
            return state
    }
}