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
L.tileLayer('https://api.mapbox.com/styles/v1/drp0ll0/cj0tausco00tb2rt87i5c8pi0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    // id: 'your.mapbox.project.id',
    // accessToken: 'pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ'
}).addTo(mymap);


//reset stili
var myStyle = {
    color: 'transparent',
    weight:0,
    fillColor: 'transparent'
};
L.Path.mergeOptions(myStyle);
L.Polyline.mergeOptions(myStyle);
L.Polygon.mergeOptions(myStyle);
L.Rectangle.mergeOptions(myStyle);
L.Circle.mergeOptions(myStyle);
L.CircleMarker.mergeOptions(myStyle);



// vectorGrid
var vectormapUrl = "http://localhost:3095/tile/{z}/{x}/{y}";
// var vectormapUrl = "http://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={token}";
var vectorMapStyling = {
    interactive:{
        fill: true,
        weight: 1,
        fillColor: '#06cccc',
        color: '#06cccc',
        fillOpacity: 0.2,
        opacity: 0.4
    },
    water: function(p,z){
        return  (false) ? {
            fill: true,
            weight: 1,
            fillColor: '#06cccc',
            color: '#06cccc',
            fillOpacity: 0.2,
            opacity: 0.4,
        } : {}
    },
    admin: function(p,z){
        // (z < 14) ? console.log('admin') : '';
        return (z < 14) ? {
            weight: 2,
            // fillColor: 'pink',
            color: 'blue',
            // fillOpacity: 0.2,
            opacity: 1
        } : {}
    },
    waterway: function(p,z){
        // (z > 9) ? console.log('waterway') : '';
        return  (z > 9) ? {
            weight: 1,
            fillColor: '#2375e0',
            color: '#2375e0',
            fillOpacity: 0.2,
            opacity: 0.4
        } : {}
    },
    park: function(p,z){
        // (z > 14 && z < 20) ? console.log('park') : '';
        return (z > 14 && z < 20) ? {
            fill: true,
            weight: 1,
            fillColor: 'green',
            color: 'green',
            fillOpacity: 0.2,
            opacity: 0.4
        } : {}
    },
    boundary: function(p,z){
        (z < 10) ? console.log('boundary') : '';
        return (z < 10) ? {
            weight: 1,
            fillColor: '#c545d3',
            color: '#c545d3',
            fillOpacity: 0.2,
            opacity: 0.4
        } : {}
    },
    road: function(p,z){
        // (z > 14) ? console.log('road') : '';
        return (z > 14) ? {	// mapbox & mapzen only
            weight: 4,
            fillColor: '#3399ff',
            color: '#3399ff',
            fillOpacity: 0.5,
            opacity: 0.85
        } : {}
    },
    tunnel: function(p,z){
        return (z > 14) ? {	// mapbox only
            weight: 0.5,
            fillColor: 'blue',
            color: 'blue',
            fillOpacity: 0.5,
            opacity: 1
// 					dashArray: [4, 4]
        }:{}
    },
    bridge: function(p,z){
        return (z > 14) ? {	// mapbox only
            weight: 0.5,
            fillColor: 'blue',
            color: 'blue',
            fillOpacity: 0.5,
            opacity: 1,
// 					dashArray: [4, 4]
        } :{}
    },
    building: function(p,z){
        // (z > 14 && z < 20) ? console.log('building') : '';
        return (z > 14 && z < 20) ? {
            fill: true,
            weight: 1,
            fillColor: 'orange',
            color: 'orange',
            fillOpacity: 0.85,
            opacity: 1
        } : {}
    },
    place: function(p,z){
        return (false) ? {
            weight: 1,
            fillColor: '#f20e93',
            color: '#f20e93',
            fillOpacity: 0.2,
            opacity: 0.4
        }:{}
    },
    barrier_line: {},
    contour: {},
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
    token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA',
    interactive: true
};
function whenClicked(e) {
    // e = event
    console.log(e);
    // You can make your ajax call declaration here
    //$.ajax(...
}
L.vectorGrid.protobuf(vectormapUrl, vectormapConfig).on('click', onMapClick).addTo(mymap);



// in attesa di tile server che funziona
// var areaStyling = function () {
//     return {
//         weight: 1,
//         fillColor: '#3bb50a',
//         color: '#fff',
//         fillOpacity: 1,
//         opacity: 1
//     }
// }
// var areaserverConfig = {
//     rendererFactory: L.svg.tile,
//     attribution:false,
//     vectorTileLayerStyles: areaStyling,
//     // token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA'
// };
// var areaserverUrl = "http://fldev.di.unito.it:3095/tile/{z}/{x}/{y}";
// L.vectorGrid.protobuf(areaserverUrl, areaserverConfig).addTo(mymap);




// hook to click event
// mymap.on('click', onMapClick);


// handler of the click event
function onMapClick(e) {
    // lat, lon, zoom_level
    var params = Object.assign(e.latlng,e.layer.properties);
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