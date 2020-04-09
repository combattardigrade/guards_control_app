import React, { Component } from 'react'
import { connect } from 'react-redux'

import { saveToken } from '../actions/auth'

import {
    IonGrid, IonRow, IonCol, IonNote, IonItem, IonIcon, IonHeader,
    IonMenuButton, IonPage, IonTitle, IonToolbar, IonLabel, IonButton,
    IonAlert, withIonLifeCycle
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons'
import ExploreContainer from '../components/ExploreContainer'
import { save } from 'ionicons/icons'

// API
import { login, codeLogin } from '../utils/api'

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

class Login extends Component {

    state = {
        showAlert: false,
        alertMsg: '',
        alertTitle: ''
    }

    ionViewDidEnter() {
        const { token } = this.props

        if(token) {
            this.props.history.replace('/dashboard')
            return
        }
    }

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        const username = e.target.username.value
        const password = e.target.password.value

        if (!username || !password) {
            this.showAlert('Ingresa todos los campos requeridos', 'Error')
            return
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
        // save jwt
        this.props.dispatch(saveToken(response.token))

        // redirect to dashboard
        this.props.history.replace('/dashboard')
    }

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
                    <form onSubmit={this.handleSubmit} style={{}}>
                        <div style={{ textAlign: 'center' }}>
                            <IonIcon style={{ fontSize: '6em', paddingTop: '40px' }} icon={personCircleOutline}></IonIcon>

                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <IonTitle>Iniciar Sesión</IonTitle>
                        </div>
                        <div style={{ padding: 15 }}>
                            <ion-item>
                                <ion-label position="stacked">Usuario:<ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="username"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Contraseña: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="password" name="password"></ion-input>
                            </ion-item>
                        </div>

                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                    <ion-button expand="block" type="submit" className="ion-no-margin">Iniciar sesión</ion-button>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </form>

                    <IonGrid style={{paddingTop: '0px'}}>
                        <IonRow>
                            <IonCol size="12" style={{ paddingTop: '0px' }}>
                                <ion-button onClick={this.handleScanner} color="dark" expand="block" type="submit" className="ion-no-margin">Escanear código qr</ion-button>
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
    }
}

export default connect(mapStateToProps)(withIonLifeCycle(Login))