import _ from 'lodash';
import Immutable from 'immutable';

// String -> String -> Int (No. of seconds?)
var getTimeChange = function(beginString, endString) {
  var begin, end;
  begin = new Date(beginString);
  end = new Date(endString);
  return (end - begin) / 1000;
};

// lap -> Int
var getMovingTime = function(lap) {
  return _.reduce(lap.Track[0].Trackpoint, function(acc, tp, idx) {
    if (tp.Extensions[0].TPX[0].Speed[0] > 0 && idx > 0) {
      return acc + this.getTimeChange(lap.Track[0].Trackpoint[idx - 1].Time[0], tp.Time[0]);
    } else {
      return acc;
    }
  }, 0);
};

// laps -> Distance
// gets distance from last TP in data
var totalDist = function(laps) {
    Math.round(_.last(_.last(laps).Track[0].Trackpoint).DistanceMeters[0]);
};

var updateSelected = function([llap, ltp], [lap, tp], shift, model) {
    // shift pressed or not
    // selected different lap ignore
    if (!shift || (lap != llap)) {

        // IMMUTABLE
        // let tmp;
        // if (!model.has(lap)) {
        //     tmp = model.set(0, Immutable.List.of({}))
        // } else tmp = model;
        // return tmp.setIn( [0, lap], !tmp.getIn([0, lap]) );

        if (!model[lap])
            model[lap] = {}
        model[lap][tp] = !model[lap][tp];
        return model;
    }

    let tgt = !model[lap][tp],
        selectedTps = _.range(Math.min(ltp, tp), Math.max(ltp, tp) + 1);
    // console.log(selectedTps, tgt);
    selectedTps.forEach( s => model[lap][s] = tgt);
    return model;
};

// lap -> Distance
var getLastDistFromLap = function(lap) {
    let count = lap.Trackpoint.length - 1
    while (!lap.Trackpoint[count].DistanceMeters || count == 0) {count--; }
    return lap.Trackpoint[count].DistanceMeters[0]
}

// () -> {1:{}, 2:{},...}
var initialiseSelected = function(n) {
    let r = _.range(0, n);
    let s = {};
    r.forEach( i => s[i] = {} );
    return s
}

class EditorCtrl {
    constructor($state, Main, $scope, $rootScope) {
        this.Main = Main;
        this.$rootScope = $rootScope;

        // Switch this to Immutable?
        this.data = null;

        this.lastChanged = [0,0];

    	this.deleteMsg = "Delete selected points";

    	if (Main.debug && _.isEmpty(Main.data)) {
            Main.getDummyData()
                .then(() => this.processData());
        } else {
            if (_.isEmpty(Main.data))
                $state.go('upload')
            else this.processData();
        }

        $scope.$on("closest", (evt, next) => {
            // console.log("closest received", c);

            if (!this.selected[next[0]]) this.selected[next[0]] = {}
            this.selected[next[0]][next[1]] = true

            /* Calculate scroll position
             * Needs to know how many tps in previous laps
             * Add that to preceding tps in this lap
             */
            let res = _.reduce(this.data.Lap, function(acc, lap, idx) {
                if (idx < next[0])
                    return acc + lap.Track[0].Trackpoint.length;
                else return acc;
            }, next[1]);
            this.scrollPos = 20*next[0] + 20*res;

            // update lastChanged so that subsequent use of shift+ work properly
            // USE CHECKCHANGE INSTEAD?
            this.lastChanged = next;
            // console.log("lap %s, tps %s, res %s, = %s", next[0], next[1], res, this.scrollPos);
            $scope.$apply();
        });
    }

    processData() {
		this.data = this.Main.data.TrainingCenterDatabase.Activities[0].Activity[0];
        // send this to store as analytics
        console.log(this.data.Lap[0].Track[0].Trackpoint[0].Position[0]);
		this.createSummaryInfo();
        this.selected = initialiseSelected(this.data.Lap.length);
    }

    createSummaryInfo() {
        this.startTime = this.data.Lap[0].Track[0].Trackpoint[0].Time[0]

        // Need last Lap with Trackpoints to get (new) endTime
        var lastLapIdx = this.data.Lap.length - 1;
        while (!this.data.Lap[lastLapIdx].Track[0].Trackpoint.length) {
            lastLapIdx--;
        }

        var lastLap = this.data.Lap[lastLapIdx].Track[0].Trackpoint;
        this.endTime = lastLap[lastLap.length - 1].Time[0];

        this.calculatedTime = getTimeChange(this.startTime, this.endTime);

        this.totalDist = totalDist(this.data.Lap);
    }

