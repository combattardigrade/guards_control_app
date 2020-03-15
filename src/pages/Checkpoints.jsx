import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonTextarea,
    IonSelect, IonSelectOption, IonAlert,
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    chevronBackOutline, checkmarkOutline, closeOutline
} from 'ionicons/icons'

import RouteMap from '../components/RouteMap'
import RegisterCheckpointModal from './RegisterCheckpointModal'
import { getMapRoute } from '../utils/api'
import './styles.css'


class Checkpoints extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        points: [],
        checkpoints: '',
        registerBtnDisabled: true,
        activeCheckpoint: '',
        showRegisterCheckpointModal: false,
        currentCheckpoint: '',
        currentRoute: ''
    }

    componentDidMount() {
        const { routes } = this.props
        if (routes) {
            this.setState({ checkpoints: routes[0].checkpoints })
        }

    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    handleSelectChange = (e) => {
        const { routes } = this.props
        const index = e.target.value

        this.setState({ checkpoints: 'checkpoints' in routes[index] ? routes[index].checkpoints : '', points: [] })
        this.handleShowRoute(index)
    }

    async handleShowRoute(index) {
        const { routes } = this.props
        this.setState({ checkpoints: routes[index].checkpoints, points: [] })
        let checkpoints = routes[index].checkpoints
        let points = []
        for (let i = 0; i < checkpoints.length; i++) {
            if (!checkpoints[i + 1]) {
                break;
            }
            let jsonobject = await (await getMapRoute({ fromLocation: { lat: checkpoints[i].lat, lng: checkpoints[i].lng }, toLocation: { lat: checkpoints[i + 1].lat, lng: checkpoints[i + 1].lng } })).json()

            let coordinates = jsonobject.routes[0].geometry.coordinates
            await coordinates.map((point) => {
                points.push({ lat: point[1], lng: point[0] })
            })
        }
        this.setState({ points })
    }

    handleCheckpointClick(checkpoint) {
        if (checkpoint.status == 'COMPLETED') {
            this.setState({ registerBtnDisabled: true })
            this.showAlert('El punto de control seleccionado ya ha sido completado', 'Notificación')
            return
        }
        this.setState({ registerBtnDisabled: false, activeCheckpoint: checkpoint })
    }

    handleScanClick = (e) => {
        e.preventDefault()
        const { activeCheckpoint } = this.state
        const { routes } = this.props

        this.setState({
            currentCheckpoint: activeCheckpoint,
            currentRoute: (Object.values(routes).filter(r => r.id == activeCheckpoint.routeId))[0],
            showRegisterCheckpointModal: true
        })
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleToggleRegisterCheckpointModal = (value) => {
        this.setState({ showRegisterCheckpointModal: value })
    }

    render() {

        const { routes, location, } = this.props
        const { points, checkpoints } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Puntos de Control</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>



                    <IonRow>
                        <IonCol>
                            {
                                location && <RouteMap location={location} checkpoints={checkpoints} routePoints={points} />
                            }
                        </IonCol>
                    </IonRow>

                    <IonItem style={{ marginTop: '30vh' }} >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <IonLabel>Seleccionar Ruta:</IonLabel>
                                    <IonSelect onIonChange={this.handleSelectChange} placeholder="Seleccionar ruta" style={{ width: '100% !important', maxWidth: '100% !important' }}>
                                        {
                                            routes &&
                                            (
                                                Object.values(routes).map((route, index) => (
                                                    <IonSelectOption key={index} value={index}>{route.name}</IonSelectOption>

                                                ))
                                            )
                                        }
                                    </IonSelect>
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonItem>

                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="1"><IonLabel style={{ fontSize: '12px' }}>ID</IonLabel></IonCol>
                                <IonCol size="4"><IonLabel style={{ fontSize: '12px' }}>Punto de Control</IonLabel></IonCol>
                                <IonCol size="4"><IonLabel style={{ fontSize: '12px' }}>Registrar antes de</IonLabel></IonCol>
                                <IonCol style={{ textAlign: 'center' }}><IonLabel style={{ fontSize: '12px' }}>Estado</IonLabel></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    {
                        checkpoints ?
                            checkpoints.map((cp, index) => (
                                <IonItem color={cp.id == this.state.activeCheckpoint.id ? 'primary' : null} key={index} button onClick={e => { e.preventDefault(); this.handleCheckpointClick(cp) }}>
                                    <IonGrid>
                                        <IonRow >
                                            <IonCol size="1"><IonLabel style={{ fontSize: '12px' }}>{cp.id}</IonLabel></IonCol>
                                            <IonCol size="4"><IonLabel style={{ fontSize: '12px' }}>{cp.name}</IonLabel></IonCol>
                                            <IonCol size="4"><IonLabel style={{ fontSize: '12px' }}>15:45 04/03/2020</IonLabel></IonCol>
                                            <IonCol style={{ textAlign: 'center' }}>{cp.status == 'COMPLETED' ? <IonIcon icon={checkmarkOutline}></IonIcon> : <IonIcon icon={closeOutline}></IonIcon>}</IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            ))
                            :
                            <IonRow>
                                <IonCol><IonLabel style={{ fontSize: '12px' }}>-</IonLabel></IonCol>
                                <IonCol><IonLabel style={{ fontSize: '12px' }}>-</IonLabel></IonCol>
                                <IonCol><IonLabel style={{ fontSize: '12px' }}>-</IonLabel></IonCol>
                            </IonRow>
                    }




                    <div style={{ textAlign: 'center', position: 'fixed', width: '100%', bottom: '10px' }}>
                        <IonButton disabled={this.state.registerBtnDisabled} onClick={this.handleScanClick}> Escanear Punto de Control</IonButton>
                    </div>
                    <RegisterCheckpointModal
                        checkpoint={this.state.currentCheckpoint}
                        route={this.state.currentRoute}
                        showRegisterCheckpointModal={this.state.showRegisterCheckpointModal}
                        handleToggleRegisterCheckpointModal={this.handleToggleRegisterCheckpointModal}
                    />
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


function mapStateToProps({ auth, routes, location }) {
    return {
        token: auth && auth.token,
        routes: routes && routes,
        location: location && location,

    }
}

export default connect(mapStateToProps)(Checkpoints)