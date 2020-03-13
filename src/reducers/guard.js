import { SAVE_GUARD_DATA, UPDATE_GUARD_STATUS } from '../actions/guard'

export default function guard(state = null, action) {
    switch (action.type) {
        case SAVE_GUARD_DATA:
            return {                
                ...action.guard

            }
        case UPDATE_GUARD_STATUS:
            return {
                ...state,
                status: action.status
            }
        default:
            return state
    }
}