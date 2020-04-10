import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, IonTextarea, IonSpinner,
    IonAlert, IonToast
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline, closeCircle, micOutline
} from 'ionicons/icons'

// Styles
import './styles.css'

// Api
import { sendBitacora } from '../utils/api'

// Actions
import { saveOfflineBitacora } from '../actions/offlineData'

// Components
import SuccessModal from './SuccessModal'

// Plugins
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Plugins } from '@capacitor/core'
const { Camera } = Plugins

const moment = require('moment')

class SendBitacora extends Component {

    state = {
        loading: false,
        showAlert: false,
        alertTitle: '',
        alertDescription: '',
        activitiesDescription: '',
        incidentsDescription: '',
        bitacoraPhotos: [],
        showPhotoPreview: false,
        showSentMessage: false,
        showSuccessModal: false,
        actividadesRecognitionActive: false,
        incidenciasRecognitionActive: false
    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    handleSuccessModalBtn = () => {
        this.setState({ showSuccessModal: false })
        this.props.history.replace('/dashboard')
    }

    handleActivitiesChange = (e) => {
        this.setState({ activitiesDescription: e.target.value })
    }

    handleIncidentsChange = (e) => {
        this.setState({ incidentsDescription: e.target.value })
    }

    handleSendClick = (e) => {
        e.preventDefault()
        console.log('SEND BITACORA BTN CLICKED')
        const { token, network, dispatch } = this.props
        const { activitiesDescription, incidentsDescription, bitacoraPhotos } = this.state

        if (!activitiesDescription || !incidentsDescription) {
            this.showAlert('Ingresa todos los campos requeridos', 'Error')
            return
        }

        this.setState({ loading: true })

        const params = {
            resumenActividades: activitiesDescription,
            resumenIncidencias: incidentsDescription,
            photoData: bitacoraPhotos,
            token,
        }
        if (network && network.connected == true) {
            sendBitacora(params)
                .then(data => data.json())
                .then(res => {
                    console.log(res)
                    if (res.status == 'OK') {
                        // Clear bitacora data
                        this.setState({
                            bitacoraPhotos: [],
                            showPhotoPreview: false,
                            activitiesDescription: '',
                            incidentsDescription: '',
                            loading: false,
                            showSentMessage: true
                        })
                        return
                    } else if (res.status == 'ERROR') {
                        this.showAlert('message' in res ? res.message : 'Ocurrió un error al intentar enviar la bitácora diaria')
                        this.setState({ loading: false })
                        return
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar enviar el bitácora diaria')
                    this.setState({ loading: false })
                    return
                })
        } else {
            dispatch(saveOfflineBitacora(params))
            // Clear bitacora data
            this.setState({
                bitacoraPhotos: [],
                showPhotoPreview: false,
                activitiesDescription: '',
                incidentsDescription: '',
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
            this.setState({ bitacoraPhotos: [...this.state.bitacoraPhotos, photoData.base64String], showPhotoPreview: true })
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
            this.setState({ bitacoraPhotos: [...this.state.bitacoraPhotos, photoData.base64String], showPhotoPreview: true })
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar añadir una foto', 'Error')
            return
        }
    }

    handleDeletePhoto = (photoIndex) => {
        const { bitacoraPhotos } = this.state
        this.setState({
            bitacoraPhotos: bitacoraPhotos.filter((p, i) => i != photoIndex)
        })
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleIncidenciasSpeech = async (e) => {
        e.preventDefault()
        console.log('INCIDENCIAS SPEECH RECOGNITION STARTED')

        // Check if another speech recognition process is active
        if (this.state.actividadesRecognitionActive === true || this.state.incidenciasRecognitionActive === true) {
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

        this.setState({ incidenciasRecognitionActive: true })

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
                    this.setState({ incidentsDescription: matches[0] })
                },
                (err) => {
                    console.log(err)
                    this.showAlert(err, 'Error')
                    this.setState({ incidenciasRecognitionActive: false })
                }
            )

    }

    handleActividadesSpeech = async (e) => {
        e.preventDefault()
        console.log('ACTIVIDADES SPEECH RECOGNITION STARTED')

        // Check if another speech recognition process is active
        if (this.state.actividadesRecognitionActive === true || this.state.incidenciasRecognitionActive === true) {
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

        this.setState({ actividadesRecognitionActive: true })

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
                    this.setState({ activitiesDescription: matches[0] })
                },
                (err) => {
                    console.log(err)
                    this.showAlert(err, 'Error')
                    this.setState({ actividadesRecognitionActive: false })
                }
            )
    }

    handleStopIncidenciasSpeech = async (e) => {
        e.preventDefault()
        console.log('INCIDENCIAS SPEECH RECOGNITION STOPPED')
        SpeechRecognition.stopListening()
        this.setState({ incidenciasRecognitionActive: false })
    }

    handleStopActividadesSpeech = async (e) => {
        e.preventDefault()
        console.log('ACTIVIDADES SPEECH RECOGNITION STOPPED')
        SpeechRecognition.stopListening()
        this.setState({ actividadesRecognitionActive: false })
    }

    render() {
        const { showPhotoPreview, bitacoraPhotos, loading, showSentMessage, activitiesDescription, incidentsDescription } = this.state

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Enviar Registro Diario</IonTitle>
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
                                            <IonCol size="12">
                                                <IonLabel className="dataTitle" style={{ maxWidth: 'unset' }}>Resumen de Actividades del día:</IonLabel>
                                                <IonTextarea rows="2" onIonChange={this.handleActivitiesChange} value={activitiesDescription} className="dataField" placeholder="Escribe el texto aquí..."></IonTextarea>
                                                {
                                                    this.state.actividadesRecognitionActive === false
                                                        ?
                                                        <IonButton onClick={this.handleActividadesSpeech} color="dark"><IonIcon icon={micOutline}></IonIcon> Reconocimiento de Voz</IonButton>
                                                        :
                                                        <IonButton onClick={this.handleStopActividadesSpeech} color="danger"><IonIcon icon={micOutline}></IonIcon>Detener Reconocimiento de Voz</IonButton>
                                                }
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>

                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="12" >
                                                <IonLabel className="dataTitle" style={{ maxWidth: 'unset' }}>Resumen de Incidencias del día:</IonLabel>
                                                <IonTextarea rows="2" onIonChange={this.handleIncidentsChange} value={incidentsDescription} className="dataField" placeholder="Escribe el texto aquí..."></IonTextarea>
                                                {
                                                    this.state.incidenciasRecognitionActive === false
                                                        ?
                                                        <IonButton onClick={this.handleIncidenciasSpeech} color="dark"><IonIcon icon={micOutline}></IonIcon> Reconocimiento de Voz</IonButton>
                                                        :
                                                        <IonButton onClick={this.handleStopIncidenciasSpeech} color="danger"><IonIcon icon={micOutline}></IonIcon>Detener Reconocimiento de Voz</IonButton>
                                                }

                                            </IonCol>
                                        </IonRow>

                                    </IonGrid>
                                </IonItem>

                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonLabel className="dataTitle">Fecha del registro:</IonLabel>
                                                <IonInput className="dataField" readonly value={moment().format('DD/MM/YY')}></IonInput>
                                            </IonCol>
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
                                    showPhotoPreview == true && bitacoraPhotos.length > 0
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
                                                        bitacoraPhotos.map((photo, i) => (
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
                                            <ion-button disabled={this.state.showSentMessage} onClick={this.handleSendClick} expand="full" type="submit" className="ion-no-margin">Enviar Bitácora</ion-button>
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
                        message="Bitácora enviada correctamente"
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


function mapStateToProps({ auth, network }) {
    return {
        token: auth && auth.token,
        network
    }
}

export default connect(mapStateToProps)(SendBitacora)