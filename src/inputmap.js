'use strict';

var currentEnv = "dev";

var env = {
    "dev":{
        lat: 45.070312,
        lon: 7.686856,
        zoom: 13,
        colors:{
            primary:'wgnred',
            secondary: 'red'
        },
        language: 'en'
    },
    "pt3":{
        lat: 45.070312,
        lon: 7.686856,
        zoom: 13,
        colors:{
            primary:'blue',
            secondary: 'green'
        },
        language: 'en'
    },
    "torino":{
        lat: 45.070312,
        lon: 7.686856,
        zoom: 13,
        colors:{
            primary:'indingo',
            secondary: 'indingo'
        },
        language: 'it'
    },
    "sandona":{
        lat: 45.630373,
        lon: 12.566082,
        zoom: 13,
        colors:{
            primary:'blue',
            secondary: 'lightblue'
        },
        language: 'it'
    },
    "southwark":{
        lat: 51.483448,
        lon: -0.082088,
        zoom: 13,
        colors:{
            primary:'blue',
            secondary: 'lightblue'
        },
        language: 'en'
    }
};



// environment management
var zoom = env[currentEnv].zoom;
var locationZoom = 18;
var lat = env[currentEnv].lat;
var lon = env[currentEnv].lon;
var colors = env[currentEnv].colors;

var colorCode = {
    florange: "#FC4A00",
    orange : "#FF9800",
    pink : "#E91E63",
    deeporange : "#FF5722",
    blue : "#2196f3",
    lightblue : "#03a9f3",
    deeppurle : "#673AB7",
    cyan : "#00BCD4",
    teal : "#009688",
    light : "#03A9F4",
    indingo : "#3F51B5",
    green : "#4CAF50",
    lightgreen : "#8BC34A",
    yellow : "#FFEB3B",
    amber : "#FFC107",
    lime : "#CDDC39",
    red : "#F44336",
    wgnred : '#c32630',
    gray : "#9E9E9E",
    brown : "#795548",
    bluegray : "#607D8B",
    darkgray : "#666"
};

// color management
var baseColor = colorCode[colors.primary];
var secondColor = colorCode[colors.secondary];


var mapOptions = {
    center: [lat,lon],
    zoom: zoom
};
var zoomControlPosition = 'bottomleft';
// var baselayer = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
// var contrastlayer = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
var baselayer = 'https://api.mapbox.com/styles/v1/drp0ll0/cj0tausco00tb2rt87i5c8pi0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ';
var contrastlayer = 'https://api.mapbox.com/styles/v1/drp0ll0/cj167l5m800452rqsb9y2ijuq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHJwMGxsMCIsImEiOiI4bUpPVm9JIn0.NCRmAUzSfQ_fT3A86d9RvQ';

// marker icon
var htmlIcon = '<div style="background:'+baseColor+';" class="pin"></div><div class="pulse"></div>';
var pinIcon = L.divIcon({className: 'pointer',html:htmlIcon, iconSize:[30,30],iconAnchor:[15,15]});

// vectorGrid
// var vectormapUrl = "//localhost:3095/tile/{z}/{x}/{y}";
// var vectormapUrl = "https://tiles.fldev.di.unito.it/tile/{z}/{x}/{y}";
var vectormapUrl = "https://tiles.firstlife.org/tile/{z}/{x}/{y}";

// defaults
var contrast = false;
var domain = window.location.href;
var mode = false;
var params = null;

// inputMap states: input, view, edit
var state = 'input';

var label = document.getElementById('label');


// language
var defaultLang = 0;
var languages = ['en','it'];
// tooltips
var tooltipLabel = {
    it : 'Click per localizzare',
    en : 'Click to geolocate'
};
var tooltipCancel = {
    it : 'Click per cancellare la selezione',
    en : 'Click to reset location'
};
var userLang = navigator.language || navigator.userLanguage;
var lang = languages[defaultLang];
for(var i = 0; i < languages.length; i++){
    var l = languages[i];
    if(userLang.search(l) > -1){
        lang = l;
    }
}

