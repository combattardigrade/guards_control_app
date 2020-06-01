import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonGrid, IonRow, IonCol, IonNote, IonItem, IonIcon, IonHeader,
    IonMenuButton, IonPage, IonTitle, IonToolbar, IonLabel, IonButton,
    IonAlert, withIonLifeCycle, IonCheckbox, IonInput
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons'
import ExploreContainer from '../components/ExploreContainer'
import { save } from 'ionicons/icons'

// Actions
import { saveToken, saveCredentials, removeCredentials } from '../actions/auth'
import { saveDeviceData } from '../actions/device'
import { saveNetworkData } from '../actions/network'

// API
import { login, codeLogin } from '../utils/api'

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Plugins } from '@capacitor/core';
const { Device, Network } = Plugins;

class Login extends Component {

    state = {
        username: '',
        password: '',
        rememberAccount: false,
        showAlert: false,
        alertMsg: '',
        alertTitle: ''
    }

    ionViewDidEnter() {
        const { token } = this.props

        if (token) {
            this.props.history.replace('/dashboard')
            return
        }
    }

    componentDidMount() {
        const { credentials, dispatch } = this.props
        this.setState({ username: credentials ? credentials.username : '', password: credentials ? credentials.password : '' })

        Device.getInfo()
            .then((info) => {
                dispatch(saveDeviceData(info))
            })

        Network.getStatus()
            .then((status) => {                
                dispatch(saveNetworkData(status))
            })
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const { username, password, rememberAccount } = this.state
        const { network, dispatch } = this.props

        if (!username || !password) {
            this.showAlert('Ingresa todos los campos requeridos', 'Error')
            return
        }

        if (!network || !network.connected) {
            // save offline token
            this.props.dispatch(saveToken('OFFLINE_TOKEN'))
            // redirect to dashboard
            this.props.history.replace('/dashboard')
        }

        let response
        try {
            response = await (await login({ username: username, password: password })).json()
        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar realizar la acción. Por favor, inténtalo nuevamente.', 'Error')
            return
        }

        if (response.status != 'OK') {
            this.showAlert('message' in response ? response.message : 'Ocurrió un error al intentar realizar la acción. Por favor, inténtalo nuevamente.', 'Error')
            return
        }

        // remember account
        rememberAccount
            ? dispatch(saveCredentials({ username, password }))
            : dispatch(removeCredentials())

        // save jwt
        dispatch(saveToken(response.token))

        // redirect to dashboard
        this.props.history.replace('/dashboard')
    }

    handleUsernameChange = (e) => this.setState({ username: e.target.value })
    handlePasswordChange = (e) => this.setState({ password: e.target.value })

    handleScanner = async (e) => {

        e.preventDefault()
        console.log('QR SCANNER STARTED')
        const { dispatch } = this.props

        try {
            const data = await BarcodeScanner.scan({ preferFrontCamera: false, formats: 'QR_CODE', showTorchButton: true })
            console.log(`Barcode data: ${data.text}`)
            const code = data.text

            codeLogin({ code: code })
                .then(data => data.json())
                .then(res => {
                    console.log(res)
                    if (res.status == 'OK') {
                        // save jwt
                        dispatch(saveToken(res.token))
                        // redirect to dashboard
                        this.props.history.replace('/dashboard')
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.showAlert('message' in err ? err.message : 'Ocurrió un error al intentar iniciar sesión con el código QR', 'Error')
                    return
                })

        }
        catch (err) {
            console.log(err)
            this.showAlert('Ocurrió un error al intentar escanear el código QR.', 'Error')
            return
        }
    }

    goToSignup = (e) => {
        e.preventDefault()
        this.props.history.push('/signup')
    }


    render() {

        return (
            <IonPage>


                <ion-content >
                    <form>
                        <div style={{ textAlign: 'center' }}>
                            <IonIcon style={{ fontSize: '6em', paddingTop: '40px' }} icon={personCircleOutline}></IonIcon>

                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <IonTitle>Iniciar Sesión</IonTitle>
                        </div>
                        <div style={{ padding: '15 15 0 15' }}>
                            <ion-item>
                                <ion-label position="stacked">Usuario:<ion-text color="danger">*</ion-text></ion-label>
                                <IonInput value={this.state.username} onIonChange={this.handleUsernameChange} type="text" ></IonInput>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Contraseña: <ion-text color="danger">*</ion-text></ion-label>
                                <IonInput value={this.state.password} onIonChange={this.handlePasswordChange} type="password" ></IonInput>
                            </ion-item>

                            <IonItem lines="none">
                                <IonCheckbox color="primary" checked={this.state.rememberAccount} onIonChange={e => this.setState({ rememberAccount: !this.state.rememberAccount })} />
                                <IonLabel style={{ paddingLeft: '15px' }}>Recordar credenciales</IonLabel>
                            </IonItem>
                        </div>

                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                    <IonButton onClick={this.handleSubmit} expand="block" className="ion-no-margin">Iniciar sesión</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </form>

                    <IonGrid style={{ paddingTop: '0px' }}>
                        <IonRow>
                            <IonCol size="12" style={{ paddingTop: '0px' }}>
                                <ion-button onClick={this.handleScanner} color="dark" expand="block" className="ion-no-margin">Escanear código qr</ion-button>
                            </IonCol>
                        </IonRow>
                        <IonRow >
                            <IonCol style={{ textAlign: 'center' }}>
                                <IonButton fill="clear" >
                                    <IonNote onClick={this.goToSignup} style={{ fontSize: '0.8em' }}>¿No tienes cuenta? Registrate Aquí</IonNote>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </ion-content>
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
            </IonPage>
        )
    }
}

function mapStateToProps({ auth }) {
    return {
        token: auth && auth.token,
        credentials: auth && auth.credentials
    }
}

export default connect(mapStateToProps)(withIonLifeCycle(Login))