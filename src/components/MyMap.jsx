import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '30vh',
    marginTop: '10px',
    display: 'block'
};

class MyMap extends Component {

    

    render() {

        const { location, google } = this.props
       

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
                {/* {this.displayMarkers()} */}
                <Marker id='currentLocation' position={{lat: location.lat, lng: location.lng}} />
            </Map>
        );
    }
}

const LoadingContainer = (props) => (
    <div>Loading map...</div>
  )
export default GoogleApiWrapper({
    apiKey: 'AIzaSyAY5scI2sYPDGoLn2INfct1gMw5gFLIHjs',
    LoadingContainer: LoadingContainer,
    version: 3.31
})(MyMap);