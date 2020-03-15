import { SAVE_COMPANY_DATA } from '../actions/company'

export default function company(state = null, action) {
    switch (action.type) {
        case SAVE_COMPANY_DATA:
            return {
                ...action.company

            }
        default:
            return state
    }
}