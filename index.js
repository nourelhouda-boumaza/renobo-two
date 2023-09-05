
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoicmVub2JvIiwiYSI6ImNsbHRjbHA0cTAyeW4zZG1kd3FncHptcDEifQ.oz3-6Ilvjwr2SkgDJxv3mw';
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/dark-v11',
  center: { lng: -122.43071924561035, lat: 37.806738206553305 },
  zoom: 0.8,
  pitch: 10,
  bearing: 0,
  antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
});

// Add the control to the map.
map.addControl(
  new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: {
    color: 'white' // Set the marker color to your desired color
}
  })
  );
// Define the flyToBuilding function
function flyToBuilding(coordinates) {
  map.flyTo({
    center: coordinates, // Coordinates of the building (longitude, latitude)
    zoom: 15.4, // Adjust the zoom level as needed
    bearing: 45, // You can change the bearing (rotation) if desired
    speed: 1.5, // Adjust the animation speed
    curve: 1, // Use a linear animation curve
    pitch: 70,
    easing: function (t) {
      return t;
    },
    essential: true // This ensures the animation is considered essential and won't be interrupted
  });
}
var flyButton = document.getElementById('fly-button');

flyButton.addEventListener('click', function () {
  // Coordinates of the building (longitude, latitude)
  var buildingCoordinates = [-122.43075947189408, 37.807074033128124]; // Replace with the coordinates of your building
  flyToBuilding(buildingCoordinates);
});

// eslint-disable-next-line no-undef
const tb = (window.tb = new Threebox(
  map,
  map.getCanvas().getContext('webgl'),
  {
    defaultLights: true
  }
));

map.on('style.load', () => {
  map.addLayer({
    id: 'custom-threebox-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function () {
      // Creative Commons License attribution:  Metlife Building model by https://sketchfab.com/NanoRay
      // https://sketchfab.com/3d-models/metlife-building-32d3a4a1810a4d64abb9547bb661f7f3
      const scale = 3.2;
      const options = {
        obj: 'buildspace_structure_raw3d.gltf',
        type: 'gltf',
        scale: { x: 0.0009, y: 0.0009, z: 0.0009 },
        units: 'meters',
        rotation: { x: 90, y: 217.5, z: 0 }
      };

      tb.loadObj(options, (model) => {
        model.setCoords([-122.43075947189408, 37.807074033128124]);
        model.setRotation({ x: 0, y: 0, z: 241 });
        tb.add(model);
      });
    },

    render: function () {
      tb.update();
    }
  });
});
