/* ======================================================
   WEBGIS QUẢN LÝ THÚ Y ĐIỆN BIÊN
====================================================== */

:root{

    --green:#0B6E4F;
    --green2:#17A673;
    --light:#F5F7FA;
    --border:#E5E7EB;
    --card:#FFFFFF;
    --shadow:0 4px 12px rgba(0,0,0,.08);

}

*{

    margin:0;
    padding:0;
    box-sizing:border-box;

}

html,
body{

    width:100%;
    height:100%;
    overflow:hidden;

    font-family:
    "Segoe UI",
    Arial,
    sans-serif;

    background:#eef2f7;

}

/* HEADER */

header{

    height:65px;

    background:linear-gradient(90deg,#0B6E4F,#198754);

    color:white;

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:0 20px;

}

.logo{

    font-size:22px;

    font-weight:bold;

}

.toolbar{

    display:flex;

    gap:10px;

}

.toolbar button{

    width:42px;

    height:42px;

    border:none;

    border-radius:10px;

    background:white;

    cursor:pointer;

    font-size:18px;

}

/* MAIN */

.container{

    display:grid;

    grid-template-columns:330px 1fr;

    height:calc(100vh - 65px);

}

/* SIDEBAR */

.sidebar{

    background:white;

    overflow:auto;

    padding:18px;

    border-right:1px solid var(--border);

}

.sidebar h2{

    color:#198754;

    margin-bottom:15px;

}

/* CARD */

.card{

    background:white;

    border-radius:12px;

    padding:18px;

    margin-bottom:15px;

    box-shadow:var(--shadow);

    border-left:6px solid #198754;

}

.card .title{

    color:#555;

    margin-bottom:10px;

}

.card div:last-child{

    font-size:30px;

    font-weight:bold;

    color:#198754;

}

/* FORM */

label{

    display:block;

    margin-bottom:10px;

    cursor:pointer;

}

input[type=text]{

    width:100%;

    padding:12px;

    border:1px solid #ccc;

    border-radius:8px;

    margin-top:10px;

    margin-bottom:10px;

}

button{

    transition:.25s;

}

#btnSearch{

    width:100%;

    background:#198754;

    color:white;

    border:none;

    padding:12px;

    border-radius:8px;

    cursor:pointer;

}

#btnSearch:hover{

    background:#146c43;

}

/* MAP */

#map{

    width:100%;

    height:100%;

}

/* POPUP */

.leaflet-popup-content{

    font-size:14px;

    line-height:1.5;

}

.popup-title{

    font-size:18px;

    color:#198754;

    font-weight:bold;

    margin-bottom:10px;

}

.popup-table{

    width:100%;

    border-collapse:collapse;

}

.popup-table td{

    padding:5px;

    border-bottom:1px solid #eee;

}

/* LEGEND */

.legend{

    background:white;

    padding:10px;

    border-radius:8px;

    box-shadow:var(--shadow);

    line-height:22px;

}

.legend i{

    width:18px;

    height:18px;

    float:left;

    margin-right:8px;

}

/* RESPONSIVE */

@media(max-width:900px){

.container{

grid-template-columns:1fr;

}

.sidebar{

height:320px;

}

}
/*=========================================================
 BASEMAP
=========================================================*/

function initBaseMap(){

APP.osm=L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

maxZoom:19,

attribution:"© OpenStreetMap"

}

);

APP.satellite=L.tileLayer(

"https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"

);

APP.hybrid=L.tileLayer(

"https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"

);

APP.terrain=L.tileLayer(

"https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"

);

}
/*=========================================================
 MAP
=========================================================*/

function initMap(){

APP.map=L.map(

"map",

{

center:CONFIG.CENTER,

zoom:CONFIG.ZOOM,

minZoom:CONFIG.MINZOOM,

maxZoom:CONFIG.MAXZOOM

}

);

APP.osm.addTo(APP.map);

L.control.layers(

{

"OpenStreetMap":APP.osm,

"Google Satellite":APP.satellite,

"Google Hybrid":APP.hybrid,

"Google Terrain":APP.terrain

}

).addTo(APP.map);

}
/*=========================================================
 ĐỌC DỮ LIỆU API
=========================================================*/

async function loadData(){

    try{

        const response = await fetch(CONFIG.API);

        APP.data = await response.json();

        APP.bang = {};

        APP.data.forEach(row=>{

            APP.bang[Number(row.ID)] = row;

        });

    }

    catch(err){

        console.error(err);

        alert("Không đọc được dữ liệu API!");

    }

}


/*=========================================================
 ĐỌC GEOJSON
=========================================================*/

