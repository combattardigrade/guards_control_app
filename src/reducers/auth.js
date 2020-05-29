import { SAVE_TOKEN, SAVE_CREDENTIALS, REMOVE_CREDENTIALS } from '../actions/auth'

export default function auth(state = null, action) {
    switch(action.type) {
        case SAVE_TOKEN:
            return {
                ...state,
                token: action.token
            }
        case SAVE_CREDENTIALS:
            return {
                ...state,
                credentials: action.credentials
            }
        case REMOVE_CREDENTIALS: 
            return {
                ...state,
                credentials: ''
            }
        default:
            return state
    }
}