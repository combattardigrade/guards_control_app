export const SAVE_ROUTES = 'SAVE_ROUTES'


export function saveRoutes(routes) {
    return {
        type: SAVE_ROUTES,
        routes
    }
}

