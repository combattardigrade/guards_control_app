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
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline, closeCircle, micOutline
} from 'ionicons/icons'

// Styles
import './styles.css'


// Api
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { sendReport } from '../utils/api'

// Actions 
import { saveOfflineReport } from '../actions/offlineData'

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
        reportPhotos: [],
        showPhotoPreview: false,
        showSentMessage: false,
        titleRecognitionActive: false,
        descriptionRecognitionActive: false
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
        const { token, location, network, dispatch } = this.props
        const { reportTitle, reportDescription, reportPhotos } = this.state

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
            photoData: reportPhotos,
            token,
        }

        if (network && network.connected == true) {
            sendReport(params)
                .then(data => data.json())
                .then(res => {
                    console.log(res)
                    if (res.status == 'OK') {
                        // Clear report data
                        this.setState({
                            reportPhotos: '',
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
        } else {
            dispatch(saveOfflineReport(params))
            // Clear report data
            this.setState({
                reportPhotos: '',
                showPhotoPreview: false,
                reportTitle: '',
                reportDescription: '',
                loading: false,
                showSentMessage: true
            })
            return
        }
    }

    handleTakePhotoBtn = async (e) => {

        e.preventDefault()
        console.log('TAKE PHOTO BTN CLICKED')

        const options = {
            allowEditing: false,
            quality: 30,
            resultType: 'Base64',
            saveGallery: true,
            source: 'CAMERA',
            direction: 'REAR'
        }
        try {
            const photoData = await Camera.getPhoto(options)
            this.setState({ reportPhotos: [...this.state.reportPhotos, photoData.base64String], showPhotoPreview: true })
        }
        catch (err) {
            console.log(err)
            this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar añadir una fotografía')
            return
        }
    }

    handleGalleryBtn = async (e) => {
        e.preventDefault()
        console.log('GALLERY BTN CLICKED')

        const options = {
            allowEditing: false,
            quality: 30,
            resultType: 'Base64',
            source: 'PHOTOS'
        }

        try {
            const photoData = await Camera.getPhoto(options)
            this.setState({ reportPhotos: [...this.state.reportPhotos, photoData.base64String], showPhotoPreview: true })
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar añadir una foto', 'Error')
            return
        }
    }

    handleDeletePhoto = (photoIndex) => {
        const { reportPhotos } = this.state
        this.setState({
            reportPhotos: reportPhotos.filter((p, i) => i != photoIndex)
        })
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleTitleSpeech = async (e) => {
        e.preventDefault()
        console.log('TITLE SPEECH RECOGNITION STARTED')

        // Check if another speech recognition process is active
        if (this.state.titleRecognitionActive === true || this.state.descriptionRecognitionActive === true) {
            this.showAlert('Otro proceso de reconocimiento de voz se encuentra activo', 'Error')
            return
        }

        // Check if feature is available
        const available = await SpeechRecognition.isRecognitionAvailable()

        if (!available) {
            this.showAlert('Reconocimiento de voz no disponible', 'Error')
            return
        }

        // Check permission
        const hasPermission = await SpeechRecognition.hasPermission()
        if (!hasPermission) {
            console.log('SPEECH RECOGNITION DOES NOT HAVE PERMISSION')
            console.log('REQUESTING PERMISSION')
            await SpeechRecognition.requestPermission()
        }

        // Check if user provided permissions
        const hasPermission2ndCheck = await SpeechRecognition.hasPermission()
        if (!hasPermission2ndCheck) {
            this.showAlert('La aplicación no tiene permisos para realizar la acción', 'Error')
            return
        }

        this.setState({ titleRecognitionActive: true })

        // Configure options
        const options = {
            language: 'es-MX',
            matches: 500,
        }

        // Start the recognition process
        SpeechRecognition.startListening(options)
            .subscribe(
                (matches) => {
                    console.log(matches)
                    this.setState({ reportTitle: matches[0] })
                },
                (err) => {
                    console.log(err)
                    this.showAlert(err, 'Error')
                    this.setState({ titleRecognitionActive: false })
                }
            )
    }

    handleDescriptionSpeech = async (e) => {
        e.preventDefault()
        console.log('DESCRIPTION SPEECH RECOGNITION STARTED')

        // Check if another speech recognition process is active
        if (this.state.titleRecognitionActive === true || this.state.descriptionRecognitionActive === true) {
            this.showAlert('Otro proceso de reconocimiento de voz se encuentra activo', 'Error')
            return
        }

        // Check if feature is available
        const available = await SpeechRecognition.isRecognitionAvailable()

        if (!available) {
            this.showAlert('Reconocimiento de voz no disponible', 'Error')
            return
        }

        // Check permission
        const hasPermission = await SpeechRecognition.hasPermission()
        if (!hasPermission) {
            console.log('SPEECH RECOGNITION DOES NOT HAVE PERMISSION')
            console.log('REQUESTING PERMISSION')
            await SpeechRecognition.requestPermission()
        }

        // Check if user provided permissions
        const hasPermission2ndCheck = await SpeechRecognition.hasPermission()
        if (!hasPermission2ndCheck) {
            this.showAlert('La aplicación no tiene permisos para realizar la acción', 'Error')
            return
        }

        this.setState({ descriptionRecognitionActive: true })

        // Configure options
        const options = {
            language: 'es-MX',
            matches: 500,
        }

        // Start the recognition process
        SpeechRecognition.startListening(options)
            .subscribe(
                (matches) => {
                    console.log(matches)
                    this.setState({ reportDescription: matches[0] })
                },
                (err) => {
                    console.log(err)
                    this.showAlert(err, 'Error')
                    this.setState({ descriptionRecognitionActive: false })
                }
            )
    }

    handleStopTitleSpeech = async (e) => {
        e.preventDefault()
        console.log('TITLE SPEECH RECOGNITION STOPPED')
        SpeechRecognition.stopListening()
        this.setState({ titleRecognitionActive: false })
    }

    handleStopDescriptionSpeech = async (e) => {
        e.preventDefault()
        console.log('DESCRIPTION SPEECH RECOGNITION STOPPED')
        SpeechRecognition.stopListening()
        this.setState({ descriptionRecognitionActive: false })
    }

    render() {

        const { location } = this.props
        const { showPhotoPreview, reportPhotos, reportTitle, reportDescription, loading, showSentMessage } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Enviar Reporte de Anomalía</IonTitle>
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
                                            <IonCol> 
                                                <IonInput value={reportTitle} onIonChange={this.handleTitleChange} placeholder="Escribe el título del evento o incidente..." ></IonInput>
                                                {
                                                    this.state.titleRecognitionActive === false
                                                        ?
                                                        <IonButton onClick={this.handleTitleSpeech} color="dark"><IonIcon icon={micOutline}></IonIcon> Reconocimiento de Voz</IonButton>
                                                        :
                                                        <IonButton onClick={this.handleStopTitleSpeech} color="danger"><IonIcon icon={micOutline}></IonIcon>Detener Reconocimiento de Voz</IonButton>
                                                }
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol><IonLabel>Descripción de la incidencia:</IonLabel></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol> 
                                                <IonTextarea rows="3" value={reportDescription} onIonChange={this.handleDescriptionChange} placeholder="Escribe la descripción del incidente o evento a reportar..."></IonTextarea>
                                                {
                                                    this.state.descriptionRecognitionActive === false
                                                        ?
                                                        <IonButton onClick={this.handleDescriptionSpeech} color="dark"><IonIcon icon={micOutline}></IonIcon> Reconocimiento de Voz</IonButton>
                                                        :
                                                        <IonButton onClick={this.handleStopDescriptionSpeech} color="danger"><IonIcon icon={micOutline}></IonIcon>Detener Reconocimiento de Voz</IonButton>
                                                }
                                            </IonCol>
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

                                {
                                    showPhotoPreview == true && reportPhotos.length > 0
                                        ?                                        
                                        <IonItem lines="none">
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol>
                                                        <IonLabel className="dataTitle">Archivos adjuntos:</IonLabel>
                                                    </IonCol>
                                                </IonRow>
                                                <IonRow>
                                                    {
                                                        reportPhotos.map((photo, i) => (
                                                            <IonCol size="3" key={i}>
                                                                <IonButton onClick={e => { e.preventDefault(); this.handleDeletePhoto(i) }} color="danger" style={{ position: 'absolute', right: '0' }} fill="clear"><IonIcon icon={closeCircle}></IonIcon></IonButton>
                                                                <img style={{ height: '100%', width: '100%', marginTop: '10px', borderRadius: '5px' }} src={`data:image/jpeg;base64,${photo}`} />
                                                            </IonCol>
                                                        ))
                                                    }
                                                </IonRow>
                                            </IonGrid>
                                        </IonItem>
                                        :
                                        null
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


function mapStateToProps({ auth, location, network }) {
    return {
        token: auth && auth.token,
        location: location && location,
        network: network && network
    }
}

export default connect(mapStateToProps)(SendReport)