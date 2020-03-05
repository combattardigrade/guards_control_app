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
    documentAttachOutline, chevronBackOutline, searchOutline, micOutline, personCircleOutline
} from 'ionicons/icons'



class Chat extends Component {

    render() {



        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Miembros del Chat</IonTitle>
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={peopleOutline}></IonIcon>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>                    
                    <IonItem>
                        <IonTitle>20 Participantes</IonTitle>
                    </IonItem>                   
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonIcon icon={personCircleOutline} style={{fontSize: '2.5em'}}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Juan Pérez</IonLabel>
                                    <IonLabel>+12 98 3245 7595</IonLabel>
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

export default connect(mapStateToProps)(Chat)