export default class FrameBroadcastChannel {
  constructor(name) {
    this.isTop = typeof window === 'undefined' || window === window.parent;
    this.name = name;
    this.handlers = {
      message: [],
      messageerror: [],
    };
    this.onMessage = null;
    this.mainHandler = {
      message: e => {
        if (e.data.type !== 'frame-broadcast' || e.data.channel !== this.name) {
          return;
        }
        this.handlers.message.forEach(handler => handler(e.data.message));
      },
      messageerror: e => {
        if (e.data.type !== 'frame-broadcast' || e.data.channel !== this.name) {
          return;
        }
        this.handlers.messageerror.forEach(handler => handler(e.data.message));
      },
    };
    ['message', 'messageerror'].forEach(type => {
      window.addEventListener(type, this.mainHandler[type]);
    });

    this.broadcastHandler = this.broadcastHandler.bind(this);
    if (this.isTop) {
      window.addEventListener('message', this.broadcastHandler);
    }
  }

  broadcastHandler(e) {
    if (e.data.type !== 'frame-broadcast-request' || e.data.channel !== this.name)  {
      return;
    }
    const data = { type: 'frame-broadcast', channel: this.name, message: e.data.message };
    window.postMessage(data, '*');
    for (let i = 0; i < window.frames.length; i += 1) {
      const frame = window.frames[i];
      frame.postMessage(data, '*');
    }
  }

  postMessage(message) {
    window.parent.postMessage({
      type: 'frame-broadcast-request',
      channel: this.name,
      message,
    }, '*');
  }

  close() {
    this.handlers = {};
    this.onMessage = null;
    ['message', 'messageerror'].forEach(type => {
      window.removeEventListener(type, this.mainHandler[type]);
    });
    if (this.isTop) {
      window.removeEventListener('message', this.broadcastHandler);
    }
  }

  set onmessage(v) {
    this.removeEventListener('message', v);
    if (typeof v === 'function') {
      this.addEventListener('message', v);
      this.onMessage = v;
    } else {
      this.onMessage = null;
    }
  }

  addEventListener(type, handler) {
    this.handlers[type].push(handler);
  }

  removeEventListener(type, handler) {
    this.handlers[type] = this.handlers[type].filter(x => x !== handler);
  }
}
