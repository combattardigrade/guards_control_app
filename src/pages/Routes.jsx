import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline
} from 'ionicons/icons'

import RouteMap from '../components/RouteMap'
import Checkpoints from './Checkpoints';

class Routes extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        checkpoints: ''
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    componentDidMount() {
        const { routes } = this.props
        if (routes) {
            this.setState({ checkpoints: routes[0].checkpoints })
        }

    }

    handleShowRoute(index) {        
        const { routes } = this.props
        this.setState({ checkpoints: routes[index].checkpoints })
    }

    render() {

        const { routes, location } = this.props
        const { checkpoints } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
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
                                location && <RouteMap location={location} checkpoints={checkpoints} />
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

export default connect(mapStateToProps)(Routes)