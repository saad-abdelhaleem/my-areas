'use-strict';

const Index = function () {

    let markersArr = [];

    let _addMarker = function () {
        setTimeout(function () {
            _map.addListener("click", (mapsMouseEvent) => {

                let _location = mapsMouseEvent.latLng.toJSON();

                let _markerNumber = markersArr.length + 1;
                const _marker = new google.maps.Marker({
                    position: _location,
                    title: `${_markerNumber}`,
                    label: `${_markerNumber}`,
                    optimized: false,
                    map: _map
                });

                markersArr.push(_marker);

                let isExist = false;
                if (mapAreasArr.length > 0) {
                    for (var i = 0; i < mapAreasArr.length; i++) {
                        let polygon = mapAreasArr[i].area;
                        if (google.maps.geometry.poly.containsLocation(_marker.getPosition(), polygon)) {
                            _addLog(`Merker #${_markerNumber} inside the area: (${mapAreasArr[i].name})`);
                            isExist = true;
                            break;
                        }
                    }
                }

                if (isExist == false)
                    _addLog(`Merker #${_markerNumber} outside all covered areas, expect a call from our CS in 24 hours`, 'alert-danger');

            });
        }, 500);
    }

    return {
        init: function () {
            _addMarker();
        }
    }
}();

$(function () {
    Index.init();
});

function initMap() {
    _map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP//"hybrid",
    });

    const boundaries = [
        { lat: 30.042122, lng: 31.1912467 },
        { lat: 30.0412676, lng: 31.181462 },
        { lat: 30.0446346, lng: 31.1810333 },
        { lat: 30.0442976, lng: 31.1735613 },
        { lat: 30.030888, lng: 31.1622343 },
        { lat: 30.0328296, lng: 31.1948823 },
        { lat: 30.042122, lng: 31.1912467 },
    ];

    _renderSavedAreas();

    let defaultArea = _drawAnArea(boundaries);
    let areaName= 'Bolaq Dakror';

    _setAreaName(areaName, boundaries[0]);

    _saveAnArea(areaName, boundaries);
    mapAreasArr.push({ name: areaName, area: defaultArea });

    return _map;
}