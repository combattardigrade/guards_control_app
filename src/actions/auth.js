export const SAVE_TOKEN = 'SAVE_TOKEN'
export const USER_LOGOUT = 'USER_LOGOUT'

export function saveToken(token) {
    return {
        type: SAVE_TOKEN,
        token
    }
}

export function userLogout() {
    return {
        type: USER_LOGOUT,        
    }
}