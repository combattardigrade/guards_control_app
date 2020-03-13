import { SAVE_LOCATION } from '../actions/location'

export default function location(state = null, action) {
    switch(action.type) {
        case SAVE_LOCATION:
            return {
                ...action.location
                
            }
        default:
            return state
    }
}