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

import './styles.css'

import { API } from '../utils/api'
const moment = require('moment')

class BitacoraModal extends Component {

    render() {

        const { bitacora, showBitacoraModal, handleToggleBitacoraModal } = this.props

        console.log(bitacora)

        return (
            <IonModal isOpen={showBitacoraModal} >
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); handleToggleBitacoraModal(false) }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={closeOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Bitacora del {moment(bitacora.createdAt).format('DD/MM/YYYY')}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel className="dataTitle">Resumen de Actividades:</IonLabel>
                                    <IonNote className="dataField">{bitacora.resumenActividades}</IonNote>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel className="dataTitle">Resumen de incidencias:</IonLabel>
                                    <IonNote className="dataField">{bitacora.resumenIncidencias}</IonNote>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel className="dataTitle">Fecha y Hora:</IonLabel>
                                    <IonLabel className="dataField">{moment(bitacora.createdAt).format('DD/MM/YY HH:MM')}</IonLabel>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>

                   

                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <IonLabel className="dataTitle">Archivos adjuntos:</IonLabel>
                                    <img style={{ height: '120px', width: '120px', marginTop: '10px', borderRadius: '5px' }} src={`${API}/photo/${bitacora.photoId}`} />                                    
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

export default connect(mapStateToProps)(BitacoraModal)