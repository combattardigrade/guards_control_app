export const SAVE_REPORTS = 'SAVE_REPORTS'
export const SAVE_NEW_REPORT = 'SAVE_NEW_REPORT'


export function saveReports(reports) {
    return {
        type: SAVE_REPORTS,
        reports
    }
}

export function saveNewReport(report) {
    return {
        type: SAVE_NEW_REPORT,
        report
    }
}