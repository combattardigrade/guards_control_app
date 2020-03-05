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
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline
} from 'ionicons/icons'



class SendBitacora extends Component {




    render() {

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Bitácora</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonItem style={{textAlign:'center'}} lines="none">
                    <IonLabel>Enviar Registro Diario</IonLabel>
                </IonItem>
                <IonContent>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Fecha:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly value="07/02/2020"></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Resumen del día:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonTextarea placeholder="Escribe el texto aquí..."></IonTextarea></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonItem lines="none">
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonButton color="light" expand="full"><IonIcon icon={cameraOutline}></IonIcon> Tomar Foto</IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton color="light" expand="full"><IonIcon icon={imagesOutline}></IonIcon> Galería</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                <ion-button expand="full" type="submit" className="ion-no-margin">Enviar Reporte</ion-button>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="12" style={{ paddingTop: '0px' }}>
                                <ion-button color="light" expand="full" type="submit" className="ion-no-margin">Cancelar</ion-button>
                            </IonCol>
                        </IonRow>

                    </IonGrid>
                    <IonGrid>
                        <IonRow style={{ bottom: '10px', position: 'absolute', width: "98%" }}>
                            <IonCol style={{ textAlign: 'center' }}>

                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <div style={{ bottom: '10px', position: 'absolute', padding: '10px', width: '100%' }}>
                        <ion-button color="light" expand="full" type="submit" className="ion-no-margin">Ver Historial de Bitácoras</ion-button>
                    </div>

                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, workOrders }) {

}

export default connect(mapStateToProps)(SendBitacora)