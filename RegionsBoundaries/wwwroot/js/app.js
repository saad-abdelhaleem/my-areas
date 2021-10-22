'use-strict';


const defaultLatlng = { lat: 30.0589653, lng: 31.2124118 };

let _map;

let _lblLoger = $('#loger'),
    myAreasArr = [],
    areaBoundariesArr = [],
    markersArr = [],
    polygonsArr = [];

let _setAreaName = function (name, areaPosition) {

    if (typeof name == 'undefined' || name == null || $.trim(name) == '') {
        throw new Error('name can not be null');
    }

    let infoWindow = new google.maps.InfoWindow({
        content: name,
        position: areaPosition,
    });

    infoWindow.open(_map);
}

let _drawAnArea = function (locationsArr = []) {
    if (locationsArr.length == 0)
        return false;

    const _polygon = new google.maps.Polygon({
        paths: locationsArr,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        clickable: false,
    });

    _polygon.setMap(_map);

    polygonsArr.push(_polygon);

    return _polygon;
}

let _polygonCenter = function (poly) {
    const vertices = poly.getPath();

    // put all latitudes and longitudes in arrays
    const longitudes = new Array(vertices.length).map((_, i) => vertices.getAt(i).lng());
    const latitudes = new Array(vertices.length).map((_, i) => vertices.getAt(i).lat());

    // sort the arrays low to high
    latitudes.sort();
    longitudes.sort();

    // get the min and max of each
    const lowX = latitudes[0];
    const highX = latitudes[latitudes.length - 1];
    const lowy = longitudes[0];
    const highy = longitudes[latitudes.length - 1];

    // center of the polygon is the starting point plus the midpoint
    const centerX = lowX + ((highX - lowX) / 2);
    const centerY = lowy + ((highy - lowy) / 2);

    return (new google.maps.LatLng(centerX, centerY));
}

let _addLog = function (message, cssClass = 'alert-success') {
    if (typeof message == 'undefined' || message == null || $.trim(message) == "")
        throw new Error('message can not be empty');

    _lblLoger.prepend(`<li class="alert ${cssClass} my-1">${message}</li>`);
}
