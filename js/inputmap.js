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