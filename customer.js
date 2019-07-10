var items = JSON.parse(localStorage.getItem('items'))
var markers = {
  "type": "FeatureCollection",
  "features": []
};
var app = new Vue({
  el: '#app',
  data: {
    items: items
  },
  methods: {
    onClick: function(item) {
      console.log(item);
      markers.features = [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              item.lng,
              item.lat
            ]
          },
          "properties": {
            "name": item.name,
            "index": item.index
          }
        }
      ];
      layerGroup.clearLayers(); // inherited from LayerGroup
      layerGroup.addData(markers);
    }
  }
  
});


var mapCustomer = L.map('map-customer', {
  crs: L.CRS.Simple,
  minZoom: 1
});
var bounds = [[0,0], [100,100]];
var image = L.imageOverlay('map.png', bounds).addTo(mapCustomer);
var layerGroup = L.geoJSON(markers).addTo(mapCustomer);
mapCustomer.fitBounds(bounds);