import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, withIonLifeCycle, useIonViewWillEnter, IonAlert
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    shieldCheckmark, logInOutline
} from 'ionicons/icons'


class SuccessModal extends Component {
    render() {
        const { showSuccessModal, handleSuccessModalBtn, title, description } = this.props

        return (
            <IonModal isOpen={showSuccessModal} >
                <IonHeader>
                    <IonToolbar color="dark">

                        <IonTitle>{title}</IonTitle>
                    </IonToolbar>
                </IonHeader>


                <IonContent>
                    <IonItem style={{ top: '25vh' }} lines="none">
                        <IonGrid>
                            <IonRow>
                                <IonCol style={{ textAlign: 'center' }}>
                                    <IonIcon color="success" style={{ fontSize: '6em' }} icon={shieldCheckmark}></IonIcon>
                                    <IonLabel style={{ fontWeight: 'bold', fontSize: '1em', marginTop: '20px' }}>{description}</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonGrid>
                        <IonRow style={{ bottom: '10px', position: 'absolute', width: "98%" }}>
                            <IonCol style={{ textAlign: 'center' }}>
                                <IonRow>
                                    <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                        <ion-button onClick={e => { e.preventDefault(); handleSuccessModalBtn()}} expand="full" type="submit" className="ion-no-margin">
                                            Ir a Dashboard
                                        </ion-button>
                                    </IonCol>
                                </IonRow>

                            </IonCol>
                        </IonRow>
                    </IonGrid>

                </IonContent>
            </IonModal >
        )
    }
}
export default withIonLifeCycle(SuccessModal)

