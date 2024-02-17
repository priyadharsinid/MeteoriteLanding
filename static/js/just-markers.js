let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "/meteorites";
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
  

  //console.log(features);

  // Comment this line in to render all 80,000 markers
  // let marker_limit = features.length;
  let marker_limit = 1000;

  for (let i = 0; i < marker_limit; i++) {

    let location = features[i].geometry;
    if(location){
      L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
    }

  }

});
