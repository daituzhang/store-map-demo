var items = [];
var app = new Vue({
  el: '#app',
  data: {
    items: items
  },
  methods: {
    reset: function() {
      localStorage.removeItem('items');
      items = [];
      this.items = items;
      markers.features = [];
      layerGroup.clearLayers(); // inherited from LayerGroup
      layerGroup.addData(markers);
    }
  }
})

var aisles = [{
  l:12.5,
  r:24.5,
  t:100,
  b:51
},{
  l:44,
  r:56,
  t:100,
  b:51
},{
  l:74,
  r:87,
  t:100,
  b:51,
}
]

function layerClickHandler (e) {
  var marker = e.target,
  properties = e.target.feature.properties,
  geometry = e.target.feature.geometry,
  lng = geometry.coordinates[0],
  lat = geometry.coordinates[1];
   var popup = '<form id="add-item">\
   <label for="name">Name</label><br>\
   <input id="item-'+properties.index +'-name" type="text" name="name" value="'+properties.name+'">\
   </form>';
   if (marker.hasOwnProperty('_popup')) {
    marker.unbindPopup();
  }
   marker.bindPopup(popup);
   marker.openPopup();
  var inputName = L.DomUtil.get('item-'+properties.index +'-name');
  var aisle;

  if (lng >= aisles[0].l && lng <= aisles[0].r && lat >= aisles[0].b && lat <= aisles[0].t) {
    aisle = 1;
  } else if (lng >= aisles[1].l && lng <= aisles[1].r && lat >= aisles[1].b && lat <= aisles[1].t) {
    aisle = 2;
  } else if (lng >= aisles[2].l && lng <= aisles[2].r && lat >= aisles[2].b && lat <= aisles[2].t) {
    aisle = 3;
  }

  L.DomEvent.addListener(inputName, 'change', function (e) {
    if(items[properties.index]) {
      items[properties.index] = {
        name: e.target.value,
        lat: lat,
        lng: lng,
        aisle: aisle
      }; 
    } else {
      items.push( {
        name: e.target.value,
        lat: lat,
        lng: lng,
        aisle: aisle
      })
    }

    localStorage.setItem('items', JSON.stringify(items));
    
    properties.name =  e.target.value;
    markers.features[properties.index].name = e.target.value;
  });
}

var mapAgent = L.map('map-agent', {
  crs: L.CRS.Simple,
  minZoom: 1
});
var bounds = [[0,0], [100,100]];
var image = L.imageOverlay('map.png', bounds).addTo(mapAgent);
var markers = {
  "type": "FeatureCollection",
  "features": []
};
var layerGroup = L.geoJSON(markers, {
  onEachFeature: function (feature, layer) {
    layer.on('click', layerClickHandler);
  }
}).addTo(mapAgent);
mapAgent.fitBounds(bounds);


mapAgent.on('click', function(e){
  var coord = e.latlng;
  var lat = coord.lat;
  var lng = coord.lng;
  console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
  var index = items.length;
  markers.features.push({
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
        lng,
        lat
      ]
    },
    "properties": {
      "name": "",
      "index": index
    }
  });  
  layerGroup.clearLayers(); // inherited from LayerGroup
  layerGroup.addData(markers);
});

