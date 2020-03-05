import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IonButtons, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { 
    notificationsOutline, keyOutline, shieldCheckmarkOutline, repeatOutline,
    navigateOutline, cameraOutline, readerOutline, alertCircleOutline,
    chatboxEllipsesOutline, callOutline

} from 'ionicons/icons'


import { Plugins } from '@capacitor/core'
const { Modals } = Plugins

class Dashboard extends Component {

    async componentDidMount() {

    }

    handleWorkOrderClick = async (wonum) => {
        console.log(wonum)
        // got to wo details
        this.props.history.push('/wo/' + wonum)
    }

    async showAlert(message) {
        await Modals.alert({
            title: 'Error',
            message,
        })
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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
                                <IonItem style={{ border: '2px solid whitesmoke' }} lines="none">
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




                </IonContent>
            </IonPage>
        );
    }
};


function mapStateToProps({ auth, workOrders }) {
    return {
        // token: auth.token,
        // workOrders: workOrders.workOrders

    }
}

export default connect(mapStateToProps)(Dashboard)