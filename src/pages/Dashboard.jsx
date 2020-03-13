import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IonButtons, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle,
     IonToolbar, IonIcon, IonItem, IonLabel, IonRefresher, IonRefresherContent,
      IonGrid, IonRow, IonCol, IonAlert 
    } from '@ionic/react';
import {
    notificationsOutline, keyOutline, shieldCheckmarkOutline, repeatOutline,
    navigateOutline, cameraOutline, readerOutline, alertCircleOutline,
    chatboxEllipsesOutline, callOutline

} from 'ionicons/icons'

// Actions
import { saveLocation } from '../actions/location'
import { saveGuardData } from '../actions/guard'


// Api
import { getGuardData } from '../utils/api'

import { Plugins } from '@capacitor/core'
const { Geolocation } = Plugins

class Dashboard extends Component {

    state = {
        showAlert: false,
        alertMsg: '',
        alertTitle: ''
    }

    componentDidMount() {
        const { token, dispatch } = this.props
        this.watchPosition()

        getGuardData({token})
            .then(data => data.json())
            .then(res => {
                if(res.status == 'OK') {
                    dispatch(saveGuardData(res.payload))
                }
            })
    }

    watchPosition = () => {
        console.log('watch position')
        const options = {
            enableHighAccuracy: true,
            maximumAge:30000,
            requireAltitude: true,
            timeout: 30000
        }
        Geolocation.watchPosition(options, (position, err) => {
            if (err) {
                console.log(err)
                return
            }
            
            const locationData = {
                lat: position.coords.latituted,
                lng: position.coords.lng,
                accuracy: position.coords.accuracy,
                speed: position.coords.speed,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                timestamp: position.timestamp
            }
            saveLocation(locationData)
        })
    }

    handleWorkOrderClick = async (wonum) => {
        console.log(wonum)
        // got to wo details
        this.props.history.push('/wo/' + wonum)
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleAccessBtn = (e) => {
        const { guard, history } = this.props
        e.preventDefault()

        if(guard.status == 'ON_STAND_BY') {
            history.push('startTurn')
        } else if (guard.status == 'ON_PATROL') {
            history.push('endTurn')
        } else {
            this.showAlert('No fue posible obtener el estado del guardia. Por favor, inténtalo nuevamente', 'Error')
        }
        
        
    }

    goToPage = (page) => {        
        this.props.history.push(page)
    }

    
    render() {


        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Dashboard</IonTitle>
                        <IonButtons slot="end">
                            <IonButton><IonIcon icon={notificationsOutline}></IonIcon></IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none"  button onClick={this.handleAccessBtn}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={repeatOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Acceso</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none" button onClick={e => {e.preventDefault(); this.goToPage('checkpoints')}}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={shieldCheckmarkOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Puntos de Control</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none" button onClick={e => {e.preventDefault(); this.goToPage('checkpoints')}}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={navigateOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Rutas</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none" button onClick={e => {e.preventDefault(); this.goToPage('report')}}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={cameraOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Reportar</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none" button onClick={e => {e.preventDefault(); this.goToPage('bitacora')}}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={readerOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Bitácoras</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none" button >
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={alertCircleOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Pánico</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none" button onClick={e => {e.preventDefault(); this.goToPage('chat')}}>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={chatboxEllipsesOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Chat</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6">
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none" button>
                                    <IonGrid>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonIcon icon={callOutline}></IonIcon></IonCol>
                                        </IonRow>
                                        <IonRow style={{ textAlign: 'center' }}>
                                            <IonCol><IonLabel>Llamar a Central</IonLabel></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </IonGrid>



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
            </IonPage>
        );
    }
};


function mapStateToProps({ auth, guard }) {
    return {
        token: auth.token,
        guard: guard && guard.guard
        

    }
}

export default connect(mapStateToProps)(Dashboard)