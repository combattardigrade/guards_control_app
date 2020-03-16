import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, micOutline, personCircleOutline,
    closeOutline,
} from 'ionicons/icons'

import './styles.css'


class ChatMembersModal extends Component {

    handleBackBtn = () => {
        this.props.history.goBack()
    }

    render() {

        const { chatMembers, showChatMembersModal, handleToggleChatMembersModal } = this.props
        const totalMembers = chatMembers ? Object.values(chatMembers).length : 0

        return (
            <IonModal isOpen={showChatMembersModal} >
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); handleToggleChatMembersModal(false) }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={closeOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Miembros del Chat</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonItem>
                        <IonTitle>{totalMembers} Participantes</IonTitle>
                    </IonItem>
                    {
                        chatMembers
                            ?
                            Object.values(chatMembers).map((member, index) => (
                                <IonItem key={index}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="2">
                                                <IonIcon icon={personCircleOutline} style={{ fontSize: '2.5em' }}></IonIcon>
                                            </IonCol>
                                            <IonCol size="10">
                                                <IonLabel className="dataTitle">{member.username}</IonLabel>
                                                <IonLabel className="dataField">{member.name}</IonLabel>
                                                <IonLabel className="dataField">{member.phone}</IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonItem>
                            ))
                            :
                            null
                    }
                </IonContent>
            </IonModal >

        )
    }
}

export default ChatMembersModal