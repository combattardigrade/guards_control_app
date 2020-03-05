import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline
} from 'ionicons/icons'



class RegisterCheckpoint extends Component {

   
  

    render() {



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
                                <IonCol><IonLabel>Punto de Controla:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly value="Marca A"></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Ruta:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly value="Ruta#1"></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel >Localización:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput value="19.454545, -18.45684"></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        Map
                    </IonItem>

                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                <ion-button expand="full" type="submit" className="ion-no-margin">Escanear punto con NFC</ion-button>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="12" style={{ paddingTop: '0px' }}>
                                <ion-button color="dark" expand="full" type="submit" className="ion-no-margin">Escanear punto con QR</ion-button>
                            </IonCol>
                        </IonRow>

                    </IonGrid>
                    <IonGrid>
                        <IonRow style={{ bottom: '10px', position: 'absolute', width: "98%" }}>
                            <IonCol style={{ textAlign: 'center' }}>

                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, workOrders }) {
    
}

export default connect(mapStateToProps)(RegisterCheckpoint)