// recover search params
if (!window.location.getParameter ) {
    window.location.getParameter = function(key) {
        function parseParams() {
            var params = {},
                e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                q = window.location.search.substring(1);

            while (e = r.exec(q))
                params[d(e[1])] = d(e[2]);

            return params;
        }

        if (!this.queryStringParams)
            this.queryStringParams = parseParams();

        return this.queryStringParams[key];
    };
}

if(window.location.getParameter){
// override location from get params
    lat = window.location.getParameter('lat') ? window.location.getParameter('lat') : lat;
    lon = window.location.getParameter('lon') ? window.location.getParameter('lon') : lon;
    zoom = window.location.getParameter('zoom') ? window.location.getParameter('zoom') : zoom;
    contrast = window.location.getParameter('contrast') === 'true' ;
    lang = window.location.getParameter('lang') ? window.location.getParameter('lang') : lang;
    // recover domain param (used for security reasons)
    if(window.location.getParameter('domain')){
        domain = window.location.getParameter('domain');
    }else{
        // if domain does not exist trows a console error
        console.error('missing mandatory param: "domain"');
    }
    // get required state if defined
    if(window.location.getParameter('state')){
        state = window.location.getParameter('state');
    }

}else{
    console.error('cannot retrieve search params from URL location');
}


// set labels
var defIcon = '<button " title="'+tooltipLabel[lang]+'">&#x02713;</button>';
var defaultLabel = defIcon+tooltipLabel[lang];
label.innerHTML = defaultLabel;
// console.debug('current language',lang);
var cancelButton = '<button onclick="cancel()" title="'+tooltipCancel[lang]+'">&#x2715;</button>';
var infoIcon = '<i style="font-size:1em;position:absolute;left:9px;top:7px;" class="material-icons">location_on</i>';





// mode {lite = false | interactive = true}
// lite mode: one click > event
// interactive mode: first click > marker > click > event
if(window.location.getParameter('mode') === 'interactive'){ mode = true; }

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


console.log('select base layer:',contrast,contrast ? 'contrast': 'base', "test",window.location.getParameter('contrast'));
var mymap = L.map('inputmap',mapOptions);
mymap.setView([lat, lon], zoom );
layers[contrast ? 'contrast': 'base'].addTo(mymap);
mymap.zoomControl.setPosition(zoomControlPosition);
// geocoder
var geocoderSettings = {
    defaultMarkGeocode: false,
    position: 'topleft'
};
var geocoder = L.Control.geocoder(geocoderSettings);
geocoder.addTo(mymap);


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


var ordering = function (layers, zoom) {
    // console.debug('reordering....',layers);
    switch (zoom) {
        case 1:
        case 2:
            return [
                "nazioni",
                "waterareas",
                "waterways"
            ];
            break;
        case 3:
        case 4:
            return [
                "nazioni",
                "regioni",
                "provincie",
                // "waterareas",
                // "waterways"
            ];
            break;
        case 5:
        case 6:
            return [
                "nazioni",
                "regioni",
                "provincie",
                // "landusages",
                // "roads",
                // "waterareas",
                "waterways"];
            break;
        case 7:
        case 8:
            return [
                "nazioni",
                "regioni",
                "provincie",
                // "landusages",
                // "roads",
                // "waterareas",
                // "waterways",
                "comuni",];
            break;
        case 9:
        case 10:
            return [
                "nazioni",
                "regioni",
                "provincie",
                // "landusages",
                // "roads",
                // "waterareas",
                // "waterways",
                "comuni"];
            break;
        case 11:
        case 12:
            return [
                "provincie",
                // "landusages",
                // "roads",
                // "waterareas",
                // "waterways",
                "comuni"];
            break;
        case 13:
        case 14:
            return [
                "provincie",
                "quartieri",
                // "landusages",
                "comuni"];
            break;
        case 15:
        case 16:
            return [
                "comuni",
                "city_block",
                // "landusages",
                // "waterareas",
                // "waterways",
                "quartieri",];
            break;
        case 17:
        case 18:
            return [
                "site",
                "landusages",
                "building",
                "roads",
                "waterareas",
                "waterways",
                "quartieri",
                "city_block",];
            break;
        case 19:
        case 20:
            return [
                "site",
                "building",
                "roads",
                "waterareas",
                "waterways",
                "indoor"];
            break;
        default:
            return Object.keys(layers);
    }
};
var featureStyle = function(properties,z) {
    var style = {
        weight: 1,
        color: secondColor,
        opacity: 1,
        fill: true
    };
    if (properties.type === 'indoor') {
        style.fillColor = secondColor;
        style.fillOpacity = 0.5;
    }
    return style;
};
var vectorMapStyling = {
    nazioni: featureStyle,
    regioni: featureStyle,
    provincie: featureStyle,
    comuni: featureStyle,
    circoscrizioni: featureStyle,
    quartieri: featureStyle,
    city_block: featureStyle,
    site: featureStyle,
    building: featureStyle,
    // landusages: featureStyle,
    // roads: featureStyle,
    // waterareas: featureStyle,
    // waterways: featureStyle,
    indoor: featureStyle,
    interactive: featureStyle
};




