/**
 * Created by drpollo on 15/03/2017.
 */
'use strict'

// defaults
var zoom = 13;
var lat = 45.070312;
var lon = 7.686856;


// recover search params
var params = (new URL(location)).searchParams;
console.debug('check params',params.get('contrast'));

// override location from get params
lat = params.get('lat') ? params.get('lat') : lat;
lon = params.get('lon') ? params.get('lon') : lon;
zoom = params.get('zoom') ? params.get('zoom') : zoom;

// recover domain param (used for security reasons)
var domain = params.get('domain');
// if domain does not exist trows a console error
if(!domain){
    console.error('missing mandatory param: "domain"');
}

/*
 * set other params
 * 1) contrast: selects the highcontrast tile layer
 */
var contrast = params.get('contrast');



// definition of the map
var mymap = L.map('inputmap').setView([lat, lon], zoom );
// map setup
// https://api.mapbox.com/styles/v1/drp0ll0/cizl1thgs000u2ro17h1cv4y2/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ
L.tileLayer('https://api.mapbox.com/styles/v1/drp0ll0/cizl1thgs000u2ro17h1cv4y2/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    // id: 'your.mapbox.project.id',
    // accessToken: 'pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ'
}).addTo(mymap);

// vectorGrid
var vectormapUrl = "https://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={token}";
var vectorMapStyling = {
    water: {
        fill: true,
        weight: 1,
        fillColor: '#06cccc',
        color: '#06cccc',
        fillOpacity: 0.2,
        opacity: 0.4,
    },
    admin: {
        weight: 1,
        fillColor: 'pink',
        color: 'pink',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    waterway: {
        weight: 1,
        fillColor: '#2375e0',
        color: '#2375e0',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    landcover: {
        fill: true,
        weight: 1,
        fillColor: '#53e033',
        color: '#53e033',
        fillOpacity: 0.2,
        opacity: 0.4,
    },
    landuse: {
        fill: true,
        weight: 1,
        fillColor: '#e5b404',
        color: '#e5b404',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    park: {
        fill: true,
        weight: 1,
        fillColor: '#84ea5b',
        color: '#84ea5b',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    boundary: {
        weight: 1,
        fillColor: '#c545d3',
        color: '#c545d3',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    aeroway: {
        weight: 1,
        fillColor: '#51aeb5',
        color: '#51aeb5',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    road: {	// mapbox & mapzen only
        weight: 1,
        fillColor: '#f2b648',
        color: '#f2b648',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    tunnel: {	// mapbox only
        weight: 0.5,
        fillColor: '#f2b648',
        color: '#f2b648',
        fillOpacity: 0.2,
        opacity: 0.4,
// 					dashArray: [4, 4]
    },
    bridge: {	// mapbox only
        weight: 0.5,
        fillColor: '#f2b648',
        color: '#f2b648',
        fillOpacity: 0.2,
        opacity: 0.4,
// 					dashArray: [4, 4]
    },
    transportation: {	// openmaptiles only
        weight: 0.5,
        fillColor: '#f2b648',
        color: '#f2b648',
        fillOpacity: 0.2,
        opacity: 0.4,
// 					dashArray: [4, 4]
    },
    transit: {	// mapzen only
        weight: 0.5,
        fillColor: '#f2b648',
        color: '#f2b648',
        fillOpacity: 0.2,
        opacity: 0.4,
// 					dashArray: [4, 4]
    },
    building: {
        fill: true,
        weight: 1,
        fillColor: '#2b2b2b',
        color: '#2b2b2b',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    water_name: {
        weight: 1,
        fillColor: '#022c5b',
        color: '#022c5b',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    transportation_name: {
        weight: 1,
        fillColor: '#bc6b38',
        color: '#bc6b38',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    place: {
        weight: 1,
        fillColor: '#f20e93',
        color: '#f20e93',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    housenumber: {
        weight: 1,
        fillColor: '#ef4c8b',
        color: '#ef4c8b',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    poi: {
        weight: 1,
        fillColor: '#3bb50a',
        color: '#3bb50a',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    earth: {	// mapzen only
        fill: true,
        weight: 1,
        fillColor: '#c0c0c0',
        color: '#c0c0c0',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    // Do not symbolize some stuff for mapbox
    country_label: [],
    marine_label: [],
    state_label: [],
    place_label: [],
    waterway_label: [],
    poi_label: [],
    road_label: [],
    housenum_label: [],
    // Do not symbolize some stuff for openmaptiles
    country_name: [],
    marine_name: [],
    state_name: [],
    place_name: [],
    waterway_name: [],
    poi_name: [],
    road_name: [],
    housenum_name: [],
};
// Monkey-patch some properties for mapzen layer names, because
// instead of "building" the data layer is called "buildings" and so on
vectorMapStyling.buildings  = vectorMapStyling.building;
vectorMapStyling.boundaries = vectorMapStyling.boundary;
vectorMapStyling.places     = vectorMapStyling.place;
vectorMapStyling.pois       = vectorMapStyling.poi;
vectorMapStyling.roads      = vectorMapStyling.road;

// config del layer
var vectormapConfig = {
    rendererFactory: L.canvas.tile,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>',
    vectorTileLayerStyles: vectorMapStyling,
    token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA'
};
// L.vectorGrid.protobuf(vectormapUrl, vectormapConfig).addTo(mymap);




var areaStyling = function () {
    return {
        weight: 1,
        fillColor: '#3bb50a',
        color: '#fff',
        fillOpacity: 1,
        opacity: 1
    }
}
var areaserverConfig = {
    rendererFactory: L.svg.tile,
    attribution:false,
    vectorTileLayerStyles: areaStyling,
    // token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA'
};
var areaserverUrl = "http://fldev.di.unito.it:3095/tile/{z}/{x}/{y}";
L.vectorGrid.protobuf(areaserverUrl, areaserverConfig).addTo(mymap);
// hook to click event
mymap.on('click', onMapClick);


// handler of the click event
function onMapClick(e) {
    // lat, lon, zoom_level
    var params = e.latlng;
    // if empty event such as return key event
    if(!params)
        return
    // if the event has lat and lng params
    // enrich the params with the current zoom level
    params['zoom_level'] = mymap.getZoom();
    console.debug("Click params:", params);
    // send message to parent element
    top.postMessage(params,domain);
}