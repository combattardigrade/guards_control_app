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
    documentAttachOutline, chevronBackOutline, searchOutline, micOutline
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
                        <IonTitle>Chat</IonTitle>
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={peopleOutline}></IonIcon>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    

                    <IonItem lines="none">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonLabel>¡Bienvenido al chat de la empresa!</IonLabel>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" offset='6'>
                                    <IonLabel>¡Buenos días!</IonLabel>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" offset='6'>
                                    <IonLabel>Mensaje de audio</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="none" style={{position:'fixed', bottom: '0px', borderTop: '1px solid #dedede', width: '100%'}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="10">
                                    <IonInput placeholder="Ingresa tu mensaje..."></IonInput>
                                </IonCol>
                                <IonCol size="2">
                                   <IonButton expand="full">
                                       <IonIcon icon={micOutline} ></IonIcon>
                                   </IonButton>
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