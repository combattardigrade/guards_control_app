import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonAlert, withIonLifeCycle
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, carOutline
} from 'ionicons/icons'

// Components
import CarMap from '../components/CarMap'

// Actions
import { toggleCarTrackingState, removeCarLocations } from '../actions/carTracking'

// API
import { toggleCarTracking } from '../utils/api'

// Styles
import './styles.css'
const carIcon = require('../components/carIcon.png')
const moment = require('moment')


class CarTracking extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        showMap: false,
        vehiclePlates: ''
    }

    handleBackBtn = () => {
        this.props.history.replace('/dashboard')
    }


    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }


    handleVehiclesPlatesChange = (e) => {
        e.preventDefault()
        this.setState({ vehiclePlates: e.target.value })
    }

    handleStartTracking = () => {
        const { vehiclePlates } = this.state
        const { token, dispatch } = this.props
        const actionType = 'START'

        if (!vehiclePlates) {
            this.showAlert('Ingresa todos los campos requeridos', 'Error')
            return
        }

        toggleCarTracking({ actionType, vehiclePlates, token })
            .then((data) => data.json())
            .then((res) => {
                console.log(res)
                if (res.status == 'OK') {
                    dispatch(toggleCarTrackingState(true))
                }
            })
    }

    handleStopTracking = () => {
        const { token, dispatch } = this.props
        const actionType = 'END'

        toggleCarTracking({ actionType, token })
            .then((data) => data.json())
            .then((res) => {
                console.log(res)
                if (res.status == 'OK') {
                    dispatch(toggleCarTrackingState(false))
                }
            })
    }


    render() {

        const { location, carTracking, } = this.props
        const { loading } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Seguimiento Vehículo</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>


                    <IonRow>
                        <IonCol>

                            {
                                location && this.props.carTracking.tracking == true ? <CarMap location={location} /> : null
                            }

                        </IonCol>
                    </IonRow>

                    {
                        carTracking && carTracking.tracking == false
                            ?
                            <Fragment>
                                <IonItem lines="none">
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol style={{ textAlign: 'center' }}>
                                                {/* <IonIcon style={{fontSize:'4em'}} icon={carOutline}></IonIcon> */}
                                                <img style={{ height: '120px' }} src={carIcon} />
                                            </IonCol>
                                        </IonRow>
                                        <IonRow style={{ marginTop: '20px' }}>
                                            <IonCol>
                                                <IonLabel className="dataTitle">Placas del vehículo</IonLabel>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput onIonChange={this.handleVehiclesPlatesChange} value={this.state.vehiclePlates} className="dataField" type="text" placeholder="Ingresa las placas del vehículo"></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        
                                    </IonGrid>
                                </IonItem>
                                <div style={{ bottom: '10px', padding: '10px 10px 0px 10px', width: '100%' }}>
                                    <IonButton style={{ marginTop: '40px' }} color="primary" onClick={e => { e.preventDefault(); this.handleStartTracking() }} expand="full" type="submit" style={{ marginBottom: '10px' }}>Iniciar Seguimiento</IonButton>
                                </div>
                            </Fragment>
                            :
                            <div style={{ bottom: '10px', position: 'absolute', padding: '10px 10px 0px 10px', width: '100%' }}>
                                <IonButton color="danger" onClick={e => { e.preventDefault(); this.handleStopTracking() }} expand="full" type="submit" style={{ marginBottom: '10px' }}>Detener Seguimiento</IonButton>
                            </div>
                    }


                    <IonAlert
                        isOpen={this.state.showAlert}
                        header={this.state.alertTitle}
                        message={this.state.alertMsg}
                        buttons={[{
                            text: 'OK',
                            handler: () => {
                                this.setState({ showAlert: false })
                            }
                        }]}
                    />
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, token, location, guard, device, network, carTracking }) {
    return {
        token: auth && auth.token,
        location: location && location,
        guard: guard && guard,
        device: device && device,
        network: network && network,
        carTracking: carTracking && carTracking,
    }
}

export default connect(mapStateToProps)(withIonLifeCycle(CarTracking))