import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signup } from '../utils/api'
import { saveToken } from '../actions/auth'

import { IonGrid, IonRow, IonCol, IonNote, IonItem, IonIcon, 
    IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonLabel, IonButton,
    IonAlert
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons'
import ExploreContainer from '../components/ExploreContainer'
import { save } from 'ionicons/icons'
import { Plugins } from '@capacitor/core'
const { Modals } = Plugins

class Signup extends Component {

    state = {
        showAlert: false,
        alertMsg: '',
        alertTitle: ''
    }

    componentDidMount() {
        console.log(this.props.history)

    }
    
    showAlert = (msg, title) => {
        this.setState({showAlert: true, alertMsg: msg, alertTitle: title})
    }

    handleSubmit = async (e) => {
        const { device } = this.props

        e.preventDefault()

        const identification = e.target.identification.value
        const username = e.target.username.value
        const password = e.target.password.value
        const rpassword = e.target.rpassword.value
        const name = e.target.name.value
        const phone = e.target.phone.value
        const email = e.target.email.value
        const address = e.target.address.value
        const companyCode = e.target.companyCode.value

        // Check all required fields
        if (!identification || !username || !password || !rpassword || !name || !phone || !email 
            || !address || !companyCode    
        ) {
            this.showAlert('Ingresa todos los campos requeridos', 'Error')
            return
        }

        // Check Passwords
        if(password != rpassword) {
            this.showAlert('Las contraseñas ingresadas no coinciden', 'Error')
            return
        }

        // Check Email
        if(this.validateEmail(email) == false) {
            this.showAlert('Ingresa un email válido', 'Error')
            return
        }

        let response
        try {
            response = await signup({ 
                identification,
                username,
                password,
                name,
                phone,
                email,
                address,
                companyCode,
                imei: device && device.uuid,
                os: device && device.platform,
                battery: device && device.batteryLevel
            })
            response = await response.json()
            console.log(response)
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

    goToLogin = (e) => {
        e.preventDefault()
        this.props.history.replace('/login')
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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
                            <IonTitle>Registrar Cuenta</IonTitle>
                        </div>
                        <div style={{ padding: 15 }}>
                            <ion-item>
                                <ion-label position="stacked">Identificación:<ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="identification"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Usuario:<ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="username"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Contraseña: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="password" name="password"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Repetir Contraseña: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="password" name="rpassword"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Nombre Completo: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="name"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Teléfono: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="phone"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Email: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="email"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Dirección: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="address"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">ID Empresa: <ion-text color="danger">*</ion-text></ion-label>
                                <ion-input type="text" name="companyCode"></ion-input>
                            </ion-item>
                        </div>

                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" style={{ paddingBottom: '0px' }}>
                                    <ion-button expand="block" type="submit" className="ion-no-margin">Registrar Cuenta</ion-button>
                                </IonCol>
                            </IonRow>
                            
                            <IonRow style={{ marginTop: '5px' }}>
                                <IonCol style={{ textAlign: 'center' }}>
                                    <IonButton fill="clear" >
                                        <IonNote onClick={this.goToLogin} style={{ fontSize: '0.8em' }}>¿Ya tienes cuenta? Inicia sesión Aquí</IonNote>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>



                    </form>
                </ion-content>
                <IonAlert
                    isOpen={this.state.showAlert}
                    header={this.state.alertTitle}
                    message={this.state.alertMsg}
                    buttons={[{
                        text: 'OK',
                        handler: () => {
                            this.setState({showAlert: false})
                        }
                    }]}
                />
            </IonPage>
        )
    }
}

function mapStateToProps({ device }) {
    return {
        device: device.device
    }
}

export default connect(mapStateToProps)(Signup)