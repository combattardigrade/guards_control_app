import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import socketIOClient from 'socket.io-client'
import {
    IonButtons,
    IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonGrid, IonRow,
    IonCol, IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon,
    IonFab, IonFabButton, IonModal, IonButton, IonBackButton, IonInput, IonNote, withIonLifeCycle, IonAlert
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import {
    addOutline, peopleOutline, hammerOutline, documentTextOutline, cameraOutline,
    documentAttachOutline, chevronBackOutline, searchOutline, micOutline, sendOutline, imageOutline
} from 'ionicons/icons'

// Styles
import './styles.css'

// Components
import ChatMembersModal from './ChatMembersModal'

// Api
import { sendMessage, getCompanyActiveMembers, sendAudioMessage, sendImageMessage, API, SOCKETS_HOST } from '../utils/api'

// Actions
import { saveNewChatMessage } from '../actions/chatMessages'
import { saveChatMembers } from '../actions/chatMembers'

// Plugins
import { MediaCapture } from '@ionic-native/media-capture'
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Plugins } from '@capacitor/core'
const { Camera } = Plugins

const moment = require('moment')




class Chat extends Component {
    messagesEnd = React.createRef()

    state = {
        isTyping: false,
        textMsg: '',
        showChatMembersModal: false,
        goBack: false,
        showAlert: false,
        alertTitle: '',
        alertMsg: '',
        socket: ''
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
        const { textMsg, socket } = this.state
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
        const { socket } = this.state
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

    handleSendPhoto = async (e) => {
        e.preventDefault()
        console.log('TAKE PHOTO BTN CLICKED')

        const { company, token, dispatch } = this.props
        const { socket } = this.state

        const options = {
            allowEditing: false,
            quality: 10,
            resultType: 'Base64',
            saveGallery: true,
            source: 'CAMERA',
            direction: 'REAR'
        }

        // Get Photo
        const photoData = await Camera.getPhoto(options)

        // Send photo to server
        sendImageMessage({ photoData: photoData.base64String, token })
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

    handleSendGallery = async (e) => {
        e.preventDefault()
        console.log('GALLERY BTN CLICKED')

        const { company, token, dispatch } = this.props
        const { socket } = this.state

        const options = {
            allowEditing: false,
            quality: 10,
            resultType: 'Base64',
            source: 'PHOTOS'
        }

        // Get Photo
        const photoData = await Camera.getPhoto(options)

        // Send photo to server
        sendImageMessage({ photoData: photoData.base64String, token })
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

    showAlert = (msg, title) => {
        this.setState({ showAlert: true, alertMsg: msg, alertTitle: title })
    }

    ionViewWillEnter() {
        const { chatMessages, company, dispatch, token } = this.props

        // Get Chat Members
        getCompanyActiveMembers({ companyId: company.id, token })
            .then(data => data.json())
            .then(res => {
                if (res.status == 'OK') {
                    dispatch(saveChatMembers(res.payload.users))
                }
            })
        const socket = socketIOClient(SOCKETS_HOST)
        this.setState({ socket })
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
            if (data.msg.type === 'live_audio') return
            console.log('New message received: ', data.msg)
            // save message
            dispatch(saveNewChatMessage(data.msg))
        })

        if (chatMessages && Object.values(chatMessages).length > 0) {
            // Scroll to bottom
            setTimeout(() => {
                this.scrollToBottom()
            }, 500)
        }

    }

    componentDidUpdate() {
        const { chatMessages } = this.props
        // Do not scroll when going back to previous page
        if (this.state.goBack == true) return
        if (chatMessages && Object.values(chatMessages).length > 0) {
            // Scroll to bottom
            setTimeout(() => {
                this.scrollToBottom()
            }, 500)
        }
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
                                if (message.userId == guard.id) { // sent
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
                                    } else if (message.messageType == 'image') {
                                        return (
                                            <Fragment key={index}>
                                                <IonItem className={index + 1 == totalMessages && 'lastMessage'} lines="none" ref={index + 1 == totalMessages && (this.messagesEnd)}>
                                                    <IonGrid>
                                                        <IonRow>
                                                            <IonCol size="8" offset="4" style={{ borderRadius: '5px', padding: '5px 0px', textAlign: 'right', }}>
                                                                <img onClick={e => { e.preventDefault(); PhotoViewer.show(API + '/photo/' + message.photoId); }} style={{ width: '50%' }} src={API + '/photo/' + message.photoId} />
                                                                <IonLabel style={{ whiteSpace: 'normal', fontSize: '.6em', marginTop: '5px', textAlign: 'right' }}>{moment(message.createdAt).fromNow()} </IonLabel>
                                                            </IonCol>
                                                        </IonRow>
                                                    </IonGrid>
                                                </IonItem>
                                            </Fragment>
                                        )
                                    }
                                } else { // received
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
                                    } else if (message.messageType == 'image') {
                                        return (
                                            <Fragment key={index}>
                                                <IonItem className={index + 1 == totalMessages && 'lastMessage'} lines="none" ref={index + 1 == totalMessages && (this.messagesEnd)}>
                                                    <IonGrid>
                                                        <IonRow>
                                                            <IonCol size="8" style={{ borderRadius: '5px', padding: '5px 0px', textAlign: 'left' }}>
                                                                <img onClick={e => { e.preventDefault(); PhotoViewer.show(API + '/photo/' + message.photoId); }} style={{ width: '50%' }} src={API + '/photo/' + message.photoId} />
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



                    <IonGrid style={{ backgroundColor: '#f4f5f8', position: 'fixed', bottom: '0px', borderTop: '1px solid #dedede', width: '100%', zIndex: '20' }}>
                        <IonRow style={{ margin: '0px', padding: '0px', width: '100%' }}>

                            <IonCol size={isTyping === true ? '10' : '9'}>
                                <IonInput className="chatInput" onIonChange={this.handleTextMsgChange} placeholder="Ingresa tu mensaje..." value={textMsg} style={{ background: 'white', border: '1px solid rgb(214, 214, 216)' }}></IonInput>
                            </IonCol>



                            {
                                isTyping == true
                                    ?
                                    <IonCol size="2" style={{ padding: '0px', margin: '0px 0px 0px 0px', }}>
                                        <IonButton onClick={this.handleSendTextMsg} fill="clear" style={{ padding: '0px', margin: '0px', height: '100%', position: 'relative' }}>
                                            <IonIcon style={{}} icon={sendOutline} ></IonIcon>
                                        </IonButton>
                                    </IonCol>
                                    :
                                    <Fragment>
                                        <IonCol size="1" style={{ padding: '0px', margin: '0px', }}>
                                            <IonButton onClick={this.handleSendGallery} fill="clear" style={{ padding: '0px', margin: '0px', height: '100%', left: '-15px', position: 'relative' }}>
                                                <IonIcon style={{}} icon={imageOutline} ></IonIcon>
                                            </IonButton>
                                        </IonCol>
                                        <IonCol size="1" style={{ padding: '0px', margin: '0px', }}>
                                            <IonButton onClick={this.handleSendPhoto} fill="clear" style={{ padding: '0px', margin: '0px', height: '100%', left: '-12px', position: 'relative' }}>
                                                <IonIcon style={{}} icon={cameraOutline} ></IonIcon>
                                            </IonButton>
                                        </IonCol>
                                        <IonCol size="1" style={{ padding: '0px', margin: '0px', }}>
                                            <IonButton onClick={this.handleRecAudioMsg} fill="clear" style={{ padding: '0px', margin: '0px', height: '100%', left: '-10px', position: 'relative' }}>
                                                <IonIcon style={{}} icon={micOutline} ></IonIcon>
                                            </IonButton>
                                        </IonCol>
                                    </Fragment>
                            }


                        </IonRow>
                    </IonGrid>


                    <ChatMembersModal
                        chatMembers={chatMembers}

                        showChatMembersModal={this.state.showChatMembersModal}
                        handleToggleChatMembersModal={this.handleToggleChatMembersModal}
                    />

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