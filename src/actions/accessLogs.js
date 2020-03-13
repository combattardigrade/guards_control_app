export const SAVE_ACCESS_LOGS = 'SAVE_ACCESS_LOGS'
export const SAVE_NEW_ACCESS_LOG = 'SAVE_NEW_ACCESS_LOG'


export function saveAccessLogs(accessLogs) {
    return {
        type: SAVE_ACCESS_LOGS,
        accessLogs
    }
}

export function saveNewAccessLog(accessLog) {
    return {
        type: SAVE_NEW_ACCESS_LOG,
        accessLog
    }
}