async function loadGeoJSON(){

    try{

        const response = await fetch(CONFIG.GEOJSON);

        APP.boundary = await response.json();

    }

    catch(err){

        console.error(err);

        alert("Không đọc được GeoJSON!");

    }

}
/*=========================================================
 MÀU THEO DỮ LIỆU
=========================================================*/

function getColor(row){

    if(!row) return "#d9d9d9";

    const status = String(row["DTLCP_Trạng thái"] || "").trim();

    if(status==="Đang có dịch"){

        return "#d32f2f";

    }

    if(status==="Đã qua 21 ngày"){

        return "#f9a825";

    }

    return "#43a047";

}
/*=========================================================
 VẼ BẢN ĐỒ
=========================================================*/

function drawMap(){

    APP.geojson = L.geoJSON(

        APP.boundary,

        {

            style:function(feature){

                const id = Number(feature.properties.ID);

                const row = APP.bang[id];

                return{

                    color:"#0b5394",

                    weight:1,

                    fillOpacity:.75,

                    fillColor:getColor(row)

                };

            },

            onEachFeature:onEachCommune

        }

    ).addTo(APP.map);

    APP.map.fitBounds(

        APP.geojson.getBounds()

    );

}/*=========================================================
 POPUP
=========================================================*/

function onEachCommune(feature,layer){

    const id = Number(feature.properties.ID);

    const row = APP.bang[id];

    if(!row){

        layer.bindPopup(feature.properties.TenXa);

        return;

    }

    let html = `

    <div class="popup-title">

    ${row["Tên xã"]}

    </div>

    <table class="popup-table">

    <tr>

    <td>DTLCP</td>

    <td>${row["DTLCP_Trạng thái"]}</td>

    </tr>

    <tr>

    <td>Số ổ dịch</td>

    <td>${row["DTLCP_Ổ dịch"]}</td>

    </tr>

    <tr>

    <td>Tiêu hủy</td>

    <td>${row["DTLCP_Chết"]}</td>

    </tr>

    <tr>

    <td>KSGM</td>

    <td>${row["KSGM_Trạng thái"]}</td>

    </tr>

    <tr>

    <td>Cơ sở thuốc TY</td>

    <td>${row["CSBBTTY_Cơ sở"]}</td>

    </tr>

    </table>

    `;

    layer.bindPopup(html);

}
/*=========================================================
 DASHBOARD
=========================================================*/

function updateDashboard(){

    let dangCoDich = 0;

    let qua21 = 0;

    let tongODich = 0;

    let tongTieuHuy = 0;

    APP.data.forEach(row=>{

        const status = String(row["DTLCP_Trạng thái"] || "");

        if(status==="Đang có dịch"){

            dangCoDich++;

        }

        if(status==="Đã qua 21 ngày"){

            qua21++;

        }

        tongODich += Number(row["DTLCP_Ổ dịch"] || 0);

        tongTieuHuy += Number(row["DTLCP_Chết"] || 0);

    });

    document.getElementById("txtDangCoDich").innerHTML = dangCoDich;

    document.getElementById("txtQua21").innerHTML = qua21;

    document.getElementById("txtODich").innerHTML = tongODich;

    document.getElementById("txtTieuHuy").innerHTML = tongTieuHuy;

}
/*=========================================================
 SEARCH
=========================================================*/

function searchCommune(){

    const keyword = document
        .getElementById("txtSearch")
        .value
        .trim()
        .toLowerCase();

    APP.geojson.eachLayer(layer=>{

        const ten = String(
            layer.feature.properties.TenXa
        ).toLowerCase();

        if(ten.includes(keyword)){

            APP.map.fitBounds(

                layer.getBounds()

            );

            layer.openPopup();

        }

    });

}

document
.getElementById("btnSearch")
.addEventListener(

"click",

searchCommune

);
/*=========================================================
 HOME
=========================================================*/

document
.getElementById("btnHome")
.onclick=function(){

APP.map.setView(

CONFIG.CENTER,

CONFIG.ZOOM

);

};
/*=========================================================
 GPS
=========================================================*/

document
.getElementById("btnLocate")
.onclick=function(){

navigator.geolocation.getCurrentPosition(

function(pos){

APP.map.setView(

[
pos.coords.latitude,
pos.coords.longitude
],

15

);

},

function(){

alert("Không lấy được vị trí.");

}

);

};
/*=========================================================
 INIT
=========================================================*/

async function init(){

    initBaseMap();

    initMap();

    await loadData();

    await loadGeoJSON();

    drawMap();

    updateDashboard();

}

window.onload = init;
