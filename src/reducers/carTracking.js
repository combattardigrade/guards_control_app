import { TOGGLE_CAR_TRACKING_STATE, SAVE_CAR_LOCATION, REMOVE_CAR_LOCATIONS } from '../actions/carTracking'

const initialState = {
    carLocations: [],
    tracking: false
}

export default function carTracking(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_CAR_TRACKING_STATE:
            return { 
                ...state,               
                tracking: action.trackingState
            }
        case SAVE_CAR_LOCATION:
            return {
                ...state,
                carLocations: [...state.carLocations, action.carLocation]
            }        
        case REMOVE_CAR_LOCATIONS:
            return {
                ...state,
                carLocations: []
            }
        default:
            return state
    }
}