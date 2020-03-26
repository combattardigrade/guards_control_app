import Menu from './components/Menu.jsx';

import React, { Component } from 'react'
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import { Plugins } from '@capacitor/core';



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
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import StartTurn from './pages/StartTurn'
import EndTurn from './pages/EndTurn'
// import RegisterCheckpoint from './pages/RegisterCheckpointModal'
import Routes from './pages/Routes'
import Chat from './pages/Chat'
import SendReport from './pages/SendReport'
import SendBitacora from './pages/SendBitacora'
import HistorialBitacoras from './pages/HistorialBitacoras'
import HistorialReportes from './pages/HistorialReportes'
import Alert from './pages/Alert'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import Checkpoints from './pages/Checkpoints'
import HistorialAccesos from './pages/HistorialAccesos'
import SyncOffline from './pages/SyncOffline'
import CarTracking from './pages/CarTracking'

class App extends Component {

  state = {
    selectedPage: '',
    setSelectedPage: ''
  }

  render() {
    const { selectedPage, setSelectedPage } = this.state
    const { auth } = this.props

    return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu selectedPage={selectedPage} />
            <IonRouterOutlet id="main">
              

              <Route path="/" render={() => <Redirect to="/login" />} exact={true} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <PrivateRoute path='/dashboard' component={Dashboard} auth={auth}/>
              <PrivateRoute path='/startTurn' component={StartTurn} auth={auth}/>
              <PrivateRoute path='/endTurn' component={EndTurn} auth={auth}/>              
              <PrivateRoute path='/routes' component={Routes} auth={auth}/>
              <PrivateRoute path='/chat' component={Chat} auth={auth}/>              
              <PrivateRoute path="/sendReport" component={SendReport} auth={auth}/>
              <PrivateRoute path="/sendBitacora" component={SendBitacora} auth={auth} />
              <PrivateRoute path="/historialBitacoras" component={HistorialBitacoras} auth={auth}/>
              <PrivateRoute path="/historialReportes" component={HistorialReportes} auth={auth}/>
              <PrivateRoute path="/alert" component={Alert} auth={auth}/>
              <PrivateRoute path="/settings" component={Settings}auth={auth} />
              <PrivateRoute path="/notifications" component={Notifications} auth={auth}/>
              <PrivateRoute path="/checkpoints" component={Checkpoints} auth={auth}/>
              <PrivateRoute path="/historialAccesos" component={HistorialAccesos} auth={auth}/>
              <PrivateRoute path="/syncOffline" component={SyncOffline} auth={auth}/>
              <PrivateRoute path="/carTracking" component={CarTracking} auth={auth}/>
              
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    );
  }
};

function PrivateRoute({ component: Component, ...rest }) {
  const { auth } = rest
  return (
    <Route
      {...rest}
      render={props =>
        auth !== null ? (
          <Component {...props} />
        )
          : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location.pathname } // thanks a lot of the suggestion :)
              }}
            />
          )
      }
    />
  )
}

function mapStateToProps({ device, auth }) {
  return {
    device,
    auth
  }
}

export default connect(mapStateToProps)(App)
