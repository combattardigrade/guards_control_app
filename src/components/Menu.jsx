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
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  archiveOutline, archiveSharp, bookmarkOutline, heartOutline,
  heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
  trashOutline, trashSharp, warningOutline, warningSharp, personCircleOutline,
  flashlightOutline, globeOutline, settingsOutline
} from 'ionicons/icons';
import './Menu.css';
import { menuController } from '@ionic/core';

class Menu extends Component {
  goToPage = (page) => {
    this.props.history.push(page)
    menuController.close()
    return
  }
  render() {
    return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonRow>
              <IonCol size="2"><IonIcon style={{ fontSize: '50px' }} icon={personCircleOutline} /></IonCol>
              <IonCol size="8"><IonListHeader style={{ paddingTop: '10px' }}>Usuario</IonListHeader></IonCol>

            </IonRow>
          </IonList>

          <IonList id="labels-list">
            <IonListHeader>Menú</IonListHeader>

            <IonItem lines="none" >
              <IonIcon icon={flashlightOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Linterna</IonLabel>
              <IonToggle color="success" />
            </IonItem>

            <IonItem lines="none" >
              <IonIcon icon={globeOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Web de la Empresa</IonLabel>
            </IonItem>

            <IonItem lines="none" onClick={e => { e.preventDefault(); this.goToPage('settings') }}>
              <IonIcon icon={settingsOutline}></IonIcon>
              <IonLabel style={{ marginLeft: '10px' }}>Ajustes</IonLabel>
            </IonItem>
          </IonList>

          <IonItem lines="none" style={{ position: 'absolute', bottom: '20px', width: '100%' }} onClick={e => { e.preventDefault(); localStorage.clear(); this.goToPage('login') }} >
            <IonLabel style={{textAlign:'center'}}>Cerrar sesión</IonLabel>
          </IonItem>
        </IonContent>
      </IonMenu>
    );
  }

};

export default withRouter(Menu);
