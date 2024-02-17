let myMap = L.map("map", {
   center: [37.09, -95.71],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "/meteorites"
d3.json(url).then(function(data) {

  let features = [];

    for (i = 0; i < data.length; i++) {
        let feature = {
            "type": "Feature",
            "name": data[i].name,
            "properties": {
                "mass": data[i].mass
            },

            "geometry": {
                "type": "Point",
                "coordinates": [data[i].latitude, data[i].longitude]
            }
        }
        features.push(feature);
    }
    console.log(features);
    createFeatures(features);

  let heatArray = [];

  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    if (location) {
      //console.log(location);
      heatArray.push([location.coordinates[1], location.coordinates[0]]);
    }

  }

  let heat = L.heatLayer(heatArray, {
    radius: 20,
    gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'}
    // blur: 35
  }).addTo(myMap);




});
