import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, withIonLifeCycle, useIonViewWillEnter, IonAlert
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    closeOutline
} from 'ionicons/icons'



// Actions
import { saveRoutes } from '../actions/routes'
import { saveOfflineCheckpoint } from '../actions/offlineData'

// Api
import { completeCheckpoint, getRoutesByStatus } from '../utils/api'

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Diagnostic } from '@ionic-native/diagnostic';


class RegisterCheckpointModal extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        
    }



    handleScanner = async (e) => {

        e.preventDefault()
        console.log('QR SCANNER STARTED')
        const { token, checkpoint, dispatch, network, handleShowSuccessModal } = this.props

        try {
            const data = await BarcodeScanner.scan({ preferFrontCamera: false, formats: 'QR_CODE', showTorchButton: true })
            console.log(`Barcode data: ${data.text}`)
            const code = data.text
            const checkpointData = { checkpointId: checkpoint.id, code: code, token }

            if (network && network.connected == true) {
                completeCheckpoint(checkpointData)
                    .then(data => data.json())
                    .then(res => {
                        console.log(res)
                        if (res.status == 'OK') {

                            // Get Routes
                            getRoutesByStatus({ status: 'ACTIVE', token })
                                .then(data => data.json())
                                .then(res => {
                                    if (res.status == 'OK') {
                                        console.log(res.payload)
                                        dispatch(saveRoutes(res.payload))
                                    }
                                })
                            // show success page
                            console.log('CHECKPOINT COMPLETED SUCCESSFULLY')
                            handleShowSuccessModal()
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar registrar el acceso', 'Error')
                        return
                    })
            } else {
                // save offline checkpoint
                dispatch(saveOfflineCheckpoint(checkpointData))
                handleShowSuccessModal()
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
        e.preventDefault()
        console.log('NFC SCANNER STARTED')
        const { token, device, checkpoint, dispatch, network, handleShowSuccessModal } = this.props        

        if (device.platform === 'android') {
            try {
                const isPresent = await Diagnostic.isNFCPresent()

                if (!isPresent) {
                    this.showAlert('El dispositivo no cuenta con funcionalidad NFC', 'ERROR')
                    return
                }

                const isEnabled = await Diagnostic.isNFCEnabled()

                if (!isEnabled) {
                    this.showAlert('Activa el sistema NFC para continuar', 'ERROR')
                    Diagnostic.switchToNFCSettings()
                    return
                }

            } catch (err) {
                console.log(err)
                this.showAlert('Ocurrió un error al intentar iniciar el sistema NFC en el dispositivo')
                return
            }
        }

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
                let code = NFC.bytesToString(payload)
                code = code.replace('en', '')
                console.log(`NFC access code: ${code}`)

                const checkpointData = { checkpointId: checkpoint.id, code: code, token }

                // If connencted send to server
                if (network && network.connected == true) {
                    completeCheckpoint(checkpointData)
                        .then(data => data.json())
                        .then(res => {
                            console.log(res)
                            if (res.status == 'OK') {

                                // Get Routes
                                getRoutesByStatus({ status: 'ACTIVE', token })
                                    .then(data => data.json())
                                    .then(res => {
                                        if (res.status == 'OK') {
                                            console.log(res.payload)
                                            dispatch(saveRoutes(res.payload))
                                        }
                                    })
                                // show success page
                                console.log('CHECKPOINT COMPLETED SUCCESSFULLY')                                
                                handleShowSuccessModal()
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar registrar el acceso', 'Error')
                            return
                        })
                } else {
                    // save offline checkpoint
                    dispatch(saveOfflineCheckpoint(checkpointData))
                    handleShowSuccessModal()
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

    render() {

        const { checkpoint, route, location, showRegisterCheckpointModal, handleToggleRegisterCheckpointModal } = this.props

        return (
            <IonModal isOpen={showRegisterCheckpointModal} >
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); handleToggleRegisterCheckpointModal(false) }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={closeOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Registrar Punto de Control</IonTitle>
                    </IonToolbar>
                </IonHeader>


                <IonContent>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>ID Punto de Control:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly >{checkpoint && checkpoint.id}</IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Punto de Control:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly >{checkpoint && checkpoint.name}</IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Estado:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly >{checkpoint && checkpoint.status}</IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Ruta:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly >{route && route.name}</IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel >Localización:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly >{location && `${location.lat}, ${location.lng}`}</IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>


                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                <ion-button onClick={this.handleNFC} expand="full" type="submit" className="ion-no-margin">Escanear punto con NFC</ion-button>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="12" style={{ paddingTop: '0px' }}>
                                <ion-button onClick={this.handleScanner} color="dark" expand="full" type="submit" className="ion-no-margin">Escanear punto con QR</ion-button>
                            </IonCol>
                        </IonRow>

                    </IonGrid>
                    <IonGrid>
                        <IonRow style={{ bottom: '10px', position: 'absolute', width: "98%" }}>
                            <IonCol style={{ textAlign: 'center' }}>

                            </IonCol>
                        </IonRow>
                    </IonGrid>
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
            </IonModal >

        );
    }
};


function mapStateToProps({ auth, location, device, network }, ownProps) {
    console.log(ownProps)
    return {
        token: auth && auth.token,
        location: location && location,
        device: device && device,
        network: network && network
    }
}

export default connect(mapStateToProps)(RegisterCheckpointModal)