import { combineReducers } from 'redux'
import auth from './auth'
import device from './device'

export default combineReducers({
    auth,
    device
})