import { SAVE_GUARD_DATA } from '../actions/guard'

export default function guard(state = null, action) {
    switch(action.type) {
        case SAVE_GUARD_DATA:
            return {
                ...state,
                guard: {
                    ...action.guard
                }
            }
        default:
            return state
    }
}