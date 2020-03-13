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

    state = {
        points: ''
    }

    componentDidMount() {

    }

    async generateRoute() {
        const { location, checkpoints } = this.props
        if (checkpoints && checkpoints.length > 0) {
            let jsonobject = await (await getMapRoute({ fromLocation: { lat: location.lat, lng: location.lng }, toLocation: { lat: checkpoints[0].lat, lng: checkpoints[0].lng } })).json()

            let coordinates = jsonobject.routes[0].geometry.coordinates
            let points = []
            coordinates.map((point) => {
                point.push({ lat: point[1], lng: point[0] })
            })
            return (< Polyline
                paths={points}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
            />)
            console.log('test')
            // checkpoints.map((checkpoint, index) => {
            //     let jsonobject = await getMapRoute({fromLocation: {lat: checkpoint.lat,lng: checkpoint.lng}, toLocation: {lat: checkpoints[index + 1].lat,lng: checkpoints[index + 1].lng}})
            // })
        }
    }

    async fetchPolylineRoute(location, checkpoints) {

        if (checkpoints && checkpoints.length > 0) {
            let jsonobject = await (await getMapRoute({ fromLocation: { lat: location.lat, lng: location.lng }, toLocation: { lat: checkpoints[0].lat, lng: checkpoints[0].lng } })).json()

            let coordinates = jsonobject.routes[0].geometry.coordinates
            let points = []
            await coordinates.map((point) => {
                point.push({ lat: point[1], lng: point[0] })
            })
            this.setState({ points: points })
        }
    }

    async  handleMarkerClick(props, location) {
        const { id, position } = props
        console.log(position)
        let jsonobject = await (await getMapRoute({ fromLocation: { lat: location.lat, lng: location.lng }, toLocation: { lat: position.lat, lng: position.lng } })).json()
        let coordinates = jsonobject.routes[0].geometry.coordinates
        let points = []
        coordinates.map((point) => {
            points.push({ lat: point[1], lng: point[0] })
        })
        this.setState({ points })
        console.log(points)
    }

    render() {

        const { location, google, checkpoints, } = this.props
        const { points } = this.state
        console.log(checkpoints)

        return (
            <Map
                google={google}
                zoom={15}
                style={mapStyles}
                initialCenter={{ lat: location.lat, lng: location.lng }}

            >

                <Marker
                    id='currentLocation'
                    position={{ lat: location.lat, lng: location.lng }}
                    onClick={this.handleMarkerClick}
                />

                {
                    checkpoints && (
                        checkpoints.map((checkpoint) => (
                            <Marker key={checkpoint.id} id={checkpoint.id} label={`Punto ${checkpoint.name}`} position={{ lat: checkpoint.lat, lng: checkpoint.lng }} onClick={(props, marker, e) => this.handleMarkerClick(props, location)} />
                        ))
                    )
                }

                {
                    points &&
                    <Polyline
                        path={points}
                        strokeColor="#3880ff"
                        strokeOpacity={0.8}
                        strokeWeight={2}
                    />
                }


            </Map>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyAY5scI2sYPDGoLn2INfct1gMw5gFLIHjs'
})(RouteMap);