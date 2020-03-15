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
    businessOutline, phonePortraitOutline, globeOutline, informationCircleOutline, callOutline
} from 'ionicons/icons'

// Styles
import './styles.css'

// Modals
import GuardModal from './GuardModal'
import CompanyModal from './CompanyModal'

// Plugins
import { CallNumber } from '@ionic-native/call-number';
import { Plugins } from '@capacitor/core';
const { Network, Browser } = Plugins;


class Settings extends Component {

    state = {
        networkStatus: '',
        showGuardModal: false,
        showCompanyModal: false
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }
    
    async componentDidMount() {
        let networkStatus = await Network.getStatus();
        if (networkStatus.connected) {
            this.setState({ networkStatus: 'Conectado' })
        } else {
            this.setState({ networkStatus: 'Conexión no disponible' })
        }

    }

    goToWebsite = async (url) => {
        await Browser.open({ url: `${url}` });
    }

    makeCall = (phone) =>{
        CallNumber.callNumber(phone, true)
        .then(res => console.log('LAUNCHED CALL DIALER'))
        .catch(err => console.log('ERROR LAUNCHING CALL DIALER', err))      
    }

    handleToggleGuardModal = (value) => {
        this.setState({ showGuardModal: value })
    }

    handleToggleCompanyModal = (value) => {
        console.log('test')
        this.setState({ showCompanyModal: value })
    }

    render() {
        const { guard, company, device } = this.props
        const { networkStatus } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Ajustes</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={wifiOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel >Estado de la conexión</IonLabel>
                                    <IonNote className="dataField">{networkStatus ? networkStatus : 'Cargando...'}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail onClick={e => {e.preventDefault(); this.handleToggleGuardModal(true)}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={personOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Usuario</IonLabel>
                                    <IonNote className="dataField">{guard.username}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail onClick={e => {e.preventDefault(); this.handleToggleCompanyModal(true)}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={businessOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Empresa</IonLabel>
                                    <IonNote className="dataField">{company.name}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={phonePortraitOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>IMEI Dispositivo</IonLabel>
                                    <IonNote className="dataField">{device.uuid}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail onClick={e => {e.preventDefault(); this.goToWebsite(company.website)}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={globeOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Sitio Web Empresa</IonLabel>
                                    <IonNote className="dataField">{company.website}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail onClick={e => {e.preventDefault(); this.makeCall(company.phone)}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={callOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Teléfono de la Central</IonLabel>
                                    <IonNote className="dataField">{company.phone}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={informationCircleOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Versión de la App</IonLabel>
                                    <IonNote className="dataField"><span style={{ textTransform: 'capitalize' }}>{device.platform}</span> v{'appVersion' in device && device.appVersion ? device.appVersion : '1.0.0'}</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <GuardModal
                        guard={guard}
                        showGuardModal={this.state.showGuardModal}
                        handleToggleGuardModal={this.handleToggleGuardModal}                        
                    />
                    <CompanyModal
                        guard={guard}
                        company={company}
                        showCompanyModal={this.state.showCompanyModal}
                        handleToggleCompanyModal={this.handleToggleCompanyModal}                        
                    />
                    {/* <div style={{ bottom: '20px', position: 'absolute', textAlign: 'center', width: '100%' }}>
                        <IonLabel className="dataField" ><span style={{ textTransform: 'capitalize' }}>{device.platform}</span> v{'appVersion' in device && device.appVersion ? device.appVersion : '1.0.0'}</IonLabel>
                    </div> */}
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, guard, device }) {
    return {
        guard,
        company: guard ? 'company' in guard ? guard.company : null : null,
        device,
    }
}

export default connect(mapStateToProps)(Settings)