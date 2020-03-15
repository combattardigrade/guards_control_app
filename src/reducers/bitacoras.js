import { SAVE_BITACORAS } from '../actions/bitacoras'

export default function accessLogs(state = null, action) {
    switch (action.type) {
        case SAVE_BITACORAS:
            return {
                ...state,
                ...action.bitacoras
            }        
        default:
            return state
    }
}