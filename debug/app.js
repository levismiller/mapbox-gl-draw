var StaticMode = require('@mapbox/mapbox-gl-draw-static-mode');


// Parse the access_token out of the url
var args = location.search.replace(/^\?/, '').split('&').reduce(function (o, param) { var keyvalue = param.split('='); o[keyvalue[0]] = keyvalue[1]; return o; }, {});

mapboxgl.accessToken = args.access_token || localStorage.accessToken;

var map = new mapboxgl.Map({
  container: 'map',
  zoom: 1,
  center: [0, 0],
  style: 'mapbox://styles/mapbox/streets-v8'
});

map.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken
}));

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

var modes = MapboxDraw.modes;
modes.static = StaticMode;
var Draw = window.Draw = new MapboxDraw({ modes: modes });
var drawIsActive = true;
map.addControl(Draw, 'bottom-right');

map.on('load', function () {

  // Add Draw to the map if it is inactive
  var addButton = document.getElementById('addBtn');
  addButton.onclick = function () {
    if (drawIsActive) return;
    drawIsActive = true;
    var draw = map.addControl(Draw, 'bottom-right');
  }

  // Remove draw from the map if it is active
  var removeButton = document.getElementById('removeBtn');
  removeButton.onclick = function () {
    if (!drawIsActive) return;
    drawIsActive = false;
    map.removeControl(Draw);
  }

  map.on('draw.create', (e) => {
    console.log('create ...', e);
    e.features[0].properties.draggable = false;

    var ids = Draw.set({
      type: 'FeatureCollection',
      features: [e.features[0]]
    });
  })

  map.on('draw.dragfeature', (e) => {
    console.log('dragfeature ...', e);
  })

  map.on('draw.dragvertex', (e) => {
    console.log('dragvertex ...', e);
  })

  map.on('draw.dragstart', (e) => {
    console.log('dragstart ...', e);
  })

  map.on('draw.dragstop', (e) => {
    console.log('dragstop ...', e);
  })

  // Toggle the style between dark and streets
  var flipStyleButton = document.getElementById('flipStyleBtn');
  var currentStyle = 'streets-v9';
  flipStyleButton.onclick = function () {
    var style = currentStyle === 'streets-v9' ? 'dark-v9' : 'streets-v9';
    map.setStyle('mapbox://styles/mapbox/' + style);
    currentStyle = style;
  }

  // toggle double click zoom
  var doubleClickZoom = document.getElementById('doubleClickZoom');
  var doubleClickZoomOn = true;
  doubleClickZoom.onclick = function () {
    if (doubleClickZoomOn) {
      doubleClickZoomOn = false;
      map.doubleClickZoom.disable();
      doubleClickZoom.innerText = 'enable dblclick zoom'
    } else {
      map.doubleClickZoom.enable();
      doubleClickZoomOn = true;
      doubleClickZoom.innerText = 'disable dblclick zoom'
    }
  }

  // Jump into draw point mode via a custom UI element
  var startPoint = document.getElementById('start-point');
  startPoint.onclick = function () {
    Draw.changeMode('draw_point');
  };

  // Jump into draw line mode via a custom UI element
  var startLine = document.getElementById('start-line');
  startLine.onclick = function () {
    Draw.changeMode('draw_line_string');
  };

  // Jump into draw polygon mode via a custom UI element
  var startPolygon = document.getElementById('start-polygon');
  startPolygon.onclick = function () {
    Draw.changeMode('draw_polygon');
  };

  // Jump into static mode via a custom UI element
  var startStatic = document.getElementById('start-static');
  startStatic.onclick = function () {
    Draw.changeMode('static');
  };

});
