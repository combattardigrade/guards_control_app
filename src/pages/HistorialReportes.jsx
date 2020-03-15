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

import ReportModal from './ReportModal'
// Api
import { getPhoto } from '../utils/api'

const moment = require('moment')



class HistorialReportes extends Component {

    state = {
        report: '',
        showReportModal: false,
        base64Img: ''
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    handleToggleReportModal = (value) => {
        this.setState({ showReportModal: value })
    }

    handleShowReport = (index) => {
        const { reports, token } = this.props
        const report = (Object.values(reports).filter((r, i) => i == index))[0]
        this.setState({
            report,
            showReportModal: true
        })       
    }



    render() {

        const { reports } = this.props

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Historial Reportes</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center' }}>
                                    <IonLabel className='dataTitle' >ID</IonLabel>
                                </IonCol>
                                <IonCol size="3">
                                    <IonLabel className='dataTitle'>Título</IonLabel>
                                </IonCol>
                                <IonCol size="3">
                                    <IonLabel className='dataTitle'>Descripción</IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonLabel className='dataTitle'>Fecha y Hora</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    {
                        reports &&
                        Object.values(reports).map((report, index) => (
                            <IonItem key={index} button detail onClick={e => { e.preventDefault(); this.handleShowReport(index) }}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="2" style={{ textAlign: 'center' }}>
                                            <IonLabel style={{ fontSize: '12px' }}>{report.id}</IonLabel>
                                        </IonCol>
                                        <IonCol size="3">
                                            <IonLabel style={{ fontSize: '12px' }}>{report.title}</IonLabel>
                                        </IonCol>
                                        <IonCol size="3" >
                                            <IonLabel style={{ fontSize: '12px' }}>{report.description.substring(0, 11) + '...'}</IonLabel>
                                        </IonCol>
                                        <IonCol size="4">
                                            <IonLabel style={{ fontSize: '12px' }}>{moment(report.createdAt).format('DD/MM/YY HH:MM')}</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonItem>
                        ))
                    }
                    <ReportModal
                        report={this.state.report}
                        showReportModal={this.state.showReportModal}
                        handleToggleReportModal={this.handleToggleReportModal}
                        base64Img={this.state.base64Img}
                    />

                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, reports }) {
    return {
        reports,
    }
}

export default connect(mapStateToProps)(HistorialReportes)