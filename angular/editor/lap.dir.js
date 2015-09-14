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

// link: function(scope, elem, attrs, myDirCtrl) {
    // scope.$watch(attrs['selected'], function(){
    //     console.log("selected");
    //     // myDirCtrl.updateSelectedOptions();
    //     myDirCtrl.selectedPoints = scope.selected;
    // })
    // angular.element(elem)
    // .bind('mousedown', (evt) => {
    //     console.log('angular mousedown', evt);
    //     console.log("row", evt.target.parentNode.classList[1][1]);
    //     evt.target.parentNode.addClass('selected');
    //     var idx = evt.target.parentNode.classList[1][1];
    //     scope.selected[idx] = !scope.selected[idx];
    //     evt.stopPropagation();
    // });
    //
    // angular.element(elem)
    // .bind('mouseup', (evt) => {
    //     console.log('angular mousedown', evt);
    //     console.log(evt.target.parentNode.classList[1]);
    //     evt.stopPropagation();
    // });
// }
