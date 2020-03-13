export const SAVE_GUARD_DATA = 'SAVE_GUARD_DATA'

export function saveGuardData(guard) {
    return {
        type: SAVE_GUARD_DATA,
        guard
    }
}