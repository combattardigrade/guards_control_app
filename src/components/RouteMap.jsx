import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';

import { getMapRoute } from '../utils/api'

const mapStyles = {
    width: '100%',
    height: '30vh',
    marginTop: '10px',
    display: 'block'
};

class RouteMap extends Component {

    state = {
        points: '',
        loading: true
    }

    async  handleMarkerClick(props, location) {
        const { position } = props
        let jsonobject = await (await getMapRoute({ fromLocation: { lat: location.lat, lng: location.lng }, toLocation: { lat: position.lat, lng: position.lng } })).json()
        let coordinates = jsonobject.routes[0].geometry.coordinates
        let points = []
        coordinates.map((point) => {
            points.push({ lat: point[1], lng: point[0] })
        })
        this.setState({ points, loading: false })

    }

    render() {

        const { location, google, checkpoints, routePoints } = this.props
        const { points, loading } = this.state

        return (
           
            <Map
                google={google}
                zoom={15}

                style={mapStyles}
                initialCenter={{ lat: location.lat, lng: location.lng }}
                mapTypeControl={false}
                styles={[{
                    featureType: 'poi',
                    elementType: 'labels.icon',
                    stylers: [{ visibility: 'off' }] // hide poi (businesses) icons
                },
                {
                    featureType: 'poi',
                    elementType: 'geometry',
                    stylers: [{ color: '#e5e5e5' }] // poi geometry color
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#ffffff' }] // hide local businesses labels
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#676767' }] // hide local businesses labels
                },
                {
                    featureType: 'landscape',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f5f5' }] // buildings and so on
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }] // hide arterial roads labels
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry', // highway color
                    stylers: [{ color: '#dadada' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.stroke', // highway label text stroke (contorno)
                    stylers: [{ color: '#ffffff' }]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill', // rad label text color (fill)
                    stylers: [{ color: '#676767' }]
                },
                {
                    featureType: 'road.local',
                    elementType: 'geometry',
                    stylers: [{ color: '#ffffff' }] // park roads color

                },
                {
                    featureType: 'transit',
                    elementType: 'labels.icon',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    featureType: 'transit',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#676767' }]
                },
                {
                    featureType: 'transit',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#ffffff' }]
                },
                {
                    featureType: 'transit.station.bus',
                    elementType: 'labels.icon',
                    stylers: [{ visibility: 'off' }]
                }]}
            >

                <Marker
                    id='currentLocation'
                    position={{ lat: location.lat, lng: location.lng }}
                    onClick={this.handleMarkerClick}
                />

                {
                    checkpoints && (
                        checkpoints.map((checkpoint) => (
                            <Marker key={checkpoint.id} id={checkpoint.id} label={`${checkpoint.name}`} position={{ lat: checkpoint.lat, lng: checkpoint.lng }} onClick={(props, marker, e) => this.handleMarkerClick(props, location)} />
                        ))
                    )
                }

                {
                    points ?                
                        
                        <Polyline
                            path={points}
                            strokeColor="#3880ff"
                            strokeOpacity={0.8}
                            strokeWeight={2}
                        />
                    :
                    null
                }

                {
                    
                    <Polyline
                        path={routePoints}
                        strokeColor="#3880ff"
                        strokeOpacity={0.8}
                        strokeWeight={2}
                    />
                }


            </Map>
        );
    }
}
const LoadingContainer = (props) => (
    <div>Loading map...</div>
)
export default GoogleApiWrapper({
    apiKey: 'AIzaSyAY5scI2sYPDGoLn2INfct1gMw5gFLIHjs',
    LoadingContainer: LoadingContainer
})(RouteMap);

