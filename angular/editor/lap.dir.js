// import Immutable from 'immutable';

var LapDir = function() {
    var bindings = {
        lapdata: '=',
        selected: '=',
        count: '@',
        check: '&'
    }
    return {
        bindToController: bindings,
        scope: {},
        controller : function() {

            this.select = (evt, idx) => {
                // console.log("Click: lap %s, tp %s, shift %s", this.count, idx, evt.shiftKey);
                evt.stopPropagation();
                this.check({
                    lapIdx: this.count,
                    idx: idx,
                    shift: (evt.shiftKey)
                });
            };
        },
        controllerAs: 'vm',
        templateUrl: 'editor/lap.tmpl.html'
    }
}
