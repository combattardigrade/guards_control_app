export const SAVE_GUARD_DATA = 'SAVE_GUARD_DATA'
export const UPDATE_GUARD_STATUS = 'UPDATE_GUARD_STATUS'

export function saveGuardData(guard) {
    return {
        type: SAVE_GUARD_DATA,
        guard
    }
}

export function updateGuardStatus(status) {
    return {
        type: UPDATE_GUARD_STATUS,
        status
    }
}