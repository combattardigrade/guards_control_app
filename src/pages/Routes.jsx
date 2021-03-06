import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, withIonLifeCycle
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline
} from 'ionicons/icons'

import RouteMap from '../components/RouteMap'
import Checkpoints from './Checkpoints';

import { getMapRoute } from '../utils/api'

class Routes extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        checkpoints: '',
        center: '',
        loading: true
    }

    handleBackBtn = () => {
        this.props.history.replace('/dashboard')
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    ionViewDidEnter() {
        const { routes } = this.props
        if (routes) {
            //this.setState({ checkpoints: routes[0].checkpoints, loading: false })
            this.handleShowRoute(0)
        }

    }

    async handleShowRoute(index) {
        const { routes } = this.props
        this.setState({ checkpoints: routes[index].checkpoints })
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
        this.setState({ points, center: { lat: checkpoints[0].lat, lng: checkpoints[0].lng }, loading: false })
    }

    render() {

        const { routes, location } = this.props
        const { checkpoints, points, center, loading } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Rutas Activas</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonRow>
                        <IonCol>
                            {

                                (location && checkpoints && points && loading == false)
                                    ?                                    
                                    <RouteMap location={location} checkpoints={checkpoints} routePoints={points} center={center ? center : location} />
                                    : <div>Loading map...</div>
                            }
                        </IonCol>
                    </IonRow>
                    <div style={{ marginTop: '30vh' }}>
                        {
                            routes ?
                                Object.values(routes).map((route, index) => (
                                    <IonItem key={route.id} lines="full" button detailIcon={searchOutline} detail onClick={e => { e.preventDefault(); this.handleShowRoute(index) }}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol><IonLabel>ID {route.id}</IonLabel></IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>Nombre: {route.name}</IonLabel>
                                                    <IonLabel>Descripción: {route.description}</IonLabel>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonItem>
                                ))
                                :
                                <div>No se encontraron resultados</div>


                        }
                    </div>

                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, routes, location }) {
    return {
        token: auth && auth.token,
        routes: routes && routes,
        location: location && location
    }

}

export default connect(mapStateToProps)(withIonLifeCycle(Routes))