import Menu from './components/Menu';

import React, { Component } from 'react'
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StartTurn from './pages/StartTurn'
import EndTurn from './pages/EndTurn'
import RegisterCheckpoint from './pages/RegisterCheckpoint'
import Routes from './pages/Routes'
import Chat from './pages/Chat'
import ChatMembers from './pages/ChatMembers'
import SendReport from './pages/SendReport'
import SendBitacora from './pages/SendBitacora'
import HistorialBitacoras from './pages/HistorialBitacoras'
import HistorialReportes from './pages/HistorialReportes'
import Alert from './pages/Alert'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import Checkpoints from './pages/Checkpoints'
import HistorialAccesos from './pages/HistorialAccesos'
import Report from './pages/Report'
import Bitacora from './pages/Bitacora'

class App extends Component {

  state = {
    selectedPage: '',
    setSelectedPage: ''
  }

  render() {
    const { selectedPage, setSelectedPage } = this.state

    return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu selectedPage={selectedPage} />
            <IonRouterOutlet id="main">
              <Route path="/dashboard" component={Dashboard} />
              
              <Route path="/" render={() => <Redirect to="/login" />} exact={true} />
              <Route path="/login" component={Login} />
              <Route path="/startTurn" component={StartTurn} />
              <Route path="/endTurn" component={EndTurn} />
              <Route path="/registerCheckpoint" component={RegisterCheckpoint} />
              <Route path="/routes" component={Routes} />
              <Route path="/chat" component={Chat} />
              <Route path="/chatMembers" component={ChatMembers} />
              <Route path="/sendReport" component={SendReport} />
              <Route path="/sendBitacora" component={SendBitacora} />
              <Route path="/historialBitacoras" component={HistorialBitacoras} />
              <Route path="/historialReportes" component={HistorialReportes} />
              <Route path="/alert" component={Alert} />
              <Route path="/settings" component={Settings} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/checkpoints" component={Checkpoints} />
              <Route path="/historialAccesos" component={HistorialAccesos} />
              <Route path="/report" component={Report} />
              <Route path="/bitacora" component={Bitacora} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    );
  }
};

export default App;
