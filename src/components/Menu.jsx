import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRow,
  IonCol,
  IonToggle,
  IonButton
} from '@ionic/react';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  archiveOutline, archiveSharp, bookmarkOutline, heartOutline,
  heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
  trashOutline, trashSharp, warningOutline, warningSharp, personCircleOutline,
  flashlightOutline, globeOutline, settingsOutline, repeatOutline, layersOutline, folderOutline, carOutline
} from 'ionicons/icons';
import './Menu.css';
import '../pages/styles.css'
import { menuController } from '@ionic/core';

// Actions
import { userLogout } from '../actions/auth'

//  Plugins
import { Flashlight } from '@ionic-native/flashlight';
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;


class Menu extends Component {
  goToPage = (page) => {
    this.props.history.push(page)
    menuController.close()
    return
  }

  toggleFlashlight = () => {
    console.log('flashlight')
    Flashlight.toggle(function () { }, function () { }, { intensity: 0.9 })
  }

  goToWebsite = async (url) => {
    await Browser.open({ url });
  }

  handleUserLogout = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(userLogout())
   // this.goToPage('login')
  }

  render() {
    const { guard, company } = this.props
    

    return (
      <IonMenu contentId="main" type="overlay" disabled={this.props.location.pathname !== '/dashboard' ? true : false}>
        <IonContent>
          <IonList id="inbox-list">
            <IonRow>
              <IonCol size="2"><IonIcon style={{ fontSize: '50px' }} icon={personCircleOutline} /></IonCol>
              <IonCol size="8">
                <IonListHeader style={{ paddingTop: '0px' }}>{guard && 'username' in guard ? guard.username : 'No disponible'}</IonListHeader>
                <IonLabel className="dataField" style={{ paddingLeft: '10px' }}>{company && 'name' in company ? company.name : 'No disponible'}</IonLabel>
              </IonCol>

            </IonRow>
          </IonList>

          <IonList id="labels-list">
            <IonListHeader>Menú</IonListHeader>

            <IonItem lines="full" >
              <IonIcon icon={flashlightOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Linterna</IonLabel>
              <IonToggle onIonChange={e => { e.preventDefault(); this.toggleFlashlight() }} color="success" />
            </IonItem>

            <IonItem lines="full" button onClick={e => { e.preventDefault(); this.goToPage('/historialAccesos') }}>
              <IonIcon icon={repeatOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Historial de Accesos</IonLabel>
            </IonItem>

            <IonItem lines="full" button onClick={e => { e.preventDefault(); this.goToPage('/historialReportes') }}>
              <IonIcon icon={layersOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Historial de Anomalías</IonLabel>
            </IonItem>

            <IonItem lines="full" button onClick={e => { e.preventDefault(); this.goToPage('/historialBitacoras') }}>
              <IonIcon icon={folderOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Historial de Bitácoras</IonLabel>
            </IonItem>

            <IonItem lines="full" button onClick={e => { e.preventDefault(); this.goToWebsite(guard.company.website) }}>
              <IonIcon icon={globeOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Web de la Empresa</IonLabel>
            </IonItem>

            <IonItem lines="full" button onClick={e => { e.preventDefault(); this.goToPage('/carTracking') }}>
              <IonIcon icon={carOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Seguimiento de Vehículo</IonLabel>
            </IonItem>

            <IonItem lines="full" button onClick={e => { e.preventDefault(); this.goToPage('settings') }}>
              <IonIcon icon={settingsOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Ajustes</IonLabel>
            </IonItem>
          </IonList>

          <IonItem lines="none" button style={{ position: 'absolute', bottom: '20px', width: '100%' }} onClick={this.handleUserLogout} >
            <IonLabel style={{ textAlign: 'center' }}>Cerrar sesión</IonLabel>
          </IonItem>
        </IonContent>
      </IonMenu>
    );
  }

};

function mapStateToProps({ guard }) {
  return {
    guard: guard && guard,
    company: guard ? 'company' in guard ? guard.company : null : null
  }
}
export default withRouter(connect(mapStateToProps)(Menu))
