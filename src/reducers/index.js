import { combineReducers } from 'redux'
import auth from './auth'
import device from './device'
import location from './location'
import guard from './guard'
import accessLogs from './accessLogs'
import routes from './routes'
import reports from './reports'
import company from './company'
import bitacoras from './bitacoras'

export default combineReducers({
    auth,
    device,
    location,
    guard,
    accessLogs,
    routes,
    reports,
    company,
    bitacoras
})