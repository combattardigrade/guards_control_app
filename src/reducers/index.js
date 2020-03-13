import { combineReducers } from 'redux'
import auth from './auth'
import device from './device'
import location from './location'
import guard from './guard'

export default combineReducers({
    auth,
    device,
    location,
    guard
})