angular.module("scroller", [])
    .directive('scrollTo', function() {
        return {
            restrict: 'A',
            scope: {
                targetPx: '@'
            },
            link: function(scope, $elm, attrs) {

                return attrs.$observe('target', function(newValue, oldValue) {
                    console.log("scroller: moving to", newValue);
                    // $elm.scrollTop = parseInt(newValue);
                    jQuery(".data-table").animate({
                        scrollTop: parseInt(newValue)
                    }, "slow");
                });
            }
        };
    });
