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
    documentAttachOutline, chevronBackOutline, searchOutline, imagesOutline
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
        bitacoraPhoto: '',
        showPhotoPreview: false,
        showSentMessage: false,
        showSuccessModal: false,
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
        const { activitiesDescription, incidentsDescription, bitacoraPhoto } = this.state

        if (!activitiesDescription || !incidentsDescription) {
            this.showAlert('Ingresa todos los campos requeridos', 'Error')
            return
        }

        this.setState({ loading: true })

        const params = {
            resumenActividades: activitiesDescription,
            resumenIncidencias: incidentsDescription,
            photoData: bitacoraPhoto,
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
                            photoData: '',
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
                photoData: '',
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
        console.log('TAKE PHOTO BTN CLICKed')

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
            this.setState({ bitacoraPhoto: photoData.base64String, showPhotoPreview: true })
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
            this.setState({ bitacoraPhoto: photoData.base64String, showPhotoPreview: true })
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
        const { showPhotoPreview, bitacoraPhoto, loading, showSentMessage, activitiesDescription, incidentsDescription } = this.state

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
                                                <IonTextarea onIonChange={this.handleActivitiesChange} value={activitiesDescription} className="dataField" placeholder="Escribe el texto aquí..."></IonTextarea>

                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>

                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="12" >
                                                <IonLabel className="dataTitle" style={{ maxWidth: 'unset' }}>Resumen de Incidencias del día:</IonLabel>
                                                <IonTextarea onIonChange={this.handleIncidentsChange} value={incidentsDescription} className="dataField" placeholder="Escribe el texto aquí..."></IonTextarea>
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
                                {
                                    showPhotoPreview == true && bitacoraPhoto
                                        ?
                                        <IonItem lines="none">
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol >
                                                        <IonLabel>Archivos adjuntos:</IonLabel>
                                                        <img style={{ height: '120px', width: '120px', marginTop: '10px', borderRadius: '5px' }} src={`data:image/jpeg;base64,${bitacoraPhoto}`} />
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