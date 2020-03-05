import { SAVE_WORK_ORDERS } from '../actions/workOrders'

export default function auth(state = null, action) {
    switch(action.type) {
        case SAVE_WORK_ORDERS:
            return {
                ...state,
                workOrders: action.workOrders
            }
        default:
            return state
    }
}