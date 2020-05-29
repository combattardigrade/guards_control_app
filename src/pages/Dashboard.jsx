import React, { Component } from 'react'
import { connect } from 'react-redux'
import socketIOClient from 'socket.io-client'
import {
    IonButtons, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle,
    IonToolbar, IonIcon, IonItem, IonLabel,
    IonGrid, IonRow, IonCol, IonAlert, IonToast, withIonLifeCycle
} from '@ionic/react';
import {
    notificationsOutline, keyOutline, shieldCheckmarkOutline, repeatOutline,
    navigateOutline, cameraOutline, readerOutline, alertCircleOutline,
    chatboxEllipsesOutline, callOutline, ellipse, cloudUploadOutline,
    micCircleOutline, micOffCircleOutline

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
import { saveNewChatMessage } from '../actions/chatMessages'
import { saveLastChatVisitTime } from '../actions/notifications'

// Api
import {
    getGuardData, sendUserLocation, getAccessLogs,
    getRoutesByStatus, getReports, getBitacoras,
    getLastMessages, startPanicAlert, stopPanicAlert, getAllPanicAlerts, SOCKETS_HOST
} from '../utils/api'

// Sounds
import start_beep from '../sounds/start_beep.wav'
import beep_sound2 from '../sounds/end_beep.mp3'
import beep_sound3 from '../sounds/receive_beep.mp3'

// Styles
import './styles.css'

// Plugins
// import { Plugins } from '@capacitor/core'
// const { Geolocation } = Plugins
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';
import { Plugins } from '@capacitor/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AppLauncher } from '@ionic-native/app-launcher';

// import { NativeAudio } from '@ionic-native/native-audio';
const { Device, Network, Haptics } = Plugins;


class Dashboard extends Component {

    state = {
        showAlert: false,
        showPanicAlert: false,
        showPanicToast: false,
        alertMsg: '',
        alertTitle: '',
        recordingAudio: false,
        socketsAvailable: false,
        showPermissionAlert: false,
    }

    mediaRecorder = ''
    socket = ''
    chunks = ''


    componentDidMount() {
        const { token, dispatch } = this.props
        const self = this

        // Get Guard Data
        getGuardData({ token })
            .then(data => data.json())
            .then(res => {
                console.log(res)
                if (res.status == 'OK') {
                    console.log(res.payload)
                    self.socket = socketIOClient(SOCKETS_HOST)

                    self.socket.on('connect', () => {
                        console.log(`Connection to sockets server stablished correctly...`)
                        setTimeout(() => {
                            // Join company's chat room
                            self.socket.emit('joinRoom', res.payload.companyId)
                            console.log('Joining chat room...')
                        }, 5000)
                    })

                    self.socket.on('joined', (data) => {
                        console.log(`Joined room ${data}`)
                        if (!this.state.socketsAvailable) {
                            this.setState({ socketsAvailable: true })
                        }
                    })

                    // Listen for new messages
                    self.socket.on('message', async (data) => {
                        if (data.msg.type === 'live_audio') {
                            console.log('New voice message received...')
                            // Play sound effect
                            const beep = new window.Audio(beep_sound3)
                            beep.play()
                            await self.sleep(1000)
                            var blob = new Blob([data.msg.arrayBuffer], { 'type': 'audio/ogg; codecs=opus' })
                            var myAudio = new window.Audio()
                            myAudio.src = window.URL.createObjectURL(blob)
                            myAudio.play()

                            // const audio = document.createElement('audio')
                            // audio.src = window.URL.createObjectURL(blob)
                            // console.log(audio)
                            // audio.play()
                            return
                        }

                        // Text messages
                        console.log('New message received: ', data.msg)
                        // save message
                        dispatch(saveNewChatMessage(data.msg))
                    })
                }
            })


    }

    ionViewWillEnter() {
        const { token, company, guard, dispatch } = this.props

        // Start watching position
        this.watchPosition()

        // Start watching network
        this.watchNetwork()

        // Get Guard Data
        getGuardData({ token })
            .then(data => data.json())
            .then(res => {
                console.log(res)
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
                console.log(res)
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
        // https://stackoverflow.com/questions/21177210/phonegap-cordova-media-api-when-play-audio-from-url-ui-freeze-a-few-seconds
        // var myAudio = new window.Audio("http://genesisblock.ddns.net:3000/api/audio/2");
        // myAudio.play();

        // Watch Alerts
        this.watchAlerts()

    }

    handleSendVoiceBtn = async (e) => {
        e.preventDefault()

        if (!this.state.socketsAvailable) {
            this.showAlert('Conexión no disponible. Por favor inténtalo nuevamente', 'Error')
            return
        }

        // Play sound effect
        const beep = new window.Audio(start_beep)
        beep.play()

        // Haptics
        Haptics.vibrate()

        console.log('START_VOICE_RECORDING_BTN')
        const { guard } = this.props
        this.setState({ recordingAudio: true })
        const self = this

        await this.sleep(500)

        try {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((mediaStream) => {
                    self.mediaRecorder = new MediaRecorder(mediaStream)

                    self.mediaRecorder.onstart = (e) => {
                        self.chunks = []
                    }

                    self.mediaRecorder.ondataavailable = (e) => {
                        self.chunks.push(e.data)
                    }

                    self.mediaRecorder.onstop = (e) => {
                        console.log('Voice message sent...')
                        const blob = new Blob(self.chunks, { type: 'audio/ogg; codecs=opus' })
                        // change to company voice channel                        
                        self.socket.emit('message', {
                            room: guard.companyId,
                            msg: { type: 'live_audio', arrayBuffer: blob },
                        })
                    }

                    self.mediaRecorder.start()
                })
        } catch (e) {
            console.log(e)
        }

        this.walkieTalkieTimer = setTimeout(() => {
            if (this.state.recordingAudio) {
                this.handleStopVoiceBtn()
            }
        }, 8000)
    }

    handleStopVoiceBtn = () => {

        console.log('STOP_VOICE_RECORDING_BTN')
        clearInterval(this.walkieTalkieTimer)
        this.setState({ recordingAudio: false })
        const beep = new window.Audio(beep_sound2)
        beep.play()
        const self = this

        try {
            self.mediaRecorder.stop()
        } catch (e) {
            console.log(e)
        }
    }

    watchPosition = () => {

        const self = this
        let watch = Geolocation.watchPosition({
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        })

        watch.subscribe((data) => {
            const { dispatch, token, network } = self.props

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
                        // console.log(res)
                        dispatch(saveLocation(locationData))
                    })
            } else {
                dispatch(saveOfflineUserLocation({ ...locationData, token }))
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

    watchAlerts = async () => {
        const { token, dispatch } = this.props
        getAllPanicAlerts({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    // console.log(res.payload)
                    if (res.payload.length > 0) {
                        dispatch(toggleAlert(true))
                    } else {
                        dispatch(toggleAlert(false))
                    }
                }
            })
        setTimeout(this.watchAlerts, 5000)
    }

    handleWorkOrderClick = async (wonum) => {
        console.log(wonum)
        // got to wo details
        this.props.history.push('/wo/' + wonum)
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    showPermissionAlert = (msg, title) => {
        this.setState({ showPermissionAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleAccessBtn = (e) => {
        console.log('CHECK_LOCATION_PERMISSIONS')
        e.preventDefault()
        const { device, guard, history } = this.props

        if (device.platform === 'android') {
            // Check if App has Location Permission
            AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                .then(
                    (result) => {
                        // Check if Location is Enabled
                        Diagnostic.isLocationEnabled(
                            (isEnabled) => {
                                if (isEnabled) {
                                    // Check guard access status
                                    if (guard.status == 'ON_STAND_BY') {
                                        history.push('startTurn')
                                    } else if (guard.status == 'ON_PATROL') {
                                        history.push('endTurn')
                                    } else {
                                        this.showAlert('No fue posible obtener el estado del guardia. Por favor, inténtalo nuevamente', 'Error')
                                    }
                                } else {
                                    this.showPermissionAlert('Activa la Localización del dispositivo para continuar', 'Activar Localización')
                                }
                            },
                            () => this.showPermissionAlert('Activa la Localización del dispositivo para continuar', 'Activar Localización')
                        )
                    },
                    (err) => {
                        console.log(err)
                        AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                    }
                )
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

    handlePanicBtn = () => {

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

    handleUploadOfflineDataBtn = (e) => {
        e.preventDefault()
        const { network } = this.props

        if (network && network.connected == true) {
            this.goToPage('syncOffline')
            return
        } else {
            this.showAlert('Sin conexión. No es posible realizar la sincronización con el servidor.', 'Error')
            return
        }
    }

    checkPermissionsAndGoToPage = (page) => {
        console.log('CHECK_LOCATION_PERMISSIONS')
        const { device } = this.props
        if (device.platform === 'android') {
            // Check if App has Location Permission
            AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                .then(
                    (result) => {
                        // Check if Location is Enabled
                        Diagnostic.isLocationEnabled(
                            (isEnabled) => isEnabled ? this.goToPage(page) : this.showPermissionAlert('Activa la Localización del dispositivo para continuar', 'Activar Localización'),
                            () => this.showPermissionAlert('Activa la Localización del dispositivo para continuar', 'Activar Localización')
                        )
                    },
                    (err) => {
                        console.log(err)
                        AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                    }
                )
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

    handleGoToChat = async () => {
        const { dispatch } = this.props
        dispatch(saveLastChatVisitTime())
        this.goToPage('chat')
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    render() {

        const { company, network, panicAlert, notifications, chatMessages } = this.props

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
                                <IonItem color={panicAlert == true ? 'success' : 'danger'} style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.handlePanicBtn(); }} >
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
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.checkPermissionsAndGoToPage('checkpoints') }}>
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
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.checkPermissionsAndGoToPage('routes') }}>
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
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.checkPermissionsAndGoToPage('sendBitacora') }}>
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
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={e => { e.preventDefault(); this.checkPermissionsAndGoToPage('sendReport') }}>
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
                                <IonItem color="dark" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" onClick={e => { e.preventDefault(); this.handleGoToChat() }}>
                                    <IonGrid>
                                        <IonLabel style={{ position: 'absolute', right: '5px', fontSize: '0.7em' }}>

                                            {
                                                chatMessages && Object.values(chatMessages).length > 0
                                                    ?
                                                    Object.values(chatMessages).filter((msg) => {
                                                        if (new Date(msg.createdAt) >= new Date(notifications.lastChatVisitTime)) {
                                                            return true
                                                        }
                                                    }).length
                                                    :
                                                    '0'
                                            }
                                        </IonLabel>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={chatboxEllipsesOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol>
                                                <IonLabel className="dashBtnText">Chat</IonLabel>

                                            </IonCol>
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
                        <IonRow>
                            <IonCol size="6">
                                <IonItem color="success" style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button onClick={this.handleUploadOfflineDataBtn}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon className="dashBtnIcon" icon={cloudUploadOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel className="dashBtnText">Enviar Datos Locales</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6"   >

                                {
                                    this.state.recordingAudio === false
                                        ?
                                        <IonItem onClick={this.handleSendVoiceBtn} color='warning' style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button >
                                            <IonGrid>
                                                <IonRow style={{ textAlign: 'center' }}>
                                                    <IonCol><IonIcon className="dashBtnIcon" icon={micCircleOutline}></IonIcon></IonCol>
                                                </IonRow>
                                                <IonRow style={{ textAlign: 'center' }}>
                                                    <IonCol><IonLabel className="dashBtnText">Walkie Talkie</IonLabel></IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonItem>
                                        :
                                        <IonItem onClick={this.handleStopVoiceBtn} color='danger' style={{ border: '2px solid whitesmoke', borderRadius: '5px' }} lines="none" button >
                                            <IonGrid>
                                                <IonRow style={{ textAlign: 'center' }}>
                                                    <IonCol><IonIcon className="dashBtnIcon" icon={micOffCircleOutline}></IonIcon></IonCol>
                                                </IonRow>
                                                <IonRow style={{ textAlign: 'center' }}>
                                                    <IonCol><IonLabel className="dashBtnText">Detener</IonLabel></IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonItem>
                                }

                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonToast
                        isOpen={panicAlert}
                        onDidDismiss={() => { this.setState({ showPanicToast: false }) }}
                        message="¡Alerta de Pánico Activada!"
                        position="bottom"
                        color="danger"
                        buttons={[
                            {
                                text: 'Terminar',
                                role: 'cancel',
                                handler: () => {
                                    this.handlePanicBtn()
                                }
                            }
                        ]}
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

                    <IonAlert
                        isOpen={this.state.showPermissionAlert}
                        header={this.state.alertTitle}
                        message={this.state.alertMsg}
                        buttons={
                            [
                                {
                                    text: 'Cancelar',
                                    handler: () => this.setState({ showPermissionAlert: false })
                                },
                                {
                                    text: 'OK',
                                    handler: () => { Diagnostic.switchToLocationSettings(); this.setState({ showPermissionAlert: false }) }
                                }
                            ]
                        }
                    />
                </IonContent>
            </IonPage >
        );
    }
};


function mapStateToProps({ auth, guard, network, alert, offlineData, device, location, notifications, chatMessages }) {
    return {
        token: auth.token,
        guard: guard && guard,
        company: guard ? 'company' in guard ? guard.company : null : null,
        network,
        panicAlert: alert,
        device,
        offlineData,
        location,
        notifications,
        chatMessages
    }
}

export default connect(mapStateToProps)(withIonLifeCycle(Dashboard))