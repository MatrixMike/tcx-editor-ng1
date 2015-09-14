class UploadCtrl {
    constructor($state, Upload, Main) {
        this.Main = Main;
        this.Upload = Upload;
        this.$state = $state;

        this.myFiles = [];
        this.msg = "Select file to upload";
    }

    upload() {
        this.Upload.upload({
            url: '/tcx/tojson',
            file: this.file
        })
        .progress( evt => {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            this.msg = 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
        })
        .success( (data, status, headers, config) => {
            ga('send', 'event', 'file-upload', config.file.name);
            // console.log(data);

            // this.Main.data = this.Main.removeNullEntries(data);
            this.Main.setTcxData(data);
            this.Main.fname = config.file.name;

            console.log("uploaded:", config.file.name);

            this.$state.go('editor', {});
        });
    }
}

export default UploadCtrl;
