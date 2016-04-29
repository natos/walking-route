function start() {
  var AmsterdamMark = {
    lat: 52.3714633,
    lng: 4.8815704
  };
  var markers = [];
  var selectedMarkers = {};
  var marks = [
    {
      id: 1,
      label: "Vondelpark",
      position: {
        lat: 52.3579979,
        lng: 4.8664597
      }
    },
    {
      id: 2,
      label: "Dam",
      position: {
        lat: 52.3731749,
        lng: 4.8914642
      }
    },
    {
      id: 3,
      label: "Anne Frank House",
      position: {
        lat: 52.3752215,
        lng: 4.8817825
      }
    }
  ];
  var styles = [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: AmsterdamMark
  });

  map.setOptions({styles: styles});

  var $selected = document.getElementById('selected-marks');

  function selectMark() {
    // map.setCenter(this.getPosition());
    var labelId = 'label_' + this.mark.id;
    var isAlreadySelected = document.getElementById(labelId);
    if (isAlreadySelected) {
      selectedMarkers[labelId] = null;
      delete selectedMarkers[labelId];
      isAlreadySelected.parentNode.removeChild(isAlreadySelected);
      console.log('selectedMarkers', selectedMarkers);
      calculateAndDisplayRoute();
      return;
    }
    var label = document.createElement('div');
    label.className = "marker-label";
    label.id = labelId;
    label.innerHTML = this.mark.label;
    selectedMarkers[labelId] = this;
    $selected.appendChild(label);
    console.log('selectedMarkers', selectedMarkers);
    calculateAndDisplayRoute();
  }

  function dropMark(mark, timeout) {
    window.setTimeout(function() {
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: mark.position,
        mark: mark,
        map: map
      });
      marker.addListener('click', selectMark);
      markers.push(marker);
    }, timeout);
  }

  for (var i = 0; i < marks.length; i += 1) {
    var mark = marks[i];
    dropMark(mark, i * 350);
  }

  directionsDisplay.setMap(map);
  directionsDisplay.setOptions({
    suppressMarkers: true//,
    // polylineOptions: {
    //   strokeWeight: 4,
    //   strokeOpacity: 1,
    //   strokeColor:  'red'
    // }
  });

  // document.getElementById('route').addEventListener('click', function() {
  //     calculateAndDisplayRoute(directionsService, directionsDisplay);
  // });

  function calculateAndDisplayRoute() {
      var waypts = [];
      for (m in selectedMarkers) {
        var mark = selectedMarkers[m].mark;
        waypts.push({
            location: new google.maps.LatLng(mark.position.lat, mark.position.lng),
            // stopover: true
        });
      }
      // for (var i = 0; i < checkboxArray.length; i++) {
      //     if (checkboxArray[i].checked) {
      //         waypts.push({
      //             location: checkboxArray[i].value,
      //             stopover: true
      //         });
      //     }
      // }

      if (waypts.length < 2) {
        // directionsDisplay.setMap(null);
        return;
      }
console.log('waypts1', waypts.length)
      var directions = {
          origin: waypts.shift(),
          destination: waypts.pop(),
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.WALKING
      };
console.log('waypts2', waypts, waypts.length)
      if (waypts.length) {
        directions.waypoints = waypts;
      }

      console.log('directions', directions)

      directionsService.route(directions, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              var route = response.routes[0];
              var summaryPanel = document.getElementById('directions-panel');
              summaryPanel.innerHTML = '';
              var totalDurationMin = 0;
              var totalDistanceMiles = 0;
              // For each route, display summary information.
              for (var i = 0; i < route.legs.length; i++) {
                  totalDurationMin += route.legs[i].duration.value / 60; // to minutes
                  totalDistanceMiles += route.legs[i].distance.value / 1000; // to km
                  var routeSegment = i + 1;
                  summaryPanel.innerHTML += route.legs[i].duration.text + ': <b>Route Segment: ' + routeSegment + '</b><br>';
                  summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                  summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                  summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
              }
              var totals = document.getElementById('totals');
              totals.innerHTML = '<p><strong>Total Miles:</strong> ' + (Math.round(totalDistanceMiles * 10) / 10) + ' km <strong>Total Duration:</strong> ' + (Math.round(totalDurationMin * 100) / 100) + ' min</p>';
          } else {
              window.alert('Directions request failed due to ' + status);
          }
      });
  }
}
