export const SAVE_TOKEN = 'SAVE_TOKEN'
export const USER_LOGOUT = 'USER_LOGOUT'
export const SAVE_CREDENTIALS = 'SAVE_CREDENTIALS'
export const REMOVE_CREDENTIALS = 'REMOVE_CREDENTIALS'

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

export function saveCredentials(credentials) {
    return {
        type: SAVE_CREDENTIALS,
        credentials
    }
}

export function removeCredentials() {
    return {
        type: REMOVE_CREDENTIALS,
    }
}