'use-strict';

const MY_AREAS_KEY = 'MySavedAreas';
const defaultLatlng = { lat: 30.0589653, lng: 31.2124118 };

let _map;

let _lblLoger = $('#loger'),
    myAreasArr = [],
    mapAreasArr = [];

let _drawAnArea = function (locationsArr = []) {
    if (locationsArr.length == 0)
        return false;

    const _polygon = new google.maps.Polygon({
        paths: locationsArr,
        //strokeColor: "#FF0000",
        //fillColor: "#FF0000",
        fillColor: '#93b69d',
        strokeColor: '#60a774',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0.35,
        clickable: false,
    });

    _polygon.setMap(_map);

    return _polygon;
}

let _renderSavedAreas = function () {
    var savedAreas = JSON.parse(localStorage.getItem(MY_AREAS_KEY));
    if (savedAreas && savedAreas.length > 0) {
        for (var _areaItem of savedAreas) {
            let area = _drawAnArea(_areaItem.area);
            _setAreaName(_areaItem.name, _areaItem.area[0]);
            mapAreasArr.push({ name: _areaItem.name, area: area });
            _saveAnArea(_areaItem.name, _areaItem.area);
        }
    }
}

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

let _saveAnArea = function (areaName, areaPolygonPath) {

    for (var ar of myAreasArr) {
        if (ar.name == areaName) {
            return;
        }
    }

    myAreasArr.push({ name: areaName, area: areaPolygonPath });

    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    var jsonStr = JSON.stringify(myAreasArr, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            // Duplicate reference found, discard key
            if (cache.includes(value)) return;

            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection

    localStorage.setItem(MY_AREAS_KEY, jsonStr);
}

let getPolygonDefaultPosition = function (polygon) {
    return polygon.getPath().getAt(0);
}

let _addLog = function (message, cssClass = 'alert-success') {
    if (typeof message == 'undefined' || message == null || $.trim(message) == "")
        throw new Error('message can not be empty');

    _lblLoger.prepend(`<li class="alert ${cssClass} my-1">${message}</li>`);
}
