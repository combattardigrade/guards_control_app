import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    IonButtons, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle,
    IonToolbar, IonIcon, IonItem, IonLabel, IonRefresher, IonRefresherContent,
    IonGrid, IonRow, IonCol, IonAlert, IonToast
} from '@ionic/react';
import {
    notificationsOutline, keyOutline, shieldCheckmarkOutline, repeatOutline,
    navigateOutline, cameraOutline, readerOutline, alertCircleOutline,
    chatboxEllipsesOutline, callOutline, ellipse

} from 'ionicons/icons'

// Actions
import { saveLocation } from '../actions/location'
import { saveGuardData } from '../actions/guard'
import { saveAccessLogs } from '../actions/accessLogs'
import { saveRoutes } from '../actions/routes'
import { saveReports } from '../actions/reports'
import { saveBitacoras } from '../actions/bitacoras'
import { saveChatMessages } from '../actions/chatMessages'
import { saveNetworkData } from '../actions/network'
import { toggleAlert } from '../actions/alert'
import { saveOfflineUserLocation } from '../actions/offlineData'
import { saveDeviceData } from '../actions/device'

// Api
import {
    getGuardData, sendUserLocation, getAccessLogs,
    getRoutesByStatus, getReports, getBitacoras,
    getLastMessages, startPanicAlert, stopPanicAlert
} from '../utils/api'

// Styles
import './styles.css'

// Plugins
// import { Plugins } from '@capacitor/core'
// const { Geolocation } = Plugins
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';
import { Plugins } from '@capacitor/core';
const { Device } = Plugins;
const { Network } = Plugins;


class Dashboard extends Component {

    state = {
        showAlert: false,
        showPanicAlert: false,
        showPanicToast: false,
        alertMsg: '',
        alertTitle: ''
    }

    componentDidMount() {
        const { token, dispatch } = this.props

        // Start watching position
        this.watchPosition()

        // Start watching network
        this.watchNetwork()

        // Get Guard Data
        getGuardData({ token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    dispatch(saveGuardData(res.payload))
                }
            })


