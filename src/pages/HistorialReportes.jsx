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



class HistorialReportes extends Component {




    render() {

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Bitácoras Diarias</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Ventana Rota</IonLabel>
                                    <IonNote>01/02/2020</IonNote>
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

export default connect(mapStateToProps)(HistorialReportes)