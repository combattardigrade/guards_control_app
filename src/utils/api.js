// export const API = 'https://blits.net/api'
// export const SOCKETS_HOST = 'https://blits.net:2053'
export const API = 'http://genesisblock.ddns.net:3000/api'
export const SOCKETS_HOST = 'http://genesisblock.ddns.net:2053'
const MAPBOX_DIRECTIONS_API = 'https://api.mapbox.com/directions/v5/mapbox/walking/'
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29tYmF0dGFyZGlncmFkZSIsImEiOiJjanJsOXJqeDYwNmFkM3ltdXdmdG5kOTFqIn0.C14U4oY3yTlrtX_2mDFlCQ'

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

export function codeLogin(params) {
    return fetch(API + '/codeLogin', {
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

export function getRoutesByStatus(params) {
    return fetch(API + '/getRoutesByStatus/' + params.status, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getMapRoute(params) {
    const from = [params.fromLocation.lng, params.fromLocation.lat]
    const to = [params.toLocation.lng, params.toLocation.lat]
    const URL = MAPBOX_DIRECTIONS_API + from.toString() + ';' + to.toString() + '?overview=full&geometries=geojson&access_token=' + MAPBOX_ACCESS_TOKEN
    return fetch(URL, {
        method: 'GET',
        // headers: {
        //     'Content-Type': 'application/json',            
        // }
    })
}

export function completeCheckpoint(params) {
    return fetch(API + '/completeCheckpoint', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}


export function sendReport(params) {
    return fetch(API + '/report', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getReports(params) {
    return fetch(API + '/reports', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getCompanyData(params) {
    return fetch(API + '/company/' + params.companyId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function sendBitacora(params) {
    return fetch(API + '/bitacora', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getBitacoras(params) {
    return fetch(API + '/bitacoras/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function sendMessage(params) {
    return fetch(API + '/chat/sendMessage', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function sendAudioMessage(params) {
    return fetch(API + '/chat/sendAudio', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function sendImageMessage(params) {
    return fetch(API + '/chat/sendImage', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getLastMessages(params) {
    return fetch(API + '/chat/getMessages/' + params.page, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getCompanyActiveMembers(params) {
    return fetch(API + '/companyMembers/' + params.companyId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function startPanicAlert(params) {
    console.log(params)
    return fetch(API + '/alert', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function stopPanicAlert(params) {
    return fetch(API + '/alert', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getAllPanicAlerts(params) {
    return fetch(API + '/alerts/ACTIVE', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function toggleCarTracking(params) {
    return fetch(API + '/toggleCarTracking', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

