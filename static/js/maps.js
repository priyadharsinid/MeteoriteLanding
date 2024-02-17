// JSON data URL
let queryUrl = "/meteorites";
console.log(queryUrl);

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // Console log the data retrieved 
    console.log(data);
    // Once we get a response, send the data to the createFeatures function
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
});

function createFeatures(meteoriteData) {
    // Define the getColor function to assign color based on mass
    function getColor(mass) {
        if (mass < 10000) {
            return '#00FF00';
        } else if (mass < 50000) {
            return '#FFFF00';
        } else if (mass < 100000) {
            return '#41b6c4';
        } else if (mass < 207000) {
            return '#FF0000';
        } else if (mass < 409000) {
            return '#081d58';
        } else {
            return '#FF0000';
        }
    }

    // Define a function to create popups for each feature
    function onEachFeature(feature, layer) {
        // Access properties using dot notation
        var name = feature.name;
        var mass = feature.properties.mass;
         var geoLocation = feature.geometry.coordinates;
        
        // Log properties to console for debugging
        console.log('Name:', name);
        console.log( mass );
        console.log('GeoLocation:', geoLocation);

        // Bind popup to the layer
        layer.bindPopup(`<h3>Mass:${mass}</h3><hr><p>Name: ${name}</p><p>GeoLocation: ${geoLocation}</p>`);
    }

    // Create a GeoJSON layer
    var meteroides = L.geoJSON(meteoriteData, {
        pointToLayer: function(feature, latlng) {
            // Create circle marker with radius based on mass and color based on mass category
            var mass = feature.properties.mass;
            var location = feature.geometry.coordinates;
            return L.circleMarker(latlng, {
                radius: Math.sqrt(mass) / 100,
                fillColor: getColor(mass),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    });

    // Send the meteroides layer to the createMap function
    createMap(meteroides,location);
}

function createMap(meteroides,heatArray) {
    // Create the base layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object
    var baseMaps = {
        "Street Map": street
    };

    let heat = L.heatLayer(heatArray, {
        radius: 20,
        blur: 35
      });

    // Create an overlay object to hold our overlay
    var overlayMaps = {
        "meteroites": meteroites,
        "heatlayer" :heat
    };

    

    // Create our map, giving it the streetmap and meteroides layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, meteroides,heat]
    });
    //let heat = L.heatLayer(heatArray, {
    //     radius: 20,
    //     blur: 35
    //   }).addTo(myMap); 
    // Create a layer control
    // Pass it our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend control
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
       
        var depthColors = ['#00FF00', '#FFFF00', '#FFA500',  '#41b6c4', '#081d58','#FF0000'];
        var depthLabels = ['0 - 10k', '10k - 50k', '50k - 100k', '100k - 207k', '207k - 409k', '> 409k'];

        for (var i = 0; i < depthColors.length; i++) {
            div.innerHTML +=
                '<i style="background:' + depthColors[i] + '; width: 20px; height: 20px; display: inline-block;"></i> ' +
                depthLabels[i] + '<br>';
        }
        return div;
    };

    // Add legend to the map
    legend.addTo(myMap);
   
}