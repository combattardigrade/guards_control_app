export const SAVE_DEVICE_DATA = 'SAVE_DEVICE_DATA'

export function saveDeviceData(device) {
    return {
        type: SAVE_DEVICE_DATA,
        device
    }
}