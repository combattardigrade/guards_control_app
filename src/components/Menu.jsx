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
  flashlightOutline, globeOutline, settingsOutline, repeatOutline, layersOutline, folderOutline
} from 'ionicons/icons';
import './Menu.css';
import '../pages/styles.css'
import { menuController } from '@ionic/core';

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

  render() {
    const { guard } = this.props

    return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonRow>
              <IonCol size="2"><IonIcon style={{ fontSize: '50px' }} icon={personCircleOutline} /></IonCol>
              <IonCol size="8">
                <IonListHeader style={{ paddingTop: '0px' }}>{guard && guard.username}</IonListHeader>
                <IonLabel className="dataField" style={{ paddingLeft: '10px' }}>{guard && guard.company.name}</IonLabel>
              </IonCol>

            </IonRow>
          </IonList>

          <IonList id="labels-list">
            <IonListHeader>Menú</IonListHeader>

            <IonItem lines="none" >
              <IonIcon icon={flashlightOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Linterna</IonLabel>
              <IonToggle onIonChange={e => { e.preventDefault(); this.toggleFlashlight() }} color="success" />
            </IonItem>

            <IonItem lines="none" onClick={e => { e.preventDefault(); this.goToPage('/historialAccesos') }}>
              <IonIcon icon={repeatOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Historial de Accesos</IonLabel>
            </IonItem>

            <IonItem lines="none" onClick={e => { e.preventDefault(); this.goToPage('/historialReportes') }}>
              <IonIcon icon={layersOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Historial de Reportes</IonLabel>
            </IonItem>

            <IonItem lines="none" onClick={e => { e.preventDefault(); this.goToPage('/historialBitacoras') }}>
              <IonIcon icon={folderOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Historial de Bitácoras</IonLabel>
            </IonItem>

            <IonItem lines="none" onClick={e => {e.preventDefault(); this.goToWebsite(guard.company.website)}}>
              <IonIcon icon={globeOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Web de la Empresa</IonLabel>
            </IonItem>

            <IonItem lines="none" onClick={e => { e.preventDefault(); this.goToPage('settings') }}>
              <IonIcon icon={settingsOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Ajustes</IonLabel>
            </IonItem>
          </IonList>

          <IonItem lines="none" style={{ position: 'absolute', bottom: '20px', width: '100%' }} onClick={e => { e.preventDefault(); localStorage.clear(); this.goToPage('login') }} >
            <IonLabel style={{ textAlign: 'center' }}>Cerrar sesión</IonLabel>
          </IonItem>
        </IonContent>
      </IonMenu>
    );
  }

};

function mapStateToProps({ guard, company }) {
  return {
    guard,
    company
  }
}
export default withRouter(connect(mapStateToProps)(Menu))