// var vectormapUrl = "http://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={token}";
// var vectorMapStyling = {
//     interactive:{
//         fill: true,
//         weight: 2,
//         color: baseColor,
//         fillOpacity: 0.2,
//         opacity: 1
//     },
//     circoscrizioni:{
//         fill: true,
//         weight: 2,
//         color: baseColor,
//         fillOpacity: 0.2,
//         opacity: 1
//     },
//     comuni:{
//         fill: true,
//         weight: 2,
//         color: baseColor,
//         fillOpacity: 0.2,
//         opacity: 1
//     }
// };
// Monkey-patch some properties for mapzen layer names, because
// instead of "building" the data layer is called "buildings" and so on
vectorMapStyling.buildings  = vectorMapStyling.building;
vectorMapStyling.boundaries = vectorMapStyling.boundary;
vectorMapStyling.places     = vectorMapStyling.place;
vectorMapStyling.pois       = vectorMapStyling.poi;
vectorMapStyling.roads      = vectorMapStyling.road;

// config del layer
var vectormapConfig = {
    rendererFactory: L.svg.tile,
    attribution: false,
    vectorTileLayerStyles: vectorMapStyling,
    token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA',
    interactive: true,
    layersOrdering: ordering
};
// definition of the vectorGrid layer
var vGrid = L.vectorGrid.protobuf(vectormapUrl, vectormapConfig);

// add vector grid to the map
vGrid.addTo(mymap); // add vectorGrid layer to map


geocoder.on('markgeocode', function (e) {
    console.log('geocode',e);
    mymap.setView(e.geocode.center,locationZoom);
});

// vGrid.addEventParent('click',onMapClick);

// reference to current marker
var marker = null;



/*
 * State management:
 * 1) input
 * 2) edit
 * 3) view
 */


if (state === 'view' || state === 'edit') {
    // add marker at current map center
    if (marker) {
        mymap.removeLayer(marker);
        marker = null;
    }
    marker = new L.marker(L.latLng(lat, lon), {id: 'pointer', icon: pinIcon});

    mymap.addLayer(marker);

    // todo setup tooltip box with current info

    sendMessage({lat:lat, lng:lon, zoom_level: zoom})
}
// skip init click handlers if in view state
if(state !== 'view'){
        // add listner to vectorGrid layer
        vGrid.on('click', onVGridClick);
        // add listner to map as fail over of vGrid
        mymap.on('click',onMapClick);
}







