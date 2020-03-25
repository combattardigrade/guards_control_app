import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import socketIOClient from 'socket.io-client'
import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, withIonLifeCycle
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, micOutline, sendOutline
} from 'ionicons/icons'

// Styles
import './styles.css'

// Components
import ChatMembersModal from './ChatMembersModal'

// Api
import { sendMessage, getCompanyActiveMembers, sendAudioMessage, API } from '../utils/api'

// Actions
import { saveNewChatMessage } from '../actions/chatMessages'
import { saveChatMembers } from '../actions/chatMembers'

// Plugins
import { MediaCapture } from '@ionic-native/media-capture'

const moment = require('moment')

const endpoint = 'http://genesisblock.ddns.net:2053'
const socket = socketIOClient(endpoint)

class Chat extends Component {
    messagesEnd = React.createRef()

    state = {
        isTyping: false,
        textMsg: '',
        showChatMembersModal: false,
        goBack: false,
    }

    handleBackBtn = () => {
        this.setState({ goBack: true })
        this.props.history.goBack()
    }

    handleTextMsgChange = (e) => {
        e.preventDefault()
        if (e.target.value.length == 0) {
            this.setState({ textMsg: e.target.value, isTyping: false })
        } else {
            this.setState({ textMsg: e.target.value, isTyping: true })
        }
    }

