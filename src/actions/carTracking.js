export const TOGGLE_CAR_TRACKING_STATE = 'TOGGLE_CAR_TRACKING_STATE'
export const SAVE_CAR_LOCATION = 'SAVE_CAR_LOCATION'
export const REMOVE_CAR_LOCATIONS = 'REMOVE_CAR_LOCATIONS'

export function toggleCarTrackingState(trackingState) {    
    return {
        type: TOGGLE_CAR_TRACKING_STATE,
        trackingState
    }
}

export function saveCarLocation(carLocation) {
    return {
        type: SAVE_CAR_LOCATION,
        carLocation
    }
}

export function removeCarLocations() {
    return {
        type: REMOVE_CAR_LOCATIONS,
    }
}