        // Get Access Logs
        getAccessLogs({ token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    dispatch(saveAccessLogs(res.payload))
                }
            })

        // Get Routes
        getRoutesByStatus({ status: 'ACTIVE', token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    console.log(res.payload)
                    dispatch(saveRoutes(res.payload))
                }
            })

        // Get Reports
        getReports({ token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    dispatch(saveReports(res.payload))
                }
            })

        // Get Bitacoras
        getBitacoras({ token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    dispatch(saveBitacoras(res.payload))
                }
            })

        // Get Chat Messages
        getLastMessages({ page: 1, token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    dispatch(saveChatMessages(res.payload))
                }
            })

        Device.getInfo()
            .then((info) => {
                dispatch(saveDeviceData(info))
            })
    }

    watchPosition = () => {
        const { dispatch, token, network } = this.props

        let watch = Geolocation.watchPosition({
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        })

        watch.subscribe((data) => {
            if ('code' in data) {
                console.log(`Location error code ${data.code}. ${data.message}`)
                return
            }

            const locationData = {
                lat: data.coords.latitude,
                lng: data.coords.longitude,
                accuracy: data.coords.accuracy,
                speed: data.coords.speed,
                altitude: data.coords.altitude,
                altitudeAccuracy: data.coords.altitudeAccuracy,
                timestamp: data.timestamp
            }

            if (network && network.connected == true) {
                // Send User Location to server
                sendUserLocation({ ...locationData, token })
                    .then(data => data.json())
                    .then(res => {
                        console.log(res)
                        if (!('status' in res) || res.status != 'OK') {
                            // backup data until connection is restored
                            // To Do...
                        }
                        dispatch(saveLocation(locationData))
                    })
            } else {
                dispatch(saveOfflineUserLocation(locationData))
                dispatch(saveLocation(locationData))
            }
        })
    }

    watchNetwork = async () => {
        const { network, dispatch } = this.props

        if (!network) {
            let status = await Network.getStatus()
            dispatch(saveNetworkData(status))
        }

        Network.addListener('networkStatusChange', (status) => {
            console.log('Network status changes', status)
            // Save network status
            dispatch(saveNetworkData(status))
        })
    }

    handleWorkOrderClick = async (wonum) => {
        console.log(wonum)
        // got to wo details
        this.props.history.push('/wo/' + wonum)
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleAccessBtn = (e) => {
        const { guard, history } = this.props
        e.preventDefault()

        if (guard.status == 'ON_STAND_BY') {
            history.push('startTurn')
        } else if (guard.status == 'ON_PATROL') {
            history.push('endTurn')
        } else {
            this.showAlert('No fue posible obtener el estado del guardia. Por favor, inténtalo nuevamente', 'Error')
        }
    }

    handlePanicAlertActivation = () => {
        const { token, location, dispatch } = this.props
        console.log('PANIC_ALERT_ACTIVATED')
        this.setState({ showPanicToast: true })
        startPanicAlert({ lat: location.lat, lng: location.lng, token })
            .then(data => data.json())
            .then((res) => {
                if (res.status == 'OK') {
                    dispatch(toggleAlert(true))
                }
            })
    }

    handlePanicBtn = (e) => {
        e.preventDefault()
        const { token, panicAlert, dispatch } = this.props
        if (panicAlert == true) {
            this.setState({ showPanicToast: false })
            // stop panic alert request
            stopPanicAlert({ token })
                .then(data => data.json())
                .then((res) => {
                    if (res.status == 'OK') {
                        dispatch(toggleAlert(false))
                    }
                })
        } else {
            this.setState({ showPanicAlert: true })
            // start panic alert request
        }
    }

    goToPage = (page) => {
        this.props.history.push(page)
    }

    makeCall = (phone) => {
        CallNumber.callNumber(phone, true)
            .then(res => console.log('LAUNCHED CALL DIALER'))
            .catch(err => console.log('ERROR LAUNCHING CALL DIALER', err))
    }


    render() {

        const { company, network, panicAlert } = this.props

        return (
            <IonPage>
                <IonHeader >
                    <IonToolbar color="dark">
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Dashboard</IonTitle>
                        <IonButtons slot="end">
                            <IonButton><IonIcon color={network ? network.connected == true ? 'success' : 'danger' : 'danger'} icon={ellipse}></IonIcon></IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem color="primary" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={this.handleAccessBtn}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={repeatOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Acceso</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>

                            <IonCol size="6">
                                <IonItem color={panicAlert == true ? 'success' : 'danger'} style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={this.handlePanicBtn} >
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={alertCircleOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">{panicAlert == true ? 'Detener Alerta' : 'Pánico'}</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>

                        </IonRow>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.goToPage('checkpoints') }}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={shieldCheckmarkOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Puntos de Control</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.goToPage('routes') }}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={navigateOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Rutas</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.goToPage('sendBitacora') }}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={readerOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Enviar Bitácora</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.goToPage('sendReport') }}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={cameraOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Reportar</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.goToPage('chat') }}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={chatboxEllipsesOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Chat</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem color="dark" disabled={company ? false : true} style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.makeCall(company.phone) }}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={callOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Llamar a Central</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonToast
                        isOpen={this.state.showPanicToast}
                        onDidDismiss={() => { this.setState({ showPanicToast: false }) }}
                        message="¡Alerta de Pánico Activada!"
                        position="bottom"
                        color="danger"
                    />

                    <IonAlert
                        isOpen={this.state.showPanicAlert}
                        onDidDismiss={() => this.setState({ showPanicAlert: false })}
                        header={'Confirmar Alerta'}
                        message={'¿Estás seguro que quieres activar la Alerta de Pánico?'}
                        buttons={[
                            {
                                text: 'Cancelar',
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: blah => {
                                    console.log('CANCEL_PANIC_ALERT_ACTIVATION');
                                }
                            },
                            {
                                text: 'ACTIVAR',
                                handler: () => {
                                    console.log('ACTIVATE_PANIC_ALERT');
                                    this.handlePanicAlertActivation()
                                }
                            }
                        ]}
                    />

                    <IonAlert
                        isOpen={this.state.showAlert}
                        header={this.state.alertTitle}
                        message={this.state.alertMsg}
                        buttons={[{
                            text: 'OK',
                            handler: () => {
                                this.setState({ showAlert: false })
                            }
                        }]}
                    />
                </IonContent>
            </IonPage>
        );
    }
};


function mapStateToProps({ auth, guard, network, alert, offlineData, device }) {
    return {
        token: auth.token,
        guard: guard && guard,
        company: guard ? 'company' in guard ? guard.company : null : null,
        network,
        panicAlert: alert,
        device,
        offlineData
    }
}

export default connect(mapStateToProps)(Dashboard)