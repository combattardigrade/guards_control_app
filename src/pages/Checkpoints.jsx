import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonTextarea,
    IonSelect, IonSelectOption
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline, calendarOutline, wifiOutline, personOutline,
    businessOutline, phonePortraitOutline, globeOutline, mailOutline
} from 'ionicons/icons'

import RouteMap from '../components/RouteMap'
import { getMapRoute } from '../utils/api'

class Checkpoints extends Component {

    state = {
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        points: [],
        checkpoints: ''
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

    render() {

        const { routes, location,  } = this.props
        const { points, checkpoints } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
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
                                <IonCol><IonLabel style={{ fontSize: '12px' }}>ID</IonLabel></IonCol>
                                <IonCol><IonLabel style={{ fontSize: '12px' }}>Punto de Control</IonLabel></IonCol>
                                <IonCol><IonLabel style={{ fontSize: '12px' }}>Registrar antes de</IonLabel></IonCol>
                                <IonCol><IonLabel style={{ fontSize: '12px' }}>Estado</IonLabel></IonCol>
                            </IonRow>
                            {
                                checkpoints ?
                                    checkpoints.map((cp, index) => (
                                        <IonRow key={index}>
                                            <IonCol><IonLabel style={{ fontSize: '12px' }}>{cp.id}</IonLabel></IonCol>
                                            <IonCol><IonLabel style={{ fontSize: '12px' }}>{cp.name}</IonLabel></IonCol>
                                            <IonCol><IonLabel style={{ fontSize: '12px' }}>15:45 04/03/2020</IonLabel></IonCol>
                                            <IonCol><IonLabel style={{ fontSize: '12px' }}>{cp.status}</IonLabel></IonCol>
                                        </IonRow>
                                    ))
                                    :
                                    <IonRow>
                                        <IonCol><IonLabel style={{ fontSize: '12px' }}>-</IonLabel></IonCol>
                                        <IonCol><IonLabel style={{ fontSize: '12px' }}>-</IonLabel></IonCol>
                                        <IonCol><IonLabel style={{ fontSize: '12px' }}>-</IonLabel></IonCol>
                                    </IonRow>
                            }

                        </IonGrid>
                    </IonItem>


                    <div style={{ textAlign: 'center', position: 'absolute', width: '100%', bottom: '10px' }}>
                        <IonButton> Escanear Punto de Control</IonButton>
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
        location: location && location,
        
    }
}

export default connect(mapStateToProps)(Checkpoints)