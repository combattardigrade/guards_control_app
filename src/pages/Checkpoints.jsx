import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonTextarea,
    IonSelect, IonSelectOption
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline, calendarOutline, wifiOutline, personOutline,
    businessOutline, phonePortraitOutline, globeOutline, mailOutline
} from 'ionicons/icons'



class Notifications extends Component {




    render() {

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Puntos de Control</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <IonLabel>Seleccionar Ruta para ver Puntos de Control</IonLabel>

                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <IonSelect placeholder="Select One" style={{ width: '100% !important', maxWidth: '100% !important' }}>
                                        <IonSelectOption value="1">Ruta#1</IonSelectOption>
                                        <IonSelectOption value="2">Ruta#2</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonItem>
                        Mapa
                    </IonItem>

                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>Punto de Control</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>Registrar antes de</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>Estado</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>Punto A</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>15:45 07/02/2020</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}></IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>Punto B</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>15:45 07/02/2020</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}></IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>Punto C</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}>15:45 07/02/2020</IonLabel></IonCol>
                                <IonCol><IonLabel style={{fontSize:'12px'}}></IonLabel></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <div style={{textAlign:'center',position:'absolute', width:'100%', bottom:'10px'}}>
                        <IonButton> Escanear Punto de Control</IonButton>
                    </div>

                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, workOrders }) {

}

export default connect(mapStateToProps)(Notifications)