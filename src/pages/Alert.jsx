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
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline, closeCircleOutline, callOutline
} from 'ionicons/icons'



class Alert extends Component {




    render() {



        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Alerta de Pánico</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem>
                        Mapa
                    </IonItem>
                    



                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                <ion-button expand="full" type="submit" className="ion-no-margin"><IonIcon icon={closeCircleOutline}></IonIcon> Terminar Alarma</ion-button>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="12" style={{ paddingTop: '0px' }}>
                                <ion-button color="dark" expand="full" type="submit" className="ion-no-margin"><IonIcon icon={callOutline}></IonIcon> Llamar a Central</ion-button>
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

export default connect(mapStateToProps)(Alert)