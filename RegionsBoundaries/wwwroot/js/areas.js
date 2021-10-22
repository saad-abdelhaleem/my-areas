'use-strict';

const Areas = function () {

    let areaBoundaries = [],
        newPolygon = null;

    let _pageSelectors = {
        txtAreaName: '#txtAreaName',
        btnSaveNewArea: '#btnSaveNewArea',
        btnCancelNewArea: '#btnCancelNewArea',
        modalNewArea: '#modalNewArea'
    };

    let _txtAreaName,
        _btnSaveNewArea,
        _btnCancelNewArea,
        _modalNewArea;

    let _resetNewAreaForm = function () {
        _txtAreaName.val('');
        _btnSaveNewArea.prop('disabled', true);

        areaBoundaries = [];
        newPolygon = null;

        _modalNewArea.modal('hide');
    };

    let _enableDisableSaveBtn = function () {
        let areaName = $.trim(_txtAreaName.val());
        if (areaName.length > 0)
            _btnSaveNewArea.prop('disabled', false);
        else
            _btnSaveNewArea.prop('disabled', true);
    };

    let _bindTextChange = function () {
        _txtAreaName.keyup(function () {
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

            if (areaBoundaries.length == 0) {
                alert('Please specify the area points on the map');
                _resetNewAreaForm();
                return;
            }

            for (var area of myAreasArr) {
                if (area.name.toLocaleUpperCase() == areaName.toLocaleUpperCase()) {
                    alert(`There is an area with tha same name (${areaName}) already exist`);
                    return;
                }
            }
            
            _setAreaName(areaName, areaBoundaries[0]);

            //save area to my areas 
            _saveAnArea(areaName, areaBoundaries);

            _addLog(`Area (${areaName}) has been added successfully!`);

            _resetNewAreaForm();
        });
    };

    let _bindCancelNewArea = function () {
        _btnCancelNewArea.click(function () {
            areaBoundaries = [];

            //TODO: Delete polygon
            newPolygon.setMap(null);

            _modalNewArea.modal('hide');
        });
    };

    return {
        iniGoogleMap: function () {
            _map = new google.maps.Map(
                document.getElementById("map"), {
                center: defaultLatlng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            _renderSavedAreas();

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                },
                polygonOptions: {
                    fillColor: '#BCDCF9',
                    strokeColor: '#57ACF9',
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                    clickable: false,
                    editable: false,
                    zIndex: 1
                }
            });

            drawingManager.setMap(_map)

            google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
                //_addLog("polygon points:" + "<br>");
                for (var i = 0; i < polygon.getPath().getLength(); i++) {
                    areaBoundaries.push(polygon.getPath().getAt(i));
                }
                newPolygon = polygon;
                _modalNewArea.modal('show');
            });
            return _map;
        },
        init: function () {
            _btnSaveNewArea = $(_pageSelectors.btnSaveNewArea);
            _btnCancelNewArea = $(_pageSelectors.btnCancelNewArea);
            _txtAreaName = $(_pageSelectors.txtAreaName);
            _modalNewArea = $(_pageSelectors.modalNewArea);

            _resetNewAreaForm();

            _bindTextChange();
            _bindSaveNewArea();
            _bindCancelNewArea();
        }
    }

}();


$(function () {
    Areas.init();
});

function initMap() {
    Areas.iniGoogleMap();
}