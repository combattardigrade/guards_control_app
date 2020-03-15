import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonAlert
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

const moment = require('moment')


class EndTurn extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: ''
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    handleScanner = async (e) => {
        console.log('QR SCANNER STARTED')
        const { token, location, device, dispatch } = this.props
        const accessCode = '17dadc0d75f84cd57f5ec4a97e6f45a2'
       
        registerAccess({accessCode, lat: location.lat, lng: location.lng, 
            imei: device.uuid, accessMethod: 'QR_CODE', accessType: 'EXIT', token: token
        })
            .then(data => data.json())
            .then(res => {
                console.log(res)
                if(res.status == 'OK') {
                    dispatch(updateGuardStatus('ON_STAND_BY'))
                    dispatch(saveNewAccessLog(res.payload))
                    // show success page
                }
            })
            .catch(err => {
                console.log(err)
                this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar registrar el acceso', 'Error')
                return
            })

        e.preventDefault()
        try {

            const data = await BarcodeScanner.scan({ preferFrontCamera: false, formats: 'QR_CODE', showTorchButton: true })
            console.log(`Barcode data: ${data.text}`)
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar escanear el código QR.', 'Error')
            return
        }
    }

    handleNFC = async (e) => {
        console.log('NFC SCANNER STARTED')
        e.preventDefault()
        console.log(NFC)
        try {

            // Receive NFC event
            // https://stackoverflow.com/questions/26688456/my-cordova-application-not-launching-after-nfc-tag-detect
            // To Do

            NFC.addTagDiscoveredListener(
                function (nfcEvent) {
                    var tag = nfcEvent.tag,
                        ndefMessage = tag.ndefMessage;

                    // dump the raw json of the message
                    // note: real code will need to decode
                    // the payload from each record
                    alert(JSON.stringify(ndefMessage));

                    // assuming the first record in the message has
                    // a payload that can be converted to a string.
                    alert(NFC.bytesToString(ndefMessage[0].payload).substring(3));
                },
                function () { // success callback
                    alert("Waiting for NDEF tag");
                },
                function (error) { // error callback
                    alert("Error adding NDEF listener " + JSON.stringify(error));
                }
            );
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar iniciar la comunicación NFC.', 'Error')
            return
        }
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    render() {

        const { location, guard } = this.props

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Terminar Turno</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Usuario:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly value={guard.username}></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Fecha y Hora de Finalización:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly value={moment().format('DD/MM/YYYY HH:MM')}></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel >Localización:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput value={location && `${location.lat}, ${location.lng}`}></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonRow>
                        <IonCol>
                            {
                                location && <MyMap location={location} />
                            }
                        </IonCol>
                    </IonRow>

                    <div style={{ bottom: '10px', position: 'absolute', padding: '10px 10px 0px 10px', width: '100%' }}>

                        <IonButton onClick={this.handleNFC} expand="full" type="submit" style={{ marginBottom: '10px' }}>Escanear punto con NFC</IonButton>

                        <IonButton onClick={this.handleScanner} color="dark" expand="full" type="submit" style={{ marginBottom: '20px' }}>Escanear punto con QR</IonButton>


                        {/* <IonButton color="light" expand="full" type="submit" className="ion-no-margin">Ver Historial de Accesos</IonButton> */}
                    </div>
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


function mapStateToProps({ auth, token, location, guard, device }) {
    return {
        token: auth && auth.token,
        location: location && location,
        guard: guard && guard,
        device: device && device
    }
}

export default connect(mapStateToProps)(EndTurn)