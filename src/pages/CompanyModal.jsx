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
    locationOutline, manOutline, searchOutline, mailOutline, radioOutline, peopleOutline, globeOutline, businessOutline
} from 'ionicons/icons'


const moment = require('moment')

class CompanyModal extends Component {

    render() {

        const { guard, company,  showCompanyModal, handleToggleCompanyModal } = this.props



        return (
            <IonModal isOpen={showCompanyModal} >
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); handleToggleCompanyModal(false) }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={closeOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Mi Empresa</IonTitle>
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
                                    <IonLabel>ID Empresa</IonLabel>
                                    <IonNote className="dataField">{company && company.id}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={businessOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Nombre</IonLabel>
                                    <IonNote className="dataField">{company && company.name}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={globeOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Página Web</IonLabel>
                                    <IonNote className="dataField">{company && company.name}</IonNote>
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
                                    <IonNote className="dataField">{company && company.email}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines="full">
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={callOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Teléfono</IonLabel>
                                    <IonNote className="dataField">{company && company.phone}</IonNote>
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
                                    <IonNote className="dataField">{company && company.status == 1 ? 'ACTIVA' : 'INACTIVA'}</IonNote>
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
//         guard: guard && guard,
//         company: guard ? 'company' in guard ? guard.company : null : null
//     }
// }

export default CompanyModal