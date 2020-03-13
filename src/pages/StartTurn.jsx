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

const moment = require('moment')


class StartTurn extends Component {

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
        e.preventDefault()
        try {

            const data = await BarcodeScanner.scan({ preferFrontCamera: false, formats: 'QR_CODE', showTorchButton: true })
            console.log(`Barcode data: ${data.text}`)
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un erro al intentar escanear el código QR.', 'Error')
            return
        }
    }

    handleNFC = async (e) => {
        console.log('NFC SCANNER STARTED')
        e.preventDefault()
        console.log(NFC)
        try {
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
                    <IonToolbar>
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
                                <IonCol><IonLabel>Fecha y Hora de Inicio:</IonLabel></IonCol>
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


function mapStateToProps({ token, location, guard }) {
    return {
        token,
        location: location && location.location,
        guard: guard && guard.guard
    }
}

export default connect(mapStateToProps)(StartTurn)