export const SAVE_NETWORK_DATA = 'SAVE_NETWORK_DATA'

export function saveNetworkData(networkData) {
    return {
        type: SAVE_NETWORK_DATA,
        networkData
    }
}