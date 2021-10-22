'use-strict';

const Index = function () {

    let _addMarker = function () {
        setTimeout(function () {
            _map.addListener("click", (mapsMouseEvent) => {

                let _location = mapsMouseEvent.latLng.toJSON();

                areaBoundariesArr.push(_location);

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
                if (myAreasArr.length > 0) {
                    for (var i = 0; i < myAreasArr.length; i++) {
                        let polygon = myAreasArr[i].area;
                        if (google.maps.geometry.poly.containsLocation(_marker.getPosition(), polygon)) {
                            _addLog(`Merker #${_markerNumber} inside the area: (${myAreasArr[i].name})`);
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
        mapTypeId: "hybrid",
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

    let area = _drawAnArea(boundaries);
    let areaItem = { name: 'default area', area: area };

    _setAreaName(areaItem.name, boundaries[0]);

    myAreasArr.push(areaItem);

    return _map;
}