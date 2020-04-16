import { TOGGLE_ALERT } from '../actions/alert'

export default function alert(state = null, action) {
    switch (action.type) {
        case TOGGLE_ALERT:
            return action.alert        
        default:
            return state
    }
}