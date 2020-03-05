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



class Routes extends Component {

   
  

    render() {



        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Rutas</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem lines="full">
                        <div style={{height:'300px'}}>Mapa</div>
                    </IonItem>

                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Ruta #1</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Nombre: Patio</IonLabel>
                                    <IonLabel>Observaciones: No hay iluminación</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Ruta #2</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Nombre: Patio</IonLabel>
                                    <IonLabel>Observaciones: No hay iluminación</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Ruta #3</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Nombre: Patio</IonLabel>
                                    <IonLabel>Observaciones: No hay iluminación</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, workOrders }) {
    
}

export default connect(mapStateToProps)(Routes)