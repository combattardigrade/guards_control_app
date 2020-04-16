import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonAlert, withIonLifeCycle
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline
} from 'ionicons/icons'

import MyMap from '../components/MyMap'
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NFC, Ndef } from '@ionic-native/nfc';

// Api
import { registerAccess } from '../utils/api'

// Actions
import { updateGuardStatus } from '../actions/guard'
import { saveNewAccessLog } from '../actions/accessLogs'
import { saveOfflineAccessLog } from '../actions/offlineData'

// Components
import SuccessModal from './SuccessModal'

import './styles.css'

const moment = require('moment')


class StartTurn extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        loading: true,
        showSuccessModal: false,
    }

    handleSuccessModalBtn = () => {
        this.setState({ showSuccessModal: false })
        this.props.history.replace('/dashboard')
    }

    handleBackBtn = () => {
        this.props.history.replace('/dashboard')
    }

    handleScanner = async (e) => {
        console.log('QR SCANNER STARTED')
        const { token, location, device, network, dispatch } = this.props

        e.preventDefault()
        try {
            const data = await BarcodeScanner.scan({ preferFrontCamera: false, formats: 'QR_CODE', showTorchButton: true })
            console.log(`Barcode data: ${data.text}`)
            const accessCode = data.text
            const accessLog = {
                accessCode, lat: location.lat, lng: location.lng,
                imei: device.uuid, accessMethod: 'QR_CODE', accessType: 'ENTRY', token: token
            }
            // If connencted send to server
            if (network && network.connected == true) {
                registerAccess(accessLog)
                    .then(data => data.json())
                    .then(res => {
                        console.log(res)
                        if (res.status == 'OK') {
                            dispatch(updateGuardStatus('ON_PATROL'))
                            dispatch(saveNewAccessLog(res.payload))
                            // show success page
                            this.setState({ showSuccessModal: true })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar registrar el acceso', 'Error')
                        return
                    })
            } else {
                // save offline AccessLog
                dispatch(updateGuardStatus('ON_PATROL'))
                dispatch(saveOfflineAccessLog(accessLog))
                return
            }
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar escanear el código QR.', 'Error')
            return
        }
    }

    handleNFC = async (e) => {
        console.log('NFC SCANNER STARTED')
        const { token, location, device, network, dispatch } = this.props
        e.preventDefault()

        try {
            // Receive NFC event       
            NFC.addNdefListener(
                () => {
                    console.log('success')
                },
                () => {
                    console.log('err')
                }
            ).subscribe((event) => {
                const payload = event.tag.ndefMessage[0]["payload"]
                let accessCode = NFC.bytesToString(payload)
                accessCode = accessCode.replace('en', '')
                console.log(`NFC access code: ${accessCode}`)

                const accessLog = {
                    accessCode, lat: location.lat, lng: location.lng,
                    imei: device.uuid, accessMethod: 'NFC', accessType: 'ENTRY', token: token
                }
                // If connencted send to server
                if (network && network.connected == true) {
                    registerAccess(accessLog)
                        .then(data => data.json())
                        .then(res => {
                            console.log(res)
                            if (res.status == 'OK') {
                                dispatch(updateGuardStatus('ON_PATROL'))
                                dispatch(saveNewAccessLog(res.payload))
                                // show success page
                                this.setState({ showSuccessModal: true })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar registrar el acceso', 'Error')
                            return
                        })
                } else {
                    // save offline AccessLog
                    dispatch(updateGuardStatus('ON_PATROL'))
                    dispatch(saveOfflineAccessLog(accessLog))
                    return
                }
            })
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar escanear el código QR.', 'Error')
            return
        }
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    ionViewDidEnter() {
        const { location } = this.props
        if (location) {
            this.setState({ loading: false })
        }
    }

    render() {

        const { location, guard, } = this.props
        const { loading } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Iniciar Turno</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel className="dataTitle">Usuario:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput className="dataField" readonly value={guard.username}></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel className="dataTitle">Fecha y Hora de Inicio:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput className="dataField" readonly value={moment().format('DD/MM/YYYY HH:MM')}></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel className="dataTitle">Localización:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput className="dataField" readonly value={location && `${location.lat}, ${location.lng}`}></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonRow>
                        <IonCol>

                            {
                                location && loading == false ? <MyMap location={location} /> : null
                            }

                        </IonCol>
                    </IonRow>

                    <div style={{ bottom: '10px', position: 'absolute', padding: '10px 10px 0px 10px', width: '100%' }}>

                        <IonButton onClick={this.handleNFC} expand="full" type="submit" style={{ marginBottom: '10px' }}>Escanear punto con NFC</IonButton>

                        <IonButton onClick={this.handleScanner} color="dark" expand="full" type="submit" style={{ marginBottom: '20px' }}>Escanear punto con QR</IonButton>


                        {/* <IonButton color="light" expand="full" type="submit" className="ion-no-margin">Ver Historial de Accesos</IonButton> */}
                    </div>

                    {
                        this.state.showSuccessModal && (
                            <SuccessModal
                                showSuccessModal={this.state.showSuccessModal}
                                handleSuccessModalBtn={this.handleSuccessModalBtn}
                                title="¡Éxito!"
                                description="Entrada Registrada Correctamente!"

                            />
                        )
                    }
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
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, token, location, guard, device, network }) {
    return {
        token: auth && auth.token,
        location: location && location,
        guard: guard && guard,
        device: device && device,
        network: network && network,
    }
}

export default connect(mapStateToProps)(withIonLifeCycle(StartTurn))