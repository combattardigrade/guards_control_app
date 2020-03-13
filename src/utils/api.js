const API = 'http://genesisblock.ddns.net:3000/api'

export function login(params) {
    return fetch(API + '/login', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function signup(params) {
    return fetch(API + '/signup', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getGuardData(params) {
    return fetch(API + '/guard', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function sendUserLocation(params) {
    return fetch(API + '/userLocation', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function registerAccess(params) {
    return fetch(API + '/guardAccess/registerAccess', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getAccessLogs(params) {
    return fetch(API + '/guardAccess/getAccessLogs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}