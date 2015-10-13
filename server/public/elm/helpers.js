// var map = Elm.fullscreen(Elm.Main);


// var insertedNodes = [];
// var observer = new MutationObserver(function(mutations) {
//  mutations.forEach(function(mutation) {
//    for (var i = 0; i < mutation.addedNodes.length; i++)
//      insertedNodes.push(mutation.addedNodes[i]);
//  })
//  console.log(insertedNodes);
// });
// observer.observe(document, { childList: true });

var mapDiv;

// map.ports.mapdiv.subscribe(function(state) {
//     if (state = "Editing") {
//         mapDiv = mapDiv || document.getElementById('map');
//     }
// });

map.ports.gmap.subscribe(function(load) {
    // console.log(load);

    setTimeout( function() {

        mapDiv = document.getElementById('map');

        if (mapDiv) {
            var myLatlng = new google.maps.LatLng(43, 4.5);
            var mapOptions = {
              zoom: 12,
              center: myLatlng
            };
            var gmap = new google.maps.Map(mapDiv, mapOptions);
            // gmap.addListener('zoom_changed', function() {
            //     var z = gmap.getZoom();
            //     console.log("Zoom:", z);
            //     // causes loop and prevents user changing map zoom
            //     // map.ports.zoom.send(z);
            // });
        }

        if (load.length) {
            var mybounds = new google.maps.LatLngBounds();

            load.forEach(function(pos) {
                var markerPos = new google.maps.LatLng(pos.lat, pos.lng);
                var m = new google.maps.Marker({
                    position: markerPos,
                    map: gmap
                });
                mybounds.extend(markerPos);
            });
            gmap.fitBounds(mybounds);
            var listener = google.maps.event.addListenerOnce(gmap, "idle", function() {
                var z = gmap.getZoom();
                console.log("Zoom:", z);
                map.ports.zoom.send(z);
            });
        }
    }, 50)
});
