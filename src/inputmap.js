'use strict'

// defaults
var zoom = 13;
var lat = 45.070312;
var lon = 7.686856;
var baselayer = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
// var baselayer = 'https://api.mapbox.com/styles/v1/drp0ll0/cj0tausco00tb2rt87i5c8pi0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ';
// var contrastlayer = 'https://api.mapbox.com/styles/v1/drp0ll0/cj167l5m800452rqsb9y2ijuq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ';
var contrastlayer = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';

// marker icon
var htmlIcon = '<div class="pin"></div><div class="pulse"></div>';
var pinIcon = L.divIcon({className: 'pointer',html:htmlIcon, iconSize:[30,30],iconAnchor:[15,15]});

// vectorGrid
// var vectormapUrl = "//localhost:3095/tile/{z}/{x}/{y}";
var vectormapUrl = "https://tiles.fldev.di.unito.it/tile/{z}/{x}/{y}";

// recover search params
var params = (new URL(location)).searchParams;






// override location from get params
lat = params.get('lat') ? params.get('lat') : lat;
lon = params.get('lon') ? params.get('lon') : lon;
zoom = params.get('zoom') ? params.get('zoom') : zoom;
var contrast = params.get('contrast') === 'true' ;

// recover domain param (used for security reasons)
var domain = params.get('domain');
// if domain does not exist trows a console error
if(!domain){
    console.error('missing mandatory param: "domain"');
}


// definition of the map
// map setup
var layers = {
    base: L.tileLayer(baselayer, {
        maxZoom: 20,
        attribution: '<a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors | <a href="http://mapbox.com" target="_blank">Mapbox</a>'
    }),
    contrast : L.tileLayer(contrastlayer, {
        maxZoom: 20,
        attribution: '<a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors | <a href="http://mapbox.com" target="_blank">Mapbox</a>'
    })
};


console.log('select base layer:',contrast,contrast ? 'contrast': 'base', "test",params.get('contrast'));
var mymap = L.map('inputmap').setView([lat, lon], zoom );
layers[contrast ? 'contrast': 'base'].addTo(mymap);

// reset styles
var resetStyle = {
    color: 'transparent',
    weight:0,
    fillColor: 'transparent'
};
L.Path.mergeOptions(resetStyle);
L.Polyline.mergeOptions(resetStyle);
L.Polygon.mergeOptions(resetStyle);
L.Rectangle.mergeOptions(resetStyle);
L.Circle.mergeOptions(resetStyle);
L.CircleMarker.mergeOptions(resetStyle);
// end reset styles







// var vectormapUrl = "http://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={token}";
var vectorMapStyling = {
    interactive:{
        fill: false,
        weight: 2,
        fillColor: '#06cccc',
        color: '#06cccc',
        fillOpacity: 0.2,
        opacity: 1
    }
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
    attribution: false,
    vectorTileLayerStyles: vectorMapStyling,
    token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA',
    interactive: true
};
// definition of the vectorGrid layer
var vGrid = L.vectorGrid.protobuf(vectormapUrl, vectormapConfig);
// add listner to vectorGrid layer
vGrid.on('click', onMapClick);
// add vector grid to the map
vGrid.addTo(mymap); // add vectorGrid layer to map


// handler of the click event
function onMapClick(e) {
    if(e.prevented)
        return

    e.prevented = true;

    // lat, lon, zoom_level
    var params = Object.assign(e.latlng,e.layer.properties);
    // if empty event such as return key event
    if(!params)
        return
    // if the event has lat and lng params
    // enrich the params with the current zoom level
    params['zoom_level'] = mymap.getZoom();
    // set marker
    setMarker(e, params);
    // manda messaggio
    params.src = 'InputMap';
    sendMessage (params);
}


// add marker to map in the clicked position
var marker = null;
function setMarker(e, params) {
    if(marker){
        mymap.removeLayer(marker);
        marker = null;
    }
    marker = new L.marker(e.latlng, {id:'pointer',icon:pinIcon});
    // marker.on('click', function(event){
    //     sendMessage (params);
    // });
    mymap.addLayer(marker);
};


function sendMessage (params){
    console.log('pointer clicked, sending:',params.name);
    // send message to parent element
    top.postMessage(params,domain);
}