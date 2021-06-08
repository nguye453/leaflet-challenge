var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(link).then((data) => 
{
    createFeatures(data.features);
});

function createFeatures(earthquakeData) 
{
    function onEachFeature(feature, layer) 
    {
        layer.bindPopup("<h3 align='center'>" + feature.properties.place +
            "</h3><hr><p><u>Occurrence:</u> " + new Date(feature.properties.time) + "</p>" +
            "</h3><p><u>Magnitude:</u> " + feature.properties.mag + "</p>" +
            "</h3><p><u>Depth:</u> " + feature.geometry.coordinates[2] + "</p>");
            // ADD MORE DATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    var earthquakes = L.geoJSON(earthquakeData, 
    {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) 
        {
            var markerStyling = {
                radius: (5 * feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 1
            };
            return L.circleMarker(latlng, markerStyling);
        }
    });
    
    createMap(earthquakes);
}

function createMap(earthquakes) 
{
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });
 
    var map = L.map("map", 
    {
        center: [10.141932, -36.585693],
        zoom: 2.0,
        layers: [lightmap, earthquakes]
    });

    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) 
    {    
        var div = L.DomUtil.create('div', 'info legend'),
        depthLevels = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
        div.innerHTML+='Depth<br><hr>'
    
        for (var i = 0; i < depthLevels.length; i++) 
        {
            div.innerHTML +=
                '<i style="background:' + getColor(depthLevels[i]) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
        }
    
    return div;
    };
    
    legend.addTo(map);
}

function getColor(d) {
    var fillColor = "";

    if (d < 10) {
        fillColor = "#89eb34";
    }
    else if (d < 30) {
        fillColor = "#c3eb34";
    }
    else if (d < 50) {
        fillColor = "#ebeb34";
    }
    else if (d < 70) {
        fillColor = "#ebc934";
    }
    else if (d < 90) {
        fillColor = "#eb8934";
    }
    else {
        fillColor = "#eb3434";
    }

    return fillColor;
}