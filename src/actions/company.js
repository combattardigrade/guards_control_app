export const SAVE_COMPANY_DATA = 'SAVE_GUARD_DATA'

export function saveCompanyData(company) {
    return {
        type: SAVE_COMPANY_DATA,
        company
    }
}

