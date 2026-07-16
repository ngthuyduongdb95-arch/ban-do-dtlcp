/********************************************************************
 WEBGIS QUẢN LÝ THÚ Y TỈNH ĐIỆN BIÊN
 Version 2.0
********************************************************************/

"use strict";

/*=========================================================
 CONFIG
=========================================================*/

const CONFIG = {

    API: "https://script.google.com/macros/s/AKfycbz3zkALIKFWDpCYOs4XoBJMMpZL5dbWy2kubnrQDKyllSk4HyrDVeYDhnMmkr7r5PBy/exec",

    GEOJSON: "geojson/dienbien_xa.geojson",

    CENTER: [21.386, 103.023],

    ZOOM: 9,

    MIN_ZOOM: 8,

    MAX_ZOOM: 18

};

/*=========================================================
 APP
=========================================================*/

const APP = {

    map: null,

    boundary: null,

    geojsonLayer: null,

    data: [],

    dataMap: {},

    layers: {},

    chart: null

};

/*=========================================================
 BASEMAP
=========================================================*/

function createBaseMaps() {

    APP.layers.osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap",
            maxZoom: 19
        }
    );

    APP.layers.satellite = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
    );

    APP.layers.hybrid = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
    );

    APP.layers.terrain = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
    );

}

/*=========================================================
 MAP
=========================================================*/

function createMap() {

    APP.map = L.map("map", {

        center: CONFIG.CENTER,

        zoom: CONFIG.ZOOM,

        minZoom: CONFIG.MIN_ZOOM,

        maxZoom: CONFIG.MAX_ZOOM

    });

    APP.layers.osm.addTo(APP.map);

    L.control.layers({

        "OpenStreetMap": APP.layers.osm,

        "Google Satellite": APP.layers.satellite,

        "Google Hybrid": APP.layers.hybrid,

        "Google Terrain": APP.layers.terrain

    }).addTo(APP.map);

}
/*=========================================================
 LOAD API
=========================================================*/

async function loadAPI(){

    try{

        const response = await fetch(CONFIG.API);

        if(!response.ok){

            throw new Error("Không đọc được API");

        }

        APP.data = await response.json();

        APP.dataMap = {};

        APP.data.forEach(item=>{

            APP.dataMap[Number(item.ID)] = item;

        });

        console.log("Đã đọc",APP.data.length,"bản ghi.");

    }

    catch(error){

        console.error(error);

        alert("Không kết nối được Apps Script API.");

    }

}

/*=========================================================
 LOAD GEOJSON
=========================================================*/

async function loadGeoJSON(){

    try{

        const response = await fetch(CONFIG.GEOJSON);

        if(!response.ok){

            throw new Error("Không đọc được GeoJSON");

        }

        APP.boundary = await response.json();

        console.log("GeoJSON OK");

    }

    catch(error){

        console.error(error);

        alert("Không đọc được GeoJSON.");

    }

}/*=========================================================
 INIT
=========================================================*/

async function init(){

    createBaseMaps();

    createMap();

    await loadAPI();

    await loadGeoJSON();

}

window.onload = init;
