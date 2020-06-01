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
import chatMessages from './chatMessages'
import chatMembers from './chatMembers'
import network from './network'
import alert from './alert'
import offlineData from './offlineData'
import carTracking from './carTracking'
import notifications from './notifications'
import storage from 'redux-persist/lib/storage'

const appReducer = combineReducers({
    auth,
    device,
    location,
    guard,
    accessLogs,
    routes,
    reports,
    company,
    bitacoras,
    chatMessages,
    chatMembers,
    network,
    alert,
    offlineData,
    carTracking,
    notifications,
})

const rootReducer = (state, action) => {
    if (action.type == 'USER_LOGOUT') {
        // storage.removeItem('persist:root')
        state = {
            auth: {
                token: null,
                credentials: state.auth.credentials,
            },
            accessLogs: {},
            alert: false,
            bitacoras: {},
            carTracking: {
                carLocations: [],
                tracking: false,
            },
            chatMembers: '',
            chatMessages: {},
            guard: {},
            location: {},
            notifications: {},
            offlineData: {
                accessLogs: [],
                checkpoints: [],
                bitacoras: [],
                reports: [],
                userLocations: [],
            },
            reports: {},
            routes: {}
        }
    }
    return appReducer(state, action)
}

export default rootReducer