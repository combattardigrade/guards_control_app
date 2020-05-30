export const SAVE_DEVICE_DATA = 'SAVE_DEVICE_DATA'
export const SAVE_BATTERY_DATA = 'SAVE_BATTERY_DATA'

export function saveDeviceData(device) {
    return {
        type: SAVE_DEVICE_DATA,
        device
    }
}

export function saveBatteryData(batteryData) {
    return {
        type: SAVE_BATTERY_DATA,
        batteryData,
    }
}