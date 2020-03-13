import { SAVE_DEVICE_DATA } from '../actions/device'

export default function device(state = null, action) {
    switch (action.type) {
        case SAVE_DEVICE_DATA:
            return {
                ...action.device

            }
        default:
            return state
    }
}