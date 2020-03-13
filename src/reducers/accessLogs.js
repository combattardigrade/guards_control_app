import { SAVE_ACCESS_LOGS, SAVE_NEW_ACCESS_LOG } from '../actions/accessLogs'

export default function accessLogs(state = null, action) {
    switch (action.type) {
        case SAVE_ACCESS_LOGS:
            return {
                ...state,
                ...action.accessLogs
            }
        case SAVE_NEW_ACCESS_LOG:
            return {
                ...state,
                [action.accessLog.id]: action.accessLog
            }
        default:
            return state
    }
}