    /* Called by click event on items
     */
    checkChange(lapIdx, idx, shift) {
        console.log("checkChange", lapIdx, idx, shift);
        let next = [lapIdx, idx];
        // takes this.selected and adds/removes, before returning updated version
        let tmp = updateSelected(this.lastChanged, next, shift, this.selected);
        this.selected = tmp;
        this.lastChanged = next;
    }

    saveFile() {
        this.Main.saveData()
        .then( res => {
            ga('send', 'event', 'file-download', this.Main.fname);
            console.log(res.data);
            window.location = '/' + this.Main.fname
        })
        .catch( err => console.error(err) );
    }

    deletePoints() {
        // this.data.Lap.splice(0, 1);
        // return this.createSummaryInfo();

        var startDist, startTime;                   // only used when deletingFromStart

        let deletingFromStart =
               this.selected.hasOwnProperty(0)      // selected has a key '0'
            && this.selected[0].hasOwnProperty(0)   // that object as a key '0'
            && this.selected[0][0]                  // the very first object is true

        if (deletingFromStart) {
            // get first index not selected
            let i = 0;
            while (this.selected[0].hasOwnProperty(i)) { i++; }

            // if there remains a tp for lap 0, use that
            // otherwise use last point in lap 0 as start time
            // what happens if also deleting from lap 1?
            let j = (this.data.Lap[0].Track[0].Trackpoint[i]) ? i : i - 1;
            startDist = parseInt(this.data.Lap[0].Track[0].Trackpoint[j].DistanceMeters[0]);
            startTime = this.data.Lap[0].Track[0].Trackpoint[j].Time[0];
        }

        let lapsWithChanges =
            _.chain(this.selected)
                .reduce( (acc, elem, idx) => {
                    if (!_.isEmpty(elem))
                        acc.push(idx)
                    return acc
                }, [])
                .sortBy(i => -i)
                .value();
        console.log(lapsWithChanges);

        lapsWithChanges.forEach( lapIdx => {
            // focus on Trackpoint array
            let thisTrack = this.data.Lap[lapIdx].Track[0];
            // console.log(thisTrack.Trackpoint);
            // remove all TPs where index in 'selected'
            let newLapData = _.reject(thisTrack.Trackpoint, (tp, idx) => this.selected[lapIdx][idx]);
            // console.log(newLapData);
            // replace in data structure
            this.data.Lap[lapIdx].Track[0].Trackpoint = newLapData;

            /* If points remain in this lap
                    Update Lap.TotalTimeSeconds (Based on updated tackpoints)
                    else totally remove this lap from Lap
            */
            if (thisTrack.Trackpoint.length) {
                // Update lap time
                this.data.Lap[lapIdx].TotalTimeSeconds[0] =
                    getTimeChange(
                        thisTrack.Trackpoint[0].Time[0],
                        thisTrack.Trackpoint[thisTrack.Trackpoint.length - 1].Time[0]);

                // Update lap distance
                this.data.Lap[lapIdx].DistanceMeters[0] =
                    getLastDistFromLap(thisTrack) - thisTrack.Trackpoint[0].DistanceMeters[0];

                // Update AvgSpeed (based on two calculations above)
                this.data.Lap[lapIdx].Extensions[0].LX[0].AvgSpeed[0] =
                    this.data.Lap[lapIdx].DistanceMeters[0] / this.data.Lap[lapIdx].TotalTimeSeconds[0];
            } else {
                console.log("Removing Lap %s entirely", lapIdx);
                // if not final lap, then causes lapIndex to larger than Lap
                this.data.Lap.splice(lapIdx, 1);
            }
        });


        // Need to reset accumulated distance throughout rest of data
        if (deletingFromStart) {
            let newlaps = _.map(this.data.Lap, lap => {
                var newtps = _.map(lap.Track[0].Trackpoint, tp => {
                    let t2 = tp.DistanceMeters[0] - startDist;
                    tp.DistanceMeters[0] = t2;
                    return tp;
                });
                lap.Track[0].Trackpoint = newtps;
                return lap;
            });

            this.data.Lap = newlaps

            // reset meta info
            this.data.Id[0] = startTime
            this.data.Lap[0].$.StartTime = startTime
        }

        this.selected = initialiseSelected(this.data.Lap.length);
        this.createSummaryInfo();

        this.$rootScope.$broadcast("redraw");
    }

}

export default EditorCtrl