// handler of the click event
function onVGridClick(e) {
    if(e.originalEvent.defaultPrevented){return;}

    // prevent map click event
    e.originalEvent.preventDefault();
    // e.originalEvent.defaultPrevented = true;

    // console.log('vGrid click',e);

    // lat, lon, zoom_level
    var params = Object.assign(e.latlng,e.layer.properties);
    // if empty event such as return key event
    if(!params)
        return
    // if the event has lat and lng params
    // enrich the params with the current zoom level
    var z = mymap.getZoom();
    params['zoom_level'] = z;
    var tile = pointToTile(e.latlng.lng, e.latlng.lat, z);
    params['tile'] = tile;
    params['tileid'] = tile[0]+':'+tile[1]+':'+tile[2];
    params.src = 'InputMap';
    // set marker
    setMarker(e, params);
    // if mode = lite send message
    if(!mode){
        sendMessage (params);
    }
}
// handler of the click event
function onMapClick(e) {
    // console.log('map click',e);
    if(e.originalEvent.defaultPrevented)
        return;

    e.originalEvent.preventDefault();

    // console.log('map click',e);

    // lat, lon, zoom_level
    var params = Object.assign(e.latlng);
    // if empty event such as return key event
    if(!params)
        return


    // if the event has lat and lng params
    // enrich the params with the current zoom level
    var z = mymap.getZoom();
    params['zoom_level'] = z;
    var tile = pointToTile(e.latlng.lng, e.latlng.lat, z);
    params['tile'] = tile;
    params['tileid'] = tile[0]+':'+tile[1]+':'+tile[2];
    params['type'] = 'tile';
    params['name'] = 'tile';
    params['id'] = tile[0]+':'+tile[1]+':'+tile[2];
    params.src = 'InputMap';
    // set marker
    setMarker(e, params);
    // if mode = lite send message
    if(!mode) {
        sendMessage(params);
    }
}


// add marker to map in the clicked position
function setMarker(e, params) {
    if(marker){
        mymap.removeLayer(marker);
        marker = null;
    }
    marker = new L.marker(e.latlng, {id:'pointer',icon:pinIcon});

    // if mode == interactive send message at marker click
    if(mode){
        marker.on('click', function(event){
            sendMessage (params);
        });
    }

    mymap.addLayer(marker);
};


function sendMessage (params){
    var url = 'https://nominatim.openstreetmap.org/reverse?';
    // zoom cannot be more than 18 and the mapping with nominatim result require +4
    var zoom = Math.min(18,params.level+4);
    // nominatim query
    var query = url.concat("format=json","&lat=",params.lat,"&lon=",params.lng,"&zoom=",params.zoom_level+2);
    // console.log(query);
    var listner = function () {
        // console.log(this);
        if(this.status === 200) {
            var response = JSON.parse(this.response);
            // console.log(response);
            Object.assign(params, {display_name: response.display_name, address: response.address});
            if (response.osm_id && !params.osm_id)
                params.osm_id = response.osm_id;
        }        // send message to parent element
        top.postMessage(params,domain);
        setLabel(params);
        console.log('pointer clicked, sending:',params, "to",domain);
    };
    try{
        var xhr = new XMLHttpRequest();
        xhr.onload = listner;
        xhr.open("GET", query, true);
        xhr.send();
    }catch (e){
        console.error("Error: geocoding failed",e);
        // send message to parent element
        top.postMessage(params,domain);
        setLabel(params);
        console.log('pointer clicked, sending:',params, "to",domain);
    }
}


// reset focus
function cancel(){
    // guardia per view state
    if(state === 'view'){return;}


    if(marker){
        mymap.removeLayer(marker);
        marker = null;
    }
    // reset label
    label.innerHTML = defaultLabel;
    // send reset message
    top.postMessage({src:'InputMap',reset:true},domain);

}



// set label current focus
function setLabel(params) {
    // set default content
    var content = 'lat: '+params.lat+', lon:'+params.lng+', zoom: '+params.zoom_level;
    if(params.name && params.name !== params.type){
        // set displa_name
        content = params.name;
    } else if(params.display_name){
        // set display_name
        content = params.display_name;
    } else if(params.type){
        // set type
        content = params.type;
    }
    if(state === 'view'){
        label.innerHTML = infoIcon+content;
    }else{
        label.innerHTML = cancelButton+content;
    }

}


// code from @mapbox/tilebelt

var d2r = Math.PI / 180,
    r2d = 180 / Math.PI;
function pointToTile(lon, lat, z) {
    var tile = pointToTileFraction(lon, lat, z);
    tile[0] = Math.floor(tile[0]);
    tile[1] = Math.floor(tile[1]);
    return tile;
}

function pointToTileFraction(lon, lat, z) {
    var sin = Math.sin(lat * d2r),
        z2 = Math.pow(2, z),
        x = z2 * (lon / 360 + 0.5),
        y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);
    return [x, y, z];
}