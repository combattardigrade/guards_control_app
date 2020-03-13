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
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline
} from 'ionicons/icons'



class Bitacora extends Component {

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
                        <IonTitle>Bitácora</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Título:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly value="Ventana rota"></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Resumen del día:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonTextarea readonly value="Descripción de la incidenci o situación reportada"></IonTextarea></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    
                    
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol><IonLabel>Fecha y Hora:</IonLabel></IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol> <IonInput readonly value="15:45 07/02/2020"></IonInput></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    

                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <IonLabel>Fotografías:</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, workOrders }) {

}

export default connect(mapStateToProps)(Bitacora)