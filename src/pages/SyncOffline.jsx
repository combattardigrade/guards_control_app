import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signup } from '../utils/api'
import { saveToken } from '../actions/auth'

import {
    IonButtons,
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonGrid, IonRow,
    IonCol, IonIcon, IonNote, IonAlert, IonButton, IonSpinner
} from '@ionic/react';
import {
    chevronBackOutline, cloudUploadOutline
} from 'ionicons/icons'
import ExploreContainer from '../components/ExploreContainer'
import { save } from 'ionicons/icons'

// Api
import {
    registerAccess, completeCheckpoint, getRoutesByStatus,

} from '../utils/api'

// Actions
import { updateGuardStatus } from '../actions/guard'
import { saveNewAccessLog } from '../actions/accessLogs'
import { saveRoutes } from '../actions/routes'

// Plugins
import { Plugins } from '@capacitor/core'
const { Device } = Plugins;


class SyncOffline extends Component {

    state = {
        showAlert: false,
        alertMsg: '',
        alertTitle: '',
        accessLogsLoading: false,
        checkpointsLoading: false,
        reportsLoading: false,
        bitacorasLoading: false,
        userLocationsLoading: false,
    }

    componentDidMount() {

    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleSubmit = async (e) => {
        const { device } = this.props

        e.preventDefault()

    }

    handleBackBtn = () => {
        this.props.history.goBack()
    }


    handleUploadAccessLogs = async (e) => {
        e.preventDefault()
        console.log('UPLOAD_OFFLINE_ACCESS_LOGS')
        const { network, offlineData, dispatch } = this.props

        if (network && network.connected == true) {
            this.setState({ accessLogsLoading: true })
            for (let accessLog of offlineData.accessLogs) {
                try {
                    let data = await registerAccess(accessLog)
                    let res = await data.json()

                    if (res.status == 'OK') {
                        dispatch(updateGuardStatus(accessLog.accessType == 'ENTRY' ? 'ON_PATROL' : 'ON_STAND_BY'))
                        dispatch(saveNewAccessLog(res.payload))
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }
            console.log('REMOVE_OFFLINE_ACCESS_LOGS')
            this.setState({ accessLogsLoading: false })
        } else {
            this.showAlert('Sin conexión. No fue posible enviar los datos al servidor')
            return
        }
    }

    handleUploadCheckpoints = async (e) => {
        e.preventDefault()
        console.log('UPLOAD_OFFLINE_CHECKPOINTS')
        const { network, offlineData, dispatch, token } = this.props

        if (network && network.connected == true) {
            this.setState({ checkpointsLoading: true })
            for (let checkpoint of offlineData.checkpoints) {
                try {
                    await completeCheckpoint(checkpoint)                    
                }
                catch (e) {
                    console.log(e)
                }
            }
            console.log('REMOVE_OFFLINE_CHECKPOINTS')
            // Get Routes
            let data = await getRoutesByStatus({ status: 'ACTIVE', token })
            let res = await data.json()
            if (res.status == 'OK') {                
                dispatch(saveRoutes(res.payload))
            }
            this.setState({ checkpointsLoading: false })
        } else {
            this.showAlert('Sin conexión. No fue posible enviar los datos al servidor')
            return
        }
    }

    handleUploadReports = (e) => {
        e.preventDefault()
    }

    handleUploadBitacoras = (e) => {
        e.preventDefault()
    }

    handleUploadUserLocations = (e) => {
        e.preventDefault()
    }



    render() {

        const { offlineData } = this.props
        const {
            accessLogsLoading,
            checkpointsLoading,
            reportsLoading,
            bitacorasLoading,
            userLocationsLoading,
        } = this.state

        return (
            <IonPage>
                <IonHeader >
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Enviar Datos Locales</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonLabel >Registros de Acceso</IonLabel>
                                    <IonNote className="dataField">Guardados localmente</IonNote>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel>{offlineData && offlineData.accessLogs.length}</IonLabel>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    {
                                        accessLogsLoading
                                            ? <IonSpinner name="crescent" />
                                            : <IonButton onClick={this.handleUploadAccessLogs} disabled={offlineData && offlineData.accessLogs.length == 0 ? true : false} color="primary"><IonIcon icon={cloudUploadOutline}></IonIcon></IonButton>
                                    }
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonLabel >Puntos de Control</IonLabel>
                                    <IonNote className="dataField">Guardados localmente</IonNote>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel>{offlineData && offlineData.checkpoints.length}</IonLabel>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    {
                                        checkpointsLoading
                                            ? <IonSpinner name="crescent" />
                                            : <IonButton onClick={this.handleUploadCheckpoints} disabled={offlineData && offlineData.checkpoints.length == 0 ? true : false} color="primary"><IonIcon icon={cloudUploadOutline}></IonIcon></IonButton>
                                    }
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonLabel >Reportes</IonLabel>
                                    <IonNote className="dataField">Guardados localmente</IonNote>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel>{offlineData && offlineData.reports.length}</IonLabel>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    {
                                        reportsLoading
                                            ? <IonSpinner name="crescent" />
                                            : <IonButton onClick={this.handleUploadReports} disabled={offlineData && offlineData.reports.length == 0 ? true : false} color="primary"><IonIcon icon={cloudUploadOutline}></IonIcon></IonButton>
                                    }
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonLabel >Bitácoras</IonLabel>
                                    <IonNote className="dataField">Guardados localmente</IonNote>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel>{offlineData && offlineData.bitacoras.length}</IonLabel>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    {
                                        bitacorasLoading
                                            ? <IonSpinner name="crescent" />
                                            : <IonButton onClick={this.handleUploadBitacoras} disabled={offlineData && offlineData.bitacoras.length == 0 ? true : false} color="primary"><IonIcon icon={cloudUploadOutline}></IonIcon></IonButton>
                                    }
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <IonItem >
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonLabel >Registros de Localización</IonLabel>
                                    <IonNote className="dataField">Guardados localmente</IonNote>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    <IonLabel>{offlineData && offlineData.userLocations.length}</IonLabel>
                                </IonCol>
                                <IonCol size="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                    {
                                        userLocationsLoading
                                            ? <IonSpinner name="crescent" />
                                            : <IonButton onClick={this.handleUploadUserLocations} disabled={offlineData && offlineData.userLocations.length == 0 ? true : false} color="primary"><IonIcon icon={cloudUploadOutline}></IonIcon></IonButton>
                                    }
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>


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
        )
    }
}

function mapStateToProps({ auth, offlineData, network }) {
    return {
        token: auth && auth.token,
        offlineData,
        network,
    }
}

export default connect(mapStateToProps)(SyncOffline)