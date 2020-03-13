export const SAVE_LOCATION = 'SAVE_LOCATION'

export function saveLocation(location) {
    return {
        type: SAVE_LOCATION,
        location
    }
}