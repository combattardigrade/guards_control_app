import { SAVE_NETWORK_DATA } from '../actions/network'

export default function network(state = null, action) {
    switch (action.type) {
        case SAVE_NETWORK_DATA:
            return {
                ...action.networkData

            }
        default:
            return state
    }
}