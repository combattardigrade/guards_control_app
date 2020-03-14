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
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline
} from 'ionicons/icons'


// Actions
import { saveRoutes } from '../actions/routes'

// Api
import { completeCheckpoint, getRoutesByStatus } from '../utils/api'

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NFC, Ndef } from '@ionic-native/nfc';


class RegisterCheckpoint extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: ''
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    ionViewWillEnter() {
        const { checkpointId } = this.props.match.params
    }

    handleScanner = async (e) => {

        e.preventDefault()
        console.log('QR SCANNER STARTED')
        const { token, checkpoint, dispatch } = this.props
        const code = '5342543254'

        completeCheckpoint({ checkpointId: checkpoint.id, code: code, token })
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
                }
            })
            .catch(err => {
                console.log(err)
                this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar registrar el acceso', 'Error')
                return
            })


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

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    render() {

        const { checkpoint, route, location } = this.props

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
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
                                <ion-button expand="full" type="submit" className="ion-no-margin">Escanear punto con NFC</ion-button>
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
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, location }, ownProps) {
    return {
        token: auth && auth.token,
        location: location && location,
        checkpoint: ownProps.location.state.checkpoint,
        route: ownProps.location.state.route
    }
}

export default connect(mapStateToProps)(withIonLifeCycle(RegisterCheckpoint))