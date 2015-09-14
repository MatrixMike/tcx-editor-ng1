import _ from 'lodash'

class MainService {
    constructor($http) {
        this.$http = $http;

        this.debug = location.host.match('localhost').length > 0;
        // total number of points in uploaded file; used to limit number of markers shown
        this.trackpointCount = 0;
        // this will be the full data; EditorCtrl just works with the laps
        this.data = {};
    }

    getDummyData() {
        this.fname = 'dummy.tcx';
        return this.$http.get('/tcx/test')
            .then( res => this.setTcxData(res.data) );
    }

    getFeedback() {
        return this.$http.get('/comments');
    }

    saveData(fname) {
		return this.$http.post('/tcx/fromjson/' + this.fname, this.data);
    }

    setTcxData(data) {
        var laps = data.TrainingCenterDatabase.Activities[0].Activity[0].Lap;

        var newLaps = _.map(laps, (lap, idx) => {
            var lapPoints = lap.Track[0].Trackpoint;

            // we only want points that has a Position element
            var newLapPoints = _.filter(lapPoints, elem => elem.Position);

            this.trackpointCount += newLapPoints.length;

            if (lapPoints.length > newLapPoints.length) {
                console.log("Lap %s had %s positionless elements in, which have been removed", idx, lapPoints.length - newLapPoints.length);
            }
            // replace in lap
            lap.Track[0].Trackpoint = newLapPoints;
            return lap;
        });
        this.data = data;
        this.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap = newLaps;
    };
}

export default MainService;

// removeNullEntries(data) {
//     var laps;
//     laps = data.TrainingCenterDatabase.Activities[0].Activity[0].Lap;
//
//     // foreach????
//     _.map(laps, (lap, idx) => {
//         var lapPoints = lap.Track[0].Trackpoint;
//
//         this.trackpointCount += lapPoints.length;
//
//         // we only want points that has a Position element
//         var newLapPoints = _.filter(lapPoints, elem => elem.Position);
//
//         if (lapPoints.length > newLapPoints.length) {
//             console.log("Lap %s had %s positionless elements in, which have been removed", idx, lapPoints.length - newLapPoints.length);
//         }
//         // replace in main structure
//         lap.Track[0].Trackpoint = newLapPoints;
//         return lap.Track[0].Trackpoint;
//         // return lap?
//     });
//     // THIS IS WRONG
//     return data;
// };
