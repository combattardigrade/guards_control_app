export const SAVE_OFFLINE_ACCESS_LOG = 'SAVE_OFFLINE_ACCESS_LOG'
export const SAVE_OFFLINE_CHECKPOINT = 'SAVE_OFFLINE_CHECKPOINT'
export const SAVE_OFFLINE_BITACORA = 'SAVE_OFFLINE_BITACORA'
export const SAVE_OFFLINE_REPORT = 'SAVE_OFFLINE_REPORT'
export const SAVE_OFFLINE_USERLOCATION = 'SAVE_OFFLINE_USERLOCATION'

export function saveOfflineAccessLog(accessLog) {
    return {
        type: SAVE_OFFLINE_ACCESS_LOG,
        accessLog
    }
}

export function saveOfflineCheckpoint(checkpoint) {
    return {
        type: SAVE_OFFLINE_CHECKPOINT,
        checkpoint
    }
}

export function saveOfflineBitacora(bitacora) {
    return {
        type: SAVE_OFFLINE_BITACORA,
        bitacora,
    }
}

export function saveOfflineReport(report) {
    return { 
        type: SAVE_OFFLINE_REPORT,
        report
    }
}

export function saveOfflineUserLocation(userLocation) {
    return {
        type: SAVE_OFFLINE_USERLOCATION,
        userLocation
    }
}