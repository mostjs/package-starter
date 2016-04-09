(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("@most/mostPackage", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.mostMostPackage = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /** @license MIT License (c) copyright 2016 original author or authors */

  // import {...} from 'most';

  var index = function index(x) {
    return x;
  };

  exports.default = index;
});
