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

import './styles.css'

const moment = require('moment')



class HistorialAccesos extends Component {

    handleBackBtn = () => {
        this.props.history.goBack()
    }


    render() {

        const { accessLogs } = this.props

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Historial Accesos</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center' }}>
                                    <IonLabel className='dataTitle' >No.</IonLabel>
                                </IonCol>
                                <IonCol size="3">
                                    <IonLabel className='dataTitle'>Tipo</IonLabel>
                                </IonCol>
                                <IonCol size="3">
                                    <IonLabel className='dataTitle'>Método</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel className='dataTitle'>Fecha y Hora</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    {
                        accessLogs &&
                        Object.values(accessLogs).map((log, index) => (
                            <IonItem key={index}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="2" style={{ textAlign: 'center' }}>
                                            <IonLabel style={{ fontSize: '12px' }}>{index}</IonLabel>
                                        </IonCol>
                                        <IonCol size="3">
                                            <IonLabel style={{ fontSize: '12px' }}>{log.accessType == 'ENTRY' ? 'Entrada' : 'Salida'}</IonLabel>
                                        </IonCol>
                                        <IonCol size="3">
                                            <IonLabel style={{ fontSize: '12px' }}>{log.accessMethod}</IonLabel>
                                        </IonCol>
                                        <IonCol size="4">
                                            <IonLabel style={{ fontSize: '12px' }}>{moment(log.createdAt).format('DD/MM/YY HH:MM')}</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonItem>
                        ))
                    }


                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, accessLogs }) {
    return {
        accessLogs,
    }
}

export default connect(mapStateToProps)(HistorialAccesos)