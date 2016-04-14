function start() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {
            lat: 52.37,
            lng: 4.90
        }
    });
    directionsDisplay.setMap(map);

    document.getElementById('route').addEventListener('click', function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    var checkboxArray = document.getElementById('waypoints').getElementsByTagName('input');
    for (var i = 0; i < checkboxArray.length; i++) {
        if (checkboxArray[i].checked) {
            waypts.push({
                location: checkboxArray[i].value,
                stopover: true
            });
        }
    }

    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
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