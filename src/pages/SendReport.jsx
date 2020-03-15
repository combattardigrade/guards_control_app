import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonTextarea, IonAlert,
    IonSpinner, IonToast
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline
} from 'ionicons/icons'

// Styles
import './styles.css'


// Api
import { sendReport } from '../utils/api'

// Plugins
import { Plugins } from '@capacitor/core'
const { Camera } = Plugins

const moment = require('moment')

class SendReport extends Component {

    state = {
        loading: false,
        showAlert: false,
        alertTitle: '',
        alertDescription: '',
        reportTitle: '',
        reportDescription: '',
        reportPhoto: '',
        showPhotoPreview: false,
        showSentMessage: false
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    handleTitleChange = (e) => {
        this.setState({ reportTitle: e.target.value })
    }

    handleDescriptionChange = (e) => {
        this.setState({ reportDescription: e.target.value })
    }

    handleSendClick = async (e) => {
        e.preventDefault()
        console.log('SEND REPORT BTN CLICKED')
        const { token, location } = this.props
        const { reportTitle, reportDescription, reportPhoto } = this.state

        if (!reportTitle || !reportDescription) {
            this.showAlert('Ingresa todos los campos requeridos', 'Error')
            return
        }

        this.setState({ loading: true })

        const params = {
            title: reportTitle,
            description: reportDescription,
            lat: location ? location.lat : '0.0',
            lng: location ? location.lng : '0.0',
            photoData: reportPhoto,
            token,
        }

        sendReport(params)
            .then(data => data.json())
            .then(res => {
                console.log(res)
                if (res.status == 'OK') {
                    // Clear report data
                    this.setState({ 
                        photoData: '', 
                        showPhotoPreview: false, 
                        reportTitle: '', 
                        reportDescription: '', 
                        loading: false, 
                        showSentMessage: true 
                    })
                    return
                } else if (res.status == 'ERROR') {
                    this.showAlert('message' in res ? res.message : 'Ocurrió un error al intentar enviar el reporte')
                    this.setState({ loading: false })
                    return
                }
            })
            .catch((err) => {
                console.log(err)
                this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar enviar el reporte')
                this.setState({ loading: false })
                return
            })
    }

    handleTakePhotoBtn = async (e) => {

        e.preventDefault()
        console.log('TAKE PHOTO BTN CLICKed')

        const options = {
            allowEditing: false,
            quality: 30,
            resultType: 'Base64',
            saveGallery: true,
            source: 'CAMERA'
        }
        try {
            const photoData = await Camera.getPhoto(options)
            this.setState({ reportPhoto: photoData.base64String, showPhotoPreview: true })
        }
        catch (err) {
            console.log(err)
            this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar añadir una fotografía')
            return
        }
    }

    handleGalleryBtn = async (e) => {
        e.preventDefault()
        console.log('GALLERY BTN CLICK')

        const options = {
            allowEditing: false,
            quality: 30,
            resultType: 'Base64',
            source: 'PHOTOS'
        }

        try {
            const photoData = await Camera.getPhoto(options)
            this.setState({ reportPhoto: photoData.base64String, showPhotoPreview: true })
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar añadir una foto', 'Error')
            return
        }
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    render() {

        const { location } = this.props
        const { showPhotoPreview, reportPhoto, reportTitle, reportDescription, loading, showSentMessage } = this.state

        return (
            <IonPage>
                <IonHeader color="dark">
                    <IonToolbar>
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Enviar Reporte</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    {
                        loading == false
                            ?
                            <Fragment>
                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol><IonLabel>Título:</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol> <IonInput value={reportTitle} onIonChange={this.handleTitleChange} placeholder="Escribe el título del evento o incidente..." ></IonInput></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol><IonLabel>Descripción de la incidencia:</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol> <IonTextarea value={reportDescription} onIonChange={this.handleDescriptionChange} placeholder="Escribe la descripción del incidente o evento a reportar..."></IonTextarea></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>


                                <IonItem >
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol><IonLabel >Localización:</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol> <IonInput readonly value={location && `${location.lat}, ${location.lng}`}></IonInput></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>

                                {
                                    showPhotoPreview == true && reportPhoto
                                        ?
                                        <IonItem lines="none">
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol >
                                                        <IonLabel>Archivos adjuntos:</IonLabel>
                                                        <img style={{ height: '120px', width: '120px', marginTop: '10px', borderRadius: '5px' }} src={`data:image/jpeg;base64,${reportPhoto}`} />
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonItem>
                                        :
                                        <IonItem lines="none">
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol>
                                                        <IonButton onClick={this.handleTakePhotoBtn} color="light" expand="full"><IonIcon icon={cameraOutline}></IonIcon> Tomar Foto</IonButton>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonButton onClick={this.handleGalleryBtn} color="light" expand="full"><IonIcon icon={imagesOutline}></IonIcon> Galería</IonButton>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonItem>
                                }
                                <IonGrid style={{ bottom: '10px', position: 'absolute', width: "98%" }}>
                                    <IonRow>
                                        <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                            <ion-button disabled={this.state.showSentMessage} onClick={this.handleSendClick} expand="full" type="submit" className="ion-no-margin">Enviar Reporte</ion-button>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </Fragment>
                            :
                            <div className="spinnerCenter">
                                <IonSpinner name="crescent" style={{ textAlign: 'center' }} />
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

                    <IonToast
                        isOpen={showSentMessage}
                        message="Reporte enviado correctamente"
                        position="bottom"
                        color="success"
                        duration="2000"
                        onDidDismiss={() => this.setState({ showSentMessage: false })}
                    />
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, location }) {
    return {
        token: auth && auth.token,
        location: location && location,
    }
}

export default connect(mapStateToProps)(SendReport)