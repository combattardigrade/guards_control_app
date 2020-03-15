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
    closeOutline
} from 'ionicons/icons'

import { API } from '../utils/api'
const moment = require('moment')

class ReportModal extends Component {

    render() {

        const { report, base64Img, showReportModal, handleToggleReportModal } = this.props
        
        console.log(report)

        return (
            <IonModal isOpen={showReportModal} >
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); handleToggleReportModal(false) }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={closeOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Reporte (ID:{report.id})</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel className="dataTitle">Título:</IonLabel>
                                    <IonLabel>{report.title}</IonLabel>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel className="dataTitle">Descripción de la incidencia:</IonLabel>
                                    <IonLabel>{report.description}</IonLabel>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel className="dataTitle">Fecha y Hora:</IonLabel>
                                    <IonLabel>{moment(report.createdAt).format('DD/MM/YY HH:MM')}}</IonLabel>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>

                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel className="dataTitle">Localización:</IonLabel>
                                    <IonLabel>{`${report.lat}, ${report.lng}`}</IonLabel>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>

                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <IonLabel className="dataTitle">Archivos adjuntos:</IonLabel>
                                    <img style={{ height: '120px', width: '120px', marginTop: '10px', borderRadius: '5px' }} src={`${API}/photo/${report.photoId}`} />
                                    {/* <img style={{ height: '120px', width: '120px', marginTop: '10px', borderRadius: '5px' }} src={`data:image/jpeg;base64,${base64Img}`} /> */}
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                </IonContent>
            </IonModal >

        );
    }
};


function mapStateToProps({ auth }) {
    return {
        token: auth && auth.token

    }
}

export default connect(mapStateToProps)(withIonLifeCycle(ReportModal))