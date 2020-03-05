export const SAVE_TOKEN = 'SAVE_TOKEN'

export function saveToken(token) {
    return {
        type: SAVE_TOKEN,
        token
    }
}