angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("feedback.dir/feedback.tmpl.html","\n<div class=\"hotbelgo\">\n  <h3>Feedback for the author</h3>\n  <form ng-hide=\"comments\" class=\"row\">\n    <div class=\"col-sm-7\">\n      <div class=\"form-group\">\n        <textarea rows=\"2\" ng-model=\"vm.feedback\" placeholder=\"Comments, suggestions,...\" class=\"form-control\"></textarea>\n      </div>\n      <p>If the app did not work, please provide details of what you did and what you hoped / expected it would do.</p>\n    </div>\n    <div class=\"col-sm-3\">\n      <div class=\"form-group\">\n        <input type=\"text\" ng-model=\"vm.email\" placeholder=\"email (Optional*)\" class=\"form-control\"/>\n      </div>\n      <p>* Used for feedback from author. Will not be made public.</p>\n    </div>\n    <div class=\"col-sm-2\">\n      <button ng-click=\"vm.sendFeedback()\" class=\"btn btn-primary\">Send</button>\n    </div>\n  </form>\n  <div ng-show=\"comments\" class=\"row\">\n    <div class=\"col-sm-3\">\n      <h4>Date</h4>\n    </div>\n    <div class=\"col-sm-9\">\n      <h4>Comment</h4>\n    </div>\n  </div>\n  <div ng-repeat=\"comment in vm.comments\" class=\"row comments\">\n    <div class=\"col-sm-3\">\n      <p>{{comment.date}}</p>\n    </div>\n    <div class=\"col-sm-9\">\n      <p>{{comment.comment}}</p>\n    </div>\n  </div>\n</div>");
$templateCache.put("editor/editor.html","\n<div class=\"col-xs-12\">\n  <div class=\"summary\">\n    <div class=\"row\">\n      <div class=\"col-xs-12\">\n        <h2>Summary of ride ({{vm.startTime | date: \"d MMM yy\"}})</h2>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-xs-2 table-head\">Lap</div>\n      <div class=\"col-xs-2 table-head\">lapStart</div>\n      <div class=\"col-xs-2 table-head\">lapEnd</div>\n      <div class=\"col-xs-2 table-head\">Lap time</div>\n      <div class=\"col-xs-2 table-head\">Distance</div>\n      <div class=\"col-xs-2 table-head\">Avg speed</div>\n    </div>\n    <div ng-repeat=\"lap in vm.data.Lap\" class=\"row\">\n      <div class=\"col-xs-2 table-head\">{{$index + 1}}</div>\n      <div class=\"col-xs-2\">{{lap.Track[0].Trackpoint[0].Time[0] | date: \"HH:mm:ss\"}}</div>\n      <div class=\"col-xs-2\">{{lap.Track[0].Trackpoint[lap.Track[0].Trackpoint.length - 1].Time[0] | date: \"HH:mm:ss\"}}</div>\n      <div class=\"col-xs-2\">{{lap.TotalTimeSeconds[0]}}s</div>\n      <div class=\"col-xs-2\">{{lap.DistanceMeters / 1000 | number : 3}} km</div>\n      <div class=\"col-xs-2\">{{lap.Extensions[0].LX[0].AvgSpeed[0] * 60 * 60 / 1000 | number : 1}} km/h</div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h2>Trackpoint data</h2>\n      <p>Choose the \'trackpoints\' to delete from below or click on the map (not the markers). Use Shift+Click to select multiple rows.</p>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-6 data-table\">\n      <div scroll-to=\"scroll-to\" data-target=\"{{vm.scrollPos}}\" ng-repeat=\"lap in vm.data.Lap track by $index\"><strong>Lap {{$index+1}}</strong>\n        <lap lapdata=\"lap.Track[0].Trackpoint\" count=\"{{$index}}\" check=\"vm.checkChange(lapIdx, idx, shift)\" selected=\"vm.selected[$index]\"></lap>\n      </div>\n    </div>\n    <div class=\"col-xs-6\"><map center=\"44, 5\" zoom=\"11\" draggable=\"true\" map-type-control=\"false\" auto-refresh=\"auto-refresh\" ng-controller=\"MapCtrl as map\"></map>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12 controls\">\n      <button ng-click=\"vm.deletePoints()\" class=\"btn btn-danger\">{{vm.deleteMsg}}</button>\n      <button ng-click=\"vm.saveFile()\" class=\"btn btn-success btn-disabled\">Download .tcx</button><a ui-sref=\"upload\" class=\"btn btn-primary\">Load different file</a>\n    </div>\n  </div>\n  <div class=\"row feedback\">\n    <div class=\"col-xs-12\">\n      <feedback></feedback>\n    </div>\n  </div>\n</div>");
$templateCache.put("editor/lap.tmpl.html","\n<table>\n  <tr>\n    <th>Timestamp</th>\n    <th>Accum Dist. (m)</th>\n  </tr>\n  <tr ng-repeat=\"tp in vm.lapdata track by $index\" ng-class=\"{\'selected\': vm.selected[$index]}\" ng-click=\"vm.select($event, $index)\" class=\"trackpoint c{{$index}}\">\n    <td>{{tp.Time[0] | date: \'H:mm:ss\'}}</td>\n    <td>{{tp.DistanceMeters[0] | number : 1}} m</td>\n  </tr>\n</table>");
$templateCache.put("feedback/feedback.html","\n<div class=\"container feedback\">\n  <h3>Feedback</h3>\n  <div class=\"row\">\n    <div class=\"col-sm-2 table-head\">\n      <h4>Date</h4>\n    </div>\n    <div class=\"col-sm-2 table-head\">\n      <h4>Email</h4>\n    </div>\n    <div class=\"col-sm-8 table-head\">\n      <h4>Comments</h4>\n    </div>\n  </div>\n  <div ng-repeat=\"comment in vm.comments\" class=\"row comments\">\n    <div class=\"col-sm-2\">\n      <p>{{comment.date}}</p>\n    </div>\n    <div class=\"col-sm-2\">\n      <p>{{comment.email}}</p>\n    </div>\n    <div class=\"col-sm-8\">\n      <p>{{comment.comment}}</p>\n    </div>\n  </div>\n</div>");
$templateCache.put("upload/upload.html","\n<div class=\"col-sm-12\">\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n      <p>Ever left your Garmin running at the end of a ride? All your hard earned averages declined pointlessly? </p>\n      <p>This simple editor enables you to delete points from a file, recalculates aggregate ride data, and returns a new copy of the file.</p>\n      <p>To start, upload a \'.tcx\' file. You can convert a .fit file to .tcx using <a href=\"http://connect.garmin.com/\"> Garmin Connect\'s</a> export functionality.</p>\n      <p><strong>Note:</strong> This app is tested with Edge 800 (firmware 2.6) data. YMMV, but other users (including with Garmin 610) report success. </p>\n      <p>No copy of the data processed is kept.</p>\n      <form>\n        <div ngf-select=\"vm.upload($file)\" ng-model=\"vm.file\" name=\"file\" class=\"btn btn-primary btn-upload\">{{vm.msg}}</div>\n      </form>\n    </div>\n    <div class=\"col-sm-6\"><img src=\"images/edge.jpg\" alt=\"edge 800\"/></div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h3>Change log</h3>\n      <p>14 Spt 15 - 2.0.0: rewrite in ES6</p>\n      <p>24 Jan 15 - 1.3.0: &lt;shift&gt;+click functionality improved; fixed bug when deleting entire lap</p>\n      <p>31 Jan 15 - 1.2.1: fixed bug when deleting last lap</p>\n      <p>&nbsp;2 Feb 15 - 1.2.0: Use colours to distinguish laps, highlight rows where speed = 0</p>\n      <p>29 Jun 14 - 1.1.0: Handles delete from start correctly; fixed potential crashes</p>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h3>Todo</h3>\n      <ul>\n        <li>Time is incorrectly shown on screen</li>\n        <li>Provide option to change ride time (and avg speed) to time spent moving (i.e. dropping lunch stops where GPS left on)</li>\n        <li>Show total distance for info</li>\n      </ul>\n    </div>\n  </div>\n</div>");}]);