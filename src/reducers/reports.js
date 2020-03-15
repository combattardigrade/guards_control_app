import { SAVE_REPORTS, SAVE_NEW_REPORT } from '../actions/reports'

export default function reports(state = null, action) {
    switch (action.type) {
        case SAVE_REPORTS:
            return {
                ...state,
                ...action.reports
            }
        case SAVE_NEW_REPORT:
            return {
                ...state,
                [action.report.id]: action.report
            }
        default:
            return state
    }
}