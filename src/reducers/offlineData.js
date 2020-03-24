import {
    SAVE_OFFLINE_ACCESS_LOG, SAVE_OFFLINE_CHECKPOINT,
    SAVE_OFFLINE_BITACORA, SAVE_OFFLINE_REPORT,
    SAVE_OFFLINE_USERLOCATION,
    REMOVE_OFFLINE_ACCESSLOGS, REMOVE_OFFLINE_CHECKPOINTS,
    REMOVE_OFFLINE_REPORTS, REMOVE_OFFLINE_BITACORAS,
    REMOVE_OFFLINE_USERLOCATIONS

} from '../actions/offlineData'

const initialState = {
    accessLogs: [],
    checkpoints: [],
    bitacoras: [],
    reports: [],
    userLocations: [],
}

export default function offlineData(state = initialState, action) {
    switch (action.type) {
        case SAVE_OFFLINE_ACCESS_LOG:
            return {
                ...state,
                accessLogs: [...state.accessLogs, action.accessLog]
            }
        case SAVE_OFFLINE_CHECKPOINT:
            return {
                ...state,
                checkpoints: [...state.checkpoints, action.checkpoint]
            }
        case SAVE_OFFLINE_BITACORA:
            return {
                ...state,
                bitacoras: [...state.bitacoras, action.bitacora]
            }
        case SAVE_OFFLINE_REPORT:
            return {
                ...state,
                reports: [...state.reports, action.report]
            }
        case SAVE_OFFLINE_USERLOCATION:
            return {
                ...state,
                userLocations: [...state.userLocations, action.userLocation]
            }
        case REMOVE_OFFLINE_ACCESSLOGS:
            return {
                ...state,
                accessLogs: []
            }
        case REMOVE_OFFLINE_CHECKPOINTS:
            return {
                ...state,
                checkpoints: []
            }
        case REMOVE_OFFLINE_REPORTS:
            return {
                ...state,
                reports: []
            }
        case REMOVE_OFFLINE_BITACORAS:
            return {
                ...state,
                bitacoras: []
            }
        case REMOVE_OFFLINE_USERLOCATIONS:
            return {
                ...state,
                userLocations: []
            }

        default:
            return state
    }
}