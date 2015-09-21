System.config({
  baseURL: "angular",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "allenhwkim/angularjs-google-maps": "github:allenhwkim/angularjs-google-maps@1.13.4",
    "angular": "github:angular/bower-angular@1.4.5",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "babel": "npm:babel-core@5.8.24",
    "babel-runtime": "npm:babel-runtime@5.8.24",
    "core-js": "npm:core-js@1.1.4",
    "danialfarid/ng-file-upload": "github:danialfarid/ng-file-upload@7.2.1",
    "immutable": "npm:immutable@3.7.5",
    "jquery": "github:components/jquery@2.1.4",
    "lodash": "npm:lodash@3.10.1",
    "mgechev/angular-immutable": "github:mgechev/angular-immutable@0.1.0",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.8.24": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@1.1.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});
