const API = 'http://192.168.0.173:3000/api'

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