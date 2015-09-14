class FeedbackCtrl {
    constructor(Main) {
        Main.getFeedback()
        .then( response => this.comments = response.data )
        .catch( err => console.error(err) );
    }
}

export default FeedbackCtrl;
