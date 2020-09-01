'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FrameBroadcastChannel = function () {
  function FrameBroadcastChannel(name) {
    var _this = this;

    _classCallCheck(this, FrameBroadcastChannel);

    this.isTop = typeof window === 'undefined' || window === window.parent;
    this.name = name;
    this.handlers = {
      message: [],
      messageerror: []
    };
    this.onMessage = null;
    this.mainHandler = {
      message: function message(e) {
        if (e.data.type !== 'frame-broadcast' || e.data.channel !== _this.name) {
          return;
        }
        _this.handlers.message.forEach(function (handler) {
          return handler(e.data.message);
        });
      },
      messageerror: function messageerror(e) {
        if (e.data.type !== 'frame-broadcast' || e.data.channel !== _this.name) {
          return;
        }
        _this.handlers.messageerror.forEach(function (handler) {
          return handler(e.data.message);
        });
      }
    };
    ['message', 'messageerror'].forEach(function (type) {
      window.addEventListener(type, _this.mainHandler[type]);
    });

    this.broadcastHandler = this.broadcastHandler.bind(this);
    if (this.isTop) {
      window.addEventListener('message', this.broadcastHandler);
    }
  }

  _createClass(FrameBroadcastChannel, [{
    key: 'broadcastHandler',
    value: function broadcastHandler(e) {
      if (e.data.type !== 'frame-broadcast-request' || e.data.channel !== this.name) {
        return;
      }
      window.postMessage({ type: 'frame-broadcast', channel: this.name, message: e.data.message }, '*');
      for (var i = 0; i < window.frames.length; i += 1) {
        var frame = window.frames[i];
        frame.postMessage({ type: 'frame-broadcast', channel: this.name, message: e.data.message }, '*');
      }
    }
  }, {
    key: 'postMessage',
    value: function postMessage(message) {
      window.parent.postMessage({
        type: 'frame-broadcast-request',
        channel: this.name,
        message: message
      }, '*');
    }
  }, {
    key: 'close',
    value: function close() {
      var _this2 = this;

      this.handlers = {};
      this.onMessage = null;
      ['message', 'messageerror'].forEach(function (type) {
        window.removeEventListener(type, _this2.mainHandler[type]);
      });
      if (this.isTop) {
        window.removeEventListener('message', this.broadcastHandler);
      }
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(type, handler) {
      this.handlers[type].push(handler);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, handler) {
      this.handlers[type] = this.handlers[type].filter(function (x) {
        return x !== handler;
      });
    }
  }, {
    key: 'onmessage',
    set: function set(v) {
      this.removeEventListener('message', v);
      if (typeof v === 'function') {
        this.addEventListener('message', v);
        this.onMessage = v;
      } else {
        this.onMessage = null;
      }
    }
  }]);

  return FrameBroadcastChannel;
}();

exports.default = FrameBroadcastChannel;