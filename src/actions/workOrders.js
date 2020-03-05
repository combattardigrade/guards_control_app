export const SAVE_WORK_ORDERS = 'SAVE_WORK_ORDERS'

export function saveWorkOrders(workOrders) {
    console.log(workOrders)
    return {
        type: SAVE_WORK_ORDERS,
        workOrders: workOrders,
    }
}