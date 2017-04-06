'use strict'

// defaults
var zoom = 13;
var lat = 45.070312;
var lon = 7.686856;
var baselayer = 'https://api.mapbox.com/styles/v1/drp0ll0/cj0tausco00tb2rt87i5c8pi0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ';
var contrastlayer = 'https://api.mapbox.com/styles/v1/drp0ll0/cj167l5m800452rqsb9y2ijuq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ';

var htmlIcon = '<div class="pin"></div><div class="pulse"></div>';
var pinIcon = L.divIcon({className: 'pointer',html:htmlIcon});



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



// todo mobile auto control
var mobile = 'auto';
if(params.get('mobile') === 'false')
    mobile = false;
if(params.get('mobile') === 'true')
    mobile = true;



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






// vectorGrid
var vectormapUrl = "http://localhost:3095/tile/{z}/{x}/{y}";
// var vectormapUrl = "http://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={token}";
var vectorMapStyling = {
    interactive:{
        fill: false,
        weight: 0,
        fillColor: '#06cccc',
        color: '#06cccc',
        fillOpacity: 0.2,
        opacity: 0.4
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
function whenClicked(e) {
    // e = event
    console.log(e);
    // You can make your ajax call declaration here
    //$.ajax(...
}
L.vectorGrid.protobuf(vectormapUrl, vectormapConfig)
    .on('click', onMapClick) // add listner to vectorGrid layer
    .addTo(mymap); // add vectorGrid layer to map

mymap.on('click',setMarker);



// todo add market at click



// handler of the click event
function onMapClick(e) {
    sendMessage(e);

    // todo mobile controll, no mobile
    // setMarker(e);
}



// add marker to map in the clicked position
var marker = null;
function setMarker(e) {
    if(marker){
        mymap.removeLayer(marker);
        marker = null;
    }
    marker = new L.marker(e.latlng, {id:'pointer',draggable:'false',icon:pinIcon});
    // marker.on('dragend', function(event){
    //     var marker = event.target;
    //     var position = marker.getLatLng();
    //     console.log('new position',event);
    //     marker.setLatLng(position,{id:'pointer',draggable:'true'}).update();
    //     // invio messaggio a fine drag
    //     // sendMessage(event);
    // });
    mymap.addLayer(marker);
    // invio messaggio dopo l'aggiunta del marker
    // sendMessage(e);
};



function sendMessage(e){
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