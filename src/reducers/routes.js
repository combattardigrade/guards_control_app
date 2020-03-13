import { SAVE_ROUTES } from '../actions/routes'

export default function accessLogs(state = null, action) {
    switch (action.type) {
        case SAVE_ROUTES:
            return {
                ...state,
                ...action.routes
            }
        
        default:
            return state
    }
}