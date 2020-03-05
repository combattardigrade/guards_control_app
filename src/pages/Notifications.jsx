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
                        <IonTitle>Notificaciones</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '20px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={mailOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Nuevo mensaje en chat</IonLabel>
                                    <IonNote>"¡Bienvenidos al chat de la empresa!"</IonNote>
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

export default connect(mapStateToProps)(Notifications)