    handleSendTextMsg = (e) => {
        e.preventDefault()
        const { textMsg } = this.state
        const { token, company, dispatch } = this.props
        sendMessage({ messageText: textMsg, token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    console.log(res)

                    // Send message through sockets
                    socket.emit('message', {
                        room: company.id,
                        msg: res.payload,
                    })

                    // Clear message
                    this.setState({ textMsg: '', isTyping: false })

                    // Save message in locaStorage
                    dispatch(saveNewChatMessage(res.payload))
                }
            })
    }

    handleRecAudioMsg = (e) => {
        e.preventDefault()
        console.log('RECORDING_AUDIO_MESSAGE')
        const { token, company, dispatch } = this.props
        MediaCapture.captureAudio({ limit: 1, duration: 30 })
            .then(
                (mediaFile) => {
                    console.log(mediaFile)
                    const audioFile = mediaFile[0]
                    const fileReader = new FileReader()

                    fileReader.onload = function (readerEvt) {
                        const audioBase64 = readerEvt.target.result
                        // Send audio message to server                      

                        sendAudioMessage({ audioData: audioBase64, token })
                            .then(data => data.json())
                            .then(res => {
                                if (res.status == 'OK') {
                                    console.log(res)

                                    // Send audio message through sockets                                    
                                    socket.emit('message', {
                                        room: company.id,
                                        msg: res.payload,
                                    })
                                    
                                    // Save message in locaStorage
                                    dispatch(saveNewChatMessage(res.payload))
                                }
                            })

                    }
                    let file = new window.File(audioFile.name, audioFile.localURL, audioFile.type, audioFile.lastModifiedDate, audioFile.size);
                    fileReader.readAsDataURL(file)
                },
                (err) => {
                    console.error(err)
                }
            )
    }

    ionViewWillEnter() {
        const { company, dispatch, token } = this.props

        // Get Chat Members
        getCompanyActiveMembers({ companyId: company.id, token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    dispatch(saveChatMembers(res.payload.users))
                }
            })

        socket.on('connect', () => {
            console.log(`Connection to sockets server stablished correctly...`)
            // Join company's chat room
            socket.emit('joinRoom', company.id)
            console.log('Joining chat room...')
        })

        socket.on('joined', (data) => {
            console.log(`Joined room ${data}`)
        })

        // Listen for new messages
        socket.on('message', (data) => {
            console.log('New message received: ', data.msg)
            // save message
            dispatch(saveNewChatMessage(data.msg))
        })

        // Scroll to bottom
        setTimeout(() => {
            this.scrollToBottom()
        }, 500)
    }

    componentDidUpdate() {
        // Do not scroll when going back to previous page
        if (this.state.goBack == true) return
        // Scroll to bottom
        setTimeout(() => {
            this.scrollToBottom()
        }, 500)
    }

    scrollToBottom = () => {
        this.messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }

    handleToggleChatMembersModal = (value) => {
        this.setState({ showChatMembersModal: value })
    }

    render() {

        const { isTyping, textMsg } = this.state
        const { guard, chatMessages, chatMembers } = this.props
        const totalMessages = Object.values(chatMessages).length

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" onClick={e => { e.preventDefault(); this.handleBackBtn() }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={chevronBackOutline}></IonIcon>
                        </IonButtons>
                        <IonTitle>Chat</IonTitle>
                        <IonButtons slot="end" onClick={e => { e.preventDefault(); this.handleToggleChatMembersModal(true) }}>
                            <IonIcon style={{ fontSize: '28px' }} icon={peopleOutline}></IonIcon>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent scrollEvents={true}>

                    {
                        chatMessages
                            ?
                            Object.values(chatMessages).map((message, index) => {
                                if (message.userId == guard.id) {
                                    if (message.messageType == 'text') {
                                        return (
                                            <Fragment key={index}>
                                                <IonItem className={index + 1 == totalMessages && 'lastMessage'} lines="none" ref={index + 1 == totalMessages && (this.messagesEnd)}>
                                                    <IonGrid>
                                                        <IonRow>
                                                            <IonCol size="8" offset="4" style={{ backgroundColor: '#2dd36f', borderRadius: '5px', padding: '5px 10px', textAlign: 'right', borderBottom: '2px solid rgb(35, 179, 93)' }}>
                                                                <IonLabel style={{ whiteSpace: 'normal', fontSize: '.9em', color: 'white', }}>{message.messageText}</IonLabel>
                                                                <IonLabel style={{ whiteSpace: 'normal', fontSize: '.6em', marginTop: '5px', color: 'white', textAlign: 'right' }}>{moment(message.createdAt).fromNow()} </IonLabel>
                                                            </IonCol>
                                                        </IonRow>
                                                    </IonGrid>
                                                </IonItem>
                                            </Fragment>
                                        )
                                    } else if (message.messageType == 'audio') {
                                        return (
                                            <Fragment key={index}>
                                                <IonItem className={index + 1 == totalMessages && 'lastMessage'} lines="none" ref={index + 1 == totalMessages && (this.messagesEnd)}>
                                                    <IonGrid>
                                                        <IonRow>
                                                            <IonCol size="8" offset="4" style={{ borderRadius: '5px', padding: '5px 0px', textAlign: 'right', }}>
                                                                <audio volume='1' controls style={{ width: '100%' }}><source src={API + '/audio/' + message.audioId} /></audio>
                                                                <IonLabel style={{ whiteSpace: 'normal', fontSize: '.6em', marginTop: '5px', textAlign: 'right' }}>{moment(message.createdAt).fromNow()} </IonLabel>
                                                            </IonCol>
                                                        </IonRow>
                                                    </IonGrid>
                                                </IonItem>
                                            </Fragment>
                                        )
                                    }
                                } else {
                                    if (message.messageType == 'text') {
                                        return (
                                            <Fragment key={index}>
                                                <IonItem className={index + 1 == totalMessages && 'lastMessage'} lines="none" ref={index + 1 == totalMessages && (this.messagesEnd)} >
                                                    <IonGrid>
                                                        <IonRow>
                                                            <IonCol size="8" style={{ backgroundColor: '#f4f5f8', borderRadius: '5px', padding: '5px 10px', textAlign: 'left', borderBottom: '2px solid rgba(126, 124, 124, 0.26)' }}>
                                                                <IonLabel style={{ whiteSpace: 'normal', fontSize: '.9em' }}>{message.messageText}</IonLabel>
                                                                <IonLabel style={{ whiteSpace: 'normal', fontSize: '.6em', marginTop: '5px' }}>{'user' in message && message.user.username} • {moment(message.createdAt).fromNow()} </IonLabel>
                                                            </IonCol>
                                                        </IonRow>
                                                    </IonGrid>
                                                </IonItem>
                                            </Fragment>
                                        )
                                    } else if (message.messageType == 'audio') {
                                        return (
                                            <Fragment key={index}>
                                                <IonItem className={index + 1 == totalMessages && 'lastMessage'} lines="none" ref={index + 1 == totalMessages && (this.messagesEnd)}>
                                                    <IonGrid>
                                                        <IonRow>
                                                            <IonCol size="8" style={{ borderRadius: '5px', padding: '5px 0px', textAlign: 'left' }}>
                                                                <audio volume='1' controls style={{ width: '100%' }}><source src={API + '/audio/' + message.audioId} /></audio>
                                                                <IonLabel style={{ whiteSpace: 'normal', fontSize: '.6em', marginTop: '5px' }}>{'user' in message && message.user.username} • {moment(message.createdAt).fromNow()} </IonLabel>
                                                            </IonCol>
                                                        </IonRow>
                                                    </IonGrid>
                                                </IonItem>
                                            </Fragment>
                                        )
                                    }
                                }
                            })
                            :
                            <IonItem>No se encontraron mensajes</IonItem>
                    }


                    <IonItem color="light" lines="none" style={{ position: 'fixed', bottom: '0px', borderTop: '1px solid #dedede', width: '100%', zIndex: '20' }}>
                        <IonGrid>
                            <IonRow>

                                <IonCol size="11">
                                    <IonInput className="chatInput" onIonChange={this.handleTextMsgChange} placeholder="Ingresa tu mensaje..." value={textMsg} style={{ background: 'white', border: '1px solid rgb(214, 214, 216)' }}></IonInput>
                                </IonCol>
                                <IonCol size="1" style={{ padding: '0px', margin: '0px 0px 0px 0px', }}>

                                    {
                                        isTyping == true
                                            ?
                                            <IonButton onClick={this.handleSendTextMsg} fill="clear" style={{ padding: '0px', margin: '0px', height: '100%' }}>
                                                <IonIcon style={{ fontSize: '1.7em' }} icon={sendOutline} ></IonIcon>
                                            </IonButton>
                                            :
                                            <IonButton onClick={this.handleRecAudioMsg} fill="clear" style={{ padding: '0px', margin: '0px', height: '100%' }}>
                                                <IonIcon style={{ fontSize: '1.7em' }} icon={micOutline} ></IonIcon>
                                            </IonButton>
                                    }

                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>

                    <ChatMembersModal
                        chatMembers={chatMembers}

                        showChatMembersModal={this.state.showChatMembersModal}
                        handleToggleChatMembersModal={this.handleToggleChatMembersModal}
                    />
                </IonContent>
            </IonPage >

        );
    }
};


function mapStateToProps({ auth, guard, chatMessages, chatMembers }) {
    return {
        token: auth && auth.token,
        guard: guard && guard,
        chatMessages: chatMessages && chatMessages,
        company: guard ? 'company' in guard ? guard.company : null : null,
        chatMembers,
    }
}

export default connect(mapStateToProps)(withIonLifeCycle(Chat))