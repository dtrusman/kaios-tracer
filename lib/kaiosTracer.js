"use strict";

var _zipkin = require("zipkin");

var _zipkinTransportHttpCustom = require("zipkin-transport-http-custom");

var _zipkinContextCls = _interopRequireDefault(require("zipkin-context-cls"));

var _zipkinInstrumentationExpress = require("zipkin-instrumentation-express");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KaiosTracer =
/*#__PURE__*/
function () {
  function KaiosTracer() {
    _classCallCheck(this, KaiosTracer);
  }

  _createClass(KaiosTracer, [{
    key: "getMiddleware",
    value: function getMiddleware(tracer) {
      return (0, _zipkinInstrumentationExpress.expressMiddleware)({
        tracer: tracer
      });
    }
  }, {
    key: "configure",
    value: function configure(endpoint, localServiceName) {
      var ctxImpl = new _zipkinContextCls["default"]();
      var recorder = new _zipkin.BatchRecorder({
        logger: new _zipkinTransportHttpCustom.HttpLogger({
          endpoint: endpoint,
          fetch: _nodeFetch["default"]
        })
      });
      return new _zipkin.Tracer({
        ctxImpl: ctxImpl,
        recorder: recorder,
        localServiceName: localServiceName
      });
    }
  }, {
    key: "sendSpan",
    value: function sendSpan(spanName, message) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var id = tracer.createRootId();
      tracer.setId(id);
      tracer.recordServiceName(spanName);
      tracer.recordMessage(message);
      data && Object.keys(data).forEach(function (k) {
        return tracer.recordBinary(k, data[k]);
      });
      tracer.recordAnnotation(new _zipkin.Annotation.ClientRecv());
    }
  }]);

  return KaiosTracer;
}();

module.exports.KaiosTracer = KaiosTracer; // const data = {
//     error: 'my error',
//     errorCode: 2283
// }
// `http://zipkin:9411/api/v1/spans`