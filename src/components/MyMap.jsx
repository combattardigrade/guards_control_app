import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '30vh',
    marginTop: '10px',
    display: 'block'
};

class MyMap extends Component {

    // state = {
    //     stores: [{ lat: 47.49855629475769, lng: -122.14184416996333 },
    //     { latitude: 47.359423, longitude: -122.021071 },
    //     { latitude: 47.2052192687988, longitude: -121.988426208496 },
    //     { latitude: 47.6307081, longitude: -122.1434325 },
    //     { latitude: 47.3084488, longitude: -122.2140121 },
    //     { latitude: 47.5524695, longitude: -122.0425407 }]
    // }

    // displayMarkers = () => {
    //     return this.state.stores.map((store, index) => {
    //         return <Marker key={index} id={index} position={{
    //             lat: store.latitude,
    //             lng: store.longitude
    //         }}
    //             onClick={() => console.log("You clicked me!")} />
    //     })
    // }

    render() {

        const { location, google } = this.props

        

        return (
            <Map
                google={google}
                zoom={15}
                style={mapStyles}
                initialCenter={{ lat: location.lat, lng: location.lng }}
            >
                {/* {this.displayMarkers()} */}
                <Marker id='currentLocation' position={{lat: location.lat, lng: location.lng}} />
            </Map>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyAY5scI2sYPDGoLn2INfct1gMw5gFLIHjs'
})(MyMap);