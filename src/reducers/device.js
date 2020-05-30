import { SAVE_DEVICE_DATA, SAVE_BATTERY_DATA } from '../actions/device'

export default function device(state = null, action) {
    switch (action.type) {
        case SAVE_DEVICE_DATA:
            return {
                ...action.device

            }
        case SAVE_BATTERY_DATA:
            return {
                ...action.batteryData
            }
        default:
            return state
    }
}