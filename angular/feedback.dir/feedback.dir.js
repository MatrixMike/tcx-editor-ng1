function FeedbackDir() {
    return {
        templateUrl: 'feedback.dir/feedback.tmpl.html',
        restrict: 'EA',
        scope: {
            endpoint: '@'
        },
        controller: function($http) {
            this.sendFeedback = () => {
                var obj = {
                    email: this.email,
                    comment: this.feedback
                };

                return $http.post("/comments", obj)
                .then( response => {
                    // console.log(response.data);
                    this.comments = response.data;
                })
                .catch( err => console.log(err) );
            };
        },
        controllerAs: 'vm'
    };
};

export default FeedbackDir;
