import { combineReducers } from 'redux'
import auth from './auth'
import workOrders from './workOrders'

export default combineReducers({
    auth,
    workOrders
})