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
    businessOutline, phonePortraitOutline, globeOutline
} from 'ionicons/icons'



class Settings extends Component {

    handleBackBtn = () => {
        this.props.history.goBack()
    }


    render() {

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
                                    <IonLabel>Estado de la conexión</IonLabel>
                                    <IonNote>Conexión disponible</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={personOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Usuario</IonLabel>
                                    <IonNote>User123</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={businessOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Empresa</IonLabel>
                                    <IonNote>Empresa Nueva, S.A. de C.V.</IonNote>
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
                                    <IonNote>cxzcxzcxzcxz</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={globeOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Sitio Web Empresa</IonLabel>
                                    <IonNote>www.empresa.com</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem button detail>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonIcon style={{ fontSize: '2em' }} icon={documentTextOutline}></IonIcon>
                                </IonCol>
                                <IonCol size="10">
                                    <IonLabel>Teléfono de la Central</IonLabel>
                                    <IonNote>+123 5658 4574</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    
                     <div style={{bottom:'20px', position:'absolute', textAlign:'center', width:'100%'}}>
                         <IonLabel>Android v.1.0.1</IonLabel>
                     </div>
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, workOrders }) {

}

export default connect(mapStateToProps)(Settings)