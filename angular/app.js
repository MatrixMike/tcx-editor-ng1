// imports
import 'jquery';
import angular from 'angular';
import 'angular-ui-router';
import 'allenhwkim/angularjs-google-maps';
import 'danialfarid/ng-file-upload';
// import 'mgechev/angular-immutable';

import MainSvc from './services/main.svc';
import EditorCtrl from './editor/editor.ctrl';
import UploadCtrl from './upload/upload.ctrl';
import MapCtrl from './map/map.ctrl';
import FeedbackCtrl from './feedback/feedback.ctrl';
import FeedbackDir from './feedback.dir/feedback.dir';
import LapDir from './editor/lap.dir';
import './modules/scroller.dir';
import "./templates";

angular.module('garminEditorApp',
    [ 'ui.router'
    , 'ngMap'
    , 'ngFileUpload'
    , 'scroller'
    , 'templates'
    ]
);

angular.module('garminEditorApp')
.service('Main', MainSvc)
.controller('UploadCtrl', UploadCtrl)
.controller('EditorCtrl', EditorCtrl)
.controller('MapCtrl', MapCtrl)
.controller('FeedbackCtrl', FeedbackCtrl)
.directive('lap', LapDir)
.directive('feedback', FeedbackDir);

angular.module('garminEditorApp')
.config(($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) => {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);     // allows trailing slashes

    return $stateProvider
    .state('upload', {
        url: '/',
        templateUrl: 'upload/upload.html',
        controller: 'UploadCtrl',
        controllerAs: 'vm'
    })
    .state('editor', {
        url: '/editor',
        templateUrl: 'editor/editor.html',
        controller: 'EditorCtrl',
        controllerAs: 'vm'
    })
    .state('feedback', {
        url: '/feedback',
        templateUrl: 'feedback/feedback.html',
        controller: 'FeedbackCtrl',
        controllerAs: 'vm'
    });
});

angular.bootstrap(document.getElementsByTagName('body')[0], ['garminEditorApp']);
