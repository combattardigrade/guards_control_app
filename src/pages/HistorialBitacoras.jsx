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
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline, calendarOutline
} from 'ionicons/icons'

import BitacoraModal from './BitacoraModal'

const moment = require('moment')

class HistorialBitacoras extends Component {

    state = {
        bitacora: '',
        showBitacoraModal: false,
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    handleToggleBitacoraModal = (value) => {
        this.setState({ showBitacoraModal: value })
    }

    handleShowBitacora = (index) => {
        const { bitacoras } = this.props
        const bitacora = (Object.values(bitacoras).filter((b, i) => i == index))[0]
        this.setState({
            bitacora,
            showBitacoraModal: true
        })
    }

    render() {

        const { bitacoras } = this.props

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Bitácoras Diarias</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    {
                        bitacoras
                            ?
                            Object.values(bitacoras).map((bitacora, index) => (
                                <IonItem button detail key={index} onClick={e => { e.preventDefault(); this.handleShowBitacora(index) }}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="2" style={{ textAlign: 'center', paddingTop: '35px',  }}>
                                                <IonIcon style={{ fontSize: '2em' }} icon={calendarOutline}></IonIcon>
                                            </IonCol>
                                            <IonCol size="10">
                                                <IonLabel className="dataTitle" style={{marginBottom:'5px'}}>Día: {moment(bitacora.createdAt).format('DD/MM/YYYY')}</IonLabel>
                                                <IonLabel className="dataSubtitle">Activiades:</IonLabel>
                                                <IonNote className="dataField">{bitacora.resumenActividades.replace(/(\r\n|\n|\r)/gm, "").substring(0, 40)}...</IonNote>
                                                <IonLabel className="dataSubtitle">Incidentes:</IonLabel>
                                                <IonNote className="dataField">{bitacora.resumenIncidencias.replace(/(\r\n|\n|\r)/gm, "").substring(0, 40)}...</IonNote>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            ))
                            :
                            <IonItem>

                            </IonItem>
                    }



                    <BitacoraModal
                        bitacora={this.state.bitacora}
                        showBitacoraModal={this.state.showBitacoraModal}
                        handleToggleBitacoraModal={this.handleToggleBitacoraModal}
                    />
                </IonContent>
            </IonPage >



        );
    }
};


function mapStateToProps({ bitacoras }) {
    return {
        bitacoras,
    }
}

export default connect(mapStateToProps)(HistorialBitacoras)