import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonTextarea
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline, calendarOutline,
} from 'ionicons/icons'



class HistorialAccesos extends Component {




    render() {

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Historial Accesos</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="4" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel style={{ fontSize: '12px' }}>No.</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel style={{ fontSize: '12px' }}>Tipo</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel style={{ fontSize: '12px' }}>Fecha y Hora</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="4" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel style={{ fontSize: '12px' }}>1</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel style={{ fontSize: '12px' }}>Entrada</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel style={{ fontSize: '12px' }}>15:46 07/02/2020</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="4" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel style={{ fontSize: '12px' }}>2</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel style={{ fontSize: '12px' }}>Salida</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel style={{ fontSize: '12px' }}>15:46 07/02/2020</IonLabel>
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

export default connect(mapStateToProps)(HistorialAccesos)