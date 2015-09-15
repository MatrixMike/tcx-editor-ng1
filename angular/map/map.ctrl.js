import _ from 'lodash';

class MapCtrl {
    constructor(Main, $scope, $rootScope) {
        this.Main = Main;
        this.dots = [];
        this.map = {};
        // this.lap = this.Main.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap

        // $scope.$watch(this.Main.data, (newData) => {
        $scope.$watch(
            () => Main.data,
            (newData) => {
                // console.log(newData);
                if (!_.isEmpty(newData)) {
                    this.lap = Main.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap;

                    if (!_.isEmpty(this.map))
                        this.drawCircles(this.lap);
                }
            }
        );

        $scope.$on('mapInitialized', (event, map) => {
            this.map = map;

            if (!_.isEmpty(this.lap))
                this.drawCircles(this.lap);

            map.addListener('click', (e) => {
				// console.log(e.latLng);
				let closest = this.findClosest(this.lap, e.latLng);
                $rootScope.$broadcast("closest", closest);
            });
        });

        $scope.$on('redraw', () => this.drawCircles(this.lap) );
    }

    drawCircles(laps) {
        var mybounds, radius, skipCount;
        radius = 2;
        skipCount = Math.floor(Math.log(this.Main.trackpointCount));

        // remove existing points
        if (this.dots.length)
            this.dots.forEach( dot => dot.setMap(null) );

        mybounds = new google.maps.LatLngBounds();
        laps.forEach( lap => {
            return lap.Track[0].Trackpoint.forEach( (elem, idx) => {
                var c, lat, lng, marker, markerOptions;
                if (idx % skipCount === 0) {
                    lat = parseFloat(elem.Position[0].LatitudeDegrees[0]);
                    lng = parseFloat(elem.Position[0].LongitudeDegrees[0]);
                    c = new google.maps.LatLng(lat, lng);
                    mybounds.extend(c);
                    markerOptions = {
                        position: c,
                        map: this.map
                    };
                    marker = new google.maps.Marker(markerOptions);
                    return this.dots.push(marker);
                }
            });
        });
        return this.map.fitBounds(mybounds);
    }

    // ???
    findClosest(laps, point) {
        var plat, plng, res;

        plat = point.lat();
        plng = point.lng();

        res = _.reduce(laps, (function(lapAcc, lap, lapCount) {
            var thisLap;

            // get shortest distance for this lap
            thisLap = _.reduce(lap.Track[0].Trackpoint, (function(acc, elem, idx) {
                var dist, lat, lng;
                if (elem.Position) {
                    lat = parseFloat(elem.Position[0].LatitudeDegrees[0]);
                    lng = parseFloat(elem.Position[0].LongitudeDegrees[0]);
                    dist = Math.pow(plat - lat, 2) + Math.pow(plng - lng, 2);

                    if (dist < acc[1]) {
                        return [idx, dist];
                    } else {
                        return acc;
                    }
                }
            }), [0, lapAcc[2]]);

            // compare this with best so far
            if (thisLap[1] < lapAcc[2]) {
                // i.e. return [lap, index in lap, dist]
                return [lapCount].concat(thisLap);
            } else {
                return lapAcc;
            }
        }), [0, 0, 10000000]);

        // console.log(res);
        return res.slice(0, -1);
    };

}

export default MapCtrl;
