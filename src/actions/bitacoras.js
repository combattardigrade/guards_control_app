export const SAVE_BITACORAS = 'SAVE_BITACORAS'

export function saveBitacoras(bitacoras) {
    return {
        type: SAVE_BITACORAS,
        bitacoras
    }
}

