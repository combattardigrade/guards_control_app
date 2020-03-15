import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, withIonLifeCycle, useIonViewWillEnter, IonAlert,
    IonTextarea,
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    closeOutline, callOutline, personCircleOutline, keyOutline, keypadOutline, 
    locationOutline, manOutline, searchOutline, mailOutline, radioOutline, peopleOutline
} from 'ionicons/icons'


const moment = require('moment')

class GuardModal extends Component {

    render() {

        const { guard, showGuardModal, handleToggleGuardModal } = this.props

        return (
            <IonModal isOpen={showGuardModal} >
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); handleToggleGuardModal(false) }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={closeOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Mi Cuenta</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={searchOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>ID de usuario</IonLabel>
                                    <IonNote className="dataField">{guard.id}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={personCircleOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Usuario</IonLabel>
                                    <IonNote className="dataField">{guard.username}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={manOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Nombre</IonLabel>
                                    <IonNote className="dataField">{guard.name}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={mailOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Email</IonLabel>
                                    <IonNote className="dataField">{guard.email}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={personCircleOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Teléfono</IonLabel>
                                    <IonNote className="dataField">{guard.phone}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={locationOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Dirección</IonLabel>
                                    <IonNote className="dataField">{guard.address}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={peopleOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Tipo de usuario</IonLabel>
                                    <IonNote className="dataField">{guard.userType.toUpperCase()}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={radioOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Estado</IonLabel>
                                    <IonNote className="dataField">{guard.status}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    
                </IonContent>
            </IonModal >

        );
    }
};


// function mapStateToProps({ guard }) {
//     return {
//         guard: guard && guard

//     }
// }

export default GuardModal