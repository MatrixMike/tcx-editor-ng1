class FeedbackCtrl {
    constructor(Main) {
        Main.getFeedback()
        .then( response => this.comments = response.data )
        .catch( err => console.error(err) );

        Main.getAnalytics()
        .then( response => {
            console.log(response.data);
            this.analytics = response.data
        })
        .catch( err => console.error(err) );
    }
}

export default FeedbackCtrl;
