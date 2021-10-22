'use-strict';

const Areas = function () {

    let _pageSelectors = {
        btnAddNewArea: '#btnAddNewArea',
        txtAreaName: '#txtAreaName',
        btnSaveNewArea: '#btnSaveNewArea'
    };

    let _btnAddNewArea,
        _txtAreaName,
        _btnSaveNewArea;

    let geocoder;
    let polygonArray = [];


    let _resetNewAreaForm = function () {
        _txtAreaName.prop('disabled', true).val('');
        _btnSaveNewArea.prop('disabled', true);
    };

    let _enableDisableSaveBtn = function () {
        let areaName = $.trim(_txtAreaName.val());
        if (areaName.length > 0)
            _btnSaveNewArea.prop('disabled', false);
        else
            _btnSaveNewArea.prop('disabled', true);
    };

    let _drawPolygon = function (polygonCoords) {
        var bounds = new google.maps.LatLngBounds();
        var i;

        for (i = 0; i < polygonCoords.length; i++) {
            bounds.extend(polygonCoords[i]);
        }

        // The Center of the Bermuda Triangle - (25.3939245, -72.473816)
        let center = bounds.getCenter();

    };

    let _bindAddNew = function () {
        _btnAddNewArea.click(function () {
            _txtAreaName.prop('disabled', false).val('').focus();
            _enableDisableSaveBtn();

            areaBoundariesArr = [];

            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to start spicefy the area",
                position: defaultLatlng,
            });

            infoWindow.open(_map);

            google.maps.event.clearListeners(_map, 'click');
            _map.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                infoWindow.close();

                let _location = mapsMouseEvent.latLng.toJSON();

                areaBoundariesArr.push(_location);

                let _markerNumber = markersArr.length + 1;
                _marker = new google.maps.Marker({
                    position: _location,
                    title: `${_markerNumber}`,
                    label: `${_markerNumber}`,
                    optimized: false,
                    map: map
                });

                markersArr.push(_marker);

                let isExist = false;
                if (polygonsArr.length > 0) {
                    for (var polygon of polygonsArr) {
                        if (google.maps.geometry.poly.containsLocation(_marker.getPosition(), polygon)) {
                            _addLog(`Merker #${_markerNumber} inside the polygon`);
                            isExist = true;
                            break;
                        }
                    }
                }

                if (isExist == false)
                    _addLog(`Merker #${_markerNumber} outside all covered areas, expect a call from our CS in 24 hours`, 'alert-danger');

            });

        });
    };

    let _bindTextChange = function () {
        _txtAreaName.blur(function () {
            _enableDisableSaveBtn();
        });
    };

    let _bindSaveNewArea = function () {
        _btnSaveNewArea.click(function () {
            let areaName = $.trim(_txtAreaName.val());
            if (areaName.length == 0) {
                alert('Please enter the area name');
                return;
            }

            if (areaBoundariesArr.length == 0) {
                alert('Please specify the area points on the map');
                return;
            }

            //TODO: validate polygon/ is valid area
            if (areaBoundariesArr.length < 3) {
                alert('Minimum area points on the map is 3 points');
                return;
            }

            //colse the polygon if opened
            let firstItem = areaBoundariesArr[0],
                lastItem = areaBoundariesArr[areaBoundariesArr.length - 1];
            if (firstItem.lat != lastItem.lat && firstItem.lng != lastItem.lng) {
                areaBoundariesArr.push(firstItem);
            }

            //drow a polygon
            let area = _drawAnArea(areaBoundariesArr);

            _setAreaName(areaName, area);

            //save area to my areas 
            myAreasArr.push({ name: areaName, area: area });

            _resetNewAreaForm();
        });
    };

    let _resetNewAreaForm = function () {
        _txtAreaName.prop('disabled', true).val('');
        _btnSaveNewArea.prop('disabled', true);
    };

    let _enableDisableSaveBtn = function () {
        let areaName = $.trim(_txtAreaName.val());
        if (areaName.length > 0)
            _btnSaveNewArea.prop('disabled', false);
        else
            _btnSaveNewArea.prop('disabled', true);
    };

    return {
        init: function () {

            _btnAddNewArea = $(_pageSelectors.btnAddNewArea);
            _btnSaveNewArea = $(_pageSelectors.btnSaveNewArea);
            _txtAreaName = $(_pageSelectors.txtAreaName);

            _resetNewAreaForm();

            _bindAddNew();
            _bindTextChange();
            _bindSaveNewArea();
        }
    }

}();


$(function () {
    Areas.init();
});

function initMap() {
    _map = new google.maps.Map(
        document.getElementById("map"), {
        center: defaultLatlng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE]
        },
        markerOptions: {
            icon: 'images/car-icon.png'
        },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
        },
        polygonOptions: {
            fillColor: '#BCDCF9',
            fillOpacity: 0.5,
            strokeWeight: 2,
            strokeColor: '#57ACF9',
            clickable: false,
            editable: false,
            zIndex: 1
        }
    });
    console.log(drawingManager)
    drawingManager.setMap(map)

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        document.getElementById('info').innerHTML += "polygon points:" + "<br>";
        for (var i = 0; i < polygon.getPath().getLength(); i++) {
            document.getElementById('info').innerHTML += polygon.getPath().getAt(i).toUrlValue(6) + "<br>";
        }
        polygonArray.push(polygon);
    });
    return _map;
}

const COLOR = '#E74C3C';
let map;
let flightPath;
let _markersArr = [];

function resetMap() {
    if (typeof flightPath != 'undefined') {
        flightPath.setMap(null);
        for (var marker of _markersArr) {
            marker.setMap(null);
        }
    }
}

function drowRepPath(userVisitesArr) {
    if (typeof userVisitesArr == 'undefined' || userVisitesArr.length == 0)
        return false;

    var _locationsArr = [];
    _markersArr = [];
    for (let index in userVisitesArr) {

        index = parseInt(index);

        var item = userVisitesArr[index];
        var _location = {
            lat: parseFloat(item.Latitude),
            lng: parseFloat(item.Longitude)
        };
        var _createdOn = formatDate(item.CreatedOn);
        _locationsArr.push(_location);

        var _marker;
        //start marker
        if (index == 0) {
            _marker = new google.maps.Marker({
                position: _location,
                title: "Start: " + _createdOn,
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 5,
                    strokeColor: COLOR,
                },
                map: map
            });
        }
        //end marker
        else if (index + 1 == userVisitesArr.length) {
            _marker = new google.maps.Marker({
                position: _location,
                title: "End: " + _createdOn,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    strokeColor: COLOR,
                },
                map: map
            });
        }
        else {
            _marker = new google.maps.Marker({
                position: _location,
                title: `${index + 1} - ${_createdOn}`,
                label: `${index + 1}`,
                optimized: false,
                map: map
            });
        }

        _markersArr.push(_marker);
    }

    flightPath = new google.maps.Polyline({
        path: _locationsArr,
        geodesic: true,
        strokeColor: COLOR,
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    flightPath.setMap(map);
}