(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element) {
              var currTime = (/* @__PURE__ */ new Date()).getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, currentProgress, showing, progressTimerId = null, fadeTimerId = null, delayTimerId = null, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(
            Math.ceil(currentProgress * canvas.width),
            options.barThickness / 2
          );
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function(delay) {
            if (showing)
              return;
            if (delay) {
              if (delayTimerId)
                return;
              delayTimerId = setTimeout(() => topbar2.show(), delay);
            } else {
              showing = true;
              if (fadeTimerId !== null)
                window2.cancelAnimationFrame(fadeTimerId);
              if (!canvas)
                createCanvas();
              canvas.style.opacity = 1;
              canvas.style.display = "block";
              topbar2.progress(0);
              if (options.autoRun) {
                (function loop() {
                  progressTimerId = window2.requestAnimationFrame(loop);
                  topbar2.progress(
                    "+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2)
                  );
                })();
              }
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            clearTimeout(delayTimerId);
            delayTimerId = null;
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "none";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      submit.type = "submit";
      form.appendChild(submit);
      submit.click();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method") && element.getAttribute("data-to")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || global;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    /**
     *
     * @param {number} timeout
     */
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    /**
     *
     */
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    /**
     *
     * @param {*} status
     * @param {*} callback
     */
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    /**
     * @private
     */
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    /**
     * @private
     */
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    /**
     * @private
     */
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    /**
     * @private
     */
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    /**
     * @private
     */
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    /**
     * @private
     */
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    /**
     * @private
     */
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(
        this.socket.onOpen(() => {
          this.rejoinTimer.reset();
          if (this.isErrored()) {
            this.rejoin();
          }
        })
      );
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    /**
     * Join the channel
     * @param {integer} timeout
     * @returns {Push}
     */
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    /**
     * Hook into channel close
     * @param {Function} callback
     */
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    /**
     * Hook into channel errors
     * @param {Function} callback
     */
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    /**
     * Subscribes on channel events
     *
     * Subscription returns a ref counter, which can be used later to
     * unsubscribe the exact event listener
     *
     * @example
     * const ref1 = channel.on("event", do_stuff)
     * const ref2 = channel.on("event", do_other_stuff)
     * channel.off("event", ref1)
     * // Since unsubscription, do_stuff won't fire,
     * // while do_other_stuff will keep firing on the "event"
     *
     * @param {string} event
     * @param {Function} callback
     * @returns {integer} ref
     */
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    /**
     * Unsubscribes off of channel events
     *
     * Use the ref returned from a channel.on() to unsubscribe one
     * handler, or pass nothing for the ref to unsubscribe all
     * handlers for the given event.
     *
     * @example
     * // Unsubscribe the do_stuff handler
     * const ref1 = channel.on("event", do_stuff)
     * channel.off("event", ref1)
     *
     * // Unsubscribe all handlers from event
     * channel.off("event")
     *
     * @param {string} event
     * @param {integer} ref
     */
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    /**
     * @private
     */
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    /**
     * Sends a message `event` to phoenix with the payload `payload`.
     * Phoenix receives this in the `handle_in(event, payload, socket)`
     * function. if phoenix replies or it times out (default 10000ms),
     * then optionally the reply can be received.
     *
     * @example
     * channel.push("event")
     *   .receive("ok", payload => console.log("phoenix replied:", payload))
     *   .receive("error", err => console.log("phoenix errored", err))
     *   .receive("timeout", () => console.log("timed out pushing"))
     * @param {string} event
     * @param {Object} payload
     * @param {number} [timeout]
     * @returns {Push}
     */
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    /** Leaves the channel
     *
     * Unsubscribes from server events, and
     * instructs channel to terminate on server
     *
     * Triggers onClose() hooks
     *
     * To receive leave acknowledgements, use the `receive`
     * hook to bind to the server ack, ie:
     *
     * @example
     * channel.leave().receive("ok", () => alert("left!") )
     *
     * @param {integer} timeout
     * @returns {Push}
     */
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling
     * before dispatching to the channel callbacks.
     *
     * Must return the payload, modified or unmodified
     * @param {string} event
     * @param {Object} payload
     * @param {integer} ref
     * @returns {Object}
     */
    onMessage(_event, payload, _ref) {
      return payload;
    }
    /**
     * @private
     */
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    /**
     * @private
     */
    joinRef() {
      return this.joinPush.ref;
    }
    /**
     * @private
     */
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    /**
     * @private
     */
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    /**
     * @private
     */
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    /**
     * @private
     */
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    /**
     * @private
     */
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    /**
     * @private
     */
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    /**
     * @private
     */
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    /**
     * @private
     */
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var arrayBufferToBase64 = (buffer) => {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.awaitingBatchAck = false;
      this.currentBatch = null;
      this.currentBatchTimer = null;
      this.batchBuffer = [];
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      setTimeout(() => this.poll(), 0);
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      this.ajax("GET", "application/json", null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    // we collect all pushes within the current event loop by
    // setTimeout 0, which optimizes back-to-back procedural
    // pushes against an empty buffer
    send(body) {
      if (typeof body !== "string") {
        body = arrayBufferToBase64(body);
      }
      if (this.currentBatch) {
        this.currentBatch.push(body);
      } else if (this.awaitingBatchAck) {
        this.batchBuffer.push(body);
      } else {
        this.currentBatch = [body];
        this.currentBatchTimer = setTimeout(() => {
          this.batchSend(this.currentBatch);
          this.currentBatch = null;
        }, 0);
      }
    }
    batchSend(messages) {
      this.awaitingBatchAck = true;
      this.ajax("POST", "application/x-ndjson", messages.join("\n"), () => this.onerror("timeout"), (resp) => {
        this.awaitingBatchAck = false;
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        } else if (this.batchBuffer.length > 0) {
          this.batchSend(this.batchBuffer);
          this.batchBuffer = [];
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      this.batchBuffer = [];
      clearTimeout(this.currentBatchTimer);
      this.currentBatchTimer = null;
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, contentType, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), contentType, body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    // private
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.primaryPassedHealthCheck = false;
      this.longPollFallbackMs = opts.longPollFallbackMs;
      this.fallbackTimer = null;
      this.sessionStore = opts.sessionStorage || global && global.sessionStorage;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      if (!this.logger && opts.debug) {
        this.logger = (kind, msg, data) => {
          console.log(`${kind}: ${msg}`, data);
        };
      }
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    /**
     * Returns the LongPoll transport reference
     */
    getLongPollTransport() {
      return LongPoll;
    }
    /**
     * Disconnects and replaces the active transport
     *
     * @param {Function} newTransport - The new transport class to instantiate
     *
     */
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    /**
     * Returns the socket protocol
     *
     * @returns {string}
     */
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    /**
     * The fully qualified socket url
     *
     * @returns {string}
     */
    endPointURL() {
      let uri = Ajax.appendParams(
        Ajax.appendParams(this.endPoint, this.params()),
        { vsn: this.vsn }
      );
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {Function} callback - Optional callback which is called after socket is disconnected.
     * @param {integer} code - A status code for disconnection (Optional).
     * @param {string} reason - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      this.teardown(callback, code, reason);
    }
    /**
     *
     * @param {Object} params - The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn) {
        return;
      }
      if (this.longPollFallbackMs && this.transport !== LongPoll) {
        this.connectWithFallback(LongPoll, this.longPollFallbackMs);
      } else {
        this.transportConnect();
      }
    }
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind, msg, data) {
      this.logger && this.logger(kind, msg, data);
    }
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger() {
      return this.logger !== null;
    }
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {Function} callback
     */
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection close events
     * @param {Function} callback
     */
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {Function} callback
     */
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection message events
     * @param {Function} callback
     */
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    /**
     * Pings the server and invokes the callback with the RTT in milliseconds
     * @param {Function} callback
     *
     * Returns true if the ping was pushed or false if unable to be pushed.
     */
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    /**
     * @private
     */
    transportConnect() {
      this.connectClock++;
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    getSession(key) {
      return this.sessionStore && this.sessionStore.getItem(key);
    }
    storeSession(key, val) {
      this.sessionStore && this.sessionStore.setItem(key, val);
    }
    connectWithFallback(fallbackTransport, fallbackThreshold = 2500) {
      clearTimeout(this.fallbackTimer);
      let established = false;
      let primaryTransport = true;
      let openRef, errorRef;
      let fallback = (reason) => {
        this.log("transport", `falling back to ${fallbackTransport.name}...`, reason);
        this.off([openRef, errorRef]);
        primaryTransport = false;
        this.replaceTransport(fallbackTransport);
        this.transportConnect();
      };
      if (this.getSession(`phx:fallback:${fallbackTransport.name}`)) {
        return fallback("memorized");
      }
      this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
      errorRef = this.onError((reason) => {
        this.log("transport", "error", reason);
        if (primaryTransport && !established) {
          clearTimeout(this.fallbackTimer);
          fallback(reason);
        }
      });
      this.onOpen(() => {
        established = true;
        if (!primaryTransport) {
          if (!this.primaryPassedHealthCheck) {
            this.storeSession(`phx:fallback:${fallbackTransport.name}`, "true");
          }
          return this.log("transport", `established ${fallbackTransport.name} fallback`);
        }
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
        this.ping((rtt) => {
          this.log("transport", "connected to primary after", rtt);
          this.primaryPassedHealthCheck = true;
          clearTimeout(this.fallbackTimer);
        });
      });
      this.transportConnect();
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `${this.transport.name} connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    /**
     * @private
     */
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.triggerChanError();
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      this.waitForBufferDone(() => {
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (this.conn) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      this.clearHeartbeats();
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    /**
     * @private
     */
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    /**
     * @private
     */
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    /**
     * @returns {string}
     */
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    /**
     * @returns {boolean}
     */
    isConnected() {
      return this.connectionState() === "open";
    }
    /**
     * @private
     *
     * @param {Channel}
     */
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c !== channel);
    }
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {refs} - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Object} chanParams - Parameters for the channel
     * @returns {Channel}
     */
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    /**
     * @param {Object} data
     */
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          this.clearHeartbeats();
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading",
    "phx-hook-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF_LOADING = "data-phx-ref-loading";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_REF_LOCK = "data-phx-ref-lock";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_MAGIC_ID = "data-phx-id";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_LOADING_CLASS = "phx-loading";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_CLIENT_ERROR_CLASS = "phx-client-error";
  var PHX_SERVER_ERROR_CLASS = "phx-server-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_VIEWPORT_TOP = "viewport-top";
  var PHX_VIEWPORT_BOTTOM = "viewport-bottom";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_STREAM = "stream";
  var PHX_STREAM_REF = "data-phx-stream";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_LV_HISTORY_POSITION = "phx:nav-history-position";
  var PHX_PROGRESS = "progress";
  var PHX_MOUNTED = "mounted";
  var PHX_RELOAD_STATUS = "__phoenix_reload_status__";
  var LOADER_TIMEOUT = 1;
  var MAX_CHILD_JOIN_ATTEMPTS = 3;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var PHX_PENDING_ATTRS = [PHX_REF_LOADING, PHX_REF_SRC, PHX_REF_LOCK];
  var DYNAMICS = "d";
  var STATIC = "s";
  var ROOT = "r";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var STREAM = "stream";
  var EntryUploader = class {
    constructor(entry, config, liveSocket2) {
      let { chunk_size, chunk_timeout } = config;
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunk_size;
      this.chunkTimeout = chunk_timeout;
      this.chunkTimer = null;
      this.errored = false;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      if (this.errored) {
        return;
      }
      this.uploadChannel.leave();
      this.errored = true;
      clearTimeout(this.chunkTimer);
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk, this.chunkTimeout).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      }).receive("error", ({ reason }) => this.error(reason));
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  function detectInvalidStreamInserts(inserts) {
    const errors = /* @__PURE__ */ new Set();
    Object.keys(inserts).forEach((id) => {
      const streamEl = document.getElementById(id);
      if (streamEl && streamEl.parentElement && streamEl.parentElement.getAttribute("phx-update") !== "stream") {
        errors.add(`The stream container with id "${streamEl.parentElement.id}" is missing the phx-update="stream" attribute. Ensure it is set for streams to work properly.`);
      }
    });
    errors.forEach((error) => console.error(error));
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`) && !el.disabled) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage, namespace, subkey) {
      return localStorage.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage, namespace, subkey) {
      return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          window.requestAnimationFrame(() => {
            let hashEl = this.getHashTargetEl(window.location.hash);
            if (hashEl) {
              hashEl.scrollIntoView();
            } else if (meta.type === "redirect") {
              window.scroll(0, 0);
            }
          });
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value, maxAgeSeconds) {
      let expires = typeof maxAgeSeconds === "number" ? ` max-age=${maxAgeSeconds};` : "";
      document.cookie = `${name}=${value};${expires} path=/`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    deleteCookie(name) {
      document.cookie = `${name}=; max-age=-1; path=/`;
    },
    redirect(toURL, flash) {
      if (flash) {
        this.setCookie("__phoenix_flash__", flash, 60);
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    isAutoUpload(inputEl) {
      return inputEl.hasAttribute("data-phx-auto-upload");
    },
    findUploadInputs(node) {
      const formId = node.id;
      const inputsOutsideForm = this.all(document, `input[type="file"][${PHX_UPLOAD_REF}][form="${formId}"]`);
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`).concat(inputsOutsideForm);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    wantsNewTab(e) {
      let wantsNewTab = e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button === 1;
      let isDownload = e.target instanceof HTMLAnchorElement && e.target.hasAttribute("download");
      let isTargetBlank = e.target.hasAttribute("target") && e.target.getAttribute("target").toLowerCase() === "_blank";
      let isTargetNamedTab = e.target.hasAttribute("target") && !e.target.getAttribute("target").startsWith("_");
      return wantsNewTab || isTargetBlank || isDownload || isTargetNamedTab;
    },
    isUnloadableFormSubmit(e) {
      let isDialogSubmit = e.target && e.target.getAttribute("method") === "dialog" || e.submitter && e.submitter.getAttribute("formmethod") === "dialog";
      if (isDialogSubmit) {
        return false;
      } else {
        return !e.defaultPrevented && !this.wantsNewTab(e);
      }
    },
    isNewPageClick(e, currentLocation) {
      let href = e.target instanceof HTMLAnchorElement ? e.target.getAttribute("href") : null;
      let url;
      if (e.defaultPrevented || href === null || this.wantsNewTab(e)) {
        return false;
      }
      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        return false;
      }
      if (e.target.isContentEditable) {
        return false;
      }
      try {
        url = new URL(href);
      } catch (e2) {
        try {
          url = new URL(href, currentLocation);
        } catch (e3) {
          return true;
        }
      }
      if (url.host === currentLocation.host && url.protocol === currentLocation.protocol) {
        if (url.pathname === currentLocation.pathname && url.search === currentLocation.search) {
          return url.hash === "" && !url.href.endsWith("#");
        }
      }
      return url.protocol.startsWith("http");
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findExistingParentCIDs(node, cids) {
      let parentCids = /* @__PURE__ */ new Set();
      let childrenCids = /* @__PURE__ */ new Set();
      cids.forEach((cid) => {
        this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node).forEach((parent) => {
          parentCids.add(cid);
          this.filterWithinSameLiveView(this.all(parent, `[${PHX_COMPONENT}]`), parent).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => childrenCids.add(childCID));
        });
      });
      childrenCids.forEach((childCid) => parentCids.delete(childCid));
      return parentCids;
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    syncPendingAttrs(fromEl, toEl) {
      if (!fromEl.hasAttribute(PHX_REF_SRC)) {
        return;
      }
      PHX_EVENT_CLASSES.forEach((className) => {
        fromEl.classList.contains(className) && toEl.classList.add(className);
      });
      PHX_PENDING_ATTRS.filter((attr) => fromEl.hasAttribute(attr)).forEach((attr) => {
        toEl.setAttribute(attr, fromEl.getAttribute(attr));
      });
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      if (titleEl) {
        let { prefix, suffix, default: defaultTitle } = titleEl.dataset;
        let isEmpty2 = typeof str !== "string" || str.trim() === "";
        if (isEmpty2 && typeof defaultTitle !== "string") {
          return;
        }
        let inner = isEmpty2 ? defaultTitle : str;
        document.title = `${prefix || ""}${inner || ""}${suffix || ""}`;
      } else {
        document.title = str;
      }
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
      let debounce = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce === "") {
        debounce = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      let value = debounce || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => {
              if (asyncFilter()) {
                callback();
              }
            });
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              const t = setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
              this.putPrivate(el, THROTTLED, t);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => {
              clearTimeout(this.private(el, THROTTLED));
              this.triggerCycle(el, DEBOUNCE_TRIGGER);
            });
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    // maintains or adds privately used hook information
    // fromEl and toEl can be the same element in the case of a newly added node
    // fromEl and toEl can be any HTML node type, so we need to check if it's an element node
    maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom) {
      if (fromEl.hasAttribute && fromEl.hasAttribute("data-phx-hook") && !toEl.hasAttribute("data-phx-hook")) {
        toEl.setAttribute("data-phx-hook", fromEl.getAttribute("data-phx-hook"));
      }
      if (toEl.hasAttribute && (toEl.hasAttribute(phxViewportTop) || toEl.hasAttribute(phxViewportBottom))) {
        toEl.setAttribute("data-phx-hook", "Phoenix.InfiniteScroll");
      }
    },
    putCustomElHook(el, hook) {
      if (el.isConnected) {
        el.setAttribute("data-phx-hook", "");
      } else {
        console.error(`
        hook attached to non-connected DOM element
        ensure you are calling createHook within your connectedCallback. ${el.outerHTML}
      `);
      }
      this.putPrivate(el, "custom-el-hook", hook);
    },
    getCustomElHook(el) {
      return this.private(el, "custom-el-hook");
    },
    isUsedInput(el) {
      return el.nodeType === Node.ELEMENT_NODE && (this.private(el, PHX_HAS_FOCUSED) || this.private(el, PHX_HAS_SUBMITTED));
    },
    resetForm(form) {
      Array.from(form.elements).forEach((input) => {
        this.deletePrivate(input, PHX_HAS_FOCUSED);
        this.deletePrivate(input, PHX_HAS_SUBMITTED);
      });
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    isChildOfAny(el, parents) {
      return !!parents.find((parent) => parent.contains(el));
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let defaultBubble = true;
      let isUploadTarget = target.nodeName === "INPUT" && target.type === "file";
      if (isUploadTarget && name === "click") {
        defaultBubble = false;
      }
      let bubbles = opts.bubbles === void 0 ? defaultBubble : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    // merge attributes from source to target
    // if an element is ignored, we only merge data attributes
    // including removing data attributes that are no longer in the source
    mergeAttrs(target, source, opts = {}) {
      let exclude = new Set(opts.exclude || []);
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (!exclude.has(name)) {
          const sourceValue = source.getAttribute(name);
          if (target.getAttribute(name) !== sourceValue && (!isIgnored || isIgnored && name.startsWith("data-"))) {
            target.setAttribute(name, sourceValue);
          }
        } else {
          if (name === "value" && target.value === source.value) {
            target.setAttribute("value", source.getAttribute(name));
          }
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name) && !PHX_PENDING_ATTRS.includes(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (focused instanceof HTMLSelectElement) {
        focused.focus();
      }
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null && document.body.contains(el);
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode && childNode.nodeType !== Node.COMMENT_NODE) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    },
    isLocked(el) {
      return el.hasAttribute && el.hasAttribute(PHX_REF_LOCK);
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    static isPreflightInProgress(file) {
      return file._preflightInProgress === true;
    }
    static markPreflightInProgress(file) {
      file._preflightInProgress = true;
    }
    constructor(fileEl, file, view, autoUpload) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.autoUpload = autoUpload;
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    isCancelled() {
      return this._isCancelled;
    }
    cancel() {
      this.file._preflightInProgress = false;
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      if (!this.isAutoUpload()) {
        LiveUploader.clearFiles(this.fileEl);
      }
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    //private
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        LiveUploader.untrackFile(this.fileEl, this.file);
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        relative_path: this.file.webkitRelativePath,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref,
        meta: typeof this.file.meta === "function" ? this.file.meta() : void 0
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class _LiveUploader {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.last_modified = file.lastModified;
        entry.name = file.name || entry.ref;
        entry.relative_path = file.webkitRelativePath;
        entry.type = file.type;
        entry.size = file.size;
        if (typeof file.meta === "function") {
          entry.meta = file.meta();
        }
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files, dataTransfer) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.updatePrivate(inputEl, "files", [], (existing) => existing.concat(newFiles));
        inputEl.value = null;
      } else {
        if (dataTransfer && dataTransfer.files.length > 0) {
          inputEl.files = dataTransfer.files;
        }
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f) && !UploadEntry.isPreflightInProgress(f));
    }
    static markPreflightInProgress(entries) {
      entries.forEach((entry) => UploadEntry.markPreflightInProgress(entry.file));
    }
    constructor(inputEl, view, onComplete) {
      this.autoUpload = dom_default.isAutoUpload(inputEl);
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(_LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view, this.autoUpload));
      _LiveUploader.markPreflightInProgress(this._entries);
      this.numEntriesInProgress = this._entries.length;
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        if (entry.isCancelled()) {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        } else {
          entry.zipPostFlight(resp);
          entry.onDone(() => {
            this.numEntriesInProgress--;
            if (this.numEntriesInProgress === 0) {
              this.onComplete();
            }
          });
        }
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        if (!entry.meta) {
          return acc;
        }
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var ARIA = {
    anyOf(instance, classes) {
      return classes.find((name) => instance instanceof name);
    },
    isFocusable(el, interactiveOnly) {
      return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== void 0 || !el.disabled && this.anyOf(el, [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement]) || el instanceof HTMLIFrameElement || (el.tabIndex > 0 || !interactiveOnly && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true");
    },
    attemptFocus(el, interactiveOnly) {
      if (this.isFocusable(el, interactiveOnly)) {
        try {
          el.focus();
        } catch (e) {
        }
      }
      return !!document.activeElement && document.activeElement.isSameNode(el);
    },
    focusFirstInteractive(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child, true) || this.focusFirstInteractive(child, true)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusFirst(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusFirst(child)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusLast(el) {
      let child = el.lastElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusLast(child)) {
          return true;
        }
        child = child.previousElementSibling;
      }
    }
  };
  var aria_default = ARIA;
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view().cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    },
    FocusWrap: {
      mounted() {
        this.focusStart = this.el.firstElementChild;
        this.focusEnd = this.el.lastElementChild;
        this.focusStart.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.nextElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusFirst(nextFocus);
          } else {
            aria_default.focusLast(this.el);
          }
        });
        this.focusEnd.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.previousElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusLast(nextFocus);
          } else {
            aria_default.focusFirst(this.el);
          }
        });
        this.el.addEventListener("phx:show-end", () => this.el.focus());
        if (window.getComputedStyle(this.el).display !== "none") {
          aria_default.focusFirst(this.el);
        }
      }
    }
  };
  var findScrollContainer = (el) => {
    if (["HTML", "BODY"].indexOf(el.nodeName.toUpperCase()) >= 0)
      return null;
    if (["scroll", "auto"].indexOf(getComputedStyle(el).overflowY) >= 0)
      return el;
    return findScrollContainer(el.parentElement);
  };
  var scrollTop = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.scrollTop;
    } else {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }
  };
  var bottom = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().bottom;
    } else {
      return window.innerHeight || document.documentElement.clientHeight;
    }
  };
  var top = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().top;
    } else {
      return 0;
    }
  };
  var isAtViewportTop = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  var isAtViewportBottom = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.bottom) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.bottom) <= bottom(scrollContainer);
  };
  var isWithinViewport = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  Hooks.InfiniteScroll = {
    mounted() {
      this.scrollContainer = findScrollContainer(this.el);
      let scrollBefore = scrollTop(this.scrollContainer);
      let topOverran = false;
      let throttleInterval = 500;
      let pendingOp = null;
      let onTopOverrun = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => true;
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id, _overran: true }, () => {
          pendingOp = null;
        });
      });
      let onFirstChildAtTop = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => firstChild.scrollIntoView({ block: "start" });
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(firstChild, this.scrollContainer)) {
              firstChild.scrollIntoView({ block: "start" });
            }
          });
        });
      });
      let onLastChildAtBottom = this.throttle(throttleInterval, (bottomEvent, lastChild) => {
        pendingOp = () => lastChild.scrollIntoView({ block: "end" });
        this.liveSocket.execJSHookPush(this.el, bottomEvent, { id: lastChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(lastChild, this.scrollContainer)) {
              lastChild.scrollIntoView({ block: "end" });
            }
          });
        });
      });
      this.onScroll = (_e) => {
        let scrollNow = scrollTop(this.scrollContainer);
        if (pendingOp) {
          scrollBefore = scrollNow;
          return pendingOp();
        }
        let rect = this.el.getBoundingClientRect();
        let topEvent = this.el.getAttribute(this.liveSocket.binding("viewport-top"));
        let bottomEvent = this.el.getAttribute(this.liveSocket.binding("viewport-bottom"));
        let lastChild = this.el.lastElementChild;
        let firstChild = this.el.firstElementChild;
        let isScrollingUp = scrollNow < scrollBefore;
        let isScrollingDown = scrollNow > scrollBefore;
        if (isScrollingUp && topEvent && !topOverran && rect.top >= 0) {
          topOverran = true;
          onTopOverrun(topEvent, firstChild);
        } else if (isScrollingDown && topOverran && rect.top <= 0) {
          topOverran = false;
        }
        if (topEvent && isScrollingUp && isAtViewportTop(firstChild, this.scrollContainer)) {
          onFirstChildAtTop(topEvent, firstChild);
        } else if (bottomEvent && isScrollingDown && isAtViewportBottom(lastChild, this.scrollContainer)) {
          onLastChildAtBottom(bottomEvent, lastChild);
        }
        scrollBefore = scrollNow;
      };
      if (this.scrollContainer) {
        this.scrollContainer.addEventListener("scroll", this.onScroll);
      } else {
        window.addEventListener("scroll", this.onScroll);
      }
    },
    destroyed() {
      if (this.scrollContainer) {
        this.scrollContainer.removeEventListener("scroll", this.onScroll);
      } else {
        window.removeEventListener("scroll", this.onScroll);
      }
    },
    throttle(interval, callback) {
      let lastCallAt = 0;
      let timer;
      return (...args) => {
        let now = Date.now();
        let remainingTime = interval - (now - lastCallAt);
        if (remainingTime <= 0 || remainingTime > interval) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          lastCallAt = now;
          callback(...args);
        } else if (!timer) {
          timer = setTimeout(() => {
            lastCallAt = Date.now();
            timer = null;
            callback(...args);
          }, remainingTime);
        }
      };
    }
  };
  var hooks_default = Hooks;
  var ElementRef = class {
    static onUnlock(el, callback) {
      if (!dom_default.isLocked(el) && !el.closest(`[${PHX_REF_LOCK}]`)) {
        return callback();
      }
      const closestLock = el.closest(`[${PHX_REF_LOCK}]`);
      const ref = closestLock.closest(`[${PHX_REF_LOCK}]`).getAttribute(PHX_REF_LOCK);
      closestLock.addEventListener(`phx:undo-lock:${ref}`, () => {
        callback();
      }, { once: true });
    }
    constructor(el) {
      this.el = el;
      this.loadingRef = el.hasAttribute(PHX_REF_LOADING) ? parseInt(el.getAttribute(PHX_REF_LOADING), 10) : null;
      this.lockRef = el.hasAttribute(PHX_REF_LOCK) ? parseInt(el.getAttribute(PHX_REF_LOCK), 10) : null;
    }
    // public
    maybeUndo(ref, phxEvent, eachCloneCallback) {
      if (!this.isWithin(ref)) {
        return;
      }
      this.undoLocks(ref, phxEvent, eachCloneCallback);
      this.undoLoading(ref, phxEvent);
      if (this.isFullyResolvedBy(ref)) {
        this.el.removeAttribute(PHX_REF_SRC);
      }
    }
    // private
    isWithin(ref) {
      return !(this.loadingRef !== null && this.loadingRef > ref && (this.lockRef !== null && this.lockRef > ref));
    }
    // Check for cloned PHX_REF_LOCK element that has been morphed behind
    // the scenes while this element was locked in the DOM.
    // When we apply the cloned tree to the active DOM element, we must
    //
    //   1. execute pending mounted hooks for nodes now in the DOM
    //   2. undo any ref inside the cloned tree that has since been ack'd
    undoLocks(ref, phxEvent, eachCloneCallback) {
      if (!this.isLockUndoneBy(ref)) {
        return;
      }
      let clonedTree = dom_default.private(this.el, PHX_REF_LOCK);
      if (clonedTree) {
        eachCloneCallback(clonedTree);
        dom_default.deletePrivate(this.el, PHX_REF_LOCK);
      }
      this.el.removeAttribute(PHX_REF_LOCK);
      let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
      this.el.dispatchEvent(new CustomEvent(`phx:undo-lock:${this.lockRef}`, opts));
    }
    undoLoading(ref, phxEvent) {
      if (!this.isLoadingUndoneBy(ref)) {
        if (this.canUndoLoading(ref) && this.el.classList.contains("phx-submit-loading")) {
          this.el.classList.remove("phx-change-loading");
        }
        return;
      }
      if (this.canUndoLoading(ref)) {
        this.el.removeAttribute(PHX_REF_LOADING);
        let disabledVal = this.el.getAttribute(PHX_DISABLED);
        let readOnlyVal = this.el.getAttribute(PHX_READONLY);
        if (readOnlyVal !== null) {
          this.el.readOnly = readOnlyVal === "true" ? true : false;
          this.el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          this.el.disabled = disabledVal === "true" ? true : false;
          this.el.removeAttribute(PHX_DISABLED);
        }
        let disableRestore = this.el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          this.el.innerText = disableRestore;
          this.el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
        this.el.dispatchEvent(new CustomEvent(`phx:undo-loading:${this.loadingRef}`, opts));
      }
      PHX_EVENT_CLASSES.forEach((name) => {
        if (name !== "phx-submit-loading" || this.canUndoLoading(ref)) {
          dom_default.removeClass(this.el, name);
        }
      });
    }
    isLoadingUndoneBy(ref) {
      return this.loadingRef === null ? false : this.loadingRef <= ref;
    }
    isLockUndoneBy(ref) {
      return this.lockRef === null ? false : this.lockRef <= ref;
    }
    isFullyResolvedBy(ref) {
      return (this.loadingRef === null || this.loadingRef <= ref) && (this.lockRef === null || this.lockRef <= ref);
    }
    // only remove the phx-submit-loading class if we are not locked
    canUndoLoading(ref) {
      return this.lockRef === null || this.lockRef <= ref;
    }
  };
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    // We do the following to optimize append/prepend operations:
    //   1) Track ids of modified elements & of new elements
    //   2) All the modified elements are put back in the correct position in the DOM tree
    //      by storing the id of their previous sibling
    //   3) New elements are going to be put in the right place by morphdom during append.
    //      For prepend, we move them to the first position in the container
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        toNode = toNode.firstElementChild;
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var skipFromChildren = options.skipFromChildren || noop;
      var addChild = options.addChild || function(parent, child) {
        return parent.appendChild(child);
      };
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(
              curFromNodeChild,
              fromEl,
              true
              /* skip keyed nodes */
            );
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
          if (beforeUpdateResult === false) {
            return;
          } else if (beforeUpdateResult instanceof HTMLElement) {
            fromEl = beforeUpdateResult;
            indexTree(fromEl);
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var skipFrom = skipFromChildren(fromEl, toEl);
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (!skipFrom && curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(
                              curFromNodeChild,
                              fromEl,
                              true
                              /* skip keyed nodes */
                            );
                          }
                          curFromNodeChild = matchingFromEl;
                          curFromNodeKey = getNodeKey(curFromNodeChild);
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(
                  curFromNodeChild,
                  fromEl,
                  true
                  /* skip keyed nodes */
                );
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              if (!skipFrom) {
                addChild(fromEl, matchingFromEl);
              }
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                addChild(fromEl, curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    constructor(view, container, id, html, streams, targetCID, opts = {}) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.streams = streams;
      this.streamInserts = {};
      this.streamComponentRestore = {};
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.pendingRemoves = [];
      this.phxRemove = this.liveSocket.binding("remove");
      this.targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
      this.withChildren = opts.withChildren || opts.undoRef || false;
      this.undoRef = opts.undoRef;
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      let phxUpdate = this.liveSocket.binding(PHX_UPDATE);
      dom_default.all(this.container, `[${phxUpdate}=append] > *, [${phxUpdate}=prepend] > *`, (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform(isJoinPatch) {
      let { view, liveSocket: liveSocket2, html, container, targetContainer } = this;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxViewportTop = liveSocket2.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = liveSocket2.binding(PHX_VIEWPORT_BOTTOM);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let externalFormTriggered = null;
      function morph(targetContainer2, source, withChildren = this.withChildren) {
        let morphCallbacks = {
          // normally, we are running with childrenOnly, as the patch HTML for a LV
          // does not include the LV attrs (data-phx-session, etc.)
          // when we are patching a live component, we do want to patch the root element as well;
          // another case is the recursive patch of a stream item that was kept on reset (-> onBeforeNodeAdded)
          childrenOnly: targetContainer2.getAttribute(PHX_COMPONENT) === null && !withChildren,
          getNodeKey: (node) => {
            if (dom_default.isPhxDestroyed(node)) {
              return null;
            }
            if (isJoinPatch) {
              return node.id;
            }
            return node.id || node.getAttribute && node.getAttribute(PHX_MAGIC_ID);
          },
          // skip indexing from children when container is stream
          skipFromChildren: (from) => {
            return from.getAttribute(phxUpdate) === PHX_STREAM;
          },
          // tell morphdom how to add a child
          addChild: (parent, child) => {
            let { ref, streamAt } = this.getStreamInsert(child);
            if (ref === void 0) {
              return parent.appendChild(child);
            }
            this.setStreamRef(child, ref);
            if (streamAt === 0) {
              parent.insertAdjacentElement("afterbegin", child);
            } else if (streamAt === -1) {
              let lastChild = parent.lastElementChild;
              if (lastChild && !lastChild.hasAttribute(PHX_STREAM_REF)) {
                let nonStreamChild = Array.from(parent.children).find((c) => !c.hasAttribute(PHX_STREAM_REF));
                parent.insertBefore(child, nonStreamChild);
              } else {
                parent.appendChild(child);
              }
            } else if (streamAt > 0) {
              let sibling = Array.from(parent.children)[streamAt];
              parent.insertBefore(child, sibling);
            }
          },
          onBeforeNodeAdded: (el) => {
            dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
            this.trackBefore("added", el);
            let morphedEl = el;
            if (this.streamComponentRestore[el.id]) {
              morphedEl = this.streamComponentRestore[el.id];
              delete this.streamComponentRestore[el.id];
              morph.call(this, morphedEl, el, true);
            }
            return morphedEl;
          },
          onNodeAdded: (el) => {
            if (el.getAttribute) {
              this.maybeReOrderStream(el, true);
            }
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => this.onNodeDiscarded(el),
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentElement !== null && el.id && dom_default.isPhxUpdate(el.parentElement, phxUpdate, [PHX_STREAM, "append", "prepend"])) {
              return false;
            }
            if (this.maybePendingRemove(el)) {
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
            this.maybeReOrderStream(el, false);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            if (fromEl.id && fromEl.isSameNode(targetContainer2) && fromEl.id !== toEl.id) {
              morphCallbacks.onNodeDiscarded(fromEl);
              fromEl.replaceWith(toEl);
              return morphCallbacks.onNodeAdded(toEl);
            }
            dom_default.syncPendingAttrs(fromEl, toEl);
            dom_default.maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom);
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              this.maybeReOrderStream(fromEl);
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              [PHX_SESSION, PHX_STATIC, PHX_ROOT_ID].map((attr) => [attr, fromEl.getAttribute(attr), toEl.getAttribute(attr)]).forEach(([attr, fromVal, toVal]) => {
                if (toVal && fromVal !== toVal) {
                  fromEl.setAttribute(attr, toVal);
                }
              });
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: dom_default.isIgnored(fromEl, phxUpdate) });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            let focusedSelectChanged = isFocusedFormEl && this.isChangedSelect(fromEl, toEl);
            if (fromEl.hasAttribute(PHX_REF_SRC) && fromEl.getAttribute(PHX_REF_LOCK) != this.undoRef) {
              if (dom_default.isUploadInput(fromEl)) {
                dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
                this.trackBefore("updated", fromEl, toEl);
                updates.push(fromEl);
              }
              dom_default.applyStickyOperations(fromEl);
              let isLocked = fromEl.hasAttribute(PHX_REF_LOCK);
              let clone2 = isLocked ? dom_default.private(fromEl, PHX_REF_LOCK) || fromEl.cloneNode(true) : null;
              if (clone2) {
                dom_default.putPrivate(fromEl, PHX_REF_LOCK, clone2);
                if (!isFocusedFormEl) {
                  fromEl = clone2;
                }
              }
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (this.undoRef && dom_default.private(toEl, PHX_REF_LOCK)) {
              dom_default.putPrivate(fromEl, PHX_REF_LOCK, dom_default.private(toEl, PHX_REF_LOCK));
            }
            dom_default.copyPrivates(toEl, fromEl);
            if (isFocusedFormEl && fromEl.type !== "hidden" && !focusedSelectChanged) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (focusedSelectChanged) {
                fromEl.blur();
              }
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return fromEl;
            }
          }
        };
        morphdom_esm_default(targetContainer2, source, morphCallbacks);
      }
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        this.streams.forEach(([ref, inserts, deleteIds, reset]) => {
          inserts.forEach(([key, streamAt, limit]) => {
            this.streamInserts[key] = { ref, streamAt, limit, reset };
          });
          if (reset !== void 0) {
            dom_default.all(container, `[${PHX_STREAM_REF}="${ref}"]`, (child) => {
              this.removeStreamChildElement(child);
            });
          }
          deleteIds.forEach((id) => {
            let child = container.querySelector(`[id="${id}"]`);
            if (child) {
              this.removeStreamChildElement(child);
            }
          });
        });
        if (isJoinPatch) {
          dom_default.all(this.container, `[${phxUpdate}=${PHX_STREAM}]`, (el) => {
            Array.from(el.children).forEach((child) => {
              this.removeStreamChildElement(child);
            });
          });
        }
        morph.call(this, targetContainer, html);
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
        detectInvalidStreamInserts(this.streamInserts);
        Array.from(document.querySelectorAll("input[name=id]")).forEach((node) => {
          if (node.form) {
            console.error('Detected an input with name="id" inside a form! This will cause problems when patching the DOM.\n', node);
          }
        });
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      this.transitionPendingRemoves();
      if (externalFormTriggered) {
        liveSocket2.unload();
        Object.getPrototypeOf(externalFormTriggered).submit.call(externalFormTriggered);
      }
      return true;
    }
    onNodeDiscarded(el) {
      if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
        this.liveSocket.destroyViewByEl(el);
      }
      this.trackAfter("discarded", el);
    }
    maybePendingRemove(node) {
      if (node.getAttribute && node.getAttribute(this.phxRemove) !== null) {
        this.pendingRemoves.push(node);
        return true;
      } else {
        return false;
      }
    }
    removeStreamChildElement(child) {
      if (!this.view.ownsElement(child)) {
        return;
      }
      if (this.streamInserts[child.id]) {
        this.streamComponentRestore[child.id] = child;
        child.remove();
      } else {
        if (!this.maybePendingRemove(child)) {
          child.remove();
          this.onNodeDiscarded(child);
        }
      }
    }
    getStreamInsert(el) {
      let insert = el.id ? this.streamInserts[el.id] : {};
      return insert || {};
    }
    setStreamRef(el, ref) {
      dom_default.putSticky(el, PHX_STREAM_REF, (el2) => el2.setAttribute(PHX_STREAM_REF, ref));
    }
    maybeReOrderStream(el, isNew) {
      let { ref, streamAt, reset } = this.getStreamInsert(el);
      if (streamAt === void 0) {
        return;
      }
      this.setStreamRef(el, ref);
      if (!reset && !isNew) {
        return;
      }
      if (!el.parentElement) {
        return;
      }
      if (streamAt === 0) {
        el.parentElement.insertBefore(el, el.parentElement.firstElementChild);
      } else if (streamAt > 0) {
        let children = Array.from(el.parentElement.children);
        let oldIndex = children.indexOf(el);
        if (streamAt >= children.length - 1) {
          el.parentElement.appendChild(el);
        } else {
          let sibling = children[streamAt];
          if (oldIndex > streamAt) {
            el.parentElement.insertBefore(el, sibling);
          } else {
            el.parentElement.insertBefore(el, sibling.nextElementSibling);
          }
        }
      }
      this.maybeLimitStream(el);
    }
    maybeLimitStream(el) {
      let { limit } = this.getStreamInsert(el);
      let children = limit !== null && Array.from(el.parentElement.children);
      if (limit && limit < 0 && children.length > limit * -1) {
        children.slice(0, children.length + limit).forEach((child) => this.removeStreamChildElement(child));
      } else if (limit && limit >= 0 && children.length > limit) {
        children.slice(limit).forEach((child) => this.removeStreamChildElement(child));
      }
    }
    transitionPendingRemoves() {
      let { pendingRemoves, liveSocket: liveSocket2 } = this;
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves, () => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
    }
    isChangedSelect(fromEl, toEl) {
      if (!(fromEl instanceof HTMLSelectElement) || fromEl.multiple) {
        return false;
      }
      if (fromEl.options.length !== toEl.options.length) {
        return true;
      }
      toEl.value = fromEl.value;
      return !fromEl.isEqualNode(toEl);
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.hasAttribute(PHX_SKIP);
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    indexOf(parent, child) {
      return Array.from(parent.children).indexOf(child);
    }
  };
  var VOID_TAGS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  var quoteChars = /* @__PURE__ */ new Set(["'", '"']);
  var modifyRoot = (html, attrs, clearInnerHTML) => {
    let i = 0;
    let insideComment = false;
    let beforeTag, afterTag, tag, tagNameEndsAt, id, newHTML;
    let lookahead = html.match(/^(\s*(?:<!--.*?-->\s*)*)<([^\s\/>]+)/);
    if (lookahead === null) {
      throw new Error(`malformed html ${html}`);
    }
    i = lookahead[0].length;
    beforeTag = lookahead[1];
    tag = lookahead[2];
    tagNameEndsAt = i;
    for (i; i < html.length; i++) {
      if (html.charAt(i) === ">") {
        break;
      }
      if (html.charAt(i) === "=") {
        let isId = html.slice(i - 3, i) === " id";
        i++;
        let char = html.charAt(i);
        if (quoteChars.has(char)) {
          let attrStartsAt = i;
          i++;
          for (i; i < html.length; i++) {
            if (html.charAt(i) === char) {
              break;
            }
          }
          if (isId) {
            id = html.slice(attrStartsAt + 1, i);
            break;
          }
        }
      }
    }
    let closeAt = html.length - 1;
    insideComment = false;
    while (closeAt >= beforeTag.length + tag.length) {
      let char = html.charAt(closeAt);
      if (insideComment) {
        if (char === "-" && html.slice(closeAt - 3, closeAt) === "<!-") {
          insideComment = false;
          closeAt -= 4;
        } else {
          closeAt -= 1;
        }
      } else if (char === ">" && html.slice(closeAt - 2, closeAt) === "--") {
        insideComment = true;
        closeAt -= 3;
      } else if (char === ">") {
        break;
      } else {
        closeAt -= 1;
      }
    }
    afterTag = html.slice(closeAt + 1, html.length);
    let attrsStr = Object.keys(attrs).map((attr) => attrs[attr] === true ? attr : `${attr}="${attrs[attr]}"`).join(" ");
    if (clearInnerHTML) {
      let idAttrStr = id ? ` id="${id}"` : "";
      if (VOID_TAGS.has(tag)) {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}/>`;
      } else {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}></${tag}>`;
      }
    } else {
      let rest = html.slice(tagNameEndsAt, closeAt + 1);
      newHTML = `<${tag}${attrsStr === "" ? "" : " "}${attrsStr}${rest}`;
    }
    return [newHTML, beforeTag, afterTag];
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.magicId = 0;
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      let [str, streams] = this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids, true, {});
      return [str, streams];
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids, changeTracking, rootAttrs) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids, streams: /* @__PURE__ */ new Set() };
      this.toOutputBuffer(rendered, null, output, changeTracking, rootAttrs);
      return [output.buffer, output.streams];
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    resetRender(cid) {
      if (this.rendered[COMPONENTS][cid]) {
        this.rendered[COMPONENTS][cid].reset = true;
      }
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff, true);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 || oldc[cid] === void 0 ? cdiff : this.cloneMerge(oldc[cid], cdiff, false);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        let isObjVal = isObject(val);
        if (isObjVal && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
      if (target[ROOT]) {
        target.newRender = true;
      }
    }
    // Merges cid trees together, copying statics from source tree.
    //
    // The `pruneMagicId` is passed to control pruning the magicId of the
    // target. We must always prune the magicId when we are sharing statics
    // from another component. If not pruning, we replicate the logic from
    // mutableMerge, where we set newRender to true if there is a root
    // (effectively forcing the new version to be rendered instead of skipped)
    //
    cloneMerge(target, source, pruneMagicId) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val, pruneMagicId);
        } else if (val === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, {}, pruneMagicId);
        }
      }
      if (pruneMagicId) {
        delete merged.magicId;
        delete merged.newRender;
      } else if (target[ROOT]) {
        merged.newRender = true;
      }
      return merged;
    }
    componentToString(cid) {
      let [str, streams] = this.recursiveCIDToString(this.rendered[COMPONENTS], cid, null);
      let [strippedHTML, _before, _after] = modifyRoot(str, {});
      return [strippedHTML, streams];
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    // private
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    nextMagicID() {
      this.magicId++;
      return `m${this.magicId}-${this.parentViewId()}`;
    }
    // Converts rendered tree to output buffer.
    //
    // changeTracking controls if we can apply the PHX_SKIP optimization.
    // It is disabled for comprehensions since we must re-render the entire collection
    // and no individual element is tracked inside the comprehension.
    toOutputBuffer(rendered, templates, output, changeTracking, rootAttrs = {}) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let isRoot = rendered[ROOT];
      let prevBuffer = output.buffer;
      if (isRoot) {
        output.buffer = "";
      }
      if (changeTracking && isRoot && !rendered.magicId) {
        rendered.newRender = true;
        rendered.magicId = this.nextMagicID();
      }
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output, changeTracking);
        output.buffer += statics[i];
      }
      if (isRoot) {
        let skip = false;
        let attrs;
        if (changeTracking || rendered.magicId) {
          skip = changeTracking && !rendered.newRender;
          attrs = __spreadValues({ [PHX_MAGIC_ID]: rendered.magicId }, rootAttrs);
        } else {
          attrs = rootAttrs;
        }
        if (skip) {
          attrs[PHX_SKIP] = true;
        }
        let [newRoot, commentBefore, commentAfter] = modifyRoot(output.buffer, attrs, skip);
        rendered.newRender = false;
        output.buffer = prevBuffer + commentBefore + newRoot + commentAfter;
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics, [STREAM]: stream } = rendered;
      let [_ref, _inserts, deleteIds, reset] = stream || [null, {}, [], null];
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          let changeTracking = false;
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output, changeTracking);
          output.buffer += statics[i];
        }
      }
      if (stream !== void 0 && (rendered[DYNAMICS].length > 0 || deleteIds.length > 0 || reset)) {
        delete rendered[STREAM];
        rendered[DYNAMICS] = [];
        output.streams.add(stream);
      }
    }
    dynamicToBuffer(rendered, templates, output, changeTracking) {
      if (typeof rendered === "number") {
        let [str, streams] = this.recursiveCIDToString(output.components, rendered, output.onlyCids);
        output.buffer += str;
        output.streams = /* @__PURE__ */ new Set([...output.streams, ...streams]);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output, changeTracking, {});
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let attrs = { [PHX_COMPONENT]: cid };
      let skip = onlyCids && !onlyCids.has(cid);
      component.newRender = !skip;
      component.magicId = `c${cid}-${this.parentViewId()}`;
      let changeTracking = !component.reset;
      let [html, streams] = this.recursiveToString(component, components, onlyCids, changeTracking, attrs);
      delete component.reset;
      return [html, streams];
    }
  };
  var focusStack = [];
  var default_transition_time = 200;
  var JS = {
    // private
    exec(e, eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, { callback: defaults && defaults.callback }];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind) {
          args = __spreadValues(__spreadValues({}, defaultArgs), args);
          args.callback = args.callback || defaultArgs.callback;
        }
        this.filterToEls(view.liveSocket, sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](e, eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    // returns true if any part of the element is inside the viewport
    isInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      return rect.right > 0 && rect.bottom > 0 && rect.left < windowWidth && rect.top < windowHeight;
    },
    // private
    // commands
    exec_exec(e, eventType, phxEvent, view, sourceEl, el, { attr, to }) {
      let encodedJS = el.getAttribute(attr);
      if (!encodedJS) {
        throw new Error(`expected ${attr} to contain JS command on "${to}"`);
      }
      view.liveSocket.execJS(el, encodedJS, eventType);
    },
    exec_dispatch(e, eventType, phxEvent, view, sourceEl, el, { event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(e, eventType, phxEvent, view, sourceEl, el, args) {
      let { event, data, target, page_loading, loading, value, dispatcher, callback } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      const handler = (targetView, targetCtx) => {
        if (!targetView.isConnected()) {
          return;
        }
        if (eventType === "change") {
          let { newCid, _target } = args;
          _target = _target || (dom_default.isFormInput(sourceEl) ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          let { submitter } = args;
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, submitter, pushOpts, callback);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts, callback);
        }
      };
      if (args.targetView && args.targetCtx) {
        handler(args.targetView, args.targetCtx);
      } else {
        view.withinTargets(phxTarget, handler);
      }
    },
    exec_navigate(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.historyRedirect(e, href, replace ? "replace" : "push", null, sourceEl);
    },
    exec_patch(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.pushHistoryPatch(e, href, replace ? "replace" : "push", sourceEl);
    },
    exec_focus(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.attemptFocus(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.attemptFocus(el));
      });
    },
    exec_focus_first(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el));
      });
    },
    exec_push_focus(e, eventType, phxEvent, view, sourceEl, el) {
      focusStack.push(el || sourceEl);
    },
    exec_pop_focus(_e, _eventType, _phxEvent, _view, _sourceEl, _el) {
      const el = focusStack.pop();
      if (el) {
        el.focus();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => el.focus());
        });
      }
    },
    exec_add_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view, blocking);
    },
    exec_remove_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view, blocking);
    },
    exec_toggle_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.toggleClasses(el, names, transition, time, view, blocking);
    },
    exec_toggle_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val1, val2] }) {
      this.toggleAttr(el, attr, val1, val2);
    },
    exec_transition(e, eventType, phxEvent, view, sourceEl, el, { time, transition, blocking }) {
      this.addOrRemoveClasses(el, [], [], transition, time, view, blocking);
    },
    exec_toggle(e, eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time, blocking }) {
      this.toggle(eventType, view, el, display, ins, outs, time, blocking);
    },
    exec_show(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.show(eventType, view, el, display, transition, time, blocking);
    },
    exec_hide(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.hide(eventType, view, el, display, transition, time, blocking);
    },
    exec_set_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(e, eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    // utils for commands
    show(eventType, view, el, display, transition, time, blocking) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time, blocking);
      }
    },
    hide(eventType, view, el, display, transition, time, blocking) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time, blocking);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time, blocking) {
      time = time || default_transition_time;
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            const stickyDisplay = display || this.defaultDisplay(el);
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => {
                dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
                this.addOrRemoveClasses(el, inEndClasses, inStartClasses);
              });
            });
          };
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          };
          el.dispatchEvent(new Event("phx:show-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            let stickyDisplay = display || this.defaultDisplay(el);
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    toggleClasses(el, classes, transition, time, view, blocking) {
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let newAdds = classes.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let newRemoves = classes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        this.addOrRemoveClasses(el, newAdds, newRemoves, transition, time, view, blocking);
      });
    },
    toggleAttr(el, attr, val1, val2) {
      if (el.hasAttribute(attr)) {
        if (val2 !== void 0) {
          if (el.getAttribute(attr) === val1) {
            this.setOrRemoveAttrs(el, [[attr, val2]], []);
          } else {
            this.setOrRemoveAttrs(el, [[attr, val1]], []);
          }
        } else {
          this.setOrRemoveAttrs(el, [], [attr]);
        }
      } else {
        this.setOrRemoveAttrs(el, [[attr, val1]], []);
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view, blocking) {
      time = time || default_transition_time;
      let [transitionRun, transitionStart, transitionEnd] = transition || [[], [], []];
      if (transitionRun.length > 0) {
        let onStart = () => {
          this.addOrRemoveClasses(el, transitionStart, [].concat(transitionRun).concat(transitionEnd));
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, transitionRun, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, transitionEnd, transitionStart));
          });
        };
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transitionEnd), removes.concat(transitionRun).concat(transitionStart));
        if (blocking === false) {
          onStart();
          setTimeout(onDone, time);
        } else {
          view.transition(time, onStart, onDone);
        }
        return;
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(liveSocket2, sourceEl, { to }) {
      let defaultQuery = () => {
        if (typeof to === "string") {
          return document.querySelectorAll(to);
        } else if (to.closest) {
          let toEl = sourceEl.closest(to.closest);
          return toEl ? [toEl] : [];
        } else if (to.inner) {
          return sourceEl.querySelectorAll(to.inner);
        }
      };
      return to ? liveSocket2.jsQuerySelectorAll(sourceEl, to, defaultQuery) : [sourceEl];
    },
    defaultDisplay(el) {
      return { tr: "table-row", td: "table-cell" }[el.tagName.toLowerCase()] || "block";
    },
    transitionClasses(val) {
      if (!val) {
        return null;
      }
      let [trans, tStart, tEnd] = Array.isArray(val) ? val : [val.split(" "), [], []];
      trans = Array.isArray(trans) ? trans : trans.split(" ");
      tStart = Array.isArray(tStart) ? tStart : tStart.split(" ");
      tEnd = Array.isArray(tEnd) ? tEnd : tEnd.split(" ");
      return [trans, tStart, tEnd];
    }
  };
  var js_default = JS;
  var HOOK_ID = "hookId";
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return dom_default.private(el, HOOK_ID);
    }
    constructor(view, el, callbacks) {
      this.el = el;
      this.__attachView(view);
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      dom_default.putPrivate(this.el, HOOK_ID, this.constructor.makeID());
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __attachView(view) {
      if (view) {
        this.__view = () => view;
        this.liveSocket = view.liveSocket;
      } else {
        this.__view = () => {
          throw new Error(`hook not yet attached to a live view: ${this.el.outerHTML}`);
        };
        this.liveSocket = null;
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
      dom_default.deletePrivate(this.el, HOOK_ID);
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    /**
     * Binds the hook to JS commands.
     *
     * @param {ViewHook} hook - The ViewHook instance to bind.
     *
     * @returns {Object} An object with methods to manipulate the DOM and execute JavaScript.
     */
    js() {
      let hook = this;
      return {
        /**
         * Executes encoded JavaScript in the context of the hook element.
         *
         * @param {string} encodedJS - The encoded JavaScript string to execute.
         */
        exec(encodedJS) {
          hook.__view().liveSocket.execJS(hook.el, encodedJS, "hook");
        },
        /**
         * Shows an element.
         *
         * @param {HTMLElement} el - The element to show.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.display] - The CSS display value to set. Defaults "block".
         * @param {string} [opts.transition] - The CSS transition classes to set when showing.
         * @param {number} [opts.time] - The transition duration in milliseconds. Defaults 200.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *  Defaults `true`.
         */
        show(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.show("hook", owner, el, opts.display, opts.transition, opts.time, opts.blocking);
        },
        /**
         * Hides an element.
         *
         * @param {HTMLElement} el - The element to hide.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set when hiding.
         * @param {number} [opts.time] - The transition duration in milliseconds. Defaults 200.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        hide(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.hide("hook", owner, el, null, opts.transition, opts.time, opts.blocking);
        },
        /**
         * Toggles the visibility of an element.
         *
         * @param {HTMLElement} el - The element to toggle.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.display] - The CSS display value to set. Defaults "block".
         * @param {string} [opts.in] - The CSS transition classes for showing.
         *   Accepts either the string of classes to apply when toggling in, or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-0", "opacity-100"]
         *
         * @param {string} [opts.out] - The CSS transition classes for hiding.
         *   Accepts either string of classes to apply when toggling out, or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         *
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        toggle(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          opts.in = js_default.transitionClasses(opts.in);
          opts.out = js_default.transitionClasses(opts.out);
          js_default.toggle("hook", owner, el, opts.display, opts.in, opts.out, opts.time, opts.blocking);
        },
        /**
         * Adds CSS classes to an element.
         *
         * @param {HTMLElement} el - The element to add classes to.
         * @param {string|string[]} names - The class name(s) to add.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition property to set.
         *   Accepts a string of classes to apply when adding classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-0", "opacity-100"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        addClass(el, names, opts = {}) {
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, names, [], opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Removes CSS classes from an element.
         *
         * @param {HTMLElement} el - The element to remove classes from.
         * @param {string|string[]} names - The class name(s) to remove.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set.
         *   Accepts a string of classes to apply when removing classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        removeClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], names, opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Toggles CSS classes on an element.
         *
         * @param {HTMLElement} el - The element to toggle classes on.
         * @param {string|string[]} names - The class name(s) to toggle.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set.
         *   Accepts a string of classes to apply when toggling classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        toggleClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.toggleClasses(el, names, opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Applies a CSS transition to an element.
         *
         * @param {HTMLElement} el - The element to apply the transition to.
         * @param {string|string[]} transition - The transition class(es) to apply.
         *   Accepts a string of classes to apply when transitioning or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {Object} [opts={}] - Optional settings.
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        transition(el, transition, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], [], js_default.transitionClasses(transition), opts.time, owner, opts.blocking);
        },
        /**
         * Sets an attribute on an element.
         *
         * @param {HTMLElement} el - The element to set the attribute on.
         * @param {string} attr - The attribute name to set.
         * @param {string} val - The value to set for the attribute.
         */
        setAttribute(el, attr, val) {
          js_default.setOrRemoveAttrs(el, [[attr, val]], []);
        },
        /**
         * Removes an attribute from an element.
         *
         * @param {HTMLElement} el - The element to remove the attribute from.
         * @param {string} attr - The attribute name to remove.
         */
        removeAttribute(el, attr) {
          js_default.setOrRemoveAttrs(el, [], [attr]);
        },
        /**
         * Toggles an attribute on an element between two values.
         *
         * @param {HTMLElement} el - The element to toggle the attribute on.
         * @param {string} attr - The attribute name to toggle.
         * @param {string} val1 - The first value to toggle between.
         * @param {string} val2 - The second value to toggle between.
         */
        toggleAttribute(el, attr, val1, val2) {
          js_default.toggleAttr(el, attr, val1, val2);
        }
      };
    }
    pushEvent(event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            const ref = this.__view().pushHookEvent(this.el, null, event, payload, (reply, _ref) => resolve(reply));
            if (ref === false) {
              reject(new Error("unable to push hook event. LiveView not connected"));
            }
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().pushHookEvent(this.el, null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            this.__view().withinTargets(phxTarget, (view, targetCtx) => {
              const ref = view.pushHookEvent(this.el, targetCtx, event, payload, (reply, _ref) => resolve(reply));
              if (ref === false) {
                reject(new Error("unable to push hook event. LiveView not connected"));
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(this.el, targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view().dispatchUploads(null, name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        view.dispatchUploads(targetCtx, name, files);
      });
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var prependFormDataKey = (key, prefix) => {
    let isArray = key.endsWith("[]");
    let baseKey = isArray ? key.slice(0, -2) : key;
    baseKey = baseKey.replace(/([^\[\]]+)(\]?$)/, `${prefix}$1$2`);
    if (isArray) {
      baseKey += "[]";
    }
    return baseKey;
  };
  var serializeForm = (form, metadata, onlyNames = []) => {
    const _a = metadata, { submitter } = _a, meta = __objRest(_a, ["submitter"]);
    let injectedElement;
    if (submitter && submitter.name) {
      const input = document.createElement("input");
      input.type = "hidden";
      const formId = submitter.getAttribute("form");
      if (formId) {
        input.setAttribute("form", formId);
      }
      input.name = submitter.name;
      input.value = submitter.value;
      submitter.parentElement.insertBefore(input, submitter);
      injectedElement = input;
    }
    const formData = new FormData(form);
    const toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    const params = new URLSearchParams();
    let elements = Array.from(form.elements);
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        let inputs = elements.filter((input) => input.name === key);
        let isUnused = !inputs.some((input) => dom_default.private(input, PHX_HAS_FOCUSED) || dom_default.private(input, PHX_HAS_SUBMITTED));
        let hidden = inputs.every((input) => input.type === "hidden");
        if (isUnused && !(submitter && submitter.name == key) && !hidden) {
          params.append(prependFormDataKey(key, "_unused_"), "");
        }
        params.append(key, val);
      }
    }
    if (submitter && injectedElement) {
      submitter.parentElement.removeChild(injectedElement);
    }
    for (let metaKey in meta) {
      params.append(metaKey, meta[metaKey]);
    }
    return params.toString();
  };
  var View = class _View {
    static closestView(el) {
      let liveViewEl = el.closest(PHX_VIEW_SELECTOR);
      return liveViewEl ? dom_default.private(liveViewEl, "view") : null;
    }
    constructor(el, liveSocket2, parentView, flash, liveReferer) {
      this.isDead = false;
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      dom_default.putPrivate(this.el, "view", this);
      this.id = this.el.id;
      this.ref = 0;
      this.lastAckRef = null;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.pendingDiffs = [];
      this.pendingForms = /* @__PURE__ */ new Set();
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinAttempts = 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.formsForRecovery = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        let url = this.href && this.expandURL(this.href);
        return {
          redirect: this.redirect ? url : void 0,
          url: this.redirect ? void 0 : url || void 0,
          params: this.connectParams(liveReferer),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash
        };
      });
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.hasAttribute(PHX_MAIN);
    }
    connectParams(liveReferer) {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      params["_mount_attempts"] = this.joinAttempts;
      params["_live_referer"] = liveReferer;
      this.joinAttempts++;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(
        PHX_CONNECTED_CLASS,
        PHX_LOADING_CLASS,
        PHX_ERROR_CLASS,
        PHX_CLIENT_ERROR_CLASS,
        PHX_SERVER_ERROR_CLASS
      );
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_LOADING_CLASS);
      }
    }
    execAll(binding) {
      dom_default.all(this.el, `[${binding}]`, (el) => this.liveSocket.execJS(el, el.getAttribute(binding)));
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
      this.execAll(this.binding("connected"));
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    // calls the callback with the view and target element for the given phxTarget
    // targets can be:
    //  * an element itself, then it is simply passed to liveSocket.owner;
    //  * a CID (Component ID), then we first search the component's element in the DOM
    //  * a selector, then we search the selector in the DOM and call the callback
    //    for each element found with the corresponding owner view
    withinTargets(phxTarget, callback, dom = document, viewEl) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(viewEl || this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(dom.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      callback({ diff, reply, events });
      if (typeof title === "string" || type == "mount") {
        window.requestAnimationFrame(() => dom_default.putTitle(title));
      }
    }
    onJoin(resp) {
      let { rendered, container, liveview_version } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      if (this.root === this) {
        this.formsForRecovery = this.getFormsForRecovery();
      }
      if (this.isMain() && window.history.state === null) {
        browser_default.pushState("replace", {
          type: "patch",
          id: this.id,
          position: this.liveSocket.currentHistoryPosition
        });
      }
      if (liveview_version !== this.liveSocket.version()) {
        console.error(`LiveView asset version mismatch. JavaScript version ${this.liveSocket.version()} vs. server ${liveview_version}. To avoid issues, please ensure that your assets use the same version as the server.`);
      }
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let [html, streams] = this.renderContainer(null, "join");
        this.dropPendingRefs();
        this.joinCount++;
        this.joinAttempts = 0;
        this.maybeRecoverForms(html, () => {
          this.onJoinComplete(resp, html, streams, events);
        });
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (el) => {
        el.removeAttribute(PHX_REF_LOADING);
        el.removeAttribute(PHX_REF_SRC);
        el.removeAttribute(PHX_REF_LOCK);
      });
    }
    onJoinComplete({ live_patch }, html, streams, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, streams, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        if (fromEl) {
          fromEl.setAttribute(PHX_ROOT_ID, this.root.id);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, streams, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    // this is invoked for dead and live views, so we must filter by
    // by owner to ensure we aren't duplicating hooks across disconnect
    // and connected states. This also handles cases where hooks exist
    // in a root layout with a LV in the body
    execNewMounted(parent = this.el) {
      let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
      dom_default.all(parent, `[${phxViewportTop}], [${phxViewportBottom}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          dom_default.maintainPrivateHooks(hookEl, hookEl, phxViewportTop, phxViewportBottom);
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_MOUNTED)}]`, (el) => {
        if (this.ownsElement(el)) {
          this.maybeMounted(el);
        }
      });
    }
    applyJoinPatch(live_patch, html, streams, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false, true);
      this.joinNewChildren();
      this.execNewMounted();
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    maybeMounted(el) {
      let phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
      let hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
      if (phxMounted && !hasBeenInvoked) {
        this.liveSocket.execJS(el, phxMounted);
        dom_default.putPrivate(el, "mounted", true);
      }
    }
    maybeAddNewHook(el) {
      let newHook = this.addHook(el);
      if (newHook) {
        newHook.__mounted();
      }
    }
    performPatch(patch, pruneCids, isJoinPatch = false) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      this.liveSocket.triggerDOM("onPatchStart", [patch.targetContainer]);
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
        let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
        dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
        this.maybeAddNewHook(el);
        if (el.getAttribute) {
          this.maybeMounted(el);
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform(isJoinPatch);
      this.afterElementsRemoved(removedEls, pruneCids);
      this.liveSocket.triggerDOM("onPatchEnd", [patch.targetContainer]);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-hook]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    maybeRecoverForms(html, callback) {
      const phxChange = this.binding("change");
      const oldForms = this.root.formsForRecovery;
      let template = document.createElement("template");
      template.innerHTML = html;
      const rootEl = template.content.firstElementChild;
      rootEl.id = this.id;
      rootEl.setAttribute(PHX_ROOT_ID, this.root.id);
      rootEl.setAttribute(PHX_SESSION, this.getSession());
      rootEl.setAttribute(PHX_STATIC, this.getStatic());
      rootEl.setAttribute(PHX_PARENT_ID, this.parent ? this.parent.id : null);
      const formsToRecover = (
        // we go over all forms in the new DOM; because this is only the HTML for the current
        // view, we can be sure that all forms are owned by this view:
        dom_default.all(template.content, "form").filter((newForm) => newForm.id && oldForms[newForm.id]).filter((newForm) => !this.pendingForms.has(newForm.id)).filter((newForm) => oldForms[newForm.id].getAttribute(phxChange) === newForm.getAttribute(phxChange)).map((newForm) => {
          return [oldForms[newForm.id], newForm];
        })
      );
      if (formsToRecover.length === 0) {
        return callback();
      }
      formsToRecover.forEach(([oldForm, newForm], i) => {
        this.pendingForms.add(newForm.id);
        this.pushFormRecovery(oldForm, newForm, template.content.firstElementChild, () => {
          this.pendingForms.delete(newForm.id);
          if (i === formsToRecover.length - 1) {
            callback();
          }
        });
      });
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      var _a;
      if (el.id === this.id) {
        return this;
      } else {
        return (_a = this.children[el.getAttribute(PHX_PARENT_ID)]) == null ? void 0 : _a[el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new _View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.pendingForms.clear();
      this.formsForRecovery = {};
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
        return this.pendingDiffs.push({ diff, events });
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findExistingParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let [html, streams] = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff) : null;
        let [html, streams] = this.rendered.toString(cids);
        return [`<${tag}>${html}</${tag}>`, streams];
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let [html, streams] = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, streams, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      let hookElId = ViewHook.elementID(el);
      if (el.getAttribute && !this.ownsElement(el)) {
        return;
      }
      if (hookElId && !this.viewHooks[hookElId]) {
        let hook = dom_default.getCustomElHook(el) || logError(`no hook found for custom element: ${el.id}`);
        this.viewHooks[hookElId] = hook;
        hook.__attachView(this);
        return hook;
      } else if (hookElId || !el.getAttribute) {
        return;
      } else {
        let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
        let callbacks = this.liveSocket.getHookCallbacks(hookName);
        if (callbacks) {
          if (!el.id) {
            logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
          }
          let hook = new ViewHook(this, el, callbacks);
          this.viewHooks[ViewHook.elementID(hook.el)] = hook;
          return hook;
        } else if (hookName !== null) {
          logError(`unknown hook found for "${hookName}"`, el);
        }
      }
    }
    destroyHook(hook) {
      const hookId = ViewHook.elementID(hook.el);
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[hookId];
    }
    applyPendingUpdates() {
      this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
      this.pendingDiffs = [];
      this.eachChild((child) => child.applyPendingUpdates());
    }
    eachChild(callback) {
      let children = this.root.children[this.id] || {};
      for (let id in children) {
        callback(this.getChildById(id));
      }
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      this.eachChild((child) => child.destroy());
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      let e = new CustomEvent("phx:server-navigate", { detail: { to, kind, flash } });
      this.liveSocket.historyRedirect(e, url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash, reloadToken }) {
      this.liveSocket.redirect(to, flash, reloadToken);
    }
    isDestroyed() {
      return this.destroyed;
    }
    joinDead() {
      this.isDead = true;
    }
    joinPush() {
      this.joinPush = this.joinPush || this.channel.join();
      return this.joinPush;
    }
    join(callback) {
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.wrapPush(() => this.channel.join(), {
        ok: (resp) => this.liveSocket.requestDOMUpdate(() => this.onJoin(resp)),
        error: (error) => this.onJoinError(error),
        timeout: () => this.onJoinError({ reason: "timeout" })
      });
    }
    onJoinError(resp) {
      if (resp.reason === "reload") {
        this.log("error", () => [`failed mount with ${resp.status}. Falling back to page reload`, resp]);
        this.onRedirect({ to: this.root.href, reloadToken: resp.token });
        return;
      } else if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        this.onRedirect({ to: this.root.href });
        return;
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      if (this.isMain()) {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        if (this.liveSocket.isConnected()) {
          this.liveSocket.reloadWithJitter(this);
        }
      } else {
        if (this.joinAttempts >= MAX_CHILD_JOIN_ATTEMPTS) {
          this.root.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.log("error", () => [`giving up trying to mount after ${MAX_CHILD_JOIN_ATTEMPTS} tries`, resp]);
          this.destroy();
        }
        let trueChildEl = dom_default.byId(this.el.id);
        if (trueChildEl) {
          dom_default.mergeAttrs(trueChildEl, this.el);
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.el = trueChildEl;
        } else {
          this.destroy();
        }
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.isMain() && this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        if (this.liveSocket.isConnected()) {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        } else {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS]);
        }
      }
    }
    displayError(classes) {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(...classes);
      this.execAll(this.binding("disconnected"));
    }
    wrapPush(callerPush, receives) {
      let latency = this.liveSocket.getLatencySim();
      let withLatency = latency ? (cb) => setTimeout(() => !this.isDestroyed() && cb(), latency) : (cb) => !this.isDestroyed() && cb();
      withLatency(() => {
        callerPush().receive("ok", (resp) => withLatency(() => receives.ok && receives.ok(resp))).receive("error", (reason) => withLatency(() => receives.error && receives.error(reason))).receive("timeout", () => withLatency(() => receives.timeout && receives.timeout()));
      });
    }
    pushWithReply(refGenerator, event, payload) {
      if (!this.isConnected()) {
        return Promise.reject({ error: "noconnection" });
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let oldJoinCount = this.joinCount;
      let onLoadingDone = function() {
      };
      if (opts.page_loading) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return new Promise((resolve, reject) => {
        this.wrapPush(() => this.channel.push(event, payload, PUSH_TIMEOUT), {
          ok: (resp) => {
            if (ref !== null) {
              this.lastAckRef = ref;
            }
            let finish = (hookReply) => {
              if (resp.redirect) {
                this.onRedirect(resp.redirect);
              }
              if (resp.live_patch) {
                this.onLivePatch(resp.live_patch);
              }
              if (resp.live_redirect) {
                this.onLiveRedirect(resp.live_redirect);
              }
              onLoadingDone();
              resolve({ resp, reply: hookReply });
            };
            if (resp.diff) {
              this.liveSocket.requestDOMUpdate(() => {
                this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
                  if (ref !== null) {
                    this.undoRefs(ref, payload.event);
                  }
                  this.update(diff, events);
                  finish(reply);
                });
              });
            } else {
              if (ref !== null) {
                this.undoRefs(ref, payload.event);
              }
              finish(null);
            }
          },
          error: (reason) => reject({ error: reason }),
          timeout: () => {
            reject({ timeout: true });
            if (this.joinCount === oldJoinCount) {
              this.liveSocket.reloadWithJitter(this, () => {
                this.log("timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          }
        });
      });
    }
    undoRefs(ref, phxEvent, onlyEls) {
      if (!this.isConnected()) {
        return;
      }
      let selector = `[${PHX_REF_SRC}="${this.refSrc()}"]`;
      if (onlyEls) {
        onlyEls = new Set(onlyEls);
        dom_default.all(document, selector, (parent) => {
          if (onlyEls && !onlyEls.has(parent)) {
            return;
          }
          dom_default.all(parent, selector, (child) => this.undoElRef(child, ref, phxEvent));
          this.undoElRef(parent, ref, phxEvent);
        });
      } else {
        dom_default.all(document, selector, (el) => this.undoElRef(el, ref, phxEvent));
      }
    }
    undoElRef(el, ref, phxEvent) {
      let elRef = new ElementRef(el);
      elRef.maybeUndo(ref, phxEvent, (clonedTree) => {
        let patch = new DOMPatch(this, el, this.id, clonedTree, [], null, { undoRef: ref });
        const phxChildrenAdded = this.performPatch(patch, true);
        dom_default.all(el, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (child) => this.undoElRef(child, ref, phxEvent));
        if (phxChildrenAdded) {
          this.joinNewChildren();
        }
      });
    }
    refSrc() {
      return this.el.id;
    }
    putRef(elements, phxEvent, eventType, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        let loadingEls = dom_default.all(document, opts.loading).map((el) => {
          return { el, lock: true, loading: true };
        });
        elements = elements.concat(loadingEls);
      }
      for (let { el, lock, loading } of elements) {
        if (!lock && !loading) {
          throw new Error("putRef requires lock or loading");
        }
        el.setAttribute(PHX_REF_SRC, this.refSrc());
        if (loading) {
          el.setAttribute(PHX_REF_LOADING, newRef);
        }
        if (lock) {
          el.setAttribute(PHX_REF_LOCK, newRef);
        }
        if (!loading || opts.submitter && !(el === opts.submitter || el === opts.form)) {
          continue;
        }
        let lockCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-lock:${newRef}`, () => resolve(detail), { once: true });
        });
        let loadingCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-loading:${newRef}`, () => resolve(detail), { once: true });
        });
        el.classList.add(`phx-${eventType}-loading`);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute(PHX_DISABLED, el.getAttribute(PHX_DISABLED) || el.disabled);
          el.setAttribute("disabled", "");
        }
        let detail = {
          event: phxEvent,
          eventType,
          ref: newRef,
          isLoading: loading,
          isLocked: lock,
          lockElements: elements.filter(({ lock: lock2 }) => lock2).map(({ el: el2 }) => el2),
          loadingElements: elements.filter(({ loading: loading2 }) => loading2).map(({ el: el2 }) => el2),
          unlock: (els) => {
            els = Array.isArray(els) ? els : [els];
            this.undoRefs(newRef, phxEvent, els);
          },
          lockComplete: lockCompletePromise,
          loadingComplete: loadingCompletePromise,
          lock: (lockEl) => {
            return new Promise((resolve) => {
              if (this.isAcked(newRef)) {
                return resolve(detail);
              }
              lockEl.setAttribute(PHX_REF_LOCK, newRef);
              lockEl.setAttribute(PHX_REF_SRC, this.refSrc());
              lockEl.addEventListener(`phx:lock-stop:${newRef}`, () => resolve(detail), { once: true });
            });
          }
        };
        el.dispatchEvent(new CustomEvent("phx:push", {
          detail,
          bubbles: true,
          cancelable: false
        }));
        if (phxEvent) {
          el.dispatchEvent(new CustomEvent(`phx:push:${phxEvent}`, {
            detail,
            bubbles: true,
            cancelable: false
          }));
        }
      }
      return [newRef, elements.map(({ el }) => el), opts];
    }
    isAcked(ref) {
      return this.lastAckRef !== null && this.lastAckRef >= ref;
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = opts.target || target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(el, targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([{ el, loading: true, lock: true }], event, "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }).then(({ resp: _resp, reply: hookReply }) => onReply(hookReply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0 && !(el instanceof HTMLFormElement)) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}, onReply) {
      this.pushWithReply(() => this.putRef([{ el, loading: true, lock: true }], phxEvent, type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      }).then(({ reply }) => onReply && onReply(reply));
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }).then(({ resp }) => onReply(resp));
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      if (!inputEl.form) {
        throw new Error("form events require the input to be inside a form");
      }
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx, opts);
      let refGenerator = () => {
        return this.putRef([
          { el: inputEl, loading: true, lock: true },
          { el: inputEl.form, loading: true, lock: true }
        ], phxEvent, "change", opts);
      };
      let formData;
      let meta = this.extractMeta(inputEl.form);
      if (inputEl instanceof HTMLButtonElement) {
        meta.submitter = inputEl;
      }
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, __spreadValues({ _target: opts._target }, meta), [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, __spreadValues({ _target: opts._target }, meta));
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event).then(({ resp }) => {
        if (dom_default.isUploadInput(inputEl) && dom_default.isAutoUpload(inputEl)) {
          ElementRef.onUnlock(inputEl, () => {
            if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
              let [ref, _els] = refGenerator();
              this.undoRefs(ref, phxEvent, [inputEl.form]);
              this.uploadFiles(inputEl.form, phxEvent, targetCtx, ref, cid, (_uploads) => {
                callback && callback(resp);
                this.triggerAwaitingSubmit(inputEl.form, phxEvent);
                this.undoRefs(ref, phxEvent);
              });
            }
          });
        } else {
          callback && callback(resp);
        }
      });
    }
    triggerAwaitingSubmit(formEl, phxEvent) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl, phxEvent);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl, phxEvent) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _opts, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref, phxEvent);
          return false;
        } else {
          return true;
        }
      });
    }
    disableForm(formEl, phxEvent, opts = {}) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let formElements = Array.from(formEl.elements);
      let disables = formElements.filter(filterDisables);
      let buttons = formElements.filter(filterButton).filter(filterIgnored);
      let inputs = formElements.filter(filterInput).filter(filterIgnored);
      buttons.forEach((button) => {
        button.setAttribute(PHX_DISABLED, button.disabled);
        button.disabled = true;
      });
      inputs.forEach((input) => {
        input.setAttribute(PHX_READONLY, input.readOnly);
        input.readOnly = true;
        if (input.files) {
          input.setAttribute(PHX_DISABLED, input.disabled);
          input.disabled = true;
        }
      });
      let formEls = disables.concat(buttons).concat(inputs).map((el) => {
        return { el, loading: true, lock: true };
      });
      let els = [{ el: formEl, loading: true, lock: false }].concat(formEls).reverse();
      return this.putRef(els, phxEvent, "submit", opts);
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply) {
      let refGenerator = () => this.disableForm(formEl, phxEvent, __spreadProps(__spreadValues({}, opts), {
        form: formEl,
        submitter
      }));
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, phxEvent, targetCtx, ref, cid, (_uploads) => {
          if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
            return this.undoRefs(ref, phxEvent);
          }
          let meta = this.extractMeta(formEl);
          let formData = serializeForm(formEl, __spreadValues({ submitter }, meta));
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            cid
          }).then(({ resp }) => onReply(resp));
        });
      } else if (!(formEl.hasAttribute(PHX_REF_SRC) && formEl.classList.contains("phx-submit-loading"))) {
        let meta = this.extractMeta(formEl);
        let formData = serializeForm(formEl, __spreadValues({ submitter }, meta));
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }).then(({ resp }) => onReply(resp));
      }
    }
    uploadFiles(formEl, phxEvent, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        if (entries.length === 0) {
          numFileInputsInProgress--;
          return;
        }
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload).then(({ resp }) => {
          this.log("upload", () => ["got preflight response", resp]);
          uploader.entries().forEach((entry) => {
            if (resp.entries && !resp.entries[entry.ref]) {
              this.handleFailedEntryPreflight(entry.ref, "failed preflight", uploader);
            }
          });
          if (resp.error || Object.keys(resp.entries).length === 0) {
            this.undoRefs(ref, phxEvent);
            let errors = resp.error || [];
            errors.map(([entry_ref, reason]) => {
              this.handleFailedEntryPreflight(entry_ref, reason, uploader);
            });
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        });
      });
    }
    handleFailedEntryPreflight(uploadRef, reason, uploader) {
      if (uploader.isAutoUpload()) {
        let entry = uploader.entries().find((entry2) => entry2.ref === uploadRef.toString());
        if (entry) {
          entry.cancel();
        }
      } else {
        uploader.entries().map((entry) => entry.cancel());
      }
      this.log("upload", () => [`error for entry ${uploadRef}`, reason]);
    }
    dispatchUploads(targetCtx, name, filesOrBlobs) {
      let targetElement = this.targetCtxElement(targetCtx) || this.el;
      let inputs = dom_default.findUploadInputs(targetElement).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    targetCtxElement(targetCtx) {
      if (isCid(targetCtx)) {
        let [target] = dom_default.findComponentNodeList(this.el, targetCtx);
        return target;
      } else if (targetCtx) {
        return targetCtx;
      } else {
        return null;
      }
    }
    pushFormRecovery(oldForm, newForm, templateDom, callback) {
      const phxChange = this.binding("change");
      const phxTarget = newForm.getAttribute(this.binding("target")) || newForm;
      const phxEvent = newForm.getAttribute(this.binding(PHX_AUTO_RECOVER)) || newForm.getAttribute(this.binding("change"));
      const inputs = Array.from(oldForm.elements).filter((el) => dom_default.isFormInput(el) && el.name && !el.hasAttribute(phxChange));
      if (inputs.length === 0) {
        return;
      }
      inputs.forEach((input2) => input2.hasAttribute(PHX_UPLOAD_REF) && LiveUploader.clearFiles(input2));
      let input = inputs.find((el) => el.type !== "hidden") || inputs[0];
      let pending = 0;
      this.withinTargets(phxTarget, (targetView, targetCtx) => {
        const cid = this.targetComponentID(newForm, targetCtx);
        pending++;
        let e = new CustomEvent("phx:form-recovery", { detail: { sourceElement: oldForm } });
        js_default.exec(e, "change", phxEvent, this, input, ["push", {
          _target: input.name,
          targetView,
          targetCtx,
          newCid: cid,
          callback: () => {
            pending--;
            if (pending === 0) {
              callback();
            }
          }
        }]);
      }, templateDom, templateDom);
    }
    pushLinkPatch(e, href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let loading = e.isTrusted && e.type !== "popstate";
      let refGen = targetEl ? () => this.putRef([{ el: targetEl, loading, lock: true }], null, "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let url = href.startsWith("/") ? `${location.protocol}//${location.host}${href}` : href;
      this.pushWithReply(refGen, "live_patch", { url }).then(
        ({ resp }) => {
          this.liveSocket.requestDOMUpdate(() => {
            if (resp.link_redirect) {
              this.liveSocket.replaceMain(href, null, callback, linkRef);
            } else {
              if (this.liveSocket.commitPendingLink(linkRef)) {
                this.href = href;
              }
              this.applyPendingUpdates();
              callback && callback(linkRef);
            }
          });
        },
        ({ error: _error, timeout: _timeout }) => fallback()
      );
    }
    getFormsForRecovery() {
      if (this.joinCount === 0) {
        return {};
      }
      let phxChange = this.binding("change");
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => form.cloneNode(true)).reduce((acc, form) => {
        acc[form.id] = form;
        return acc;
      }, {});
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        willDestroyCIDs.forEach((cid) => this.rendered.resetRender(cid));
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }).then(() => {
          this.liveSocket.requestDOMUpdate(() => {
            let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
              return dom_default.findComponentNodeList(this.el, cid).length === 0;
            });
            if (completelyDestroyCIDs.length > 0) {
              this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }).then(({ resp }) => {
                this.rendered.pruneCIDs(resp.cids);
              });
            }
          });
        });
      }
    }
    ownsElement(el) {
      let parentViewEl = el.closest(PHX_VIEW_SELECTOR);
      return el.getAttribute(PHX_PARENT_ID) === this.id || parentViewEl && parentViewEl.id === this.id || !parentViewEl && this.isDead;
    }
    submitForm(form, targetCtx, phxEvent, submitter, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      const inputs = Array.from(form.elements);
      inputs.forEach((input) => dom_default.putPrivate(input, PHX_HAS_SUBMITTED, true));
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, submitter, opts, () => {
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.boundEventNames = /* @__PURE__ */ new Set();
      this.serverCloseRef = null;
      this.domCallbacks = Object.assign(
        {
          jsQuerySelectorAll: null,
          onPatchStart: closure2(),
          onPatchEnd: closure2(),
          onNodeAdded: closure2(),
          onBeforeElUpdated: closure2()
        },
        opts.dom || {}
      );
      this.transitions = new TransitionSet();
      this.currentHistoryPosition = parseInt(this.sessionStorage.getItem(PHX_LV_HISTORY_POSITION)) || 0;
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    // public
    version() {
      return "1.0.5";
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        this.resetReloadStatus();
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        } else {
          this.bindTopLevelEvents({ dead: true });
        }
        this.joinDeadView();
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      if (this.serverCloseRef) {
        this.socket.off(this.serverCloseRef);
        this.serverCloseRef = null;
      }
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    execJS(el, encodedJS, eventType = null) {
      let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
      this.owner(el, (view) => js_default.exec(e, eventType, encodedJS, view, el));
    }
    // private
    execJSHookPush(el, phxEvent, data, callback) {
      this.withinOwners(el, (view) => {
        let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
        js_default.exec(e, "hook", phxEvent, view, el, ["push", { data, callback }]);
      });
    }
    unload() {
      if (this.unloaded) {
        return;
      }
      if (this.main && this.isConnected()) {
        this.log(this.main, "socket", () => ["disconnect for page nav"]);
      }
      this.unloaded = true;
      this.destroyAllViews();
      this.disconnect();
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          setTimeout(() => cb(data), latency);
        }
      });
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      if (tries >= this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
        if (tries >= this.maxReloads) {
          this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        }
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinDeadView() {
      let body = document.body;
      if (body && !this.isPhxView(body) && !this.isPhxView(document.firstElementChild)) {
        let view = this.newRootView(body);
        view.setHref(this.getHref());
        view.joinDead();
        if (!this.main) {
          this.main = view;
        }
        window.requestAnimationFrame(() => {
          var _a;
          view.execNewMounted();
          this.maybeScroll((_a = history.state) == null ? void 0 : _a.scroll);
        });
      }
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          if (!dom_default.isPhxSticky(rootEl)) {
            view.setHref(this.getHref());
          }
          view.join();
          if (rootEl.hasAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash, reloadToken) {
      if (reloadToken) {
        browser_default.setCookie(PHX_RELOAD_STATUS, reloadToken, 60);
      }
      this.unload();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      const liveReferer = this.currentLocation.href;
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      const stickies = dom_default.findPhxSticky(document) || [];
      const removeEls = dom_default.all(this.outgoingMainEl, `[${this.binding("remove")}]`).filter((el) => !dom_default.isChildOfAny(el, stickies));
      const newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash, liveReferer);
      this.main.setRedirect(href);
      this.transitionRemoves(removeEls);
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            removeEls.forEach((el) => el.remove());
            stickies.forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && callback(linkRef);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements, callback) {
      let removeAttr = this.binding("remove");
      let silenceEvents = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      elements.forEach((el) => {
        for (let event of this.boundEventNames) {
          el.addEventListener(event, silenceEvents, true);
        }
        this.execJS(el, el.getAttribute(removeAttr), "remove");
      });
      this.requestDOMUpdate(() => {
        elements.forEach((el) => {
          for (let event of this.boundEventNames) {
            el.removeEventListener(event, silenceEvents, true);
          }
        });
        callback && callback();
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash, liveReferer) {
      let view = new View(el, this, null, flash, liveReferer);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
      return view && callback ? callback(view) : view;
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
      this.main = null;
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    getActiveElement() {
      return document.activeElement;
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents({ dead } = {}) {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.serverCloseRef = this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          return this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      if (!dead) {
        this.bindNav();
      }
      this.bindClicks();
      if (!dead) {
        this.bindForms();
      }
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, _phxTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (!phxTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.on("dragover", (e) => e.preventDefault());
      this.on("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files, e.dataTransfer);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      this.resetReloadStatus();
      return this.linkRef;
    }
    // anytime we are navigating or connecting, drop reload cookie in case
    // we issue the cookie but the next request was interrupted and the server never dropped it
    resetReloadStatus() {
      browser_default.deleteCookie(PHX_RELOAD_STATUS);
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, browserEventName, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, browserEventName, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      this.on("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click");
    }
    bindClick(eventName, bindingName) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (e.detail === 0)
          this.clickStartedAtTarget = e.target;
        let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
        target = closestPhxBinding(e.target, click);
        this.dispatchClickAway(e, clickStartedAtTarget);
        this.clickStartedAtTarget = null;
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          if (dom_default.isNewPageClick(e, window.location)) {
            this.unload();
          }
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        if (target.hasAttribute(PHX_REF_SRC)) {
          return;
        }
        this.debounce(target, e, "click", () => {
          this.withinOwners(target, (view) => {
            js_default.exec(e, "click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, false);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(el, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el) && js_default.isInViewport(el)) {
              js_default.exec(e, "click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, backType, id, scroll, position } = event.state || {};
        let href = window.location.href;
        let isForward = position > this.currentHistoryPosition;
        type = isForward ? type : backType || type;
        this.currentHistoryPosition = position || 0;
        this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
        dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: type === "patch", pop: true, direction: isForward ? "forward" : "backward" } });
        this.requestDOMUpdate(() => {
          const callback = () => {
            this.maybeScroll(scroll);
          };
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(event, href, null, callback);
          } else {
            this.replaceMain(href, null, callback);
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        if (!type || !this.isConnected() || !this.main || dom_default.wantsNewTab(e)) {
          return;
        }
        let href = target.href instanceof SVGAnimatedString ? target.href.baseVal : target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(e, href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(e, href, linkState, null, target);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
          let phxClick = target.getAttribute(this.binding("click"));
          if (phxClick) {
            this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
          }
        });
      }, false);
    }
    maybeScroll(scroll) {
      if (typeof scroll === "number") {
        requestAnimationFrame(() => {
          window.scrollTo(0, scroll);
        });
      }
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(e, href, linkState, targetEl) {
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href);
      }
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(e, href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      this.currentHistoryPosition++;
      this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
      browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "patch" }));
      browser_default.pushState(linkState, {
        type: "patch",
        id: this.main.id,
        position: this.currentHistoryPosition
      }, href);
      dom_default.dispatchEvent(window, "phx:navigate", { detail: { patch: true, href, pop: false, direction: "forward" } });
      this.registerNewLocation(window.location);
    }
    historyRedirect(e, href, linkState, flash, targetEl) {
      const clickLoading = targetEl && e.isTrusted && e.type !== "popstate";
      if (clickLoading) {
        targetEl.classList.add("phx-click-loading");
      }
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href, flash);
      }
      if (/^\/$|^\/[^\/]+.*$/.test(href)) {
        let { protocol, host } = window.location;
        href = `${protocol}//${host}${href}`;
      }
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, (linkRef) => {
          if (linkRef === this.linkRef) {
            this.currentHistoryPosition++;
            this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
            browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "redirect" }));
            browser_default.pushState(linkState, {
              type: "redirect",
              id: this.main.id,
              scroll,
              position: this.currentHistoryPosition
            }, href);
            dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: false, pop: false, direction: "forward" } });
            this.registerNewLocation(window.location);
          }
          if (clickLoading) {
            targetEl.classList.remove("phx-click-loading");
          }
          done();
        });
      });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      let externalFormSubmitted = false;
      this.on("submit", (e) => {
        let phxSubmit = e.target.getAttribute(this.binding("submit"));
        let phxChange = e.target.getAttribute(this.binding("change"));
        if (!externalFormSubmitted && phxChange && !phxSubmit) {
          externalFormSubmitted = true;
          e.preventDefault();
          this.withinOwners(e.target, (view) => {
            view.disableForm(e.target);
            window.requestAnimationFrame(() => {
              if (dom_default.isUnloadableFormSubmit(e)) {
                this.unload();
              }
              e.target.submit();
            });
          });
        }
      });
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          if (dom_default.isUnloadableFormSubmit(e)) {
            this.unload();
          }
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec(e, "submit", phxEvent, view, e.target, ["push", { submitter: e.submitter }]);
        });
      });
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          if (e instanceof CustomEvent && e.target.form === void 0) {
            if (e.detail && e.detail.dispatcher) {
              throw new Error(`dispatching a custom ${type} event is only supported on input elements inside a form`);
            }
            return;
          }
          let phxChange = this.binding("change");
          let input = e.target;
          if (e.isComposing) {
            const key = `composition-listener-${type}`;
            if (!dom_default.private(input, key)) {
              dom_default.putPrivate(input, key, true);
              input.addEventListener("compositionend", () => {
                input.dispatchEvent(new Event(type, { bubbles: true }));
                dom_default.deletePrivate(input, key);
              }, { once: true });
            }
            return;
          }
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type === "change" && lastType === "input") {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              js_default.exec(e, "change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        });
      }
      this.on("reset", (e) => {
        let form = e.target;
        dom_default.resetForm(form);
        let input = Array.from(form.elements).find((el) => el.type === "reset");
        if (input) {
          window.requestAnimationFrame(() => {
            input.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
          });
        }
      });
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
          callback();
        });
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      this.boundEventNames.add(event);
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
    jsQuerySelectorAll(sourceEl, query, defaultQuery) {
      let all = this.domCallbacks.jsQuerySelectorAll;
      return all ? all(sourceEl, query, defaultQuery) : defaultQuery();
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
    }
    reset() {
      this.transitions.forEach((timer) => {
        clearTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        this.flushPendingOps();
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      if (this.size() > 0) {
        return;
      }
      let op = this.pendingOps.shift();
      if (op) {
        op();
        this.flushPendingOps();
      }
    }
  };

  // js/app.js
  var import_topbar = __toESM(require_topbar());

  // js/hooks.js
  var Hooks2 = {};
  Hooks2.RehearsalHistory = {
    mounted() {
      this.handleEvent("print_plan", ({ date }) => {
        document.getElementById("rehearsal-history").style.display = "none";
        const printPlans = document.querySelectorAll(".print-plan");
        printPlans.forEach((plan) => {
          plan.style.display = "none";
        });
        const targetPlan = document.querySelector(`.print-plan[data-date="${date}"]`);
        if (targetPlan) {
          targetPlan.style.display = "block";
        }
        document.querySelector(".print-only").classList.remove("hidden");
        setTimeout(() => {
          window.print();
          document.getElementById("rehearsal-history").style.display = "block";
          document.querySelector(".print-only").classList.add("hidden");
        }, 100);
      });
    }
  };
  Hooks2.SetListHistory = {
    mounted() {
      this.handleEvent("print_set_list", ({ name }) => {
        document.getElementById("set-list-history").style.display = "none";
        const printSetLists = document.querySelectorAll(".print-setlist");
        printSetLists.forEach((setList) => {
          setList.style.display = "none";
        });
        const targetSetList = document.querySelector(`.print-setlist[data-name="${name}"]`);
        if (targetSetList) {
          targetSetList.style.display = "block";
        }
        document.querySelector("#setlist-print-container").classList.remove("hidden");
        setTimeout(() => {
          window.print();
          document.getElementById("set-list-history").style.display = "block";
          document.querySelector("#setlist-print-container").classList.add("hidden");
        }, 100);
      });
    }
  };
  Hooks2.SortableSongs = {
    mounted() {
      const hook = this;
      new Sortable(this.el, {
        animation: 150,
        handle: ".drag-handle",
        ghostClass: "sortable-ghost",
        dragClass: "sortable-drag",
        onEnd: function(evt) {
          const songId = evt.item.dataset.songId;
          const newIndex = evt.newIndex;
          const oldIndex = evt.oldIndex;
          const setIndex = hook.el.dataset.setIndex;
          if (newIndex !== oldIndex) {
            hook.pushEvent("reorder_song", {
              song_id: songId.toString(),
              old_index: oldIndex.toString(),
              new_index: newIndex.toString(),
              set_index: setIndex.toString()
            });
          }
        }
      });
    }
  };
  var hooks_default2 = Hooks2;

  // js/app.js
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, {
    longPollFallbackMs: 2500,
    params: { _csrf_token: csrfToken },
    hooks: hooks_default2
  });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (_info) => import_topbar.default.show(300));
  window.addEventListener("phx:page-loading-stop", (_info) => import_topbar.default.hide());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 2.0.0, 2023-02-04
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC91dGlscy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wdXNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC90aW1lci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY2hhbm5lbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvYWpheC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvbG9uZ3BvbGwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3ByZXNlbmNlLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zZXJpYWxpemVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2FyaWEuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvaG9va3MuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZWxlbWVudF9yZWYuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9ub2RlX21vZHVsZXMvbW9ycGhkb20vZGlzdC9tb3JwaGRvbS1lc20uanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3BhdGNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3JlbmRlcmVkLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2pzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXdfaG9vay5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy92aWV3LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2xpdmVfc29ja2V0LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9hcHAuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2hvb2tzLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogdG9wYmFyIDIuMC4wLCAyMDIzLTAyLTA0XG4gKiBodHRwczovL2J1dW5ndXllbi5naXRodWIuaW8vdG9wYmFyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgQnV1IE5ndXllblxuICovXG4oZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzFcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gW1wibXNcIiwgXCJtb3pcIiwgXCJ3ZWJraXRcIiwgXCJvXCJdO1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl0gfHxcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICB9XG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuICAgICAgICB9LCB0aW1lVG9DYWxsKTtcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH07XG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgIH07XG4gIH0pKCk7XG5cbiAgdmFyIGNhbnZhcyxcbiAgICBjdXJyZW50UHJvZ3Jlc3MsXG4gICAgc2hvd2luZyxcbiAgICBwcm9ncmVzc1RpbWVySWQgPSBudWxsLFxuICAgIGZhZGVUaW1lcklkID0gbnVsbCxcbiAgICBkZWxheVRpbWVySWQgPSBudWxsLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoZGVsYXkpIHtcbiAgICAgICAgaWYgKHNob3dpbmcpIHJldHVybjtcbiAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgaWYgKGRlbGF5VGltZXJJZCkgcmV0dXJuO1xuICAgICAgICAgIGRlbGF5VGltZXJJZCA9IHNldFRpbWVvdXQoKCkgPT4gdG9wYmFyLnNob3coKSwgZGVsYXkpO1xuICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICBzaG93aW5nID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgICAgaWYgKCFjYW52YXMpIGNyZWF0ZUNhbnZhcygpO1xuICAgICAgICAgIGNhbnZhcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICB0b3BiYXIucHJvZ3Jlc3MoMCk7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuYXV0b1J1bikge1xuICAgICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgICAgICAgIHRvcGJhci5wcm9ncmVzcyhcbiAgICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2dyZXNzOiBmdW5jdGlvbiAodG8pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0byA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgICAgaWYgKHR5cGVvZiB0byA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIHRvID1cbiAgICAgICAgICAgICh0by5pbmRleE9mKFwiK1wiKSA+PSAwIHx8IHRvLmluZGV4T2YoXCItXCIpID49IDBcbiAgICAgICAgICAgICAgPyBjdXJyZW50UHJvZ3Jlc3NcbiAgICAgICAgICAgICAgOiAwKSArIHBhcnNlRmxvYXQodG8pO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRQcm9ncmVzcyA9IHRvID4gMSA/IDEgOiB0bztcbiAgICAgICAgcmVwYWludCgpO1xuICAgICAgICByZXR1cm4gY3VycmVudFByb2dyZXNzO1xuICAgICAgfSxcbiAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGRlbGF5VGltZXJJZCk7XG4gICAgICAgIGRlbGF5VGltZXJJZCA9IG51bGw7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBQb2x5ZmlsbEV2ZW50ID0gZXZlbnRDb25zdHJ1Y3RvcigpO1xuXG4gIGZ1bmN0aW9uIGV2ZW50Q29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHdpbmRvdy5DdXN0b21FdmVudDtcbiAgICAvLyBJRTw9OSBTdXBwb3J0XG4gICAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBDdXN0b21FdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkSGlkZGVuSW5wdXQobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlbGVtZW50LCB0YXJnZXRNb2RpZmllcktleSkge1xuICAgIHZhciB0byA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSxcbiAgICAgICAgbWV0aG9kID0gYnVpbGRIaWRkZW5JbnB1dChcIl9tZXRob2RcIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSksXG4gICAgICAgIGNzcmYgPSBidWlsZEhpZGRlbklucHV0KFwiX2NzcmZfdG9rZW5cIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNzcmZcIikpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG4gICAgICAgIHN1Ym1pdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxcbiAgICAgICAgdGFyZ2V0ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0YXJnZXRcIik7XG5cbiAgICBmb3JtLm1ldGhvZCA9IChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpID09PSBcImdldFwiKSA/IFwiZ2V0XCIgOiBcInBvc3RcIjtcbiAgICBmb3JtLmFjdGlvbiA9IHRvO1xuICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgaWYgKHRhcmdldCkgZm9ybS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgZWxzZSBpZiAodGFyZ2V0TW9kaWZpZXJLZXkpIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2QpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG5cbiAgICAvLyBJbnNlcnQgYSBidXR0b24gYW5kIGNsaWNrIGl0IGluc3RlYWQgb2YgdXNpbmcgYGZvcm0uc3VibWl0YFxuICAgIC8vIGJlY2F1c2UgdGhlIGBzdWJtaXRgIGZ1bmN0aW9uIGRvZXMgbm90IGVtaXQgYSBgc3VibWl0YCBldmVudC5cbiAgICBzdWJtaXQudHlwZSA9IFwic3VibWl0XCI7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChzdWJtaXQpO1xuICAgIHN1Ym1pdC5jbGljaygpO1xuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSkge1xuICAgICAgdmFyIHBob2VuaXhMaW5rRXZlbnQgPSBuZXcgUG9seWZpbGxFdmVudCgncGhvZW5peC5saW5rLmNsaWNrJywge1xuICAgICAgICBcImJ1YmJsZXNcIjogdHJ1ZSwgXCJjYW5jZWxhYmxlXCI6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWVsZW1lbnQuZGlzcGF0Y2hFdmVudChwaG9lbml4TGlua0V2ZW50KSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRvXCIpKSB7XG4gICAgICAgIGhhbmRsZUNsaWNrKGVsZW1lbnQsIGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgZmFsc2UpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaG9lbml4LmxpbmsuY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBtZXNzYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb25maXJtXCIpO1xuICAgIGlmKG1lc3NhZ2UgJiYgIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KSgpO1xuIiwgIi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsdWUpID0+IHtcbiAgaWYodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpe1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxldCBjbG9zdXJlID0gZnVuY3Rpb24gKCl7IHJldHVybiB2YWx1ZSB9XG4gICAgcmV0dXJuIGNsb3N1cmVcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbFxuZXhwb3J0IGNvbnN0IHBoeFdpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBudWxsXG5leHBvcnQgY29uc3QgZ2xvYmFsID0gZ2xvYmFsU2VsZiB8fCBwaHhXaW5kb3cgfHwgZ2xvYmFsXG5leHBvcnQgY29uc3QgREVGQVVMVF9WU04gPSBcIjIuMC4wXCJcbmV4cG9ydCBjb25zdCBTT0NLRVRfU1RBVEVTID0ge2Nvbm5lY3Rpbmc6IDAsIG9wZW46IDEsIGNsb3Npbmc6IDIsIGNsb3NlZDogM31cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVQgPSAxMDAwMFxuZXhwb3J0IGNvbnN0IFdTX0NMT1NFX05PUk1BTCA9IDEwMDBcbmV4cG9ydCBjb25zdCBDSEFOTkVMX1NUQVRFUyA9IHtcbiAgY2xvc2VkOiBcImNsb3NlZFwiLFxuICBlcnJvcmVkOiBcImVycm9yZWRcIixcbiAgam9pbmVkOiBcImpvaW5lZFwiLFxuICBqb2luaW5nOiBcImpvaW5pbmdcIixcbiAgbGVhdmluZzogXCJsZWF2aW5nXCIsXG59XG5leHBvcnQgY29uc3QgQ0hBTk5FTF9FVkVOVFMgPSB7XG4gIGNsb3NlOiBcInBoeF9jbG9zZVwiLFxuICBlcnJvcjogXCJwaHhfZXJyb3JcIixcbiAgam9pbjogXCJwaHhfam9pblwiLFxuICByZXBseTogXCJwaHhfcmVwbHlcIixcbiAgbGVhdmU6IFwicGh4X2xlYXZlXCJcbn1cblxuZXhwb3J0IGNvbnN0IFRSQU5TUE9SVFMgPSB7XG4gIGxvbmdwb2xsOiBcImxvbmdwb2xsXCIsXG4gIHdlYnNvY2tldDogXCJ3ZWJzb2NrZXRcIlxufVxuZXhwb3J0IGNvbnN0IFhIUl9TVEFURVMgPSB7XG4gIGNvbXBsZXRlOiA0XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHVzaFxuICogQHBhcmFtIHtDaGFubmVsfSBjaGFubmVsIC0gVGhlIENoYW5uZWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIFRoZSBldmVudCwgZm9yIGV4YW1wbGUgYFwicGh4X2pvaW5cImBcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gVGhlIHBheWxvYWQsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogMTIzfWBcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gVGhlIHB1c2ggdGltZW91dCBpbiBtaWxsaXNlY29uZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVzaCB7XG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIGV2ZW50LCBwYXlsb2FkLCB0aW1lb3V0KXtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgdGhpcy5ldmVudCA9IGV2ZW50XG4gICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZCB8fCBmdW5jdGlvbiAoKXsgcmV0dXJuIHt9IH1cbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gICAgdGhpcy5yZWNIb29rcyA9IFtdXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dFxuICAgKi9cbiAgcmVzZW5kKHRpbWVvdXQpe1xuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLnJlc2V0KClcbiAgICB0aGlzLnNlbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBzZW5kKCl7XG4gICAgaWYodGhpcy5oYXNSZWNlaXZlZChcInRpbWVvdXRcIikpeyByZXR1cm4gfVxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KClcbiAgICB0aGlzLnNlbnQgPSB0cnVlXG4gICAgdGhpcy5jaGFubmVsLnNvY2tldC5wdXNoKHtcbiAgICAgIHRvcGljOiB0aGlzLmNoYW5uZWwudG9waWMsXG4gICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgIHBheWxvYWQ6IHRoaXMucGF5bG9hZCgpLFxuICAgICAgcmVmOiB0aGlzLnJlZixcbiAgICAgIGpvaW5fcmVmOiB0aGlzLmNoYW5uZWwuam9pblJlZigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHN0YXR1c1xuICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrXG4gICAqL1xuICByZWNlaXZlKHN0YXR1cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoc3RhdHVzKSl7XG4gICAgICBjYWxsYmFjayh0aGlzLnJlY2VpdmVkUmVzcC5yZXNwb25zZSlcbiAgICB9XG5cbiAgICB0aGlzLnJlY0hvb2tzLnB1c2goe3N0YXR1cywgY2FsbGJhY2t9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCl7XG4gICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgdGhpcy5yZWYgPSBudWxsXG4gICAgdGhpcy5yZWZFdmVudCA9IG51bGxcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnNlbnQgPSBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBtYXRjaFJlY2VpdmUoe3N0YXR1cywgcmVzcG9uc2UsIF9yZWZ9KXtcbiAgICB0aGlzLnJlY0hvb2tzLmZpbHRlcihoID0+IGguc3RhdHVzID09PSBzdGF0dXMpXG4gICAgICAuZm9yRWFjaChoID0+IGguY2FsbGJhY2socmVzcG9uc2UpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxSZWZFdmVudCgpe1xuICAgIGlmKCF0aGlzLnJlZkV2ZW50KXsgcmV0dXJuIH1cbiAgICB0aGlzLmNoYW5uZWwub2ZmKHRoaXMucmVmRXZlbnQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbFRpbWVvdXQoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0VGltZXIpXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0VGltZW91dCgpe1xuICAgIGlmKHRoaXMudGltZW91dFRpbWVyKXsgdGhpcy5jYW5jZWxUaW1lb3V0KCkgfVxuICAgIHRoaXMucmVmID0gdGhpcy5jaGFubmVsLnNvY2tldC5tYWtlUmVmKClcbiAgICB0aGlzLnJlZkV2ZW50ID0gdGhpcy5jaGFubmVsLnJlcGx5RXZlbnROYW1lKHRoaXMucmVmKVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKHRoaXMucmVmRXZlbnQsIHBheWxvYWQgPT4ge1xuICAgICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgICB0aGlzLmNhbmNlbFRpbWVvdXQoKVxuICAgICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBwYXlsb2FkXG4gICAgICB0aGlzLm1hdGNoUmVjZWl2ZShwYXlsb2FkKVxuICAgIH0pXG5cbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKFwidGltZW91dFwiLCB7fSlcbiAgICB9LCB0aGlzLnRpbWVvdXQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhhc1JlY2VpdmVkKHN0YXR1cyl7XG4gICAgcmV0dXJuIHRoaXMucmVjZWl2ZWRSZXNwICYmIHRoaXMucmVjZWl2ZWRSZXNwLnN0YXR1cyA9PT0gc3RhdHVzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXIoc3RhdHVzLCByZXNwb25zZSl7XG4gICAgdGhpcy5jaGFubmVsLnRyaWdnZXIodGhpcy5yZWZFdmVudCwge3N0YXR1cywgcmVzcG9uc2V9KVxuICB9XG59XG4iLCAiLyoqXG4gKlxuICogQ3JlYXRlcyBhIHRpbWVyIHRoYXQgYWNjZXB0cyBhIGB0aW1lckNhbGNgIGZ1bmN0aW9uIHRvIHBlcmZvcm1cbiAqIGNhbGN1bGF0ZWQgdGltZW91dCByZXRyaWVzLCBzdWNoIGFzIGV4cG9uZW50aWFsIGJhY2tvZmYuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCByZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB0aGlzLmNvbm5lY3QoKSwgZnVuY3Rpb24odHJpZXMpe1xuICogICByZXR1cm4gWzEwMDAsIDUwMDAsIDEwMDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9KVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgNTAwMFxuICogcmVjb25uZWN0VGltZXIucmVzZXQoKVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aW1lckNhbGNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXIge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgdGltZXJDYWxjKXtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB0aGlzLnRpbWVyQ2FsYyA9IHRpbWVyQ2FsY1xuICAgIHRoaXMudGltZXIgPSBudWxsXG4gICAgdGhpcy50cmllcyA9IDBcbiAgfVxuXG4gIHJlc2V0KCl7XG4gICAgdGhpcy50cmllcyA9IDBcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcilcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIGFueSBwcmV2aW91cyBzY2hlZHVsZVRpbWVvdXQgYW5kIHNjaGVkdWxlcyBjYWxsYmFja1xuICAgKi9cbiAgc2NoZWR1bGVUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG5cbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWVzID0gdGhpcy50cmllcyArIDFcbiAgICAgIHRoaXMuY2FsbGJhY2soKVxuICAgIH0sIHRoaXMudGltZXJDYWxjKHRoaXMudHJpZXMgKyAxKSlcbiAgfVxufVxuIiwgImltcG9ydCB7Y2xvc3VyZX0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHtcbiAgQ0hBTk5FTF9FVkVOVFMsXG4gIENIQU5ORUxfU1RBVEVTLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgUHVzaCBmcm9tIFwiLi9wdXNoXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKX0gcGFyYW1zXG4gKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWwge1xuICBjb25zdHJ1Y3Rvcih0b3BpYywgcGFyYW1zLCBzb2NrZXQpe1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5jbG9zZWRcbiAgICB0aGlzLnRvcGljID0gdG9waWNcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUocGFyYW1zIHx8IHt9KVxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0XG4gICAgdGhpcy5iaW5kaW5ncyA9IFtdXG4gICAgdGhpcy5iaW5kaW5nUmVmID0gMFxuICAgIHRoaXMudGltZW91dCA9IHRoaXMuc29ja2V0LnRpbWVvdXRcbiAgICB0aGlzLmpvaW5lZE9uY2UgPSBmYWxzZVxuICAgIHRoaXMuam9pblB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5qb2luLCB0aGlzLnBhcmFtcywgdGhpcy50aW1lb3V0KVxuICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMgPSBbXVxuXG4gICAgdGhpcy5yZWpvaW5UaW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSwgdGhpcy5zb2NrZXQucmVqb2luQWZ0ZXJNcylcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uRXJyb3IoKCkgPT4gdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpKSlcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uT3BlbigoKSA9PiB7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuaXNFcnJvcmVkKCkpeyB0aGlzLnJlam9pbigpIH1cbiAgICB9KVxuICAgIClcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmVkXG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5mb3JFYWNoKHB1c2hFdmVudCA9PiBwdXNoRXZlbnQuc2VuZCgpKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyID0gW11cbiAgICB9KVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcImVycm9yXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uQ2xvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgY2xvc2UgJHt0aGlzLnRvcGljfSAke3RoaXMuam9pblJlZigpfWApXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgICB0aGlzLnNvY2tldC5yZW1vdmUodGhpcylcbiAgICB9KVxuICAgIHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGVycm9yICR7dGhpcy50b3BpY31gLCByZWFzb24pXG4gICAgICBpZih0aGlzLmlzSm9pbmluZygpKXsgdGhpcy5qb2luUHVzaC5yZXNldCgpIH1cbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGB0aW1lb3V0ICR7dGhpcy50b3BpY30gKCR7dGhpcy5qb2luUmVmKCl9KWAsIHRoaXMuam9pblB1c2gudGltZW91dClcbiAgICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRoaXMudGltZW91dClcbiAgICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICB0aGlzLmpvaW5QdXNoLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMucmVwbHksIChwYXlsb2FkLCByZWYpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcih0aGlzLnJlcGx5RXZlbnROYW1lKHJlZiksIHBheWxvYWQpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBKb2luIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgaWYodGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInRyaWVkIHRvIGpvaW4gbXVsdGlwbGUgdGltZXMuICdqb2luJyBjYW4gb25seSBiZSBjYWxsZWQgYSBzaW5nbGUgdGltZSBwZXIgY2hhbm5lbCBpbnN0YW5jZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgICB0aGlzLmpvaW5lZE9uY2UgPSB0cnVlXG4gICAgICB0aGlzLnJlam9pbigpXG4gICAgICByZXR1cm4gdGhpcy5qb2luUHVzaFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIb29rIGludG8gY2hhbm5lbCBjbG9zZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjayl7XG4gICAgdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgZXJyb3JzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkVycm9yKGNhbGxiYWNrKXtcbiAgICByZXR1cm4gdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5lcnJvciwgcmVhc29uID0+IGNhbGxiYWNrKHJlYXNvbikpXG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBvbiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBTdWJzY3JpcHRpb24gcmV0dXJucyBhIHJlZiBjb3VudGVyLCB3aGljaCBjYW4gYmUgdXNlZCBsYXRlciB0b1xuICAgKiB1bnN1YnNjcmliZSB0aGUgZXhhY3QgZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY29uc3QgcmVmMiA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19vdGhlcl9zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKiAvLyBTaW5jZSB1bnN1YnNjcmlwdGlvbiwgZG9fc3R1ZmYgd29uJ3QgZmlyZSxcbiAgICogLy8gd2hpbGUgZG9fb3RoZXJfc3R1ZmYgd2lsbCBrZWVwIGZpcmluZyBvbiB0aGUgXCJldmVudFwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLmJpbmRpbmdSZWYrK1xuICAgIHRoaXMuYmluZGluZ3MucHVzaCh7ZXZlbnQsIHJlZiwgY2FsbGJhY2t9KVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZXMgb2ZmIG9mIGNoYW5uZWwgZXZlbnRzXG4gICAqXG4gICAqIFVzZSB0aGUgcmVmIHJldHVybmVkIGZyb20gYSBjaGFubmVsLm9uKCkgdG8gdW5zdWJzY3JpYmUgb25lXG4gICAqIGhhbmRsZXIsIG9yIHBhc3Mgbm90aGluZyBmb3IgdGhlIHJlZiB0byB1bnN1YnNjcmliZSBhbGxcbiAgICogaGFuZGxlcnMgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gVW5zdWJzY3JpYmUgdGhlIGRvX3N0dWZmIGhhbmRsZXJcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKlxuICAgKiAvLyBVbnN1YnNjcmliZSBhbGwgaGFuZGxlcnMgZnJvbSBldmVudFxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIpXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb2ZmKGV2ZW50LCByZWYpe1xuICAgIHRoaXMuYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcigoYmluZCkgPT4ge1xuICAgICAgcmV0dXJuICEoYmluZC5ldmVudCA9PT0gZXZlbnQgJiYgKHR5cGVvZiByZWYgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVmID09PSBiaW5kLnJlZikpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuUHVzaCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLmlzSm9pbmVkKCkgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgYGV2ZW50YCB0byBwaG9lbml4IHdpdGggdGhlIHBheWxvYWQgYHBheWxvYWRgLlxuICAgKiBQaG9lbml4IHJlY2VpdmVzIHRoaXMgaW4gdGhlIGBoYW5kbGVfaW4oZXZlbnQsIHBheWxvYWQsIHNvY2tldClgXG4gICAqIGZ1bmN0aW9uLiBpZiBwaG9lbml4IHJlcGxpZXMgb3IgaXQgdGltZXMgb3V0IChkZWZhdWx0IDEwMDAwbXMpLFxuICAgKiB0aGVuIG9wdGlvbmFsbHkgdGhlIHJlcGx5IGNhbiBiZSByZWNlaXZlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY2hhbm5lbC5wdXNoKFwiZXZlbnRcIilcbiAgICogICAucmVjZWl2ZShcIm9rXCIsIHBheWxvYWQgPT4gY29uc29sZS5sb2coXCJwaG9lbml4IHJlcGxpZWQ6XCIsIHBheWxvYWQpKVxuICAgKiAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgZXJyID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCBlcnJvcmVkXCIsIGVycikpXG4gICAqICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IGNvbnNvbGUubG9nKFwidGltZWQgb3V0IHB1c2hpbmdcIikpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVvdXRdXG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgcHVzaChldmVudCwgcGF5bG9hZCwgdGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgcGF5bG9hZCA9IHBheWxvYWQgfHwge31cbiAgICBpZighdGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdHJpZWQgdG8gcHVzaCAnJHtldmVudH0nIHRvICcke3RoaXMudG9waWN9JyBiZWZvcmUgam9pbmluZy4gVXNlIGNoYW5uZWwuam9pbigpIGJlZm9yZSBwdXNoaW5nIGV2ZW50c2ApXG4gICAgfVxuICAgIGxldCBwdXNoRXZlbnQgPSBuZXcgUHVzaCh0aGlzLCBldmVudCwgZnVuY3Rpb24gKCl7IHJldHVybiBwYXlsb2FkIH0sIHRpbWVvdXQpXG4gICAgaWYodGhpcy5jYW5QdXNoKCkpe1xuICAgICAgcHVzaEV2ZW50LnNlbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBwdXNoRXZlbnQuc3RhcnRUaW1lb3V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5wdXNoKHB1c2hFdmVudClcbiAgICB9XG5cbiAgICByZXR1cm4gcHVzaEV2ZW50XG4gIH1cblxuICAvKiogTGVhdmVzIHRoZSBjaGFubmVsXG4gICAqXG4gICAqIFVuc3Vic2NyaWJlcyBmcm9tIHNlcnZlciBldmVudHMsIGFuZFxuICAgKiBpbnN0cnVjdHMgY2hhbm5lbCB0byB0ZXJtaW5hdGUgb24gc2VydmVyXG4gICAqXG4gICAqIFRyaWdnZXJzIG9uQ2xvc2UoKSBob29rc1xuICAgKlxuICAgKiBUbyByZWNlaXZlIGxlYXZlIGFja25vd2xlZGdlbWVudHMsIHVzZSB0aGUgYHJlY2VpdmVgXG4gICAqIGhvb2sgdG8gYmluZCB0byB0aGUgc2VydmVyIGFjaywgaWU6XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwubGVhdmUoKS5yZWNlaXZlKFwib2tcIiwgKCkgPT4gYWxlcnQoXCJsZWZ0IVwiKSApXG4gICAqXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGxlYXZlKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgIHRoaXMuam9pblB1c2guY2FuY2VsVGltZW91dCgpXG5cbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMubGVhdmluZ1xuICAgIGxldCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGxlYXZlICR7dGhpcy50b3BpY31gKVxuICAgICAgdGhpcy50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBcImxlYXZlXCIpXG4gICAgfVxuICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRpbWVvdXQpXG4gICAgbGVhdmVQdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiBvbkNsb3NlKCkpXG4gICAgICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICBpZighdGhpcy5jYW5QdXNoKCkpeyBsZWF2ZVB1c2gudHJpZ2dlcihcIm9rXCIsIHt9KSB9XG5cbiAgICByZXR1cm4gbGVhdmVQdXNoXG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGFibGUgbWVzc2FnZSBob29rXG4gICAqXG4gICAqIFJlY2VpdmVzIGFsbCBldmVudHMgZm9yIHNwZWNpYWxpemVkIG1lc3NhZ2UgaGFuZGxpbmdcbiAgICogYmVmb3JlIGRpc3BhdGNoaW5nIHRvIHRoZSBjaGFubmVsIGNhbGxiYWNrcy5cbiAgICpcbiAgICogTXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gcmVmXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBvbk1lc3NhZ2UoX2V2ZW50LCBwYXlsb2FkLCBfcmVmKXsgcmV0dXJuIHBheWxvYWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmKXtcbiAgICBpZih0aGlzLnRvcGljICE9PSB0b3BpYyl7IHJldHVybiBmYWxzZSB9XG5cbiAgICBpZihqb2luUmVmICYmIGpvaW5SZWYgIT09IHRoaXMuam9pblJlZigpKXtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIFwiZHJvcHBpbmcgb3V0ZGF0ZWQgbWVzc2FnZVwiLCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgam9pblJlZigpeyByZXR1cm4gdGhpcy5qb2luUHVzaC5yZWYgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuaXNMZWF2aW5nKCkpeyByZXR1cm4gfVxuICAgIHRoaXMuc29ja2V0LmxlYXZlT3BlblRvcGljKHRoaXMudG9waWMpXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5pbmdcbiAgICB0aGlzLmpvaW5QdXNoLnJlc2VuZCh0aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpe1xuICAgIGxldCBoYW5kbGVkUGF5bG9hZCA9IHRoaXMub25NZXNzYWdlKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpXG4gICAgaWYocGF5bG9hZCAmJiAhaGFuZGxlZFBheWxvYWQpeyB0aHJvdyBuZXcgRXJyb3IoXCJjaGFubmVsIG9uTWVzc2FnZSBjYWxsYmFja3MgbXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcIikgfVxuXG4gICAgbGV0IGV2ZW50QmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcihiaW5kID0+IGJpbmQuZXZlbnQgPT09IGV2ZW50KVxuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGV2ZW50QmluZGluZ3MubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJpbmQgPSBldmVudEJpbmRpbmdzW2ldXG4gICAgICBiaW5kLmNhbGxiYWNrKGhhbmRsZWRQYXlsb2FkLCByZWYsIGpvaW5SZWYgfHwgdGhpcy5qb2luUmVmKCkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXBseUV2ZW50TmFtZShyZWYpeyByZXR1cm4gYGNoYW5fcmVwbHlfJHtyZWZ9YCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Nsb3NlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzRXJyb3JlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5lZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmVkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmluZygpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmluZyB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0xlYXZpbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmxlYXZpbmcgfVxufVxuIiwgImltcG9ydCB7XG4gIGdsb2JhbCxcbiAgWEhSX1NUQVRFU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBamF4IHtcblxuICBzdGF0aWMgcmVxdWVzdChtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIGlmKGdsb2JhbC5YRG9tYWluUmVxdWVzdCl7XG4gICAgICBsZXQgcmVxID0gbmV3IGdsb2JhbC5YRG9tYWluUmVxdWVzdCgpIC8vIElFOCwgSUU5XG4gICAgICByZXR1cm4gdGhpcy54ZG9tYWluUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCkgLy8gSUU3KywgRmlyZWZveCwgQ2hyb21lLCBPcGVyYSwgU2FmYXJpXG4gICAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB4ZG9tYWluUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIHJlcS50aW1lb3V0ID0gdGltZW91dFxuICAgIHJlcS5vcGVuKG1ldGhvZCwgZW5kUG9pbnQpXG4gICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGxldCByZXNwb25zZSA9IHRoaXMucGFyc2VKU09OKHJlcS5yZXNwb25zZVRleHQpXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwb25zZSlcbiAgICB9XG4gICAgaWYob250aW1lb3V0KXsgcmVxLm9udGltZW91dCA9IG9udGltZW91dCB9XG5cbiAgICAvLyBXb3JrIGFyb3VuZCBidWcgaW4gSUU5IHRoYXQgcmVxdWlyZXMgYW4gYXR0YWNoZWQgb25wcm9ncmVzcyBoYW5kbGVyXG4gICAgcmVxLm9ucHJvZ3Jlc3MgPSAoKSA9PiB7IH1cblxuICAgIHJlcS5zZW5kKGJvZHkpXG4gICAgcmV0dXJuIHJlcVxuICB9XG5cbiAgc3RhdGljIHhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIHJlcS5vcGVuKG1ldGhvZCwgZW5kUG9pbnQsIHRydWUpXG4gICAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgYWNjZXB0KVxuICAgIHJlcS5vbmVycm9yID0gKCkgPT4gY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbClcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYocmVxLnJlYWR5U3RhdGUgPT09IFhIUl9TVEFURVMuY29tcGxldGUgJiYgY2FsbGJhY2spe1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLnBhcnNlSlNPTihyZXEucmVzcG9uc2VUZXh0KVxuICAgICAgICBjYWxsYmFjayhyZXNwb25zZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYob250aW1lb3V0KXsgcmVxLm9udGltZW91dCA9IG9udGltZW91dCB9XG5cbiAgICByZXEuc2VuZChib2R5KVxuICAgIHJldHVybiByZXFcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZUpTT04ocmVzcCl7XG4gICAgaWYoIXJlc3AgfHwgcmVzcCA9PT0gXCJcIil7IHJldHVybiBudWxsIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXNwKVxuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcImZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlXCIsIHJlc3ApXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemUob2JqLCBwYXJlbnRLZXkpe1xuICAgIGxldCBxdWVyeVN0ciA9IFtdXG4gICAgZm9yKHZhciBrZXkgaW4gb2JqKXtcbiAgICAgIGlmKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKXsgY29udGludWUgfVxuICAgICAgbGV0IHBhcmFtS2V5ID0gcGFyZW50S2V5ID8gYCR7cGFyZW50S2V5fVske2tleX1dYCA6IGtleVxuICAgICAgbGV0IHBhcmFtVmFsID0gb2JqW2tleV1cbiAgICAgIGlmKHR5cGVvZiBwYXJhbVZhbCA9PT0gXCJvYmplY3RcIil7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2godGhpcy5zZXJpYWxpemUocGFyYW1WYWwsIHBhcmFtS2V5KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtVmFsKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5U3RyLmpvaW4oXCImXCIpXG4gIH1cblxuICBzdGF0aWMgYXBwZW5kUGFyYW1zKHVybCwgcGFyYW1zKXtcbiAgICBpZihPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMCl7IHJldHVybiB1cmwgfVxuXG4gICAgbGV0IHByZWZpeCA9IHVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiXG4gICAgcmV0dXJuIGAke3VybH0ke3ByZWZpeH0ke3RoaXMuc2VyaWFsaXplKHBhcmFtcyl9YFxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgU09DS0VUX1NUQVRFUyxcbiAgVFJBTlNQT1JUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgQWpheCBmcm9tIFwiLi9hamF4XCJcblxubGV0IGFycmF5QnVmZmVyVG9CYXNlNjQgPSAoYnVmZmVyKSA9PiB7XG4gIGxldCBiaW5hcnkgPSBcIlwiXG4gIGxldCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcilcbiAgbGV0IGxlbiA9IGJ5dGVzLmJ5dGVMZW5ndGhcbiAgZm9yKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKXsgYmluYXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pIH1cbiAgcmV0dXJuIGJ0b2EoYmluYXJ5KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb25nUG9sbCB7XG5cbiAgY29uc3RydWN0b3IoZW5kUG9pbnQpe1xuICAgIHRoaXMuZW5kUG9pbnQgPSBudWxsXG4gICAgdGhpcy50b2tlbiA9IG51bGxcbiAgICB0aGlzLnNraXBIZWFydGJlYXQgPSB0cnVlXG4gICAgdGhpcy5yZXFzID0gbmV3IFNldCgpXG4gICAgdGhpcy5hd2FpdGluZ0JhdGNoQWNrID0gZmFsc2VcbiAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnRCYXRjaFRpbWVyID0gbnVsbFxuICAgIHRoaXMuYmF0Y2hCdWZmZXIgPSBbXVxuICAgIHRoaXMub25vcGVuID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25lcnJvciA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9uY2xvc2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5wb2xsRW5kcG9pbnQgPSB0aGlzLm5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZ1xuICAgIC8vIHdlIG11c3Qgd2FpdCBmb3IgdGhlIGNhbGxlciB0byBmaW5pc2ggc2V0dGluZyB1cCBvdXIgY2FsbGJhY2tzIGFuZCB0aW1lb3V0IHByb3BlcnRpZXNcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucG9sbCgpLCAwKVxuICB9XG5cbiAgbm9ybWFsaXplRW5kcG9pbnQoZW5kUG9pbnQpe1xuICAgIHJldHVybiAoZW5kUG9pbnRcbiAgICAgIC5yZXBsYWNlKFwid3M6Ly9cIiwgXCJodHRwOi8vXCIpXG4gICAgICAucmVwbGFjZShcIndzczovL1wiLCBcImh0dHBzOi8vXCIpXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKFwiKC4qKVxcL1wiICsgVFJBTlNQT1JUUy53ZWJzb2NrZXQpLCBcIiQxL1wiICsgVFJBTlNQT1JUUy5sb25ncG9sbCkpXG4gIH1cblxuICBlbmRwb2ludFVSTCgpe1xuICAgIHJldHVybiBBamF4LmFwcGVuZFBhcmFtcyh0aGlzLnBvbGxFbmRwb2ludCwge3Rva2VuOiB0aGlzLnRva2VufSlcbiAgfVxuXG4gIGNsb3NlQW5kUmV0cnkoY29kZSwgcmVhc29uLCB3YXNDbGVhbil7XG4gICAgdGhpcy5jbG9zZShjb2RlLCByZWFzb24sIHdhc0NsZWFuKVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZ1xuICB9XG5cbiAgb250aW1lb3V0KCl7XG4gICAgdGhpcy5vbmVycm9yKFwidGltZW91dFwiKVxuICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgxMDA1LCBcInRpbWVvdXRcIiwgZmFsc2UpXG4gIH1cblxuICBpc0FjdGl2ZSgpeyByZXR1cm4gdGhpcy5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLm9wZW4gfHwgdGhpcy5yZWFkeVN0YXRlID09PSBTT0NLRVRfU1RBVEVTLmNvbm5lY3RpbmcgfVxuXG4gIHBvbGwoKXtcbiAgICB0aGlzLmFqYXgoXCJHRVRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIsIG51bGwsICgpID0+IHRoaXMub250aW1lb3V0KCksIHJlc3AgPT4ge1xuICAgICAgaWYocmVzcCl7XG4gICAgICAgIHZhciB7c3RhdHVzLCB0b2tlbiwgbWVzc2FnZXN9ID0gcmVzcFxuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1cyA9IDBcbiAgICAgIH1cblxuICAgICAgc3dpdGNoKHN0YXR1cyl7XG4gICAgICAgIGNhc2UgMjAwOlxuICAgICAgICAgIG1lc3NhZ2VzLmZvckVhY2gobXNnID0+IHtcbiAgICAgICAgICAgIC8vIFRhc2tzIGFyZSB3aGF0IHRoaW5ncyBsaWtlIGV2ZW50IGhhbmRsZXJzLCBzZXRUaW1lb3V0IGNhbGxiYWNrcyxcbiAgICAgICAgICAgIC8vIHByb21pc2UgcmVzb2x2ZXMgYW5kIG1vcmUgYXJlIHJ1biB3aXRoaW4uXG4gICAgICAgICAgICAvLyBJbiBtb2Rlcm4gYnJvd3NlcnMsIHRoZXJlIGFyZSB0d28gZGlmZmVyZW50IGtpbmRzIG9mIHRhc2tzLFxuICAgICAgICAgICAgLy8gbWljcm90YXNrcyBhbmQgbWFjcm90YXNrcy5cbiAgICAgICAgICAgIC8vIE1pY3JvdGFza3MgYXJlIG1haW5seSB1c2VkIGZvciBQcm9taXNlcywgd2hpbGUgbWFjcm90YXNrcyBhcmVcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIGV2ZXJ5dGhpbmcgZWxzZS5cbiAgICAgICAgICAgIC8vIE1pY3JvdGFza3MgYWx3YXlzIGhhdmUgcHJpb3JpdHkgb3ZlciBtYWNyb3Rhc2tzLiBJZiB0aGUgSlMgZW5naW5lXG4gICAgICAgICAgICAvLyBpcyBsb29raW5nIGZvciBhIHRhc2sgdG8gcnVuLCBpdCB3aWxsIGFsd2F5cyB0cnkgdG8gZW1wdHkgdGhlXG4gICAgICAgICAgICAvLyBtaWNyb3Rhc2sgcXVldWUgYmVmb3JlIGF0dGVtcHRpbmcgdG8gcnVuIGFueXRoaW5nIGZyb20gdGhlXG4gICAgICAgICAgICAvLyBtYWNyb3Rhc2sgcXVldWUuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gRm9yIHRoZSBXZWJTb2NrZXQgdHJhbnNwb3J0LCBtZXNzYWdlcyBhbHdheXMgYXJyaXZlIGluIHRoZWlyIG93blxuICAgICAgICAgICAgLy8gZXZlbnQuIFRoaXMgbWVhbnMgdGhhdCBpZiBhbnkgcHJvbWlzZXMgYXJlIHJlc29sdmVkIGZyb20gd2l0aGluLFxuICAgICAgICAgICAgLy8gdGhlaXIgY2FsbGJhY2tzIHdpbGwgYWx3YXlzIGZpbmlzaCBleGVjdXRpb24gYnkgdGhlIHRpbWUgdGhlXG4gICAgICAgICAgICAvLyBuZXh0IG1lc3NhZ2UgZXZlbnQgaGFuZGxlciBpcyBydW4uXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gSW4gb3JkZXIgdG8gZW11bGF0ZSB0aGlzIGJlaGF2aW91ciwgd2UgbmVlZCB0byBtYWtlIHN1cmUgZWFjaFxuICAgICAgICAgICAgLy8gb25tZXNzYWdlIGhhbmRsZXIgaXMgcnVuIHdpdGhpbiBpdHMgb3duIG1hY3JvdGFzay5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5vbm1lc3NhZ2Uoe2RhdGE6IG1zZ30pLCAwKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDIwNDpcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDEwOlxuICAgICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMub3BlblxuICAgICAgICAgIHRoaXMub25vcGVuKHt9KVxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0MDM6XG4gICAgICAgICAgdGhpcy5vbmVycm9yKDQwMylcbiAgICAgICAgICB0aGlzLmNsb3NlKDEwMDgsIFwiZm9yYmlkZGVuXCIsIGZhbHNlKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgY2FzZSA1MDA6XG4gICAgICAgICAgdGhpcy5vbmVycm9yKDUwMClcbiAgICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgNTAwKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgdW5oYW5kbGVkIHBvbGwgc3RhdHVzICR7c3RhdHVzfWApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIHdlIGNvbGxlY3QgYWxsIHB1c2hlcyB3aXRoaW4gdGhlIGN1cnJlbnQgZXZlbnQgbG9vcCBieVxuICAvLyBzZXRUaW1lb3V0IDAsIHdoaWNoIG9wdGltaXplcyBiYWNrLXRvLWJhY2sgcHJvY2VkdXJhbFxuICAvLyBwdXNoZXMgYWdhaW5zdCBhbiBlbXB0eSBidWZmZXJcblxuICBzZW5kKGJvZHkpe1xuICAgIGlmKHR5cGVvZihib2R5KSAhPT0gXCJzdHJpbmdcIil7IGJvZHkgPSBhcnJheUJ1ZmZlclRvQmFzZTY0KGJvZHkpIH1cbiAgICBpZih0aGlzLmN1cnJlbnRCYXRjaCl7XG4gICAgICB0aGlzLmN1cnJlbnRCYXRjaC5wdXNoKGJvZHkpXG4gICAgfSBlbHNlIGlmKHRoaXMuYXdhaXRpbmdCYXRjaEFjayl7XG4gICAgICB0aGlzLmJhdGNoQnVmZmVyLnB1c2goYm9keSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50QmF0Y2ggPSBbYm9keV1cbiAgICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5jdXJyZW50QmF0Y2gpXG4gICAgICAgIHRoaXMuY3VycmVudEJhdGNoID0gbnVsbFxuICAgICAgfSwgMClcbiAgICB9XG4gIH1cblxuICBiYXRjaFNlbmQobWVzc2FnZXMpe1xuICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IHRydWVcbiAgICB0aGlzLmFqYXgoXCJQT1NUXCIsIFwiYXBwbGljYXRpb24veC1uZGpzb25cIiwgbWVzc2FnZXMuam9pbihcIlxcblwiKSwgKCkgPT4gdGhpcy5vbmVycm9yKFwidGltZW91dFwiKSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSBmYWxzZVxuICAgICAgaWYoIXJlc3AgfHwgcmVzcC5zdGF0dXMgIT09IDIwMCl7XG4gICAgICAgIHRoaXMub25lcnJvcihyZXNwICYmIHJlc3Auc3RhdHVzKVxuICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgZmFsc2UpXG4gICAgICB9IGVsc2UgaWYodGhpcy5iYXRjaEJ1ZmZlci5sZW5ndGggPiAwKXtcbiAgICAgICAgdGhpcy5iYXRjaFNlbmQodGhpcy5iYXRjaEJ1ZmZlcilcbiAgICAgICAgdGhpcy5iYXRjaEJ1ZmZlciA9IFtdXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIGZvcihsZXQgcmVxIG9mIHRoaXMucmVxcyl7IHJlcS5hYm9ydCgpIH1cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNsb3NlZFxuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7Y29kZTogMTAwMCwgcmVhc29uOiB1bmRlZmluZWQsIHdhc0NsZWFuOiB0cnVlfSwge2NvZGUsIHJlYXNvbiwgd2FzQ2xlYW59KVxuICAgIHRoaXMuYmF0Y2hCdWZmZXIgPSBbXVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmN1cnJlbnRCYXRjaFRpbWVyKVxuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsXG4gICAgaWYodHlwZW9mKENsb3NlRXZlbnQpICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHRoaXMub25jbG9zZShuZXcgQ2xvc2VFdmVudChcImNsb3NlXCIsIG9wdHMpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uY2xvc2Uob3B0cylcbiAgICB9XG4gIH1cblxuICBhamF4KG1ldGhvZCwgY29udGVudFR5cGUsIGJvZHksIG9uQ2FsbGVyVGltZW91dCwgY2FsbGJhY2spe1xuICAgIGxldCByZXFcbiAgICBsZXQgb250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5yZXFzLmRlbGV0ZShyZXEpXG4gICAgICBvbkNhbGxlclRpbWVvdXQoKVxuICAgIH1cbiAgICByZXEgPSBBamF4LnJlcXVlc3QobWV0aG9kLCB0aGlzLmVuZHBvaW50VVJMKCksIGNvbnRlbnRUeXBlLCBib2R5LCB0aGlzLnRpbWVvdXQsIG9udGltZW91dCwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIGlmKHRoaXMuaXNBY3RpdmUoKSl7IGNhbGxiYWNrKHJlc3ApIH1cbiAgICB9KVxuICAgIHRoaXMucmVxcy5hZGQocmVxKVxuICB9XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHJlc2VuY2VcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIFRoZSBvcHRpb25zLFxuICogICAgICAgIGZvciBleGFtcGxlIGB7ZXZlbnRzOiB7c3RhdGU6IFwic3RhdGVcIiwgZGlmZjogXCJkaWZmXCJ9fWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VuY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV2ZW50cyA9IG9wdHMuZXZlbnRzIHx8IHtzdGF0ZTogXCJwcmVzZW5jZV9zdGF0ZVwiLCBkaWZmOiBcInByZXNlbmNlX2RpZmZcIn1cbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuam9pblJlZiA9IG51bGxcbiAgICB0aGlzLmNhbGxlciA9IHtcbiAgICAgIG9uSm9pbjogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoKXsgfSxcbiAgICAgIG9uU3luYzogZnVuY3Rpb24gKCl7IH1cbiAgICB9XG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLnN0YXRlLCBuZXdTdGF0ZSA9PiB7XG4gICAgICBsZXQge29uSm9pbiwgb25MZWF2ZSwgb25TeW5jfSA9IHRoaXMuY2FsbGVyXG5cbiAgICAgIHRoaXMuam9pblJlZiA9IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSlcblxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMuZm9yRWFjaChkaWZmID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgICBvblN5bmMoKVxuICAgIH0pXG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLmRpZmYsIGRpZmYgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICBpZih0aGlzLmluUGVuZGluZ1N5bmNTdGF0ZSgpKXtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGlmZnMucHVzaChkaWZmKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgICAgb25TeW5jKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25Kb2luKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25Kb2luID0gY2FsbGJhY2sgfVxuXG4gIG9uTGVhdmUoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vbkxlYXZlID0gY2FsbGJhY2sgfVxuXG4gIG9uU3luYyhjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uU3luYyA9IGNhbGxiYWNrIH1cblxuICBsaXN0KGJ5KXsgcmV0dXJuIFByZXNlbmNlLmxpc3QodGhpcy5zdGF0ZSwgYnkpIH1cblxuICBpblBlbmRpbmdTeW5jU3RhdGUoKXtcbiAgICByZXR1cm4gIXRoaXMuam9pblJlZiB8fCAodGhpcy5qb2luUmVmICE9PSB0aGlzLmNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLy8gbG93ZXItbGV2ZWwgcHVibGljIHN0YXRpYyBBUElcblxuICAvKipcbiAgICogVXNlZCB0byBzeW5jIHRoZSBsaXN0IG9mIHByZXNlbmNlcyBvbiB0aGUgc2VydmVyXG4gICAqIHdpdGggdGhlIGNsaWVudCdzIHN0YXRlLiBBbiBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrIGNhblxuICAgKiBiZSBwcm92aWRlZCB0byByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAqIGRpc2Nvbm5lY3RzIGFuZCByZWNvbm5lY3RzIHdpdGggdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuY2xvbmUoY3VycmVudFN0YXRlKVxuICAgIGxldCBqb2lucyA9IHt9XG4gICAgbGV0IGxlYXZlcyA9IHt9XG5cbiAgICB0aGlzLm1hcChzdGF0ZSwgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIGlmKCFuZXdTdGF0ZVtrZXldKXtcbiAgICAgICAgbGVhdmVzW2tleV0gPSBwcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5tYXAobmV3U3RhdGUsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlKXtcbiAgICAgICAgbGV0IG5ld1JlZnMgPSBuZXdQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJSZWZzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGpvaW5lZE1ldGFzID0gbmV3UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gY3VyUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBsZXQgbGVmdE1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IG5ld1JlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgaWYoam9pbmVkTWV0YXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICAgICAgam9pbnNba2V5XS5tZXRhcyA9IGpvaW5lZE1ldGFzXG4gICAgICAgIH1cbiAgICAgICAgaWYobGVmdE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGxlYXZlc1trZXldID0gdGhpcy5jbG9uZShjdXJyZW50UHJlc2VuY2UpXG4gICAgICAgICAgbGVhdmVzW2tleV0ubWV0YXMgPSBsZWZ0TWV0YXNcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5zeW5jRGlmZihzdGF0ZSwge2pvaW5zOiBqb2lucywgbGVhdmVzOiBsZWF2ZXN9LCBvbkpvaW4sIG9uTGVhdmUpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogVXNlZCB0byBzeW5jIGEgZGlmZiBvZiBwcmVzZW5jZSBqb2luIGFuZCBsZWF2ZVxuICAgKiBldmVudHMgZnJvbSB0aGUgc2VydmVyLCBhcyB0aGV5IGhhcHBlbi4gTGlrZSBgc3luY1N0YXRlYCwgYHN5bmNEaWZmYFxuICAgKiBhY2NlcHRzIG9wdGlvbmFsIGBvbkpvaW5gIGFuZCBgb25MZWF2ZWAgY2FsbGJhY2tzIHRvIHJlYWN0IHRvIGEgdXNlclxuICAgKiBqb2luaW5nIG9yIGxlYXZpbmcgZnJvbSBhIGRldmljZS5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNEaWZmKHN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCB7am9pbnMsIGxlYXZlc30gPSB0aGlzLmNsb25lKGRpZmYpXG4gICAgaWYoIW9uSm9pbil7IG9uSm9pbiA9IGZ1bmN0aW9uICgpeyB9IH1cbiAgICBpZighb25MZWF2ZSl7IG9uTGVhdmUgPSBmdW5jdGlvbiAoKXsgfSB9XG5cbiAgICB0aGlzLm1hcChqb2lucywgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBzdGF0ZVtrZXldID0gdGhpcy5jbG9uZShuZXdQcmVzZW5jZSlcbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBqb2luZWRSZWZzID0gc3RhdGVba2V5XS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBqb2luZWRSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIHN0YXRlW2tleV0ubWV0YXMudW5zaGlmdCguLi5jdXJNZXRhcylcbiAgICAgIH1cbiAgICAgIG9uSm9pbihrZXksIGN1cnJlbnRQcmVzZW5jZSwgbmV3UHJlc2VuY2UpXG4gICAgfSlcbiAgICB0aGlzLm1hcChsZWF2ZXMsIChrZXksIGxlZnRQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKCFjdXJyZW50UHJlc2VuY2UpeyByZXR1cm4gfVxuICAgICAgbGV0IHJlZnNUb1JlbW92ZSA9IGxlZnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICBjdXJyZW50UHJlc2VuY2UubWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKHAgPT4ge1xuICAgICAgICByZXR1cm4gcmVmc1RvUmVtb3ZlLmluZGV4T2YocC5waHhfcmVmKSA8IDBcbiAgICAgIH0pXG4gICAgICBvbkxlYXZlKGtleSwgY3VycmVudFByZXNlbmNlLCBsZWZ0UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2UubWV0YXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgZGVsZXRlIHN0YXRlW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHByZXNlbmNlcywgd2l0aCBzZWxlY3RlZCBtZXRhZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXNlbmNlc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaG9vc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBsaXN0KHByZXNlbmNlcywgY2hvb3Nlcil7XG4gICAgaWYoIWNob29zZXIpeyBjaG9vc2VyID0gZnVuY3Rpb24gKGtleSwgcHJlcyl7IHJldHVybiBwcmVzIH0gfVxuXG4gICAgcmV0dXJuIHRoaXMubWFwKHByZXNlbmNlcywgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIHJldHVybiBjaG9vc2VyKGtleSwgcHJlc2VuY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBzdGF0aWMgbWFwKG9iaiwgZnVuYyl7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikubWFwKGtleSA9PiBmdW5jKGtleSwgb2JqW2tleV0pKVxuICB9XG5cbiAgc3RhdGljIGNsb25lKG9iail7IHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpIH1cbn1cbiIsICIvKiBUaGUgZGVmYXVsdCBzZXJpYWxpemVyIGZvciBlbmNvZGluZyBhbmQgZGVjb2RpbmcgbWVzc2FnZXMgKi9cbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSEVBREVSX0xFTkdUSDogMSxcbiAgTUVUQV9MRU5HVEg6IDQsXG4gIEtJTkRTOiB7cHVzaDogMCwgcmVwbHk6IDEsIGJyb2FkY2FzdDogMn0sXG5cbiAgZW5jb2RlKG1zZywgY2FsbGJhY2spe1xuICAgIGlmKG1zZy5wYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlFbmNvZGUobXNnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHBheWxvYWQgPSBbbXNnLmpvaW5fcmVmLCBtc2cucmVmLCBtc2cudG9waWMsIG1zZy5ldmVudCwgbXNnLnBheWxvYWRdXG4gICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgfVxuICB9LFxuXG4gIGRlY29kZShyYXdQYXlsb2FkLCBjYWxsYmFjayl7XG4gICAgaWYocmF3UGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RGVjb2RlKHJhd1BheWxvYWQpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgW2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZF0gPSBKU09OLnBhcnNlKHJhd1BheWxvYWQpXG4gICAgICByZXR1cm4gY2FsbGJhY2soe2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZH0pXG4gICAgfVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICBiaW5hcnlFbmNvZGUobWVzc2FnZSl7XG4gICAgbGV0IHtqb2luX3JlZiwgcmVmLCBldmVudCwgdG9waWMsIHBheWxvYWR9ID0gbWVzc2FnZVxuICAgIGxldCBtZXRhTGVuZ3RoID0gdGhpcy5NRVRBX0xFTkdUSCArIGpvaW5fcmVmLmxlbmd0aCArIHJlZi5sZW5ndGggKyB0b3BpYy5sZW5ndGggKyBldmVudC5sZW5ndGhcbiAgICBsZXQgaGVhZGVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuSEVBREVSX0xFTkdUSCArIG1ldGFMZW5ndGgpXG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoaGVhZGVyKVxuICAgIGxldCBvZmZzZXQgPSAwXG5cbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0aGlzLktJTkRTLnB1c2gpIC8vIGtpbmRcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBqb2luX3JlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgcmVmLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0b3BpYy5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgZXZlbnQubGVuZ3RoKVxuICAgIEFycmF5LmZyb20oam9pbl9yZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHJlZiwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20odG9waWMsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKGV2ZW50LCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG5cbiAgICB2YXIgY29tYmluZWQgPSBuZXcgVWludDhBcnJheShoZWFkZXIuYnl0ZUxlbmd0aCArIHBheWxvYWQuYnl0ZUxlbmd0aClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkoaGVhZGVyKSwgMClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkocGF5bG9hZCksIGhlYWRlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIGNvbWJpbmVkLmJ1ZmZlclxuICB9LFxuXG4gIGJpbmFyeURlY29kZShidWZmZXIpe1xuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcilcbiAgICBsZXQga2luZCA9IHZpZXcuZ2V0VWludDgoMClcbiAgICBsZXQgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpXG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSB0aGlzLktJTkRTLnB1c2g6IHJldHVybiB0aGlzLmRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLnJlcGx5OiByZXR1cm4gdGhpcy5kZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgICBjYXNlIHRoaXMuS0lORFMuYnJvYWRjYXN0OiByZXR1cm4gdGhpcy5kZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMylcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSCAtIDEgLy8gcHVzaGVzIGhhdmUgbm8gcmVmXG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgam9pblJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9LFxuXG4gIGRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCByZWZTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoNClcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSFxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICBsZXQgcGF5bG9hZCA9IHtzdGF0dXM6IGV2ZW50LCByZXNwb25zZTogZGF0YX1cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IHJlZiwgdG9waWM6IHRvcGljLCBldmVudDogQ0hBTk5FTF9FVkVOVFMucmVwbHksIHBheWxvYWQ6IHBheWxvYWR9XG4gIH0sXG5cbiAgZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyAyXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBudWxsLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgZ2xvYmFsLFxuICBwaHhXaW5kb3csXG4gIENIQU5ORUxfRVZFTlRTLFxuICBERUZBVUxUX1RJTUVPVVQsXG4gIERFRkFVTFRfVlNOLFxuICBTT0NLRVRfU1RBVEVTLFxuICBUUkFOU1BPUlRTLFxuICBXU19DTE9TRV9OT1JNQUxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvc3VyZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vY2hhbm5lbFwiXG5pbXBvcnQgTG9uZ1BvbGwgZnJvbSBcIi4vbG9uZ3BvbGxcIlxuaW1wb3J0IFNlcmlhbGl6ZXIgZnJvbSBcIi4vc2VyaWFsaXplclwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKiogSW5pdGlhbGl6ZXMgdGhlIFNvY2tldCAqXG4gKlxuICogRm9yIElFOCBzdXBwb3J0IHVzZSBhbiBFUzUtc2hpbSAoaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRQb2ludCAtIFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgYFwid3M6Ly9leGFtcGxlLmNvbS9zb2NrZXRcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwid3NzOi8vZXhhbXBsZS5jb21cImBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCIvc29ja2V0XCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnRyYW5zcG9ydF0gLSBUaGUgV2Vic29ja2V0IFRyYW5zcG9ydCwgZm9yIGV4YW1wbGUgV2ViU29ja2V0IG9yIFBob2VuaXguTG9uZ1BvbGwuXG4gKlxuICogRGVmYXVsdHMgdG8gV2ViU29ja2V0IHdpdGggYXV0b21hdGljIExvbmdQb2xsIGZhbGxiYWNrIGlmIFdlYlNvY2tldCBpcyBub3QgZGVmaW5lZC5cbiAqIFRvIGZhbGxiYWNrIHRvIExvbmdQb2xsIHdoZW4gV2ViU29ja2V0IGF0dGVtcHRzIGZhaWwsIHVzZSBgbG9uZ1BvbGxGYWxsYmFja01zOiAyNTAwYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5sb25nUG9sbEZhbGxiYWNrTXNdIC0gVGhlIG1pbGxpc2Vjb25kIHRpbWUgdG8gYXR0ZW1wdCB0aGUgcHJpbWFyeSB0cmFuc3BvcnRcbiAqIGJlZm9yZSBmYWxsaW5nIGJhY2sgdG8gdGhlIExvbmdQb2xsIHRyYW5zcG9ydC4gRGlzYWJsZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5kZWJ1Z10gLSBXaGVuIHRydWUsIGVuYWJsZXMgZGVidWcgbG9nZ2luZy4gRGVmYXVsdCBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5lbmNvZGVdIC0gVGhlIGZ1bmN0aW9uIHRvIGVuY29kZSBvdXRnb2luZyBtZXNzYWdlcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBKU09OIGVuY29kZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMuZGVjb2RlXSAtIFRoZSBmdW5jdGlvbiB0byBkZWNvZGUgaW5jb21pbmcgbWVzc2FnZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gSlNPTjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAocGF5bG9hZCwgY2FsbGJhY2spID0+IGNhbGxiYWNrKEpTT04ucGFyc2UocGF5bG9hZCkpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZW91dF0gLSBUaGUgZGVmYXVsdCB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byB0cmlnZ2VyIHB1c2ggdGltZW91dHMuXG4gKlxuICogRGVmYXVsdHMgYERFRkFVTFRfVElNRU9VVGBcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zXSAtIFRoZSBtaWxsaXNlYyBpbnRlcnZhbCB0byBzZW5kIGEgaGVhcnRiZWF0IG1lc3NhZ2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5yZWNvbm5lY3RBZnRlck1zXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG1pbGxpc2VjXG4gKiBzb2NrZXQgcmVjb25uZWN0IGludGVydmFsLlxuICpcbiAqIERlZmF1bHRzIHRvIHN0ZXBwZWQgYmFja29mZiBvZjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnJlam9pbkFmdGVyTXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbWlsbGlzZWNcbiAqIHJlam9pbiBpbnRlcnZhbCBmb3IgaW5kaXZpZHVhbCBjaGFubmVscy5cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICogfVxuICogYGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmxvZ2dlcl0gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcsIGllOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKGtpbmQsIG1zZywgZGF0YSkge1xuICogICBjb25zb2xlLmxvZyhgJHtraW5kfTogJHttc2d9YCwgZGF0YSlcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5sb25ncG9sbGVyVGltZW91dF0gLSBUaGUgbWF4aW11bSB0aW1lb3V0IG9mIGEgbG9uZyBwb2xsIEFKQVggcmVxdWVzdC5cbiAqXG4gKiBEZWZhdWx0cyB0byAyMHMgKGRvdWJsZSB0aGUgc2VydmVyIGxvbmcgcG9sbCB0aW1lcikuXG4gKlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKX0gW29wdHMucGFyYW1zXSAtIFRoZSBvcHRpb25hbCBwYXJhbXMgdG8gcGFzcyB3aGVuIGNvbm5lY3RpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5hcnlUeXBlXSAtIFRoZSBiaW5hcnkgdHlwZSB0byB1c2UgZm9yIGJpbmFyeSBXZWJTb2NrZXQgZnJhbWVzLlxuICpcbiAqIERlZmF1bHRzIHRvIFwiYXJyYXlidWZmZXJcIlxuICpcbiAqIEBwYXJhbSB7dnNufSBbb3B0cy52c25dIC0gVGhlIHNlcmlhbGl6ZXIncyBwcm90b2NvbCB2ZXJzaW9uIHRvIHNlbmQgb24gY29ubmVjdC5cbiAqXG4gKiBEZWZhdWx0cyB0byBERUZBVUxUX1ZTTi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuc2Vzc2lvblN0b3JhZ2VdIC0gQW4gb3B0aW9uYWwgU3RvcmFnZSBjb21wYXRpYmxlIG9iamVjdFxuICogUGhvZW5peCB1c2VzIHNlc3Npb25TdG9yYWdlIGZvciBsb25ncG9sbCBmYWxsYmFjayBoaXN0b3J5LiBPdmVycmlkaW5nIHRoZSBzdG9yZSBpc1xuICogdXNlZnVsIHdoZW4gUGhvZW5peCB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiBGb3IgZXhhbXBsZSwgVGhpcyBjb3VsZFxuICogaGFwcGVuIGlmIGEgc2l0ZSBsb2FkcyBhIGNyb3NzLWRvbWFpbiBjaGFubmVsIGluIGFuIGlmcmFtZS4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB8fCBudWxsIH1cbiAqICAgICAgIHJlbW92ZUl0ZW0oa2V5TmFtZSkgeyBkZWxldGUgdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHNldEl0ZW0oa2V5TmFtZSwga2V5VmFsdWUpIHsgdGhpcy5zdG9yYWdlW2tleU5hbWVdID0ga2V5VmFsdWUgfVxuICogICAgIH1cbiAqXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0IHtcbiAgY29uc3RydWN0b3IoZW5kUG9pbnQsIG9wdHMgPSB7fSl7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcyA9IHtvcGVuOiBbXSwgY2xvc2U6IFtdLCBlcnJvcjogW10sIG1lc3NhZ2U6IFtdfVxuICAgIHRoaXMuY2hhbm5lbHMgPSBbXVxuICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5yZWYgPSAwXG4gICAgdGhpcy50aW1lb3V0ID0gb3B0cy50aW1lb3V0IHx8IERFRkFVTFRfVElNRU9VVFxuICAgIHRoaXMudHJhbnNwb3J0ID0gb3B0cy50cmFuc3BvcnQgfHwgZ2xvYmFsLldlYlNvY2tldCB8fCBMb25nUG9sbFxuICAgIHRoaXMucHJpbWFyeVBhc3NlZEhlYWx0aENoZWNrID0gZmFsc2VcbiAgICB0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcyA9IG9wdHMubG9uZ1BvbGxGYWxsYmFja01zXG4gICAgdGhpcy5mYWxsYmFja1RpbWVyID0gbnVsbFxuICAgIHRoaXMuc2Vzc2lvblN0b3JlID0gb3B0cy5zZXNzaW9uU3RvcmFnZSB8fCAoZ2xvYmFsICYmIGdsb2JhbC5zZXNzaW9uU3RvcmFnZSlcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMgPSAwXG4gICAgdGhpcy5kZWZhdWx0RW5jb2RlciA9IFNlcmlhbGl6ZXIuZW5jb2RlLmJpbmQoU2VyaWFsaXplcilcbiAgICB0aGlzLmRlZmF1bHREZWNvZGVyID0gU2VyaWFsaXplci5kZWNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5iaW5hcnlUeXBlID0gb3B0cy5iaW5hcnlUeXBlIHx8IFwiYXJyYXlidWZmZXJcIlxuICAgIHRoaXMuY29ubmVjdENsb2NrID0gMVxuICAgIGlmKHRoaXMudHJhbnNwb3J0ICE9PSBMb25nUG9sbCl7XG4gICAgICB0aGlzLmVuY29kZSA9IG9wdHMuZW5jb2RlIHx8IHRoaXMuZGVmYXVsdEVuY29kZXJcbiAgICAgIHRoaXMuZGVjb2RlID0gb3B0cy5kZWNvZGUgfHwgdGhpcy5kZWZhdWx0RGVjb2RlclxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuY29kZSA9IHRoaXMuZGVmYXVsdEVuY29kZXJcbiAgICAgIHRoaXMuZGVjb2RlID0gdGhpcy5kZWZhdWx0RGVjb2RlclxuICAgIH1cbiAgICBsZXQgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGxcbiAgICBpZihwaHhXaW5kb3cgJiYgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIpe1xuICAgICAgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCBfZSA9PiB7XG4gICAgICAgIGlmKHRoaXMuY29ubil7XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICAgICAgICBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gdGhpcy5jb25uZWN0Q2xvY2tcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgX2UgPT4ge1xuICAgICAgICBpZihhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID09PSB0aGlzLmNvbm5lY3RDbG9jayl7XG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGxcbiAgICAgICAgICB0aGlzLmNvbm5lY3QoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMgPSBvcHRzLmhlYXJ0YmVhdEludGVydmFsTXMgfHwgMzAwMDBcbiAgICB0aGlzLnJlam9pbkFmdGVyTXMgPSAodHJpZXMpID0+IHtcbiAgICAgIGlmKG9wdHMucmVqb2luQWZ0ZXJNcyl7XG4gICAgICAgIHJldHVybiBvcHRzLnJlam9pbkFmdGVyTXModHJpZXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gWzEwMDAsIDIwMDAsIDUwMDBdW3RyaWVzIC0gMV0gfHwgMTAwMDBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZWNvbm5lY3RBZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlY29ubmVjdEFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWNvbm5lY3RBZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMCwgNTAsIDEwMCwgMTUwLCAyMDAsIDI1MCwgNTAwLCAxMDAwLCAyMDAwXVt0cmllcyAtIDFdIHx8IDUwMDBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRzLmxvZ2dlciB8fCBudWxsXG4gICAgaWYoIXRoaXMubG9nZ2VyICYmIG9wdHMuZGVidWcpe1xuICAgICAgdGhpcy5sb2dnZXIgPSAoa2luZCwgbXNnLCBkYXRhKSA9PiB7IGNvbnNvbGUubG9nKGAke2tpbmR9OiAke21zZ31gLCBkYXRhKSB9XG4gICAgfVxuICAgIHRoaXMubG9uZ3BvbGxlclRpbWVvdXQgPSBvcHRzLmxvbmdwb2xsZXJUaW1lb3V0IHx8IDIwMDAwXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KVxuICAgIHRoaXMuZW5kUG9pbnQgPSBgJHtlbmRQb2ludH0vJHtUUkFOU1BPUlRTLndlYnNvY2tldH1gXG4gICAgdGhpcy52c24gPSBvcHRzLnZzbiB8fCBERUZBVUxUX1ZTTlxuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dFRpbWVyID0gbnVsbFxuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBudWxsXG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgIHRoaXMucmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLmNvbm5lY3QoKSlcbiAgICB9LCB0aGlzLnJlY29ubmVjdEFmdGVyTXMpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgTG9uZ1BvbGwgdHJhbnNwb3J0IHJlZmVyZW5jZVxuICAgKi9cbiAgZ2V0TG9uZ1BvbGxUcmFuc3BvcnQoKXsgcmV0dXJuIExvbmdQb2xsIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgYW5kIHJlcGxhY2VzIHRoZSBhY3RpdmUgdHJhbnNwb3J0XG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5ld1RyYW5zcG9ydCAtIFRoZSBuZXcgdHJhbnNwb3J0IGNsYXNzIHRvIGluc3RhbnRpYXRlXG4gICAqXG4gICAqL1xuICByZXBsYWNlVHJhbnNwb3J0KG5ld1RyYW5zcG9ydCl7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srK1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IHRydWVcbiAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIGlmKHRoaXMuY29ubil7XG4gICAgICB0aGlzLmNvbm4uY2xvc2UoKVxuICAgICAgdGhpcy5jb25uID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLnRyYW5zcG9ydCA9IG5ld1RyYW5zcG9ydFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNvY2tldCBwcm90b2NvbFxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgcHJvdG9jb2woKXsgcmV0dXJuIGxvY2F0aW9uLnByb3RvY29sLm1hdGNoKC9eaHR0cHMvKSA/IFwid3NzXCIgOiBcIndzXCIgfVxuXG4gIC8qKlxuICAgKiBUaGUgZnVsbHkgcXVhbGlmaWVkIHNvY2tldCB1cmxcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGVuZFBvaW50VVJMKCl7XG4gICAgbGV0IHVyaSA9IEFqYXguYXBwZW5kUGFyYW1zKFxuICAgICAgQWpheC5hcHBlbmRQYXJhbXModGhpcy5lbmRQb2ludCwgdGhpcy5wYXJhbXMoKSksIHt2c246IHRoaXMudnNufSlcbiAgICBpZih1cmkuY2hhckF0KDApICE9PSBcIi9cIil7IHJldHVybiB1cmkgfVxuICAgIGlmKHVyaS5jaGFyQXQoMSkgPT09IFwiL1wiKXsgcmV0dXJuIGAke3RoaXMucHJvdG9jb2woKX06JHt1cml9YCB9XG5cbiAgICByZXR1cm4gYCR7dGhpcy5wcm90b2NvbCgpfTovLyR7bG9jYXRpb24uaG9zdH0ke3VyaX1gXG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgdGhlIHNvY2tldFxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Nsb3NlRXZlbnQjU3RhdHVzX2NvZGVzIGZvciB2YWxpZCBzdGF0dXMgY29kZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgd2hpY2ggaXMgY2FsbGVkIGFmdGVyIHNvY2tldCBpcyBkaXNjb25uZWN0ZWQuXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gY29kZSAtIEEgc3RhdHVzIGNvZGUgZm9yIGRpc2Nvbm5lY3Rpb24gKE9wdGlvbmFsKS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlYXNvbiAtIEEgdGV4dHVhbCBkZXNjcmlwdGlvbiBvZiB0aGUgcmVhc29uIHRvIGRpc2Nvbm5lY3QuIChPcHRpb25hbClcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2FsbGJhY2ssIGNvZGUsIHJlYXNvbil7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srK1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IHRydWVcbiAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMudGVhcmRvd24oY2FsbGJhY2ssIGNvZGUsIHJlYXNvbilcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtcyB0byBzZW5kIHdoZW4gY29ubmVjdGluZywgZm9yIGV4YW1wbGUgYHt1c2VyX2lkOiB1c2VyVG9rZW59YFxuICAgKlxuICAgKiBQYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQ7IHBhc3MgdGhlbSBpbiB0aGUgU29ja2V0IGNvbnN0cnVjdG9yIGluc3RlYWQ6XG4gICAqIGBuZXcgU29ja2V0KFwiL3NvY2tldFwiLCB7cGFyYW1zOiB7dXNlcl9pZDogdXNlclRva2VufX0pYC5cbiAgICovXG4gIGNvbm5lY3QocGFyYW1zKXtcbiAgICBpZihwYXJhbXMpe1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcInBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCBwYXNzIDpwYXJhbXMgdG8gdGhlIFNvY2tldCBjb25zdHJ1Y3RvclwiKVxuICAgICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcylcbiAgICB9XG4gICAgaWYodGhpcy5jb25uKXsgcmV0dXJuIH1cbiAgICBpZih0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcyAmJiB0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5jb25uZWN0V2l0aEZhbGxiYWNrKExvbmdQb2xsLCB0aGlzLmxvbmdQb2xsRmFsbGJhY2tNcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmFuc3BvcnRDb25uZWN0KClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ncyB0aGUgbWVzc2FnZS4gT3ZlcnJpZGUgYHRoaXMubG9nZ2VyYCBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZy4gbm9vcHMgYnkgZGVmYXVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2luZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBsb2coa2luZCwgbXNnLCBkYXRhKXsgdGhpcy5sb2dnZXIgJiYgdGhpcy5sb2dnZXIoa2luZCwgbXNnLCBkYXRhKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIGxvZ2dlciBoYXMgYmVlbiBzZXQgb24gdGhpcyBzb2NrZXQuXG4gICAqL1xuICBoYXNMb2dnZXIoKXsgcmV0dXJuIHRoaXMubG9nZ2VyICE9PSBudWxsIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBvcGVuIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25PcGVuKGZ1bmN0aW9uKCl7IGNvbnNvbGUuaW5mbyhcInRoZSBzb2NrZXQgd2FzIG9wZW5lZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25PcGVuKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4ucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gY2xvc2UgZXZlbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkNsb3NlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGVycm9yIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25FcnJvcihmdW5jdGlvbihlcnJvcil7IGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gbWVzc2FnZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uTWVzc2FnZShjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBQaW5ncyB0aGUgc2VydmVyIGFuZCBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBSVFQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGluZyB3YXMgcHVzaGVkIG9yIGZhbHNlIGlmIHVuYWJsZSB0byBiZSBwdXNoZWQuXG4gICAqL1xuICBwaW5nKGNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogcmVmfSlcbiAgICBsZXQgb25Nc2dSZWYgPSB0aGlzLm9uTWVzc2FnZShtc2cgPT4ge1xuICAgICAgaWYobXNnLnJlZiA9PT0gcmVmKXtcbiAgICAgICAgdGhpcy5vZmYoW29uTXNnUmVmXSlcbiAgICAgICAgY2FsbGJhY2soRGF0ZS5ub3coKSAtIHN0YXJ0VGltZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgdHJhbnNwb3J0Q29ubmVjdCgpe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIHRoaXMuY29ubiA9IG5ldyB0aGlzLnRyYW5zcG9ydCh0aGlzLmVuZFBvaW50VVJMKCkpXG4gICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSB0aGlzLmJpbmFyeVR5cGVcbiAgICB0aGlzLmNvbm4udGltZW91dCA9IHRoaXMubG9uZ3BvbGxlclRpbWVvdXRcbiAgICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5vbkNvbm5PcGVuKClcbiAgICB0aGlzLmNvbm4ub25lcnJvciA9IGVycm9yID0+IHRoaXMub25Db25uRXJyb3IoZXJyb3IpXG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHRoaXMub25Db25uTWVzc2FnZShldmVudClcbiAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGV2ZW50ID0+IHRoaXMub25Db25uQ2xvc2UoZXZlbnQpXG4gIH1cblxuICBnZXRTZXNzaW9uKGtleSl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yZSAmJiB0aGlzLnNlc3Npb25TdG9yZS5nZXRJdGVtKGtleSkgfVxuXG4gIHN0b3JlU2Vzc2lvbihrZXksIHZhbCl7IHRoaXMuc2Vzc2lvblN0b3JlICYmIHRoaXMuc2Vzc2lvblN0b3JlLnNldEl0ZW0oa2V5LCB2YWwpIH1cblxuICBjb25uZWN0V2l0aEZhbGxiYWNrKGZhbGxiYWNrVHJhbnNwb3J0LCBmYWxsYmFja1RocmVzaG9sZCA9IDI1MDApe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgbGV0IGVzdGFibGlzaGVkID0gZmFsc2VcbiAgICBsZXQgcHJpbWFyeVRyYW5zcG9ydCA9IHRydWVcbiAgICBsZXQgb3BlblJlZiwgZXJyb3JSZWZcbiAgICBsZXQgZmFsbGJhY2sgPSAocmVhc29uKSA9PiB7XG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZmFsbGluZyBiYWNrIHRvICR7ZmFsbGJhY2tUcmFuc3BvcnQubmFtZX0uLi5gLCByZWFzb24pXG4gICAgICB0aGlzLm9mZihbb3BlblJlZiwgZXJyb3JSZWZdKVxuICAgICAgcHJpbWFyeVRyYW5zcG9ydCA9IGZhbHNlXG4gICAgICB0aGlzLnJlcGxhY2VUcmFuc3BvcnQoZmFsbGJhY2tUcmFuc3BvcnQpXG4gICAgICB0aGlzLnRyYW5zcG9ydENvbm5lY3QoKVxuICAgIH1cbiAgICBpZih0aGlzLmdldFNlc3Npb24oYHBoeDpmYWxsYmFjazoke2ZhbGxiYWNrVHJhbnNwb3J0Lm5hbWV9YCkpeyByZXR1cm4gZmFsbGJhY2soXCJtZW1vcml6ZWRcIikgfVxuXG4gICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG5cbiAgICBlcnJvclJlZiA9IHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJlcnJvclwiLCByZWFzb24pXG4gICAgICBpZihwcmltYXJ5VHJhbnNwb3J0ICYmICFlc3RhYmxpc2hlZCl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgICAgIGZhbGxiYWNrKHJlYXNvbilcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMub25PcGVuKCgpID0+IHtcbiAgICAgIGVzdGFibGlzaGVkID0gdHJ1ZVxuICAgICAgaWYoIXByaW1hcnlUcmFuc3BvcnQpe1xuICAgICAgICAvLyBvbmx5IG1lbW9yaXplIExQIGlmIHdlIG5ldmVyIGNvbm5lY3RlZCB0byBwcmltYXJ5XG4gICAgICAgIGlmKCF0aGlzLnByaW1hcnlQYXNzZWRIZWFsdGhDaGVjayl7IHRoaXMuc3RvcmVTZXNzaW9uKGBwaHg6ZmFsbGJhY2s6JHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfWAsIFwidHJ1ZVwiKSB9XG4gICAgICAgIHJldHVybiB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgZXN0YWJsaXNoZWQgJHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfSBmYWxsYmFja2ApXG4gICAgICB9XG4gICAgICAvLyBpZiB3ZSd2ZSBlc3RhYmxpc2hlZCBwcmltYXJ5LCBnaXZlIHRoZSBmYWxsYmFjayBhIG5ldyBwZXJpb2QgdG8gYXR0ZW1wdCBwaW5nXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgdGhpcy5mYWxsYmFja1RpbWVyID0gc2V0VGltZW91dChmYWxsYmFjaywgZmFsbGJhY2tUaHJlc2hvbGQpXG4gICAgICB0aGlzLnBpbmcocnR0ID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJjb25uZWN0ZWQgdG8gcHJpbWFyeSBhZnRlclwiLCBydHQpXG4gICAgICAgIHRoaXMucHJpbWFyeVBhc3NlZEhlYWx0aENoZWNrID0gdHJ1ZVxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVyKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMudHJhbnNwb3J0Q29ubmVjdCgpXG4gIH1cblxuICBjbGVhckhlYXJ0YmVhdHMoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpXG4gIH1cblxuICBvbkNvbm5PcGVuKCl7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYCR7dGhpcy50cmFuc3BvcnQubmFtZX0gY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMrK1xuICAgIHRoaXMuZmx1c2hTZW5kQnVmZmVyKClcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAgICB0aGlzLnJlc2V0SGVhcnRiZWF0KClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4uZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjaygpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIGhlYXJ0YmVhdFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYpe1xuICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSl7IHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiaGVhcnRiZWF0IHRpbWVvdXQuIEF0dGVtcHRpbmcgdG8gcmUtZXN0YWJsaXNoIGNvbm5lY3Rpb25cIikgfVxuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgICB0aGlzLnRlYXJkb3duKCgpID0+IHRoaXMucmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCksIFdTX0NMT1NFX05PUk1BTCwgXCJoZWFydGJlYXQgdGltZW91dFwiKVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0SGVhcnRiZWF0KCl7XG4gICAgaWYodGhpcy5jb25uICYmIHRoaXMuY29ubi5za2lwSGVhcnRiZWF0KXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VuZEhlYXJ0YmVhdCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gIH1cblxuICB0ZWFyZG93bihjYWxsYmFjaywgY29kZSwgcmVhc29uKXtcbiAgICBpZighdGhpcy5jb25uKXtcbiAgICAgIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgdGhpcy53YWl0Rm9yQnVmZmVyRG9uZSgoKSA9PiB7XG4gICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICBpZihjb2RlKXsgdGhpcy5jb25uLmNsb3NlKGNvZGUsIHJlYXNvbiB8fCBcIlwiKSB9IGVsc2UgeyB0aGlzLmNvbm4uY2xvc2UoKSB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZCgoKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuY29ubil7XG4gICAgICAgICAgdGhpcy5jb25uLm9ub3BlbiA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4ub25lcnJvciA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4ub25tZXNzYWdlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubi5vbmNsb3NlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubiA9IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHdhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyA9IDEpe1xuICAgIGlmKHRyaWVzID09PSA1IHx8ICF0aGlzLmNvbm4gfHwgIXRoaXMuY29ubi5idWZmZXJlZEFtb3VudCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzICsgMSlcbiAgICB9LCAxNTAgKiB0cmllcylcbiAgfVxuXG4gIHdhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzID0gMSl7XG4gICAgaWYodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCB0aGlzLmNvbm4ucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5jbG9zZWQpe1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzICsgMSlcbiAgICB9LCAxNTAgKiB0cmllcylcbiAgfVxuXG4gIG9uQ29ubkNsb3NlKGV2ZW50KXtcbiAgICBsZXQgY2xvc2VDb2RlID0gZXZlbnQgJiYgZXZlbnQuY29kZVxuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiY2xvc2VcIiwgZXZlbnQpXG4gICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpXG4gICAgaWYoIXRoaXMuY2xvc2VXYXNDbGVhbiAmJiBjbG9zZUNvZGUgIT09IDEwMDApe1xuICAgICAgdGhpcy5yZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKVxuICAgIH1cbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soZXZlbnQpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvbkNvbm5FcnJvcihlcnJvcil7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgZXJyb3IpXG4gICAgbGV0IHRyYW5zcG9ydEJlZm9yZSA9IHRoaXMudHJhbnNwb3J0XG4gICAgbGV0IGVzdGFibGlzaGVkQmVmb3JlID0gdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCB0cmFuc3BvcnRCZWZvcmUsIGVzdGFibGlzaGVkQmVmb3JlKVxuICAgIH0pXG4gICAgaWYodHJhbnNwb3J0QmVmb3JlID09PSB0aGlzLnRyYW5zcG9ydCB8fCBlc3RhYmxpc2hlZEJlZm9yZSA+IDApe1xuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXJDaGFuRXJyb3IoKXtcbiAgICB0aGlzLmNoYW5uZWxzLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBpZighKGNoYW5uZWwuaXNFcnJvcmVkKCkgfHwgY2hhbm5lbC5pc0xlYXZpbmcoKSB8fCBjaGFubmVsLmlzQ2xvc2VkKCkpKXtcbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGNvbm5lY3Rpb25TdGF0ZSgpe1xuICAgIHN3aXRjaCh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnJlYWR5U3RhdGUpe1xuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc6IHJldHVybiBcImNvbm5lY3RpbmdcIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLm9wZW46IHJldHVybiBcIm9wZW5cIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNsb3Npbmc6IHJldHVybiBcImNsb3NpbmdcIlxuICAgICAgZGVmYXVsdDogcmV0dXJuIFwiY2xvc2VkXCJcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jb25uZWN0aW9uU3RhdGUoKSA9PT0gXCJvcGVuXCIgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0NoYW5uZWx9XG4gICAqL1xuICByZW1vdmUoY2hhbm5lbCl7XG4gICAgdGhpcy5vZmYoY2hhbm5lbC5zdGF0ZUNoYW5nZVJlZnMpXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMuZmlsdGVyKGMgPT4gYyAhPT0gY2hhbm5lbClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGBvbk9wZW5gLCBgb25DbG9zZWAsIGBvbkVycm9yLGAgYW5kIGBvbk1lc3NhZ2VgIHJlZ2lzdHJhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7cmVmc30gLSBsaXN0IG9mIHJlZnMgcmV0dXJuZWQgYnkgY2FsbHMgdG9cbiAgICogICAgICAgICAgICAgICAgIGBvbk9wZW5gLCBgb25DbG9zZWAsIGBvbkVycm9yLGAgYW5kIGBvbk1lc3NhZ2VgXG4gICAqL1xuICBvZmYocmVmcyl7XG4gICAgZm9yKGxldCBrZXkgaW4gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcyl7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzW2tleV0gPSB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzW2tleV0uZmlsdGVyKChbcmVmXSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVmcy5pbmRleE9mKHJlZikgPT09IC0xXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZXMgYSBuZXcgY2hhbm5lbCBmb3IgdGhlIGdpdmVuIHRvcGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICAgKiBAcGFyYW0ge09iamVjdH0gY2hhblBhcmFtcyAtIFBhcmFtZXRlcnMgZm9yIHRoZSBjaGFubmVsXG4gICAqIEByZXR1cm5zIHtDaGFubmVsfVxuICAgKi9cbiAgY2hhbm5lbCh0b3BpYywgY2hhblBhcmFtcyA9IHt9KXtcbiAgICBsZXQgY2hhbiA9IG5ldyBDaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zLCB0aGlzKVxuICAgIHRoaXMuY2hhbm5lbHMucHVzaChjaGFuKVxuICAgIHJldHVybiBjaGFuXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIHB1c2goZGF0YSl7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSl7XG4gICAgICBsZXQge3RvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZn0gPSBkYXRhXG4gICAgICB0aGlzLmxvZyhcInB1c2hcIiwgYCR7dG9waWN9ICR7ZXZlbnR9ICgke2pvaW5fcmVmfSwgJHtyZWZ9KWAsIHBheWxvYWQpXG4gICAgfVxuXG4gICAgaWYodGhpcy5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgIHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIucHVzaCgoKSA9PiB0aGlzLmVuY29kZShkYXRhLCByZXN1bHQgPT4gdGhpcy5jb25uLnNlbmQocmVzdWx0KSkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbmV4dCBtZXNzYWdlIHJlZiwgYWNjb3VudGluZyBmb3Igb3ZlcmZsb3dzXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBtYWtlUmVmKCl7XG4gICAgbGV0IG5ld1JlZiA9IHRoaXMucmVmICsgMVxuICAgIGlmKG5ld1JlZiA9PT0gdGhpcy5yZWYpeyB0aGlzLnJlZiA9IDAgfSBlbHNlIHsgdGhpcy5yZWYgPSBuZXdSZWYgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVmLnRvU3RyaW5nKClcbiAgfVxuXG4gIHNlbmRIZWFydGJlYXQoKXtcbiAgICBpZih0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgJiYgIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnB1c2goe3RvcGljOiBcInBob2VuaXhcIiwgZXZlbnQ6IFwiaGVhcnRiZWF0XCIsIHBheWxvYWQ6IHt9LCByZWY6IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZn0pXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaGVhcnRiZWF0VGltZW91dCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gIH1cblxuICBmbHVzaFNlbmRCdWZmZXIoKXtcbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5zZW5kQnVmZmVyLmxlbmd0aCA+IDApe1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soKSlcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgfVxuICB9XG5cbiAgb25Db25uTWVzc2FnZShyYXdNZXNzYWdlKXtcbiAgICB0aGlzLmRlY29kZShyYXdNZXNzYWdlLmRhdGEsIG1zZyA9PiB7XG4gICAgICBsZXQge3RvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZn0gPSBtc2dcbiAgICAgIGlmKHJlZiAmJiByZWYgPT09IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICAgIHRoaXMuY2xlYXJIZWFydGJlYXRzKClcbiAgICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgICAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInJlY2VpdmVcIiwgYCR7cGF5bG9hZC5zdGF0dXMgfHwgXCJcIn0gJHt0b3BpY30gJHtldmVudH0gJHtyZWYgJiYgXCIoXCIgKyByZWYgKyBcIilcIiB8fCBcIlwifWAsIHBheWxvYWQpXG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoYW5uZWxzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbaV1cbiAgICAgICAgaWYoIWNoYW5uZWwuaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luX3JlZikpeyBjb250aW51ZSB9XG4gICAgICAgIGNoYW5uZWwudHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZilcbiAgICAgIH1cblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGxldCBbLCBjYWxsYmFja10gPSB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2VbaV1cbiAgICAgICAgY2FsbGJhY2sobXNnKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBsZWF2ZU9wZW5Ub3BpYyh0b3BpYyl7XG4gICAgbGV0IGR1cENoYW5uZWwgPSB0aGlzLmNoYW5uZWxzLmZpbmQoYyA9PiBjLnRvcGljID09PSB0b3BpYyAmJiAoYy5pc0pvaW5lZCgpIHx8IGMuaXNKb2luaW5nKCkpKVxuICAgIGlmKGR1cENoYW5uZWwpe1xuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYGxlYXZpbmcgZHVwbGljYXRlIHRvcGljIFwiJHt0b3BpY31cImApXG4gICAgICBkdXBDaGFubmVsLmxlYXZlKClcbiAgICB9XG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgQ09OU0VDVVRJVkVfUkVMT0FEUyA9IFwiY29uc2VjdXRpdmUtcmVsb2Fkc1wiXG5leHBvcnQgY29uc3QgTUFYX1JFTE9BRFMgPSAxMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUlOID0gNTAwMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUFYID0gMTAwMDBcbmV4cG9ydCBjb25zdCBGQUlMU0FGRV9KSVRURVIgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IFBIWF9FVkVOVF9DTEFTU0VTID0gW1xuICBcInBoeC1jbGljay1sb2FkaW5nXCIsIFwicGh4LWNoYW5nZS1sb2FkaW5nXCIsIFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIsXG4gIFwicGh4LWtleWRvd24tbG9hZGluZ1wiLCBcInBoeC1rZXl1cC1sb2FkaW5nXCIsIFwicGh4LWJsdXItbG9hZGluZ1wiLCBcInBoeC1mb2N1cy1sb2FkaW5nXCIsXG4gIFwicGh4LWhvb2stbG9hZGluZ1wiXG5dXG5leHBvcnQgY29uc3QgUEhYX0NPTVBPTkVOVCA9IFwiZGF0YS1waHgtY29tcG9uZW50XCJcbmV4cG9ydCBjb25zdCBQSFhfTElWRV9MSU5LID0gXCJkYXRhLXBoeC1saW5rXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJBQ0tfU1RBVElDID0gXCJ0cmFjay1zdGF0aWNcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSU5LX1NUQVRFID0gXCJkYXRhLXBoeC1saW5rLXN0YXRlXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVGX0xPQURJTkcgPSBcImRhdGEtcGh4LXJlZi1sb2FkaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVGX1NSQyA9IFwiZGF0YS1waHgtcmVmLXNyY1wiXG5leHBvcnQgY29uc3QgUEhYX1JFRl9MT0NLID0gXCJkYXRhLXBoeC1yZWYtbG9ja1wiXG5leHBvcnQgY29uc3QgUEhYX1RSQUNLX1VQTE9BRFMgPSBcInRyYWNrLXVwbG9hZHNcIlxuZXhwb3J0IGNvbnN0IFBIWF9VUExPQURfUkVGID0gXCJkYXRhLXBoeC11cGxvYWQtcmVmXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJFRkxJR0hURURfUkVGUyA9IFwiZGF0YS1waHgtcHJlZmxpZ2h0ZWQtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0RPTkVfUkVGUyA9IFwiZGF0YS1waHgtZG9uZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfRFJPUF9UQVJHRVQgPSBcImRyb3AtdGFyZ2V0XCJcbmV4cG9ydCBjb25zdCBQSFhfQUNUSVZFX0VOVFJZX1JFRlMgPSBcImRhdGEtcGh4LWFjdGl2ZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfTElWRV9GSUxFX1VQREFURUQgPSBcInBoeDpsaXZlLWZpbGU6dXBkYXRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NLSVAgPSBcImRhdGEtcGh4LXNraXBcIlxuZXhwb3J0IGNvbnN0IFBIWF9NQUdJQ19JRCA9IFwiZGF0YS1waHgtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUlVORSA9IFwiZGF0YS1waHgtcHJ1bmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9DT05ORUNURURfQ0xBU1MgPSBcInBoeC1jb25uZWN0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9MT0FESU5HX0NMQVNTID0gXCJwaHgtbG9hZGluZ1wiXG5leHBvcnQgY29uc3QgUEhYX0VSUk9SX0NMQVNTID0gXCJwaHgtZXJyb3JcIlxuZXhwb3J0IGNvbnN0IFBIWF9DTElFTlRfRVJST1JfQ0xBU1MgPSBcInBoeC1jbGllbnQtZXJyb3JcIlxuZXhwb3J0IGNvbnN0IFBIWF9TRVJWRVJfRVJST1JfQ0xBU1MgPSBcInBoeC1zZXJ2ZXItZXJyb3JcIlxuZXhwb3J0IGNvbnN0IFBIWF9QQVJFTlRfSUQgPSBcImRhdGEtcGh4LXBhcmVudC1pZFwiXG5leHBvcnQgY29uc3QgUEhYX01BSU4gPSBcImRhdGEtcGh4LW1haW5cIlxuZXhwb3J0IGNvbnN0IFBIWF9ST09UX0lEID0gXCJkYXRhLXBoeC1yb290LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfVklFV1BPUlRfVE9QID0gXCJ2aWV3cG9ydC10b3BcIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXUE9SVF9CT1RUT00gPSBcInZpZXdwb3J0LWJvdHRvbVwiXG5leHBvcnQgY29uc3QgUEhYX1RSSUdHRVJfQUNUSU9OID0gXCJ0cmlnZ2VyLWFjdGlvblwiXG5leHBvcnQgY29uc3QgUEhYX0hBU19GT0NVU0VEID0gXCJwaHgtaGFzLWZvY3VzZWRcIlxuZXhwb3J0IGNvbnN0IEZPQ1VTQUJMRV9JTlBVVFMgPSBbXCJ0ZXh0XCIsIFwidGV4dGFyZWFcIiwgXCJudW1iZXJcIiwgXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwic2VhcmNoXCIsIFwidGVsXCIsIFwidXJsXCIsIFwiZGF0ZVwiLCBcInRpbWVcIiwgXCJkYXRldGltZS1sb2NhbFwiLCBcImNvbG9yXCIsIFwicmFuZ2VcIl1cbmV4cG9ydCBjb25zdCBDSEVDS0FCTEVfSU5QVVRTID0gW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXVxuZXhwb3J0IGNvbnN0IFBIWF9IQVNfU1VCTUlUVEVEID0gXCJwaHgtaGFzLXN1Ym1pdHRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NFU1NJT04gPSBcImRhdGEtcGh4LXNlc3Npb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXX1NFTEVDVE9SID0gYFske1BIWF9TRVNTSU9OfV1gXG5leHBvcnQgY29uc3QgUEhYX1NUSUNLWSA9IFwiZGF0YS1waHgtc3RpY2t5XCJcbmV4cG9ydCBjb25zdCBQSFhfU1RBVElDID0gXCJkYXRhLXBoeC1zdGF0aWNcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUFET05MWSA9IFwiZGF0YS1waHgtcmVhZG9ubHlcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFRCA9IFwiZGF0YS1waHgtZGlzYWJsZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFX1dJVEggPSBcImRpc2FibGUtd2l0aFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFID0gXCJkYXRhLXBoeC1kaXNhYmxlLXdpdGgtcmVzdG9yZVwiXG5leHBvcnQgY29uc3QgUEhYX0hPT0sgPSBcImhvb2tcIlxuZXhwb3J0IGNvbnN0IFBIWF9ERUJPVU5DRSA9IFwiZGVib3VuY2VcIlxuZXhwb3J0IGNvbnN0IFBIWF9USFJPVFRMRSA9IFwidGhyb3R0bGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9VUERBVEUgPSBcInVwZGF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX1NUUkVBTSA9IFwic3RyZWFtXCJcbmV4cG9ydCBjb25zdCBQSFhfU1RSRUFNX1JFRiA9IFwiZGF0YS1waHgtc3RyZWFtXCJcbmV4cG9ydCBjb25zdCBQSFhfS0VZID0gXCJrZXlcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUklWQVRFID0gXCJwaHhQcml2YXRlXCJcbmV4cG9ydCBjb25zdCBQSFhfQVVUT19SRUNPVkVSID0gXCJhdXRvLXJlY292ZXJcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9ERUJVRyA9IFwicGh4OmxpdmUtc29ja2V0OmRlYnVnXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfUFJPRklMRSA9IFwicGh4OmxpdmUtc29ja2V0OnByb2ZpbGluZ1wiXG5leHBvcnQgY29uc3QgUEhYX0xWX0xBVEVOQ1lfU0lNID0gXCJwaHg6bGl2ZS1zb2NrZXQ6bGF0ZW5jeS1zaW1cIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OID0gXCJwaHg6bmF2LWhpc3RvcnktcG9zaXRpb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9QUk9HUkVTUyA9IFwicHJvZ3Jlc3NcIlxuZXhwb3J0IGNvbnN0IFBIWF9NT1VOVEVEID0gXCJtb3VudGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVMT0FEX1NUQVRVUyA9IFwiX19waG9lbml4X3JlbG9hZF9zdGF0dXNfX1wiXG5leHBvcnQgY29uc3QgTE9BREVSX1RJTUVPVVQgPSAxXG5leHBvcnQgY29uc3QgTUFYX0NISUxEX0pPSU5fQVRURU1QVFMgPSAzXG5leHBvcnQgY29uc3QgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCA9IDIwMFxuZXhwb3J0IGNvbnN0IEJJTkRJTkdfUFJFRklYID0gXCJwaHgtXCJcbmV4cG9ydCBjb25zdCBQVVNIX1RJTUVPVVQgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IExJTktfSEVBREVSID0gXCJ4LXJlcXVlc3RlZC13aXRoXCJcbmV4cG9ydCBjb25zdCBSRVNQT05TRV9VUkxfSEVBREVSID0gXCJ4LXJlc3BvbnNlLXVybFwiXG5leHBvcnQgY29uc3QgREVCT1VOQ0VfVFJJR0dFUiA9IFwiZGVib3VuY2UtdHJpZ2dlclwiXG5leHBvcnQgY29uc3QgVEhST1RUTEVEID0gXCJ0aHJvdHRsZWRcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1BSRVZfS0VZID0gXCJkZWJvdW5jZS1wcmV2LWtleVwiXG5leHBvcnQgY29uc3QgREVGQVVMVFMgPSB7XG4gIGRlYm91bmNlOiAzMDAsXG4gIHRocm90dGxlOiAzMDBcbn1cbmV4cG9ydCBjb25zdCBQSFhfUEVORElOR19BVFRSUyA9IFtQSFhfUkVGX0xPQURJTkcsIFBIWF9SRUZfU1JDLCBQSFhfUkVGX0xPQ0tdXG4vLyBSZW5kZXJlZFxuZXhwb3J0IGNvbnN0IERZTkFNSUNTID0gXCJkXCJcbmV4cG9ydCBjb25zdCBTVEFUSUMgPSBcInNcIlxuZXhwb3J0IGNvbnN0IFJPT1QgPSBcInJcIlxuZXhwb3J0IGNvbnN0IENPTVBPTkVOVFMgPSBcImNcIlxuZXhwb3J0IGNvbnN0IEVWRU5UUyA9IFwiZVwiXG5leHBvcnQgY29uc3QgUkVQTFkgPSBcInJcIlxuZXhwb3J0IGNvbnN0IFRJVExFID0gXCJ0XCJcbmV4cG9ydCBjb25zdCBURU1QTEFURVMgPSBcInBcIlxuZXhwb3J0IGNvbnN0IFNUUkVBTSA9IFwic3RyZWFtXCJcbiIsICJpbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudHJ5VXBsb2FkZXIge1xuICBjb25zdHJ1Y3RvcihlbnRyeSwgY29uZmlnLCBsaXZlU29ja2V0KXtcbiAgICBsZXQge2NodW5rX3NpemUsIGNodW5rX3RpbWVvdXR9ID0gY29uZmlnXG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZW50cnkgPSBlbnRyeVxuICAgIHRoaXMub2Zmc2V0ID0gMFxuICAgIHRoaXMuY2h1bmtTaXplID0gY2h1bmtfc2l6ZVxuICAgIHRoaXMuY2h1bmtUaW1lb3V0ID0gY2h1bmtfdGltZW91dFxuICAgIHRoaXMuY2h1bmtUaW1lciA9IG51bGxcbiAgICB0aGlzLmVycm9yZWQgPSBmYWxzZVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbCA9IGxpdmVTb2NrZXQuY2hhbm5lbChgbHZ1OiR7ZW50cnkucmVmfWAsIHt0b2tlbjogZW50cnkubWV0YWRhdGEoKX0pXG4gIH1cblxuICBlcnJvcihyZWFzb24pe1xuICAgIGlmKHRoaXMuZXJyb3JlZCl7IHJldHVybiB9XG4gICAgdGhpcy51cGxvYWRDaGFubmVsLmxlYXZlKClcbiAgICB0aGlzLmVycm9yZWQgPSB0cnVlXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2h1bmtUaW1lcilcbiAgICB0aGlzLmVudHJ5LmVycm9yKHJlYXNvbilcbiAgfVxuXG4gIHVwbG9hZCgpe1xuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gICAgdGhpcy51cGxvYWRDaGFubmVsLmpvaW4oKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBfZGF0YSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSlcbiAgICAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgcmVhc29uID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgfVxuXG4gIGlzRG9uZSgpeyByZXR1cm4gdGhpcy5vZmZzZXQgPj0gdGhpcy5lbnRyeS5maWxlLnNpemUgfVxuXG4gIHJlYWROZXh0Q2h1bmsoKXtcbiAgICBsZXQgcmVhZGVyID0gbmV3IHdpbmRvdy5GaWxlUmVhZGVyKClcbiAgICBsZXQgYmxvYiA9IHRoaXMuZW50cnkuZmlsZS5zbGljZSh0aGlzLm9mZnNldCwgdGhpcy5jaHVua1NpemUgKyB0aGlzLm9mZnNldClcbiAgICByZWFkZXIub25sb2FkID0gKGUpID0+IHtcbiAgICAgIGlmKGUudGFyZ2V0LmVycm9yID09PSBudWxsKXtcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gZS50YXJnZXQucmVzdWx0LmJ5dGVMZW5ndGhcbiAgICAgICAgdGhpcy5wdXNoQ2h1bmsoZS50YXJnZXQucmVzdWx0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxvZ0Vycm9yKFwiUmVhZCBlcnJvcjogXCIgKyBlLnRhcmdldC5lcnJvcilcbiAgICAgIH1cbiAgICB9XG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIH1cblxuICBwdXNoQ2h1bmsoY2h1bmspe1xuICAgIGlmKCF0aGlzLnVwbG9hZENoYW5uZWwuaXNKb2luZWQoKSl7IHJldHVybiB9XG4gICAgdGhpcy51cGxvYWRDaGFubmVsLnB1c2goXCJjaHVua1wiLCBjaHVuaywgdGhpcy5jaHVua1RpbWVvdXQpXG4gICAgICAucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRyeS5wcm9ncmVzcygodGhpcy5vZmZzZXQgLyB0aGlzLmVudHJ5LmZpbGUuc2l6ZSkgKiAxMDApXG4gICAgICAgIGlmKCF0aGlzLmlzRG9uZSgpKXtcbiAgICAgICAgICB0aGlzLmNodW5rVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVhZE5leHRDaHVuaygpLCB0aGlzLmxpdmVTb2NrZXQuZ2V0TGF0ZW5jeVNpbSgpIHx8IDApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsICh7cmVhc29ufSkgPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX1ZJRVdfU0VMRUNUT1Jcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IEVudHJ5VXBsb2FkZXIgZnJvbSBcIi4vZW50cnlfdXBsb2FkZXJcIlxuXG5leHBvcnQgbGV0IGxvZ0Vycm9yID0gKG1zZywgb2JqKSA9PiBjb25zb2xlLmVycm9yICYmIGNvbnNvbGUuZXJyb3IobXNnLCBvYmopXG5cbmV4cG9ydCBsZXQgaXNDaWQgPSAoY2lkKSA9PiB7XG4gIGxldCB0eXBlID0gdHlwZW9mKGNpZClcbiAgcmV0dXJuIHR5cGUgPT09IFwibnVtYmVyXCIgfHwgKHR5cGUgPT09IFwic3RyaW5nXCIgJiYgL14oMHxbMS05XVxcZCopJC8udGVzdChjaWQpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0RHVwbGljYXRlSWRzKCl7XG4gIGxldCBpZHMgPSBuZXcgU2V0KClcbiAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipbaWRdXCIpXG4gIGZvcihsZXQgaSA9IDAsIGxlbiA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICBpZihpZHMuaGFzKGVsZW1zW2ldLmlkKSl7XG4gICAgICBjb25zb2xlLmVycm9yKGBNdWx0aXBsZSBJRHMgZGV0ZWN0ZWQ6ICR7ZWxlbXNbaV0uaWR9LiBFbnN1cmUgdW5pcXVlIGVsZW1lbnQgaWRzLmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkcy5hZGQoZWxlbXNbaV0uaWQpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyhpbnNlcnRzKXtcbiAgY29uc3QgZXJyb3JzID0gbmV3IFNldCgpXG4gIE9iamVjdC5rZXlzKGluc2VydHMpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgY29uc3Qgc3RyZWFtRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICBpZihzdHJlYW1FbCAmJiBzdHJlYW1FbC5wYXJlbnRFbGVtZW50ICYmIHN0cmVhbUVsLnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicGh4LXVwZGF0ZVwiKSAhPT0gXCJzdHJlYW1cIil7XG4gICAgICBlcnJvcnMuYWRkKGBUaGUgc3RyZWFtIGNvbnRhaW5lciB3aXRoIGlkIFwiJHtzdHJlYW1FbC5wYXJlbnRFbGVtZW50LmlkfVwiIGlzIG1pc3NpbmcgdGhlIHBoeC11cGRhdGU9XCJzdHJlYW1cIiBhdHRyaWJ1dGUuIEVuc3VyZSBpdCBpcyBzZXQgZm9yIHN0cmVhbXMgdG8gd29yayBwcm9wZXJseS5gKVxuICAgIH1cbiAgfSlcbiAgZXJyb3JzLmZvckVhY2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpXG59XG5cbmV4cG9ydCBsZXQgZGVidWcgPSAodmlldywga2luZCwgbXNnLCBvYmopID0+IHtcbiAgaWYodmlldy5saXZlU29ja2V0LmlzRGVidWdFbmFibGVkKCkpe1xuICAgIGNvbnNvbGUubG9nKGAke3ZpZXcuaWR9ICR7a2luZH06ICR7bXNnfSAtIGAsIG9iailcbiAgfVxufVxuXG4vLyB3cmFwcyB2YWx1ZSBpbiBjbG9zdXJlIG9yIHJldHVybnMgY2xvc3VyZVxuZXhwb3J0IGxldCBjbG9zdXJlID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiID8gdmFsIDogZnVuY3Rpb24gKCl7IHJldHVybiB2YWwgfVxuXG5leHBvcnQgbGV0IGNsb25lID0gKG9iaikgPT4geyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSB9XG5cbmV4cG9ydCBsZXQgY2xvc2VzdFBoeEJpbmRpbmcgPSAoZWwsIGJpbmRpbmcsIGJvcmRlckVsKSA9PiB7XG4gIGRvIHtcbiAgICBpZihlbC5tYXRjaGVzKGBbJHtiaW5kaW5nfV1gKSAmJiAhZWwuZGlzYWJsZWQpeyByZXR1cm4gZWwgfVxuICAgIGVsID0gZWwucGFyZW50RWxlbWVudCB8fCBlbC5wYXJlbnROb2RlXG4gIH0gd2hpbGUoZWwgIT09IG51bGwgJiYgZWwubm9kZVR5cGUgPT09IDEgJiYgISgoYm9yZGVyRWwgJiYgYm9yZGVyRWwuaXNTYW1lTm9kZShlbCkpIHx8IGVsLm1hdGNoZXMoUEhYX1ZJRVdfU0VMRUNUT1IpKSlcbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGxldCBpc09iamVjdCA9IChvYmopID0+IHtcbiAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmICEob2JqIGluc3RhbmNlb2YgQXJyYXkpXG59XG5cbmV4cG9ydCBsZXQgaXNFcXVhbE9iaiA9IChvYmoxLCBvYmoyKSA9PiBKU09OLnN0cmluZ2lmeShvYmoxKSA9PT0gSlNPTi5zdHJpbmdpZnkob2JqMilcblxuZXhwb3J0IGxldCBpc0VtcHR5ID0gKG9iaikgPT4ge1xuICBmb3IobGV0IHggaW4gb2JqKXsgcmV0dXJuIGZhbHNlIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGxldCBtYXliZSA9IChlbCwgY2FsbGJhY2spID0+IGVsICYmIGNhbGxiYWNrKGVsKVxuXG5leHBvcnQgbGV0IGNoYW5uZWxVcGxvYWRlciA9IGZ1bmN0aW9uIChlbnRyaWVzLCBvbkVycm9yLCByZXNwLCBsaXZlU29ja2V0KXtcbiAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICBsZXQgZW50cnlVcGxvYWRlciA9IG5ldyBFbnRyeVVwbG9hZGVyKGVudHJ5LCByZXNwLmNvbmZpZywgbGl2ZVNvY2tldClcbiAgICBlbnRyeVVwbG9hZGVyLnVwbG9hZCgpXG4gIH0pXG59XG4iLCAibGV0IEJyb3dzZXIgPSB7XG4gIGNhblB1c2hTdGF0ZSgpeyByZXR1cm4gKHR5cGVvZiAoaGlzdG9yeS5wdXNoU3RhdGUpICE9PSBcInVuZGVmaW5lZFwiKSB9LFxuXG4gIGRyb3BMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KXtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpXG4gIH0sXG5cbiAgdXBkYXRlTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSwgaW5pdGlhbCwgZnVuYyl7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLmdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IGtleSA9IHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IG5ld1ZhbCA9IGN1cnJlbnQgPT09IG51bGwgPyBpbml0aWFsIDogZnVuYyhjdXJyZW50KVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkobmV3VmFsKSlcbiAgICByZXR1cm4gbmV3VmFsXG4gIH0sXG5cbiAgZ2V0TG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpKVxuICB9LFxuXG4gIHVwZGF0ZUN1cnJlbnRTdGF0ZShjYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuY2FuUHVzaFN0YXRlKCkpeyByZXR1cm4gfVxuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGNhbGxiYWNrKGhpc3Rvcnkuc3RhdGUgfHwge30pLCBcIlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgfSxcblxuICBwdXNoU3RhdGUoa2luZCwgbWV0YSwgdG8pe1xuICAgIGlmKHRoaXMuY2FuUHVzaFN0YXRlKCkpe1xuICAgICAgaWYodG8gIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKXtcbiAgICAgICAgaWYobWV0YS50eXBlID09IFwicmVkaXJlY3RcIiAmJiBtZXRhLnNjcm9sbCl7XG4gICAgICAgICAgLy8gSWYgd2UncmUgcmVkaXJlY3Rpbmcgc3RvcmUgdGhlIGN1cnJlbnQgc2Nyb2xsWSBmb3IgdGhlIGN1cnJlbnQgaGlzdG9yeSBzdGF0ZS5cbiAgICAgICAgICBsZXQgY3VycmVudFN0YXRlID0gaGlzdG9yeS5zdGF0ZSB8fCB7fVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZS5zY3JvbGwgPSBtZXRhLnNjcm9sbFxuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGN1cnJlbnRTdGF0ZSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgbWV0YS5zY3JvbGwgLy8gT25seSBzdG9yZSB0aGUgc2Nyb2xsIGluIHRoZSByZWRpcmVjdCBjYXNlLlxuICAgICAgICBoaXN0b3J5W2tpbmQgKyBcIlN0YXRlXCJdKG1ldGEsIFwiXCIsIHRvIHx8IG51bGwpIC8vIElFIHdpbGwgY29lcmNlIHVuZGVmaW5lZCB0byBzdHJpbmdcblxuICAgICAgICAvLyB3aGVuIHVzaW5nIG5hdmlnYXRlLCB3ZSdkIGNhbGwgcHVzaFN0YXRlIGltbWVkaWF0ZWx5IGJlZm9yZSBwYXRjaGluZyB0aGUgRE9NLFxuICAgICAgICAvLyBqdW1waW5nIGJhY2sgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZSwgZWZmZWN0aXZlbHkgaWdub3JpbmcgdGhlIHNjcm9sbEludG9WaWV3O1xuICAgICAgICAvLyB0aGVyZWZvcmUgd2Ugd2FpdCBmb3IgdGhlIG5leHQgZnJhbWUgKGFmdGVyIHRoZSBET00gcGF0Y2gpIGFuZCBvbmx5IHRoZW4gdHJ5XG4gICAgICAgIC8vIHRvIHNjcm9sbCB0byB0aGUgaGFzaEVsXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGxldCBoYXNoRWwgPSB0aGlzLmdldEhhc2hUYXJnZXRFbCh3aW5kb3cubG9jYXRpb24uaGFzaClcbiAgXG4gICAgICAgICAgaWYoaGFzaEVsKXtcbiAgICAgICAgICAgIGhhc2hFbC5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgfSBlbHNlIGlmKG1ldGEudHlwZSA9PT0gXCJyZWRpcmVjdFwiKXtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGwoMCwgMClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVkaXJlY3QodG8pXG4gICAgfVxuICB9LFxuXG4gIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgbWF4QWdlU2Vjb25kcyl7XG4gICAgbGV0IGV4cGlyZXMgPSB0eXBlb2YobWF4QWdlU2Vjb25kcykgPT09IFwibnVtYmVyXCIgPyBgIG1heC1hZ2U9JHttYXhBZ2VTZWNvbmRzfTtgIDogXCJcIlxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PSR7dmFsdWV9OyR7ZXhwaXJlc30gcGF0aD0vYFxuICB9LFxuXG4gIGdldENvb2tpZShuYW1lKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChgKD86KD86XnwuKjtcXHMqKSR7bmFtZX1cXHMqXFw9XFxzKihbXjtdKikuKiQpfF4uKiRgKSwgXCIkMVwiKVxuICB9LFxuXG4gIGRlbGV0ZUNvb2tpZShuYW1lKXtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT07IG1heC1hZ2U9LTE7IHBhdGg9L2BcbiAgfSxcblxuICByZWRpcmVjdCh0b1VSTCwgZmxhc2gpe1xuICAgIGlmKGZsYXNoKXsgdGhpcy5zZXRDb29raWUoXCJfX3Bob2VuaXhfZmxhc2hfX1wiLCBmbGFzaCwgNjApIH1cbiAgICB3aW5kb3cubG9jYXRpb24gPSB0b1VSTFxuICB9LFxuXG4gIGxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KXsgcmV0dXJuIGAke25hbWVzcGFjZX0tJHtzdWJrZXl9YCB9LFxuXG4gIGdldEhhc2hUYXJnZXRFbChtYXliZUhhc2gpe1xuICAgIGxldCBoYXNoID0gbWF5YmVIYXNoLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDEpXG4gICAgaWYoaGFzaCA9PT0gXCJcIil7IHJldHVybiB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2gpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbbmFtZT1cIiR7aGFzaH1cIl1gKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJcbiIsICJpbXBvcnQge1xuICBDSEVDS0FCTEVfSU5QVVRTLFxuICBERUJPVU5DRV9QUkVWX0tFWSxcbiAgREVCT1VOQ0VfVFJJR0dFUixcbiAgRk9DVVNBQkxFX0lOUFVUUyxcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0hBU19GT0NVU0VELFxuICBQSFhfSEFTX1NVQk1JVFRFRCxcbiAgUEhYX01BSU4sXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9QUklWQVRFLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUEVORElOR19BVFRSUyxcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9TRVNTSU9OLFxuICBQSFhfU1RBVElDLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9TVElDS1ksXG4gIFBIWF9FVkVOVF9DTEFTU0VTLFxuICBUSFJPVFRMRUQsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxubGV0IERPTSA9IHtcbiAgYnlJZChpZCl7IHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbG9nRXJyb3IoYG5vIGlkIGZvdW5kIGZvciAke2lkfWApIH0sXG5cbiAgcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSl7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gICAgaWYoZWwuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCl7IGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpIH1cbiAgfSxcblxuICBhbGwobm9kZSwgcXVlcnksIGNhbGxiYWNrKXtcbiAgICBpZighbm9kZSl7IHJldHVybiBbXSB9XG4gICAgbGV0IGFycmF5ID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpKVxuICAgIHJldHVybiBjYWxsYmFjayA/IGFycmF5LmZvckVhY2goY2FsbGJhY2spIDogYXJyYXlcbiAgfSxcblxuICBjaGlsZE5vZGVMZW5ndGgoaHRtbCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkRWxlbWVudENvdW50XG4gIH0sXG5cbiAgaXNVcGxvYWRJbnB1dChlbCl7IHJldHVybiBlbC50eXBlID09PSBcImZpbGVcIiAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICE9PSBudWxsIH0sXG5cbiAgaXNBdXRvVXBsb2FkKGlucHV0RWwpeyByZXR1cm4gaW5wdXRFbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXBoeC1hdXRvLXVwbG9hZFwiKSB9LFxuXG4gIGZpbmRVcGxvYWRJbnB1dHMobm9kZSl7XG4gICAgY29uc3QgZm9ybUlkID0gbm9kZS5pZFxuICAgIGNvbnN0IGlucHV0c091dHNpZGVGb3JtID0gdGhpcy5hbGwoZG9jdW1lbnQsIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVske1BIWF9VUExPQURfUkVGfV1bZm9ybT1cIiR7Zm9ybUlkfVwiXWApXG4gICAgcmV0dXJuIHRoaXMuYWxsKG5vZGUsIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVske1BIWF9VUExPQURfUkVGfV1gKS5jb25jYXQoaW5wdXRzT3V0c2lkZUZvcm0pXG4gIH0sXG5cbiAgZmluZENvbXBvbmVudE5vZGVMaXN0KG5vZGUsIGNpZCl7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KHRoaXMuYWxsKG5vZGUsIGBbJHtQSFhfQ09NUE9ORU5UfT1cIiR7Y2lkfVwiXWApLCBub2RlKVxuICB9LFxuXG4gIGlzUGh4RGVzdHJveWVkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmlkICYmIERPTS5wcml2YXRlKG5vZGUsIFwiZGVzdHJveWVkXCIpID8gdHJ1ZSA6IGZhbHNlXG4gIH0sXG5cbiAgd2FudHNOZXdUYWIoZSl7XG4gICAgbGV0IHdhbnRzTmV3VGFiID0gZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkgfHwgZS5tZXRhS2V5IHx8IChlLmJ1dHRvbiAmJiBlLmJ1dHRvbiA9PT0gMSlcbiAgICBsZXQgaXNEb3dubG9hZCA9IChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ICYmIGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRvd25sb2FkXCIpKVxuICAgIGxldCBpc1RhcmdldEJsYW5rID0gZS50YXJnZXQuaGFzQXR0cmlidXRlKFwidGFyZ2V0XCIpICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcInRhcmdldFwiKS50b0xvd2VyQ2FzZSgpID09PSBcIl9ibGFua1wiXG4gICAgbGV0IGlzVGFyZ2V0TmFtZWRUYWIgPSBlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJ0YXJnZXRcIikgJiYgIWUudGFyZ2V0LmdldEF0dHJpYnV0ZShcInRhcmdldFwiKS5zdGFydHNXaXRoKFwiX1wiKVxuICAgIHJldHVybiB3YW50c05ld1RhYiB8fCBpc1RhcmdldEJsYW5rIHx8IGlzRG93bmxvYWQgfHwgaXNUYXJnZXROYW1lZFRhYlxuICB9LFxuXG4gIGlzVW5sb2FkYWJsZUZvcm1TdWJtaXQoZSl7XG4gICAgLy8gSWdub3JlIGZvcm0gc3VibWlzc2lvbnMgaW50ZW5kZWQgdG8gY2xvc2UgYSBuYXRpdmUgPGRpYWxvZz4gZWxlbWVudFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9kaWFsb2cjdXNhZ2Vfbm90ZXNcbiAgICBsZXQgaXNEaWFsb2dTdWJtaXQgPSAoZS50YXJnZXQgJiYgZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwibWV0aG9kXCIpID09PSBcImRpYWxvZ1wiKSB8fFxuICAgICAgKGUuc3VibWl0dGVyICYmIGUuc3VibWl0dGVyLmdldEF0dHJpYnV0ZShcImZvcm1tZXRob2RcIikgPT09IFwiZGlhbG9nXCIpXG5cbiAgICBpZihpc0RpYWxvZ1N1Ym1pdCl7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFlLmRlZmF1bHRQcmV2ZW50ZWQgJiYgIXRoaXMud2FudHNOZXdUYWIoZSlcbiAgICB9XG4gIH0sXG5cbiAgaXNOZXdQYWdlQ2xpY2soZSwgY3VycmVudExvY2F0aW9uKXtcbiAgICBsZXQgaHJlZiA9IGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgPyBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpIDogbnVsbFxuICAgIGxldCB1cmxcblxuICAgIGlmKGUuZGVmYXVsdFByZXZlbnRlZCB8fCBocmVmID09PSBudWxsIHx8IHRoaXMud2FudHNOZXdUYWIoZSkpeyByZXR1cm4gZmFsc2UgfVxuICAgIGlmKGhyZWYuc3RhcnRzV2l0aChcIm1haWx0bzpcIikgfHwgaHJlZi5zdGFydHNXaXRoKFwidGVsOlwiKSl7IHJldHVybiBmYWxzZSB9XG4gICAgaWYoZS50YXJnZXQuaXNDb250ZW50RWRpdGFibGUpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHVybCA9IG5ldyBVUkwoaHJlZilcbiAgICB9IGNhdGNoIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVybCA9IG5ldyBVUkwoaHJlZiwgY3VycmVudExvY2F0aW9uKVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGJhZCBVUkwsIGZhbGxiYWNrIHRvIGxldCBicm93c2VyIHRyeSBpdCBhcyBleHRlcm5hbFxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKHVybC5ob3N0ID09PSBjdXJyZW50TG9jYXRpb24uaG9zdCAmJiB1cmwucHJvdG9jb2wgPT09IGN1cnJlbnRMb2NhdGlvbi5wcm90b2NvbCl7XG4gICAgICBpZih1cmwucGF0aG5hbWUgPT09IGN1cnJlbnRMb2NhdGlvbi5wYXRobmFtZSAmJiB1cmwuc2VhcmNoID09PSBjdXJyZW50TG9jYXRpb24uc2VhcmNoKXtcbiAgICAgICAgcmV0dXJuIHVybC5oYXNoID09PSBcIlwiICYmICF1cmwuaHJlZi5lbmRzV2l0aChcIiNcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbC5zdGFydHNXaXRoKFwiaHR0cFwiKVxuICB9LFxuXG4gIG1hcmtQaHhDaGlsZERlc3Ryb3llZChlbCl7XG4gICAgaWYodGhpcy5pc1BoeENoaWxkKGVsKSl7IGVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgXCJcIikgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgXCJkZXN0cm95ZWRcIiwgdHJ1ZSlcbiAgfSxcblxuICBmaW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHBhcmVudElkKXtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgcmV0dXJuIHRoaXMuZmluZFBoeENoaWxkcmVuKHRlbXBsYXRlLmNvbnRlbnQsIHBhcmVudElkKVxuICB9LFxuXG4gIGlzSWdub3JlZChlbCwgcGh4VXBkYXRlKXtcbiAgICByZXR1cm4gKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpIHx8IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LXVwZGF0ZVwiKSkgPT09IFwiaWdub3JlXCJcbiAgfSxcblxuICBpc1BoeFVwZGF0ZShlbCwgcGh4VXBkYXRlLCB1cGRhdGVUeXBlcyl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiB1cGRhdGVUeXBlcy5pbmRleE9mKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpKSA+PSAwXG4gIH0sXG5cbiAgZmluZFBoeFN0aWNreShlbCl7IHJldHVybiB0aGlzLmFsbChlbCwgYFske1BIWF9TVElDS1l9XWApIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuKGVsLCBwYXJlbnRJZCl7XG4gICAgcmV0dXJuIHRoaXMuYWxsKGVsLCBgJHtQSFhfVklFV19TRUxFQ1RPUn1bJHtQSFhfUEFSRU5UX0lEfT1cIiR7cGFyZW50SWR9XCJdYClcbiAgfSxcblxuICBmaW5kRXhpc3RpbmdQYXJlbnRDSURzKG5vZGUsIGNpZHMpe1xuICAgIC8vIHdlIG9ubHkgd2FudCB0byBmaW5kIHBhcmVudHMgdGhhdCBleGlzdCBvbiB0aGUgcGFnZVxuICAgIC8vIGlmIGEgY2lkIGlzIG5vdCBvbiB0aGUgcGFnZSwgdGhlIG9ubHkgd2F5IGl0IGNhbiBiZSBhZGRlZCBiYWNrIHRvIHRoZSBwYWdlXG4gICAgLy8gaXMgaWYgYSBwYXJlbnQgYWRkcyBpdCBiYWNrLCB0aGVyZWZvcmUgaWYgYSBjaWQgZG9lcyBub3QgZXhpc3Qgb24gdGhlIHBhZ2UsXG4gICAgLy8gd2Ugc2hvdWxkIG5vdCB0cnkgdG8gcmVuZGVyIGl0IGJ5IGl0c2VsZiAoYmVjYXVzZSBpdCB3b3VsZCBiZSByZW5kZXJlZCB0d2ljZSxcbiAgICAvLyBvbmUgYnkgdGhlIHBhcmVudCwgYW5kIGEgc2Vjb25kIHRpbWUgYnkgaXRzZWxmKVxuICAgIGxldCBwYXJlbnRDaWRzID0gbmV3IFNldCgpXG4gICAgbGV0IGNoaWxkcmVuQ2lkcyA9IG5ldyBTZXQoKVxuXG4gICAgY2lkcy5mb3JFYWNoKGNpZCA9PiB7XG4gICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSkuZm9yRWFjaChwYXJlbnQgPT4ge1xuICAgICAgICBwYXJlbnRDaWRzLmFkZChjaWQpXG4gICAgICAgIHRoaXMuZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KHRoaXMuYWxsKHBhcmVudCwgYFske1BIWF9DT01QT05FTlR9XWApLCBwYXJlbnQpXG4gICAgICAgICAgLm1hcChlbCA9PiBwYXJzZUludChlbC5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkpKVxuICAgICAgICAgIC5mb3JFYWNoKGNoaWxkQ0lEID0+IGNoaWxkcmVuQ2lkcy5hZGQoY2hpbGRDSUQpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgY2hpbGRyZW5DaWRzLmZvckVhY2goY2hpbGRDaWQgPT4gcGFyZW50Q2lkcy5kZWxldGUoY2hpbGRDaWQpKVxuXG4gICAgcmV0dXJuIHBhcmVudENpZHNcbiAgfSxcblxuICBmaWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcobm9kZXMsIHBhcmVudCl7XG4gICAgaWYocGFyZW50LnF1ZXJ5U2VsZWN0b3IoUEhYX1ZJRVdfU0VMRUNUT1IpKXtcbiAgICAgIHJldHVybiBub2Rlcy5maWx0ZXIoZWwgPT4gdGhpcy53aXRoaW5TYW1lTGl2ZVZpZXcoZWwsIHBhcmVudCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2Rlc1xuICAgIH1cbiAgfSxcblxuICB3aXRoaW5TYW1lTGl2ZVZpZXcobm9kZSwgcGFyZW50KXtcbiAgICB3aGlsZShub2RlID0gbm9kZS5wYXJlbnROb2RlKXtcbiAgICAgIGlmKG5vZGUuaXNTYW1lTm9kZShwYXJlbnQpKXsgcmV0dXJuIHRydWUgfVxuICAgICAgaWYobm9kZS5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJpdmF0ZShlbCwga2V5KXsgcmV0dXJuIGVsW1BIWF9QUklWQVRFXSAmJiBlbFtQSFhfUFJJVkFURV1ba2V5XSB9LFxuXG4gIGRlbGV0ZVByaXZhdGUoZWwsIGtleSl7IGVsW1BIWF9QUklWQVRFXSAmJiBkZWxldGUgKGVsW1BIWF9QUklWQVRFXVtrZXldKSB9LFxuXG4gIHB1dFByaXZhdGUoZWwsIGtleSwgdmFsdWUpe1xuICAgIGlmKCFlbFtQSFhfUFJJVkFURV0peyBlbFtQSFhfUFJJVkFURV0gPSB7fSB9XG4gICAgZWxbUEhYX1BSSVZBVEVdW2tleV0gPSB2YWx1ZVxuICB9LFxuXG4gIHVwZGF0ZVByaXZhdGUoZWwsIGtleSwgZGVmYXVsdFZhbCwgdXBkYXRlRnVuYyl7XG4gICAgbGV0IGV4aXN0aW5nID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpXG4gICAgaWYoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCl7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhkZWZhdWx0VmFsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHVwZGF0ZUZ1bmMoZXhpc3RpbmcpKVxuICAgIH1cbiAgfSxcblxuICBzeW5jUGVuZGluZ0F0dHJzKGZyb21FbCwgdG9FbCl7XG4gICAgaWYoIWZyb21FbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpKXsgcmV0dXJuIH1cbiAgICBQSFhfRVZFTlRfQ0xBU1NFUy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICBmcm9tRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkgJiYgdG9FbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbiAgICB9KVxuICAgIFBIWF9QRU5ESU5HX0FUVFJTLmZpbHRlcihhdHRyID0+IGZyb21FbC5oYXNBdHRyaWJ1dGUoYXR0cikpLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShhdHRyLCBmcm9tRWwuZ2V0QXR0cmlidXRlKGF0dHIpKVxuICAgIH0pXG4gIH0sXG5cbiAgY29weVByaXZhdGVzKHRhcmdldCwgc291cmNlKXtcbiAgICBpZihzb3VyY2VbUEhYX1BSSVZBVEVdKXtcbiAgICAgIHRhcmdldFtQSFhfUFJJVkFURV0gPSBzb3VyY2VbUEhYX1BSSVZBVEVdXG4gICAgfVxuICB9LFxuXG4gIHB1dFRpdGxlKHN0cil7XG4gICAgbGV0IHRpdGxlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGl0bGVcIilcbiAgICBpZih0aXRsZUVsKXtcbiAgICAgIGxldCB7cHJlZml4LCBzdWZmaXgsIGRlZmF1bHQ6IGRlZmF1bHRUaXRsZX0gPSB0aXRsZUVsLmRhdGFzZXRcbiAgICAgIGxldCBpc0VtcHR5ID0gdHlwZW9mKHN0cikgIT09IFwic3RyaW5nXCIgfHwgc3RyLnRyaW0oKSA9PT0gXCJcIlxuICAgICAgaWYoaXNFbXB0eSAmJiB0eXBlb2YoZGVmYXVsdFRpdGxlKSAhPT0gXCJzdHJpbmdcIil7IHJldHVybiB9XG5cbiAgICAgIGxldCBpbm5lciA9IGlzRW1wdHkgPyBkZWZhdWx0VGl0bGUgOiBzdHJcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gYCR7cHJlZml4IHx8IFwiXCJ9JHtpbm5lciB8fCBcIlwifSR7c3VmZml4IHx8IFwiXCJ9YFxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC50aXRsZSA9IHN0clxuICAgIH1cbiAgfSxcblxuICBkZWJvdW5jZShlbCwgZXZlbnQsIHBoeERlYm91bmNlLCBkZWZhdWx0RGVib3VuY2UsIHBoeFRocm90dGxlLCBkZWZhdWx0VGhyb3R0bGUsIGFzeW5jRmlsdGVyLCBjYWxsYmFjayl7XG4gICAgbGV0IGRlYm91bmNlID0gZWwuZ2V0QXR0cmlidXRlKHBoeERlYm91bmNlKVxuICAgIGxldCB0aHJvdHRsZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhUaHJvdHRsZSlcblxuICAgIGlmKGRlYm91bmNlID09PSBcIlwiKXsgZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2UgfVxuICAgIGlmKHRocm90dGxlID09PSBcIlwiKXsgdGhyb3R0bGUgPSBkZWZhdWx0VGhyb3R0bGUgfVxuICAgIGxldCB2YWx1ZSA9IGRlYm91bmNlIHx8IHRocm90dGxlXG4gICAgc3dpdGNoKHZhbHVlKXtcbiAgICAgIGNhc2UgbnVsbDogcmV0dXJuIGNhbGxiYWNrKClcblxuICAgICAgY2FzZSBcImJsdXJcIjpcbiAgICAgICAgaWYodGhpcy5vbmNlKGVsLCBcImRlYm91bmNlLWJsdXJcIikpe1xuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyBjYWxsYmFjaygpIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZXQgdGltZW91dCA9IHBhcnNlSW50KHZhbHVlKVxuICAgICAgICBsZXQgdHJpZ2dlciA9ICgpID0+IHRocm90dGxlID8gdGhpcy5kZWxldGVQcml2YXRlKGVsLCBUSFJPVFRMRUQpIDogY2FsbGJhY2soKVxuICAgICAgICBsZXQgY3VycmVudEN5Y2xlID0gdGhpcy5pbmNDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgdHJpZ2dlcilcbiAgICAgICAgaWYoaXNOYU4odGltZW91dCkpeyByZXR1cm4gbG9nRXJyb3IoYGludmFsaWQgdGhyb3R0bGUvZGVib3VuY2UgdmFsdWU6ICR7dmFsdWV9YCkgfVxuICAgICAgICBpZih0aHJvdHRsZSl7XG4gICAgICAgICAgbGV0IG5ld0tleURvd24gPSBmYWxzZVxuICAgICAgICAgIGlmKGV2ZW50LnR5cGUgPT09IFwia2V5ZG93blwiKXtcbiAgICAgICAgICAgIGxldCBwcmV2S2V5ID0gdGhpcy5wcml2YXRlKGVsLCBERUJPVU5DRV9QUkVWX0tFWSlcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVksIGV2ZW50LmtleSlcbiAgICAgICAgICAgIG5ld0tleURvd24gPSBwcmV2S2V5ICE9PSBldmVudC5rZXlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZighbmV3S2V5RG93biAmJiB0aGlzLnByaXZhdGUoZWwsIFRIUk9UVExFRCkpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKSB9XG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBUSFJPVFRMRUQsIHQpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSLCBjdXJyZW50Q3ljbGUpIH1cbiAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZvcm0gPSBlbC5mb3JtXG4gICAgICAgIGlmKGZvcm0gJiYgdGhpcy5vbmNlKGZvcm0sIFwiYmluZC1kZWJvdW5jZVwiKSl7XG4gICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsICgpID0+IHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oKG5ldyBGb3JtRGF0YShmb3JtKSkuZW50cmllcygpLCAoW25hbWVdKSA9PiB7XG4gICAgICAgICAgICAgIGxldCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihgW25hbWU9XCIke25hbWV9XCJdYClcbiAgICAgICAgICAgICAgdGhpcy5pbmNDeWNsZShpbnB1dCwgREVCT1VOQ0VfVFJJR0dFUilcbiAgICAgICAgICAgICAgdGhpcy5kZWxldGVQcml2YXRlKGlucHV0LCBUSFJPVFRMRUQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5vbmNlKGVsLCBcImJpbmQtZGVib3VuY2VcIikpe1xuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vIGJlY2F1c2Ugd2UgdHJpZ2dlciB0aGUgY2FsbGJhY2sgaGVyZSxcbiAgICAgICAgICAgIC8vIHdlIGFsc28gY2xlYXIgdGhlIHRocm90dGxlIHRpbWVvdXQgdG8gcHJldmVudCB0aGUgY2FsbGJhY2tcbiAgICAgICAgICAgIC8vIGZyb20gYmVpbmcgY2FsbGVkIGFnYWluIGFmdGVyIHRoZSB0aW1lb3V0IGZpcmVzXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5wcml2YXRlKGVsLCBUSFJPVFRMRUQpKVxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB0cmlnZ2VyQ3ljbGUoZWwsIGtleSwgY3VycmVudEN5Y2xlKXtcbiAgICBsZXQgW2N5Y2xlLCB0cmlnZ2VyXSA9IHRoaXMucHJpdmF0ZShlbCwga2V5KVxuICAgIGlmKCFjdXJyZW50Q3ljbGUpeyBjdXJyZW50Q3ljbGUgPSBjeWNsZSB9XG4gICAgaWYoY3VycmVudEN5Y2xlID09PSBjeWNsZSl7XG4gICAgICB0aGlzLmluY0N5Y2xlKGVsLCBrZXkpXG4gICAgICB0cmlnZ2VyKClcbiAgICB9XG4gIH0sXG5cbiAgb25jZShlbCwga2V5KXtcbiAgICBpZih0aGlzLnByaXZhdGUoZWwsIGtleSkgPT09IHRydWUpeyByZXR1cm4gZmFsc2UgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB0cnVlKVxuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgaW5jQ3ljbGUoZWwsIGtleSwgdHJpZ2dlciA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICBsZXQgW2N1cnJlbnRDeWNsZV0gPSB0aGlzLnByaXZhdGUoZWwsIGtleSkgfHwgWzAsIHRyaWdnZXJdXG4gICAgY3VycmVudEN5Y2xlKytcbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgW2N1cnJlbnRDeWNsZSwgdHJpZ2dlcl0pXG4gICAgcmV0dXJuIGN1cnJlbnRDeWNsZVxuICB9LFxuXG4gIC8vIG1haW50YWlucyBvciBhZGRzIHByaXZhdGVseSB1c2VkIGhvb2sgaW5mb3JtYXRpb25cbiAgLy8gZnJvbUVsIGFuZCB0b0VsIGNhbiBiZSB0aGUgc2FtZSBlbGVtZW50IGluIHRoZSBjYXNlIG9mIGEgbmV3bHkgYWRkZWQgbm9kZVxuICAvLyBmcm9tRWwgYW5kIHRvRWwgY2FuIGJlIGFueSBIVE1MIG5vZGUgdHlwZSwgc28gd2UgbmVlZCB0byBjaGVjayBpZiBpdCdzIGFuIGVsZW1lbnQgbm9kZVxuICBtYWludGFpblByaXZhdGVIb29rcyhmcm9tRWwsIHRvRWwsIHBoeFZpZXdwb3J0VG9wLCBwaHhWaWV3cG9ydEJvdHRvbSl7XG4gICAgLy8gbWFpbnRhaW4gdGhlIGhvb2tzIGNyZWF0ZWQgd2l0aCBjcmVhdGVIb29rXG4gICAgaWYoZnJvbUVsLmhhc0F0dHJpYnV0ZSAmJiBmcm9tRWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiKSAmJiAhdG9FbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXBoeC1ob29rXCIpKXtcbiAgICAgIHRvRWwuc2V0QXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiLCBmcm9tRWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiKSlcbiAgICB9XG4gICAgLy8gYWRkIGhvb2tzIHRvIGVsZW1lbnRzIHdpdGggdmlld3BvcnQgYXR0cmlidXRlc1xuICAgIGlmKHRvRWwuaGFzQXR0cmlidXRlICYmICh0b0VsLmhhc0F0dHJpYnV0ZShwaHhWaWV3cG9ydFRvcCkgfHwgdG9FbC5oYXNBdHRyaWJ1dGUocGh4Vmlld3BvcnRCb3R0b20pKSl7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgXCJQaG9lbml4LkluZmluaXRlU2Nyb2xsXCIpXG4gICAgfVxuICB9LFxuXG4gIHB1dEN1c3RvbUVsSG9vayhlbCwgaG9vayl7XG4gICAgaWYoZWwuaXNDb25uZWN0ZWQpe1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiLCBcIlwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgICAgaG9vayBhdHRhY2hlZCB0byBub24tY29ubmVjdGVkIERPTSBlbGVtZW50XG4gICAgICAgIGVuc3VyZSB5b3UgYXJlIGNhbGxpbmcgY3JlYXRlSG9vayB3aXRoaW4geW91ciBjb25uZWN0ZWRDYWxsYmFjay4gJHtlbC5vdXRlckhUTUx9XG4gICAgICBgKVxuICAgIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFwiY3VzdG9tLWVsLWhvb2tcIiwgaG9vaylcbiAgfSxcblxuICBnZXRDdXN0b21FbEhvb2soZWwpeyByZXR1cm4gdGhpcy5wcml2YXRlKGVsLCBcImN1c3RvbS1lbC1ob29rXCIpIH0sXG5cbiAgaXNVc2VkSW5wdXQoZWwpe1xuICAgIHJldHVybiAoZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmXG4gICAgICAodGhpcy5wcml2YXRlKGVsLCBQSFhfSEFTX0ZPQ1VTRUQpIHx8IHRoaXMucHJpdmF0ZShlbCwgUEhYX0hBU19TVUJNSVRURUQpKSlcbiAgfSxcblxuICByZXNldEZvcm0oZm9ybSl7XG4gICAgQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKS5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKVxuICAgICAgdGhpcy5kZWxldGVQcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRClcbiAgICB9KVxuICB9LFxuXG4gIGlzUGh4Q2hpbGQobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXG4gIH0sXG5cbiAgaXNQaHhTdGlja3kobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9TVElDS1kpICE9PSBudWxsXG4gIH0sXG5cbiAgaXNDaGlsZE9mQW55KGVsLCBwYXJlbnRzKXtcbiAgICByZXR1cm4gISFwYXJlbnRzLmZpbmQocGFyZW50ID0+IHBhcmVudC5jb250YWlucyhlbCkpXG4gIH0sXG5cbiAgZmlyc3RQaHhDaGlsZChlbCl7XG4gICAgcmV0dXJuIHRoaXMuaXNQaHhDaGlsZChlbCkgPyBlbCA6IHRoaXMuYWxsKGVsLCBgWyR7UEhYX1BBUkVOVF9JRH1dYClbMF1cbiAgfSxcblxuICBkaXNwYXRjaEV2ZW50KHRhcmdldCwgbmFtZSwgb3B0cyA9IHt9KXtcbiAgICBsZXQgZGVmYXVsdEJ1YmJsZSA9IHRydWVcbiAgICBsZXQgaXNVcGxvYWRUYXJnZXQgPSB0YXJnZXQubm9kZU5hbWUgPT09IFwiSU5QVVRcIiAmJiB0YXJnZXQudHlwZSA9PT0gXCJmaWxlXCJcbiAgICBpZihpc1VwbG9hZFRhcmdldCAmJiBuYW1lID09PSBcImNsaWNrXCIpe1xuICAgICAgZGVmYXVsdEJ1YmJsZSA9IGZhbHNlXG4gICAgfVxuICAgIGxldCBidWJibGVzID0gb3B0cy5idWJibGVzID09PSB1bmRlZmluZWQgPyBkZWZhdWx0QnViYmxlIDogISFvcHRzLmJ1YmJsZXNcbiAgICBsZXQgZXZlbnRPcHRzID0ge2J1YmJsZXM6IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUsIGRldGFpbDogb3B0cy5kZXRhaWwgfHwge319XG4gICAgbGV0IGV2ZW50ID0gbmFtZSA9PT0gXCJjbGlja1wiID8gbmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiLCBldmVudE9wdHMpIDogbmV3IEN1c3RvbUV2ZW50KG5hbWUsIGV2ZW50T3B0cylcbiAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgfSxcblxuICBjbG9uZU5vZGUobm9kZSwgaHRtbCl7XG4gICAgaWYodHlwZW9mIChodG1sKSA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICByZXR1cm4gbm9kZS5jbG9uZU5vZGUodHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNsb25lZCA9IG5vZGUuY2xvbmVOb2RlKGZhbHNlKVxuICAgICAgY2xvbmVkLmlubmVySFRNTCA9IGh0bWxcbiAgICAgIHJldHVybiBjbG9uZWRcbiAgICB9XG4gIH0sXG5cbiAgLy8gbWVyZ2UgYXR0cmlidXRlcyBmcm9tIHNvdXJjZSB0byB0YXJnZXRcbiAgLy8gaWYgYW4gZWxlbWVudCBpcyBpZ25vcmVkLCB3ZSBvbmx5IG1lcmdlIGRhdGEgYXR0cmlidXRlc1xuICAvLyBpbmNsdWRpbmcgcmVtb3ZpbmcgZGF0YSBhdHRyaWJ1dGVzIHRoYXQgYXJlIG5vIGxvbmdlciBpbiB0aGUgc291cmNlXG4gIG1lcmdlQXR0cnModGFyZ2V0LCBzb3VyY2UsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV4Y2x1ZGUgPSBuZXcgU2V0KG9wdHMuZXhjbHVkZSB8fCBbXSlcbiAgICBsZXQgaXNJZ25vcmVkID0gb3B0cy5pc0lnbm9yZWRcbiAgICBsZXQgc291cmNlQXR0cnMgPSBzb3VyY2UuYXR0cmlidXRlc1xuICAgIGZvcihsZXQgaSA9IHNvdXJjZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcbiAgICAgIGxldCBuYW1lID0gc291cmNlQXR0cnNbaV0ubmFtZVxuICAgICAgaWYoIWV4Y2x1ZGUuaGFzKG5hbWUpKXtcbiAgICAgICAgY29uc3Qgc291cmNlVmFsdWUgPSBzb3VyY2UuZ2V0QXR0cmlidXRlKG5hbWUpXG4gICAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUobmFtZSkgIT09IHNvdXJjZVZhbHVlICYmICghaXNJZ25vcmVkIHx8IChpc0lnbm9yZWQgJiYgbmFtZS5zdGFydHNXaXRoKFwiZGF0YS1cIikpKSl7XG4gICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShuYW1lLCBzb3VyY2VWYWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgZXhjbHVkZSB0aGUgdmFsdWUgZnJvbSBiZWluZyBtZXJnZWQgb24gZm9jdXNlZCBpbnB1dHMsIGJlY2F1c2UgdGhlXG4gICAgICAgIC8vIHVzZXIncyBpbnB1dCBzaG91bGQgYWx3YXlzIHdpbi5cbiAgICAgICAgLy8gV2UgY2FuIHN0aWxsIGFzc2lnbiBpdCBhcyBsb25nIGFzIHRoZSB2YWx1ZSBwcm9wZXJ0eSBpcyB0aGUgc2FtZSwgdGhvdWdoLlxuICAgICAgICAvLyBUaGlzIHByZXZlbnRzIGEgc2l0dWF0aW9uIHdoZXJlIHRoZSB1cGRhdGVkIGhvb2sgaXMgbm90IGJlaW5nIHRyaWdnZXJlZFxuICAgICAgICAvLyB3aGVuIGFuIGlucHV0IGlzIGJhY2sgaW4gaXRzIFwib3JpZ2luYWwgc3RhdGVcIiwgYmVjYXVzZSB0aGUgYXR0cmlidXRlXG4gICAgICAgIC8vIHdhcyBuZXZlciBjaGFuZ2VkLCBzZWU6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8yMTYzXG4gICAgICAgIGlmKG5hbWUgPT09IFwidmFsdWVcIiAmJiB0YXJnZXQudmFsdWUgPT09IHNvdXJjZS52YWx1ZSl7XG4gICAgICAgICAgLy8gYWN0dWFsbHkgc2V0IHRoZSB2YWx1ZSBhdHRyaWJ1dGUgdG8gc3luYyBpdCB3aXRoIHRoZSB2YWx1ZSBwcm9wZXJ0eVxuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBzb3VyY2UuZ2V0QXR0cmlidXRlKG5hbWUpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRhcmdldEF0dHJzID0gdGFyZ2V0LmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSB0YXJnZXRBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHRhcmdldEF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKGlzSWdub3JlZCl7XG4gICAgICAgIGlmKG5hbWUuc3RhcnRzV2l0aChcImRhdGEtXCIpICYmICFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpICYmICFQSFhfUEVORElOR19BVFRSUy5pbmNsdWRlcyhuYW1lKSl7IHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUobmFtZSkgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWVyZ2VGb2N1c2VkSW5wdXQodGFyZ2V0LCBzb3VyY2Upe1xuICAgIC8vIHNraXAgc2VsZWN0cyBiZWNhdXNlIEZGIHdpbGwgcmVzZXQgaGlnaGxpZ2h0ZWQgaW5kZXggZm9yIGFueSBzZXRBdHRyaWJ1dGVcbiAgICBpZighKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSl7IERPTS5tZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCB7ZXhjbHVkZTogW1widmFsdWVcIl19KSB9XG5cbiAgICBpZihzb3VyY2UucmVhZE9ubHkpe1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKVxuICAgIH1cbiAgfSxcblxuICBoYXNTZWxlY3Rpb25SYW5nZShlbCl7XG4gICAgcmV0dXJuIGVsLnNldFNlbGVjdGlvblJhbmdlICYmIChlbC50eXBlID09PSBcInRleHRcIiB8fCBlbC50eXBlID09PSBcInRleHRhcmVhXCIpXG4gIH0sXG5cbiAgcmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpe1xuICAgIGlmKGZvY3VzZWQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCl7IGZvY3VzZWQuZm9jdXMoKSB9XG4gICAgaWYoIURPTS5pc1RleHR1YWxJbnB1dChmb2N1c2VkKSl7IHJldHVybiB9XG5cbiAgICBsZXQgd2FzRm9jdXNlZCA9IGZvY3VzZWQubWF0Y2hlcyhcIjpmb2N1c1wiKVxuICAgIGlmKCF3YXNGb2N1c2VkKXsgZm9jdXNlZC5mb2N1cygpIH1cbiAgICBpZih0aGlzLmhhc1NlbGVjdGlvblJhbmdlKGZvY3VzZWQpKXtcbiAgICAgIGZvY3VzZWQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZClcbiAgICB9XG4gIH0sXG5cbiAgaXNGb3JtSW5wdXQoZWwpeyByZXR1cm4gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QoZWwudGFnTmFtZSkgJiYgZWwudHlwZSAhPT0gXCJidXR0b25cIiB9LFxuXG4gIHN5bmNBdHRyc1RvUHJvcHMoZWwpe1xuICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBDSEVDS0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+PSAwKXtcbiAgICAgIGVsLmNoZWNrZWQgPSBlbC5nZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIpICE9PSBudWxsXG4gICAgfVxuICB9LFxuXG4gIGlzVGV4dHVhbElucHV0KGVsKXsgcmV0dXJuIEZPQ1VTQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwIH0sXG5cbiAgaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFRyaWdnZXJFeHRlcm5hbCkgIT09IG51bGwgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyhlbClcbiAgfSxcblxuICBjbGVhbkNoaWxkTm9kZXMoY29udGFpbmVyLCBwaHhVcGRhdGUpe1xuICAgIGlmKERPTS5pc1BoeFVwZGF0ZShjb250YWluZXIsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgbGV0IHRvUmVtb3ZlID0gW11cbiAgICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgICAgaWYoIWNoaWxkTm9kZS5pZCl7XG4gICAgICAgICAgLy8gU2tpcCB3YXJuaW5nIGlmIGl0J3MgYW4gZW1wdHkgdGV4dCBub2RlIChlLmcuIGEgbmV3LWxpbmUpXG4gICAgICAgICAgbGV0IGlzRW1wdHlUZXh0Tm9kZSA9IGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgY2hpbGROb2RlLm5vZGVWYWx1ZS50cmltKCkgPT09IFwiXCJcbiAgICAgICAgICBpZighaXNFbXB0eVRleHROb2RlICYmIGNoaWxkTm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5DT01NRU5UX05PREUpe1xuICAgICAgICAgICAgbG9nRXJyb3IoXCJvbmx5IEhUTUwgZWxlbWVudCB0YWdzIHdpdGggYW4gaWQgYXJlIGFsbG93ZWQgaW5zaWRlIGNvbnRhaW5lcnMgd2l0aCBwaHgtdXBkYXRlLlxcblxcblwiICtcbiAgICAgICAgICAgICAgYHJlbW92aW5nIGlsbGVnYWwgbm9kZTogXCIkeyhjaGlsZE5vZGUub3V0ZXJIVE1MIHx8IGNoaWxkTm9kZS5ub2RlVmFsdWUpLnRyaW0oKX1cIlxcblxcbmApXG4gICAgICAgICAgfVxuICAgICAgICAgIHRvUmVtb3ZlLnB1c2goY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdG9SZW1vdmUuZm9yRWFjaChjaGlsZE5vZGUgPT4gY2hpbGROb2RlLnJlbW92ZSgpKVxuICAgIH1cbiAgfSxcblxuICByZXBsYWNlUm9vdENvbnRhaW5lcihjb250YWluZXIsIHRhZ05hbWUsIGF0dHJzKXtcbiAgICBsZXQgcmV0YWluZWRBdHRycyA9IG5ldyBTZXQoW1wiaWRcIiwgUEhYX1NFU1NJT04sIFBIWF9TVEFUSUMsIFBIWF9NQUlOLCBQSFhfUk9PVF9JRF0pXG4gICAgaWYoY29udGFpbmVyLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpKXtcbiAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLmF0dHJpYnV0ZXMpXG4gICAgICAgIC5maWx0ZXIoYXR0ciA9PiAhcmV0YWluZWRBdHRycy5oYXMoYXR0ci5uYW1lLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAuZm9yRWFjaChhdHRyID0+IGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKSlcblxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAgIC5maWx0ZXIobmFtZSA9PiAhcmV0YWluZWRBdHRycy5oYXMobmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcblxuICAgICAgcmV0dXJuIGNvbnRhaW5lclxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpXG4gICAgICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cnNbYXR0cl0pKVxuICAgICAgcmV0YWluZWRBdHRycy5mb3JFYWNoKGF0dHIgPT4gbmV3Q29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBjb250YWluZXIuZ2V0QXR0cmlidXRlKGF0dHIpKSlcbiAgICAgIG5ld0NvbnRhaW5lci5pbm5lckhUTUwgPSBjb250YWluZXIuaW5uZXJIVE1MXG4gICAgICBjb250YWluZXIucmVwbGFjZVdpdGgobmV3Q29udGFpbmVyKVxuICAgICAgcmV0dXJuIG5ld0NvbnRhaW5lclxuICAgIH1cbiAgfSxcblxuICBnZXRTdGlja3koZWwsIG5hbWUsIGRlZmF1bHRWYWwpe1xuICAgIGxldCBvcCA9IChET00ucHJpdmF0ZShlbCwgXCJzdGlja3lcIikgfHwgW10pLmZpbmQoKFtleGlzdGluZ05hbWUsXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgIGlmKG9wKXtcbiAgICAgIGxldCBbX25hbWUsIF9vcCwgc3Rhc2hlZFJlc3VsdF0gPSBvcFxuICAgICAgcmV0dXJuIHN0YXNoZWRSZXN1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHR5cGVvZihkZWZhdWx0VmFsKSA9PT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxuICAgIH1cbiAgfSxcblxuICBkZWxldGVTdGlja3koZWwsIG5hbWUpe1xuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICByZXR1cm4gb3BzLmZpbHRlcigoW2V4aXN0aW5nTmFtZSwgX10pID0+IGV4aXN0aW5nTmFtZSAhPT0gbmFtZSlcbiAgICB9KVxuICB9LFxuXG4gIHB1dFN0aWNreShlbCwgbmFtZSwgb3Ape1xuICAgIGxldCBzdGFzaGVkUmVzdWx0ID0gb3AoZWwpXG4gICAgdGhpcy51cGRhdGVQcml2YXRlKGVsLCBcInN0aWNreVwiLCBbXSwgb3BzID0+IHtcbiAgICAgIGxldCBleGlzdGluZ0luZGV4ID0gb3BzLmZpbmRJbmRleCgoW2V4aXN0aW5nTmFtZSxdKSA9PiBuYW1lID09PSBleGlzdGluZ05hbWUpXG4gICAgICBpZihleGlzdGluZ0luZGV4ID49IDApe1xuICAgICAgICBvcHNbZXhpc3RpbmdJbmRleF0gPSBbbmFtZSwgb3AsIHN0YXNoZWRSZXN1bHRdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHMucHVzaChbbmFtZSwgb3AsIHN0YXNoZWRSZXN1bHRdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9wc1xuICAgIH0pXG4gIH0sXG5cbiAgYXBwbHlTdGlja3lPcGVyYXRpb25zKGVsKXtcbiAgICBsZXQgb3BzID0gRE9NLnByaXZhdGUoZWwsIFwic3RpY2t5XCIpXG4gICAgaWYoIW9wcyl7IHJldHVybiB9XG5cbiAgICBvcHMuZm9yRWFjaCgoW25hbWUsIG9wLCBfc3Rhc2hlZF0pID0+IHRoaXMucHV0U3RpY2t5KGVsLCBuYW1lLCBvcCkpXG4gIH0sXG5cbiAgaXNMb2NrZWQoZWwpe1xuICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUgJiYgZWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBET01cbiIsICJpbXBvcnQge1xuICBQSFhfQUNUSVZFX0VOVFJZX1JFRlMsXG4gIFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2hhbm5lbFVwbG9hZGVyLFxuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVwbG9hZEVudHJ5IHtcbiAgc3RhdGljIGlzQWN0aXZlKGZpbGVFbCwgZmlsZSl7XG4gICAgbGV0IGlzTmV3ID0gZmlsZS5fcGh4UmVmID09PSB1bmRlZmluZWRcbiAgICBsZXQgYWN0aXZlUmVmcyA9IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNBY3RpdmUgPSBhY3RpdmVSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDBcbiAgICByZXR1cm4gZmlsZS5zaXplID4gMCAmJiAoaXNOZXcgfHwgaXNBY3RpdmUpXG4gIH1cblxuICBzdGF0aWMgaXNQcmVmbGlnaHRlZChmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBwcmVmbGlnaHRlZFJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNQcmVmbGlnaHRlZCA9IHByZWZsaWdodGVkUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGlzUHJlZmxpZ2h0ZWQgJiYgdGhpcy5pc0FjdGl2ZShmaWxlRWwsIGZpbGUpXG4gIH1cblxuICBzdGF0aWMgaXNQcmVmbGlnaHRJblByb2dyZXNzKGZpbGUpe1xuICAgIHJldHVybiBmaWxlLl9wcmVmbGlnaHRJblByb2dyZXNzID09PSB0cnVlXG4gIH1cblxuICBzdGF0aWMgbWFya1ByZWZsaWdodEluUHJvZ3Jlc3MoZmlsZSl7XG4gICAgZmlsZS5fcHJlZmxpZ2h0SW5Qcm9ncmVzcyA9IHRydWVcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGZpbGVFbCwgZmlsZSwgdmlldywgYXV0b1VwbG9hZCl7XG4gICAgdGhpcy5yZWYgPSBMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKVxuICAgIHRoaXMuZmlsZUVsID0gZmlsZUVsXG4gICAgdGhpcy5maWxlID0gZmlsZVxuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm1ldGEgPSBudWxsXG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSBmYWxzZVxuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlXG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSAwXG4gICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IC0xXG4gICAgdGhpcy5fb25Eb25lID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMuX29uRWxVcGRhdGVkID0gdGhpcy5vbkVsVXBkYXRlZC5iaW5kKHRoaXMpXG4gICAgdGhpcy5maWxlRWwuYWRkRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICAgIHRoaXMuYXV0b1VwbG9hZCA9IGF1dG9VcGxvYWRcbiAgfVxuXG4gIG1ldGFkYXRhKCl7IHJldHVybiB0aGlzLm1ldGEgfVxuXG4gIHByb2dyZXNzKHByb2dyZXNzKXtcbiAgICB0aGlzLl9wcm9ncmVzcyA9IE1hdGguZmxvb3IocHJvZ3Jlc3MpXG4gICAgaWYodGhpcy5fcHJvZ3Jlc3MgPiB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50KXtcbiAgICAgIGlmKHRoaXMuX3Byb2dyZXNzID49IDEwMCl7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gMTAwXG4gICAgICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAxMDBcbiAgICAgICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgICAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIDEwMCwgKCkgPT4ge1xuICAgICAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKVxuICAgICAgICAgIHRoaXMuX29uRG9uZSgpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gdGhpcy5fcHJvZ3Jlc3NcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCB0aGlzLl9wcm9ncmVzcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0NhbmNlbGxlZCgpeyByZXR1cm4gdGhpcy5faXNDYW5jZWxsZWQgfVxuXG4gIGNhbmNlbCgpe1xuICAgIHRoaXMuZmlsZS5fcHJlZmxpZ2h0SW5Qcm9ncmVzcyA9IGZhbHNlXG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSB0cnVlXG4gICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgIHRoaXMuX29uRG9uZSgpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMuX2lzRG9uZSB9XG5cbiAgZXJyb3IocmVhc29uID0gXCJmYWlsZWRcIil7XG4gICAgdGhpcy5maWxlRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwge2Vycm9yOiByZWFzb259KVxuICAgIGlmKCF0aGlzLmlzQXV0b1VwbG9hZCgpKXsgTGl2ZVVwbG9hZGVyLmNsZWFyRmlsZXModGhpcy5maWxlRWwpIH1cbiAgfVxuXG4gIGlzQXV0b1VwbG9hZCgpeyByZXR1cm4gdGhpcy5hdXRvVXBsb2FkIH1cblxuICAvL3ByaXZhdGVcblxuICBvbkRvbmUoY2FsbGJhY2spe1xuICAgIHRoaXMuX29uRG9uZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBvbkVsVXBkYXRlZCgpe1xuICAgIGxldCBhY3RpdmVSZWZzID0gdGhpcy5maWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgaWYoYWN0aXZlUmVmcy5pbmRleE9mKHRoaXMucmVmKSA9PT0gLTEpe1xuICAgICAgTGl2ZVVwbG9hZGVyLnVudHJhY2tGaWxlKHRoaXMuZmlsZUVsLCB0aGlzLmZpbGUpXG4gICAgICB0aGlzLmNhbmNlbCgpXG4gICAgfVxuICB9XG5cbiAgdG9QcmVmbGlnaHRQYXlsb2FkKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhc3RfbW9kaWZpZWQ6IHRoaXMuZmlsZS5sYXN0TW9kaWZpZWQsXG4gICAgICBuYW1lOiB0aGlzLmZpbGUubmFtZSxcbiAgICAgIHJlbGF0aXZlX3BhdGg6IHRoaXMuZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGgsXG4gICAgICBzaXplOiB0aGlzLmZpbGUuc2l6ZSxcbiAgICAgIHR5cGU6IHRoaXMuZmlsZS50eXBlLFxuICAgICAgcmVmOiB0aGlzLnJlZixcbiAgICAgIG1ldGE6IHR5cGVvZih0aGlzLmZpbGUubWV0YSkgPT09IFwiZnVuY3Rpb25cIiA/IHRoaXMuZmlsZS5tZXRhKCkgOiB1bmRlZmluZWRcbiAgICB9XG4gIH1cblxuICB1cGxvYWRlcih1cGxvYWRlcnMpe1xuICAgIGlmKHRoaXMubWV0YS51cGxvYWRlcil7XG4gICAgICBsZXQgY2FsbGJhY2sgPSB1cGxvYWRlcnNbdGhpcy5tZXRhLnVwbG9hZGVyXSB8fCBsb2dFcnJvcihgbm8gdXBsb2FkZXIgY29uZmlndXJlZCBmb3IgJHt0aGlzLm1ldGEudXBsb2FkZXJ9YClcbiAgICAgIHJldHVybiB7bmFtZTogdGhpcy5tZXRhLnVwbG9hZGVyLCBjYWxsYmFjazogY2FsbGJhY2t9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7bmFtZTogXCJjaGFubmVsXCIsIGNhbGxiYWNrOiBjaGFubmVsVXBsb2FkZXJ9XG4gICAgfVxuICB9XG5cbiAgemlwUG9zdEZsaWdodChyZXNwKXtcbiAgICB0aGlzLm1ldGEgPSByZXNwLmVudHJpZXNbdGhpcy5yZWZdXG4gICAgaWYoIXRoaXMubWV0YSl7IGxvZ0Vycm9yKGBubyBwcmVmbGlnaHQgdXBsb2FkIHJlc3BvbnNlIHJldHVybmVkIHdpdGggcmVmICR7dGhpcy5yZWZ9YCwge2lucHV0OiB0aGlzLmZpbGVFbCwgcmVzcG9uc2U6IHJlc3B9KSB9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBQSFhfRE9ORV9SRUZTLFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgVXBsb2FkRW50cnkgZnJvbSBcIi4vdXBsb2FkX2VudHJ5XCJcblxubGV0IGxpdmVVcGxvYWRlckZpbGVSZWYgPSAwXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVVcGxvYWRlciB7XG4gIHN0YXRpYyBnZW5GaWxlUmVmKGZpbGUpe1xuICAgIGxldCByZWYgPSBmaWxlLl9waHhSZWZcbiAgICBpZihyZWYgIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gcmVmXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGUuX3BoeFJlZiA9IChsaXZlVXBsb2FkZXJGaWxlUmVmKyspLnRvU3RyaW5nKClcbiAgICAgIHJldHVybiBmaWxlLl9waHhSZWZcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0RW50cnlEYXRhVVJMKGlucHV0RWwsIHJlZiwgY2FsbGJhY2spe1xuICAgIGxldCBmaWxlID0gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKGZpbGUgPT4gdGhpcy5nZW5GaWxlUmVmKGZpbGUpID09PSByZWYpXG4gICAgY2FsbGJhY2soVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSlcbiAgfVxuXG4gIHN0YXRpYyBoYXNVcGxvYWRzSW5Qcm9ncmVzcyhmb3JtRWwpe1xuICAgIGxldCBhY3RpdmUgPSAwXG4gICAgRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKS5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykgIT09IGlucHV0LmdldEF0dHJpYnV0ZShQSFhfRE9ORV9SRUZTKSl7XG4gICAgICAgIGFjdGl2ZSsrXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWN0aXZlID4gMFxuICB9XG5cbiAgc3RhdGljIHNlcmlhbGl6ZVVwbG9hZHMoaW5wdXRFbCl7XG4gICAgbGV0IGZpbGVzID0gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKVxuICAgIGxldCBmaWxlRGF0YSA9IHt9XG4gICAgZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgIGxldCBlbnRyeSA9IHtwYXRoOiBpbnB1dEVsLm5hbWV9XG4gICAgICBsZXQgdXBsb2FkUmVmID0gaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpXG4gICAgICBmaWxlRGF0YVt1cGxvYWRSZWZdID0gZmlsZURhdGFbdXBsb2FkUmVmXSB8fCBbXVxuICAgICAgZW50cnkucmVmID0gdGhpcy5nZW5GaWxlUmVmKGZpbGUpXG4gICAgICBlbnRyeS5sYXN0X21vZGlmaWVkID0gZmlsZS5sYXN0TW9kaWZpZWRcbiAgICAgIGVudHJ5Lm5hbWUgPSBmaWxlLm5hbWUgfHwgZW50cnkucmVmXG4gICAgICBlbnRyeS5yZWxhdGl2ZV9wYXRoID0gZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGhcbiAgICAgIGVudHJ5LnR5cGUgPSBmaWxlLnR5cGVcbiAgICAgIGVudHJ5LnNpemUgPSBmaWxlLnNpemVcbiAgICAgIGlmKHR5cGVvZihmaWxlLm1ldGEpID09PSBcImZ1bmN0aW9uXCIpeyBlbnRyeS5tZXRhID0gZmlsZS5tZXRhKCkgfVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXS5wdXNoKGVudHJ5KVxuICAgIH0pXG4gICAgcmV0dXJuIGZpbGVEYXRhXG4gIH1cblxuICBzdGF0aWMgY2xlYXJGaWxlcyhpbnB1dEVsKXtcbiAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIGlucHV0RWwucmVtb3ZlQXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgW10pXG4gIH1cblxuICBzdGF0aWMgdW50cmFja0ZpbGUoaW5wdXRFbCwgZmlsZSl7XG4gICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBET00ucHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIpLmZpbHRlcihmID0+ICFPYmplY3QuaXMoZiwgZmlsZSkpKVxuICB9XG5cbiAgc3RhdGljIHRyYWNrRmlsZXMoaW5wdXRFbCwgZmlsZXMsIGRhdGFUcmFuc2Zlcil7XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSAhPT0gbnVsbCl7XG4gICAgICBsZXQgbmV3RmlsZXMgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiAhdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKGYgPT4gT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgICAgIERPTS51cGRhdGVQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgW10sIChleGlzdGluZykgPT4gZXhpc3RpbmcuY29uY2F0KG5ld0ZpbGVzKSlcbiAgICAgIGlucHV0RWwudmFsdWUgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlc2V0IGlucHV0RWwgZmlsZXMgdG8gYWxpZ24gb3V0cHV0IHdpdGggcHJvZ3JhbW1hdGljIGNoYW5nZXMgKGkuZS4gZHJhZyBhbmQgZHJvcClcbiAgICAgIGlmKGRhdGFUcmFuc2ZlciAmJiBkYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoID4gMCl7IGlucHV0RWwuZmlsZXMgPSBkYXRhVHJhbnNmZXIuZmlsZXMgfVxuICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBmaWxlcylcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYWN0aXZlRmlsZUlucHV0cyhmb3JtRWwpe1xuICAgIGxldCBmaWxlSW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKVxuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dHMpLmZpbHRlcihlbCA9PiBlbC5maWxlcyAmJiB0aGlzLmFjdGl2ZUZpbGVzKGVsKS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVzKGlucHV0KXtcbiAgICByZXR1cm4gKERPTS5wcml2YXRlKGlucHV0LCBcImZpbGVzXCIpIHx8IFtdKS5maWx0ZXIoZiA9PiBVcGxvYWRFbnRyeS5pc0FjdGl2ZShpbnB1dCwgZikpXG4gIH1cblxuICBzdGF0aWMgaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoaW5wdXQgPT4gdGhpcy5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXQpe1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0KS5maWx0ZXIoZiA9PiAhVXBsb2FkRW50cnkuaXNQcmVmbGlnaHRlZChpbnB1dCwgZikgJiYgIVVwbG9hZEVudHJ5LmlzUHJlZmxpZ2h0SW5Qcm9ncmVzcyhmKSlcbiAgfVxuXG4gIHN0YXRpYyBtYXJrUHJlZmxpZ2h0SW5Qcm9ncmVzcyhlbnRyaWVzKXtcbiAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4gVXBsb2FkRW50cnkubWFya1ByZWZsaWdodEluUHJvZ3Jlc3MoZW50cnkuZmlsZSkpXG4gIH1cblxuICBjb25zdHJ1Y3RvcihpbnB1dEVsLCB2aWV3LCBvbkNvbXBsZXRlKXtcbiAgICB0aGlzLmF1dG9VcGxvYWQgPSBET00uaXNBdXRvVXBsb2FkKGlucHV0RWwpXG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMub25Db21wbGV0ZSA9IG9uQ29tcGxldGVcbiAgICB0aGlzLl9lbnRyaWVzID1cbiAgICAgIEFycmF5LmZyb20oTGl2ZVVwbG9hZGVyLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXRFbCkgfHwgW10pXG4gICAgICAgIC5tYXAoZmlsZSA9PiBuZXcgVXBsb2FkRW50cnkoaW5wdXRFbCwgZmlsZSwgdmlldywgdGhpcy5hdXRvVXBsb2FkKSlcblxuICAgIC8vIHByZXZlbnQgc2VuZGluZyBkdXBsaWNhdGUgcHJlZmxpZ2h0IHJlcXVlc3RzXG4gICAgTGl2ZVVwbG9hZGVyLm1hcmtQcmVmbGlnaHRJblByb2dyZXNzKHRoaXMuX2VudHJpZXMpXG5cbiAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzID0gdGhpcy5fZW50cmllcy5sZW5ndGhcbiAgfVxuXG4gIGlzQXV0b1VwbG9hZCgpeyByZXR1cm4gdGhpcy5hdXRvVXBsb2FkIH1cblxuICBlbnRyaWVzKCl7IHJldHVybiB0aGlzLl9lbnRyaWVzIH1cblxuICBpbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCBsaXZlU29ja2V0KXtcbiAgICB0aGlzLl9lbnRyaWVzID1cbiAgICAgIHRoaXMuX2VudHJpZXMubWFwKGVudHJ5ID0+IHtcbiAgICAgICAgaWYoZW50cnkuaXNDYW5jZWxsZWQoKSl7XG4gICAgICAgICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcy0tXG4gICAgICAgICAgaWYodGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9PT0gMCl7IHRoaXMub25Db21wbGV0ZSgpIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnRyeS56aXBQb3N0RmxpZ2h0KHJlc3ApXG4gICAgICAgICAgZW50cnkub25Eb25lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MtLVxuICAgICAgICAgICAgaWYodGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9PT0gMCl7IHRoaXMub25Db21wbGV0ZSgpIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnRyeVxuICAgICAgfSlcblxuICAgIGxldCBncm91cGVkRW50cmllcyA9IHRoaXMuX2VudHJpZXMucmVkdWNlKChhY2MsIGVudHJ5KSA9PiB7XG4gICAgICBpZighZW50cnkubWV0YSl7IHJldHVybiBhY2MgfVxuICAgICAgbGV0IHtuYW1lLCBjYWxsYmFja30gPSBlbnRyeS51cGxvYWRlcihsaXZlU29ja2V0LnVwbG9hZGVycylcbiAgICAgIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSB8fCB7Y2FsbGJhY2s6IGNhbGxiYWNrLCBlbnRyaWVzOiBbXX1cbiAgICAgIGFjY1tuYW1lXS5lbnRyaWVzLnB1c2goZW50cnkpXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG5cbiAgICBmb3IobGV0IG5hbWUgaW4gZ3JvdXBlZEVudHJpZXMpe1xuICAgICAgbGV0IHtjYWxsYmFjaywgZW50cmllc30gPSBncm91cGVkRW50cmllc1tuYW1lXVxuICAgICAgY2FsbGJhY2soZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldClcbiAgICB9XG4gIH1cbn1cbiIsICJsZXQgQVJJQSA9IHtcbiAgYW55T2YoaW5zdGFuY2UsIGNsYXNzZXMpeyByZXR1cm4gY2xhc3Nlcy5maW5kKG5hbWUgPT4gaW5zdGFuY2UgaW5zdGFuY2VvZiBuYW1lKSB9LFxuXG4gIGlzRm9jdXNhYmxlKGVsLCBpbnRlcmFjdGl2ZU9ubHkpe1xuICAgIHJldHVybiAoXG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBlbC5yZWwgIT09IFwiaWdub3JlXCIpIHx8XG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MQXJlYUVsZW1lbnQgJiYgZWwuaHJlZiAhPT0gdW5kZWZpbmVkKSB8fFxuICAgICAgKCFlbC5kaXNhYmxlZCAmJiAodGhpcy5hbnlPZihlbCwgW0hUTUxJbnB1dEVsZW1lbnQsIEhUTUxTZWxlY3RFbGVtZW50LCBIVE1MVGV4dEFyZWFFbGVtZW50LCBIVE1MQnV0dG9uRWxlbWVudF0pKSkgfHxcbiAgICAgIChlbCBpbnN0YW5jZW9mIEhUTUxJRnJhbWVFbGVtZW50KSB8fFxuICAgICAgKGVsLnRhYkluZGV4ID4gMCB8fCAoIWludGVyYWN0aXZlT25seSAmJiBlbC5nZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSAhPT0gbnVsbCAmJiBlbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSAhPT0gXCJ0cnVlXCIpKVxuICAgIClcbiAgfSxcblxuICBhdHRlbXB0Rm9jdXMoZWwsIGludGVyYWN0aXZlT25seSl7XG4gICAgaWYodGhpcy5pc0ZvY3VzYWJsZShlbCwgaW50ZXJhY3RpdmVPbmx5KSl7IHRyeSB7IGVsLmZvY3VzKCkgfSBjYXRjaCB7fSB9XG4gICAgcmV0dXJuICEhZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZWwpXG4gIH0sXG5cbiAgZm9jdXNGaXJzdEludGVyYWN0aXZlKGVsKXtcbiAgICBsZXQgY2hpbGQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkLCB0cnVlKSB8fCB0aGlzLmZvY3VzRmlyc3RJbnRlcmFjdGl2ZShjaGlsZCwgdHJ1ZSkpe1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICB9XG4gIH0sXG5cbiAgZm9jdXNGaXJzdChlbCl7XG4gICAgbGV0IGNoaWxkID0gZWwuZmlyc3RFbGVtZW50Q2hpbGRcbiAgICB3aGlsZShjaGlsZCl7XG4gICAgICBpZih0aGlzLmF0dGVtcHRGb2N1cyhjaGlsZCkgfHwgdGhpcy5mb2N1c0ZpcnN0KGNoaWxkKSl7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfSxcblxuICBmb2N1c0xhc3QoZWwpe1xuICAgIGxldCBjaGlsZCA9IGVsLmxhc3RFbGVtZW50Q2hpbGRcbiAgICB3aGlsZShjaGlsZCl7XG4gICAgICBpZih0aGlzLmF0dGVtcHRGb2N1cyhjaGlsZCkgfHwgdGhpcy5mb2N1c0xhc3QoY2hpbGQpKXtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIGNoaWxkID0gY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQVJJQVxuIiwgImltcG9ydCB7XG4gIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyxcbiAgUEhYX0xJVkVfRklMRV9VUERBVEVELFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcbmltcG9ydCBBUklBIGZyb20gXCIuL2FyaWFcIlxuXG5sZXQgSG9va3MgPSB7XG4gIExpdmVGaWxlVXBsb2FkOiB7XG4gICAgYWN0aXZlUmVmcygpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKSB9LFxuXG4gICAgcHJlZmxpZ2h0ZWRSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykgfSxcblxuICAgIG1vdW50ZWQoKXsgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IHRoaXMucHJlZmxpZ2h0ZWRSZWZzKCkgfSxcblxuICAgIHVwZGF0ZWQoKXtcbiAgICAgIGxldCBuZXdQcmVmbGlnaHRzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKVxuICAgICAgaWYodGhpcy5wcmVmbGlnaHRlZFdhcyAhPT0gbmV3UHJlZmxpZ2h0cyl7XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSBuZXdQcmVmbGlnaHRzXG4gICAgICAgIGlmKG5ld1ByZWZsaWdodHMgPT09IFwiXCIpe1xuICAgICAgICAgIHRoaXMuX192aWV3KCkuY2FuY2VsU3VibWl0KHRoaXMuZWwuZm9ybSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmFjdGl2ZVJlZnMoKSA9PT0gXCJcIil7IHRoaXMuZWwudmFsdWUgPSBudWxsIH1cbiAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoUEhYX0xJVkVfRklMRV9VUERBVEVEKSlcbiAgICB9XG4gIH0sXG5cbiAgTGl2ZUltZ1ByZXZpZXc6IHtcbiAgICBtb3VudGVkKCl7XG4gICAgICB0aGlzLnJlZiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtZW50cnktcmVmXCIpXG4gICAgICB0aGlzLmlucHV0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRikpXG4gICAgICBMaXZlVXBsb2FkZXIuZ2V0RW50cnlEYXRhVVJMKHRoaXMuaW5wdXRFbCwgdGhpcy5yZWYsIHVybCA9PiB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsXG4gICAgICAgIHRoaXMuZWwuc3JjID0gdXJsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZGVzdHJveWVkKCl7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHRoaXMudXJsKVxuICAgIH1cbiAgfSxcbiAgRm9jdXNXcmFwOiB7XG4gICAgbW91bnRlZCgpe1xuICAgICAgdGhpcy5mb2N1c1N0YXJ0ID0gdGhpcy5lbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgICAgdGhpcy5mb2N1c0VuZCA9IHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgICAgdGhpcy5mb2N1c1N0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICBpZighZS5yZWxhdGVkVGFyZ2V0IHx8ICF0aGlzLmVsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpeyBcbiAgICAgICAgICAvLyBIYW5kbGUgZm9jdXMgZW50ZXJpbmcgZnJvbSBvdXRzaWRlIChlLmcuIFRhYiB3aGVuIGJvZHkgaXMgZm9jdXNlZClcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzYzNlxuICAgICAgICAgIGNvbnN0IG5leHRGb2N1cyA9IGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZ1xuICAgICAgICAgIEFSSUEuYXR0ZW1wdEZvY3VzKG5leHRGb2N1cykgfHwgQVJJQS5mb2N1c0ZpcnN0KG5leHRGb2N1cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBBUklBLmZvY3VzTGFzdCh0aGlzLmVsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5mb2N1c0VuZC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKGUpID0+IHtcbiAgICAgICAgaWYoIWUucmVsYXRlZFRhcmdldCB8fCAhdGhpcy5lbC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQpKXsgXG4gICAgICAgICAgLy8gSGFuZGxlIGZvY3VzIGVudGVyaW5nIGZyb20gb3V0c2lkZSAoZS5nLiBTaGlmdCtUYWIgd2hlbiBib2R5IGlzIGZvY3VzZWQpXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM2MzZcbiAgICAgICAgICBjb25zdCBuZXh0Rm9jdXMgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgICAgICAgQVJJQS5hdHRlbXB0Rm9jdXMobmV4dEZvY3VzKSB8fCBBUklBLmZvY3VzTGFzdChuZXh0Rm9jdXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQVJJQS5mb2N1c0ZpcnN0KHRoaXMuZWwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6c2hvdy1lbmRcIiwgKCkgPT4gdGhpcy5lbC5mb2N1cygpKVxuICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbCkuZGlzcGxheSAhPT0gXCJub25lXCIpe1xuICAgICAgICBBUklBLmZvY3VzRmlyc3QodGhpcy5lbClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubGV0IGZpbmRTY3JvbGxDb250YWluZXIgPSAoZWwpID0+IHtcbiAgLy8gdGhlIHNjcm9sbCBldmVudCB3b24ndCBiZSBmaXJlZCBvbiB0aGUgaHRtbC9ib2R5IGVsZW1lbnQgZXZlbiBpZiBvdmVyZmxvdyBpcyBzZXRcbiAgLy8gdGhlcmVmb3JlIHdlIHJldHVybiBudWxsIHRvIGluc3RlYWQgbGlzdGVuIGZvciBzY3JvbGwgZXZlbnRzIG9uIGRvY3VtZW50XG4gIGlmKFtcIkhUTUxcIiwgXCJCT0RZXCJdLmluZGV4T2YoZWwubm9kZU5hbWUudG9VcHBlckNhc2UoKSkgPj0gMCkgcmV0dXJuIG51bGxcbiAgaWYoW1wic2Nyb2xsXCIsIFwiYXV0b1wiXS5pbmRleE9mKGdldENvbXB1dGVkU3R5bGUoZWwpLm92ZXJmbG93WSkgPj0gMCkgcmV0dXJuIGVsXG4gIHJldHVybiBmaW5kU2Nyb2xsQ29udGFpbmVyKGVsLnBhcmVudEVsZW1lbnQpXG59XG5cbmxldCBzY3JvbGxUb3AgPSAoc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGlmKHNjcm9sbENvbnRhaW5lcil7XG4gICAgcmV0dXJuIHNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3BcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxuICB9XG59XG5cbmxldCBib3R0b20gPSAoc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGlmKHNjcm9sbENvbnRhaW5lcil7XG4gICAgcmV0dXJuIHNjcm9sbENvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b21cbiAgfSBlbHNlIHtcbiAgICAvLyB3aGVuIHdlIGhhdmUgbm8gY29udGFpbmVyLCB0aGUgd2hvbGUgcGFnZSBzY3JvbGxzLFxuICAgIC8vIHRoZXJlZm9yZSB0aGUgYm90dG9tIGNvb3JkaW5hdGUgaXMgdGhlIHZpZXdwb3J0IGhlaWdodFxuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICB9XG59XG5cbmxldCB0b3AgPSAoc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGlmKHNjcm9sbENvbnRhaW5lcil7XG4gICAgcmV0dXJuIHNjcm9sbENvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgfSBlbHNlIHtcbiAgICAvLyB3aGVuIHdlIGhhdmUgbm8gY29udGFpbmVyIHRoZSB3aG9sZSBwYWdlIHNjcm9sbHMsXG4gICAgLy8gdGhlcmVmb3JlIHRoZSB0b3AgY29vcmRpbmF0ZSBpcyAwXG4gICAgcmV0dXJuIDBcbiAgfVxufVxuXG5sZXQgaXNBdFZpZXdwb3J0VG9wID0gKGVsLCBzY3JvbGxDb250YWluZXIpID0+IHtcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICByZXR1cm4gTWF0aC5jZWlsKHJlY3QudG9wKSA+PSB0b3Aoc2Nyb2xsQ29udGFpbmVyKSAmJiBNYXRoLmNlaWwocmVjdC5sZWZ0KSA+PSAwICYmIE1hdGguZmxvb3IocmVjdC50b3ApIDw9IGJvdHRvbShzY3JvbGxDb250YWluZXIpXG59XG5cbmxldCBpc0F0Vmlld3BvcnRCb3R0b20gPSAoZWwsIHNjcm9sbENvbnRhaW5lcikgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiBNYXRoLmNlaWwocmVjdC5ib3R0b20pID49IHRvcChzY3JvbGxDb250YWluZXIpICYmIE1hdGguY2VpbChyZWN0LmxlZnQpID49IDAgJiYgTWF0aC5mbG9vcihyZWN0LmJvdHRvbSkgPD0gYm90dG9tKHNjcm9sbENvbnRhaW5lcilcbn1cblxubGV0IGlzV2l0aGluVmlld3BvcnQgPSAoZWwsIHNjcm9sbENvbnRhaW5lcikgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiBNYXRoLmNlaWwocmVjdC50b3ApID49IHRvcChzY3JvbGxDb250YWluZXIpICYmIE1hdGguY2VpbChyZWN0LmxlZnQpID49IDAgJiYgTWF0aC5mbG9vcihyZWN0LnRvcCkgPD0gYm90dG9tKHNjcm9sbENvbnRhaW5lcilcbn1cblxuSG9va3MuSW5maW5pdGVTY3JvbGwgPSB7XG4gIG1vdW50ZWQoKXtcbiAgICB0aGlzLnNjcm9sbENvbnRhaW5lciA9IGZpbmRTY3JvbGxDb250YWluZXIodGhpcy5lbClcbiAgICBsZXQgc2Nyb2xsQmVmb3JlID0gc2Nyb2xsVG9wKHRoaXMuc2Nyb2xsQ29udGFpbmVyKVxuICAgIGxldCB0b3BPdmVycmFuID0gZmFsc2VcbiAgICBsZXQgdGhyb3R0bGVJbnRlcnZhbCA9IDUwMFxuICAgIGxldCBwZW5kaW5nT3AgPSBudWxsXG5cbiAgICBsZXQgb25Ub3BPdmVycnVuID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAodG9wRXZlbnQsIGZpcnN0Q2hpbGQpID0+IHtcbiAgICAgIHBlbmRpbmdPcCA9ICgpID0+IHRydWVcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlNIb29rUHVzaCh0aGlzLmVsLCB0b3BFdmVudCwge2lkOiBmaXJzdENoaWxkLmlkLCBfb3ZlcnJhbjogdHJ1ZX0sICgpID0+IHtcbiAgICAgICAgcGVuZGluZ09wID0gbnVsbFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgbGV0IG9uRmlyc3RDaGlsZEF0VG9wID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAodG9wRXZlbnQsIGZpcnN0Q2hpbGQpID0+IHtcbiAgICAgIHBlbmRpbmdPcCA9ICgpID0+IGZpcnN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcInN0YXJ0XCJ9KVxuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKU0hvb2tQdXNoKHRoaXMuZWwsIHRvcEV2ZW50LCB7aWQ6IGZpcnN0Q2hpbGQuaWR9LCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdPcCA9IG51bGxcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIERPTSBpcyBwYXRjaGVkIGJ5IHdhaXRpbmcgZm9yIHRoZSBuZXh0IHRpY2tcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYoIWlzV2l0aGluVmlld3BvcnQoZmlyc3RDaGlsZCwgdGhpcy5zY3JvbGxDb250YWluZXIpKXtcbiAgICAgICAgICAgIGZpcnN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcInN0YXJ0XCJ9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGxldCBvbkxhc3RDaGlsZEF0Qm90dG9tID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAoYm90dG9tRXZlbnQsIGxhc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gbGFzdENoaWxkLnNjcm9sbEludG9WaWV3KHtibG9jazogXCJlbmRcIn0pXG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTSG9va1B1c2godGhpcy5lbCwgYm90dG9tRXZlbnQsIHtpZDogbGFzdENoaWxkLmlkfSwgKCkgPT4ge1xuICAgICAgICBwZW5kaW5nT3AgPSBudWxsXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBET00gaXMgcGF0Y2hlZCBieSB3YWl0aW5nIGZvciB0aGUgbmV4dCB0aWNrXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlmKCFpc1dpdGhpblZpZXdwb3J0KGxhc3RDaGlsZCwgdGhpcy5zY3JvbGxDb250YWluZXIpKXtcbiAgICAgICAgICAgIGxhc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwiZW5kXCJ9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub25TY3JvbGwgPSAoX2UpID0+IHtcbiAgICAgIGxldCBzY3JvbGxOb3cgPSBzY3JvbGxUb3AodGhpcy5zY3JvbGxDb250YWluZXIpXG5cbiAgICAgIGlmKHBlbmRpbmdPcCl7XG4gICAgICAgIHNjcm9sbEJlZm9yZSA9IHNjcm9sbE5vd1xuICAgICAgICByZXR1cm4gcGVuZGluZ09wKClcbiAgICAgIH1cbiAgICAgIGxldCByZWN0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgbGV0IHRvcEV2ZW50ID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUodGhpcy5saXZlU29ja2V0LmJpbmRpbmcoXCJ2aWV3cG9ydC10b3BcIikpXG4gICAgICBsZXQgYm90dG9tRXZlbnQgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSh0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhcInZpZXdwb3J0LWJvdHRvbVwiKSlcbiAgICAgIGxldCBsYXN0Q2hpbGQgPSB0aGlzLmVsLmxhc3RFbGVtZW50Q2hpbGRcbiAgICAgIGxldCBmaXJzdENoaWxkID0gdGhpcy5lbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgICAgbGV0IGlzU2Nyb2xsaW5nVXAgPSBzY3JvbGxOb3cgPCBzY3JvbGxCZWZvcmVcbiAgICAgIGxldCBpc1Njcm9sbGluZ0Rvd24gPSBzY3JvbGxOb3cgPiBzY3JvbGxCZWZvcmVcblxuICAgICAgLy8gZWwgb3ZlcnJhbiB3aGlsZSBzY3JvbGxpbmcgdXBcbiAgICAgIGlmKGlzU2Nyb2xsaW5nVXAgJiYgdG9wRXZlbnQgJiYgIXRvcE92ZXJyYW4gJiYgcmVjdC50b3AgPj0gMCl7XG4gICAgICAgIHRvcE92ZXJyYW4gPSB0cnVlXG4gICAgICAgIG9uVG9wT3ZlcnJ1bih0b3BFdmVudCwgZmlyc3RDaGlsZClcbiAgICAgIH0gZWxzZSBpZihpc1Njcm9sbGluZ0Rvd24gJiYgdG9wT3ZlcnJhbiAmJiByZWN0LnRvcCA8PSAwKXtcbiAgICAgICAgdG9wT3ZlcnJhbiA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmKHRvcEV2ZW50ICYmIGlzU2Nyb2xsaW5nVXAgJiYgaXNBdFZpZXdwb3J0VG9wKGZpcnN0Q2hpbGQsIHRoaXMuc2Nyb2xsQ29udGFpbmVyKSl7XG4gICAgICAgIG9uRmlyc3RDaGlsZEF0VG9wKHRvcEV2ZW50LCBmaXJzdENoaWxkKVxuICAgICAgfSBlbHNlIGlmKGJvdHRvbUV2ZW50ICYmIGlzU2Nyb2xsaW5nRG93biAmJiBpc0F0Vmlld3BvcnRCb3R0b20obGFzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICBvbkxhc3RDaGlsZEF0Qm90dG9tKGJvdHRvbUV2ZW50LCBsYXN0Q2hpbGQpXG4gICAgICB9XG4gICAgICBzY3JvbGxCZWZvcmUgPSBzY3JvbGxOb3dcbiAgICB9XG5cbiAgICBpZih0aGlzLnNjcm9sbENvbnRhaW5lcil7XG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfVxuICB9LFxuICBcbiAgZGVzdHJveWVkKCl7XG4gICAgaWYodGhpcy5zY3JvbGxDb250YWluZXIpe1xuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLm9uU2Nyb2xsKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLm9uU2Nyb2xsKVxuICAgIH1cbiAgfSxcblxuICB0aHJvdHRsZShpbnRlcnZhbCwgY2FsbGJhY2spe1xuICAgIGxldCBsYXN0Q2FsbEF0ID0gMFxuICAgIGxldCB0aW1lclxuXG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgbGV0IHJlbWFpbmluZ1RpbWUgPSBpbnRlcnZhbCAtIChub3cgLSBsYXN0Q2FsbEF0KVxuXG4gICAgICBpZihyZW1haW5pbmdUaW1lIDw9IDAgfHwgcmVtYWluaW5nVGltZSA+IGludGVydmFsKXtcbiAgICAgICAgaWYodGltZXIpe1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgICAgICAgICB0aW1lciA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2FsbEF0ID0gbm93XG4gICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpXG4gICAgICB9IGVsc2UgaWYoIXRpbWVyKXtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBsYXN0Q2FsbEF0ID0gRGF0ZS5ub3coKVxuICAgICAgICAgIHRpbWVyID0gbnVsbFxuICAgICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpXG4gICAgICAgIH0sIHJlbWFpbmluZ1RpbWUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBIb29rc1xuIiwgImltcG9ydCB7XG4gIFBIWF9SRUZfTE9BRElORyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX0VWRU5UX0NMQVNTRVMsXG4gIFBIWF9ESVNBQkxFRCxcbiAgUEhYX1JFQURPTkxZLFxuICBQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkVcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50UmVmIHtcbiAgc3RhdGljIG9uVW5sb2NrKGVsLCBjYWxsYmFjayl7XG4gICAgaWYoIURPTS5pc0xvY2tlZChlbCkgJiYgIWVsLmNsb3Nlc3QoYFske1BIWF9SRUZfTE9DS31dYCkpeyByZXR1cm4gY2FsbGJhY2soKSB9XG4gICAgY29uc3QgY2xvc2VzdExvY2sgPSBlbC5jbG9zZXN0KGBbJHtQSFhfUkVGX0xPQ0t9XWApXG4gICAgY29uc3QgcmVmID0gY2xvc2VzdExvY2suY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKS5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKVxuICAgIGNsb3Nlc3RMb2NrLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDp1bmRvLWxvY2s6JHtyZWZ9YCwgKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgIH0sIHtvbmNlOiB0cnVlfSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsKXtcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLmxvYWRpbmdSZWYgPSBlbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9MT0FESU5HKSA/IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpLCAxMCkgOiBudWxsXG4gICAgdGhpcy5sb2NrUmVmID0gZWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfTE9DSykgPyBwYXJzZUludChlbC5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKSwgMTApIDogbnVsbFxuICB9XG5cbiAgLy8gcHVibGljXG5cbiAgbWF5YmVVbmRvKHJlZiwgcGh4RXZlbnQsIGVhY2hDbG9uZUNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5pc1dpdGhpbihyZWYpKXsgcmV0dXJuIH1cblxuICAgIC8vIHVuZG8gbG9ja3MgYW5kIGFwcGx5IGNsb25lc1xuICAgIHRoaXMudW5kb0xvY2tzKHJlZiwgcGh4RXZlbnQsIGVhY2hDbG9uZUNhbGxiYWNrKVxuXG4gICAgLy8gdW5kbyBsb2FkaW5nIHN0YXRlc1xuICAgIHRoaXMudW5kb0xvYWRpbmcocmVmLCBwaHhFdmVudClcblxuICAgIC8vIGNsZWFuIHVwIGlmIGZ1bGx5IHJlc29sdmVkXG4gICAgaWYodGhpcy5pc0Z1bGx5UmVzb2x2ZWRCeShyZWYpKXsgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpIH1cbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBpc1dpdGhpbihyZWYpe1xuICAgIHJldHVybiAhKCh0aGlzLmxvYWRpbmdSZWYgIT09IG51bGwgJiYgdGhpcy5sb2FkaW5nUmVmID4gcmVmKSAmJiAodGhpcy5sb2NrUmVmICE9PSBudWxsICYmIHRoaXMubG9ja1JlZiA+IHJlZikpXG4gIH1cblxuICAvLyBDaGVjayBmb3IgY2xvbmVkIFBIWF9SRUZfTE9DSyBlbGVtZW50IHRoYXQgaGFzIGJlZW4gbW9ycGhlZCBiZWhpbmRcbiAgLy8gdGhlIHNjZW5lcyB3aGlsZSB0aGlzIGVsZW1lbnQgd2FzIGxvY2tlZCBpbiB0aGUgRE9NLlxuICAvLyBXaGVuIHdlIGFwcGx5IHRoZSBjbG9uZWQgdHJlZSB0byB0aGUgYWN0aXZlIERPTSBlbGVtZW50LCB3ZSBtdXN0XG4gIC8vXG4gIC8vICAgMS4gZXhlY3V0ZSBwZW5kaW5nIG1vdW50ZWQgaG9va3MgZm9yIG5vZGVzIG5vdyBpbiB0aGUgRE9NXG4gIC8vICAgMi4gdW5kbyBhbnkgcmVmIGluc2lkZSB0aGUgY2xvbmVkIHRyZWUgdGhhdCBoYXMgc2luY2UgYmVlbiBhY2snZFxuICB1bmRvTG9ja3MocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzTG9ja1VuZG9uZUJ5KHJlZikpeyByZXR1cm4gfVxuXG4gICAgbGV0IGNsb25lZFRyZWUgPSBET00ucHJpdmF0ZSh0aGlzLmVsLCBQSFhfUkVGX0xPQ0spXG4gICAgaWYoY2xvbmVkVHJlZSl7XG4gICAgICBlYWNoQ2xvbmVDYWxsYmFjayhjbG9uZWRUcmVlKVxuICAgICAgRE9NLmRlbGV0ZVByaXZhdGUodGhpcy5lbCwgUEhYX1JFRl9MT0NLKVxuICAgIH1cbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG5cbiAgICBsZXQgb3B0cyA9IHtkZXRhaWw6IHtyZWY6IHJlZiwgZXZlbnQ6IHBoeEV2ZW50fSwgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2V9XG4gICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChgcGh4OnVuZG8tbG9jazoke3RoaXMubG9ja1JlZn1gLCBvcHRzKSlcbiAgfVxuXG4gIHVuZG9Mb2FkaW5nKHJlZiwgcGh4RXZlbnQpe1xuICAgIGlmKCF0aGlzLmlzTG9hZGluZ1VuZG9uZUJ5KHJlZikpe1xuICAgICAgaWYodGhpcy5jYW5VbmRvTG9hZGluZyhyZWYpICYmIHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIpKXtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKFwicGh4LWNoYW5nZS1sb2FkaW5nXCIpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZih0aGlzLmNhblVuZG9Mb2FkaW5nKHJlZikpe1xuICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9MT0FESU5HKVxuICAgICAgbGV0IGRpc2FibGVkVmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgbGV0IHJlYWRPbmx5VmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKVxuICAgICAgLy8gcmVzdG9yZSBpbnB1dHNcbiAgICAgIGlmKHJlYWRPbmx5VmFsICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5lbC5yZWFkT25seSA9IHJlYWRPbmx5VmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpXG4gICAgICB9XG4gICAgICBpZihkaXNhYmxlZFZhbCAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMuZWwuZGlzYWJsZWQgPSBkaXNhYmxlZFZhbCA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgfVxuICAgICAgLy8gcmVzdG9yZSBkaXNhYmxlc1xuICAgICAgbGV0IGRpc2FibGVSZXN0b3JlID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgaWYoZGlzYWJsZVJlc3RvcmUgIT09IG51bGwpe1xuICAgICAgICB0aGlzLmVsLmlubmVyVGV4dCA9IGRpc2FibGVSZXN0b3JlXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSlcbiAgICAgIH1cblxuICAgICAgbGV0IG9wdHMgPSB7ZGV0YWlsOiB7cmVmOiByZWYsIGV2ZW50OiBwaHhFdmVudH0sIGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IGZhbHNlfVxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChgcGh4OnVuZG8tbG9hZGluZzoke3RoaXMubG9hZGluZ1JlZn1gLCBvcHRzKSlcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgY2xhc3Nlc1xuICAgIFBIWF9FVkVOVF9DTEFTU0VTLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBpZihuYW1lICE9PSBcInBoeC1zdWJtaXQtbG9hZGluZ1wiIHx8IHRoaXMuY2FuVW5kb0xvYWRpbmcocmVmKSl7XG4gICAgICAgIERPTS5yZW1vdmVDbGFzcyh0aGlzLmVsLCBuYW1lKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpc0xvYWRpbmdVbmRvbmVCeShyZWYpeyByZXR1cm4gdGhpcy5sb2FkaW5nUmVmID09PSBudWxsID8gZmFsc2UgOiB0aGlzLmxvYWRpbmdSZWYgPD0gcmVmIH1cbiAgaXNMb2NrVW5kb25lQnkocmVmKXsgcmV0dXJuIHRoaXMubG9ja1JlZiA9PT0gbnVsbCA/IGZhbHNlIDogdGhpcy5sb2NrUmVmIDw9IHJlZiB9XG5cbiAgaXNGdWxseVJlc29sdmVkQnkocmVmKXtcbiAgICByZXR1cm4gKHRoaXMubG9hZGluZ1JlZiA9PT0gbnVsbCB8fCB0aGlzLmxvYWRpbmdSZWYgPD0gcmVmKSAmJiAodGhpcy5sb2NrUmVmID09PSBudWxsIHx8IHRoaXMubG9ja1JlZiA8PSByZWYpXG4gIH1cblxuICAvLyBvbmx5IHJlbW92ZSB0aGUgcGh4LXN1Ym1pdC1sb2FkaW5nIGNsYXNzIGlmIHdlIGFyZSBub3QgbG9ja2VkXG4gIGNhblVuZG9Mb2FkaW5nKHJlZil7IHJldHVybiB0aGlzLmxvY2tSZWYgPT09IG51bGwgfHwgdGhpcy5sb2NrUmVmIDw9IHJlZiB9XG59XG4iLCAiaW1wb3J0IHtcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBvc3RNb3JwaFJlc3RvcmVyIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyQmVmb3JlLCBjb250YWluZXJBZnRlciwgdXBkYXRlVHlwZSl7XG4gICAgbGV0IGlkc0JlZm9yZSA9IG5ldyBTZXQoKVxuICAgIGxldCBpZHNBZnRlciA9IG5ldyBTZXQoWy4uLmNvbnRhaW5lckFmdGVyLmNoaWxkcmVuXS5tYXAoY2hpbGQgPT4gY2hpbGQuaWQpKVxuXG4gICAgbGV0IGVsZW1lbnRzVG9Nb2RpZnkgPSBbXVxuXG4gICAgQXJyYXkuZnJvbShjb250YWluZXJCZWZvcmUuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgaWYoY2hpbGQuaWQpeyAvLyBhbGwgb2Ygb3VyIGNoaWxkcmVuIHNob3VsZCBiZSBlbGVtZW50cyB3aXRoIGlkc1xuICAgICAgICBpZHNCZWZvcmUuYWRkKGNoaWxkLmlkKVxuICAgICAgICBpZihpZHNBZnRlci5oYXMoY2hpbGQuaWQpKXtcbiAgICAgICAgICBsZXQgcHJldmlvdXNFbGVtZW50SWQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaWRcbiAgICAgICAgICBlbGVtZW50c1RvTW9kaWZ5LnB1c2goe2VsZW1lbnRJZDogY2hpbGQuaWQsIHByZXZpb3VzRWxlbWVudElkOiBwcmV2aW91c0VsZW1lbnRJZH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5jb250YWluZXJJZCA9IGNvbnRhaW5lckFmdGVyLmlkXG4gICAgdGhpcy51cGRhdGVUeXBlID0gdXBkYXRlVHlwZVxuICAgIHRoaXMuZWxlbWVudHNUb01vZGlmeSA9IGVsZW1lbnRzVG9Nb2RpZnlcbiAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZCA9IFsuLi5pZHNBZnRlcl0uZmlsdGVyKGlkID0+ICFpZHNCZWZvcmUuaGFzKGlkKSlcbiAgfVxuXG4gIC8vIFdlIGRvIHRoZSBmb2xsb3dpbmcgdG8gb3B0aW1pemUgYXBwZW5kL3ByZXBlbmQgb3BlcmF0aW9uczpcbiAgLy8gICAxKSBUcmFjayBpZHMgb2YgbW9kaWZpZWQgZWxlbWVudHMgJiBvZiBuZXcgZWxlbWVudHNcbiAgLy8gICAyKSBBbGwgdGhlIG1vZGlmaWVkIGVsZW1lbnRzIGFyZSBwdXQgYmFjayBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiB0aGUgRE9NIHRyZWVcbiAgLy8gICAgICBieSBzdG9yaW5nIHRoZSBpZCBvZiB0aGVpciBwcmV2aW91cyBzaWJsaW5nXG4gIC8vICAgMykgTmV3IGVsZW1lbnRzIGFyZSBnb2luZyB0byBiZSBwdXQgaW4gdGhlIHJpZ2h0IHBsYWNlIGJ5IG1vcnBoZG9tIGR1cmluZyBhcHBlbmQuXG4gIC8vICAgICAgRm9yIHByZXBlbmQsIHdlIG1vdmUgdGhlbSB0byB0aGUgZmlyc3QgcG9zaXRpb24gaW4gdGhlIGNvbnRhaW5lclxuICBwZXJmb3JtKCl7XG4gICAgbGV0IGNvbnRhaW5lciA9IERPTS5ieUlkKHRoaXMuY29udGFpbmVySWQpXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5LmZvckVhY2goZWxlbWVudFRvTW9kaWZ5ID0+IHtcbiAgICAgIGlmKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCl7XG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCksIHByZXZpb3VzRWxlbSA9PiB7XG4gICAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZy5pZCA9PSBwcmV2aW91c0VsZW0uaWRcbiAgICAgICAgICAgIGlmKCFpc0luUmlnaHRQbGFjZSl7XG4gICAgICAgICAgICAgIHByZXZpb3VzRWxlbS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBlbGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBjb250YWluZXJcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgIGxldCBpc0luUmlnaHRQbGFjZSA9IGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZyA9PSBudWxsXG4gICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZih0aGlzLnVwZGF0ZVR5cGUgPT0gXCJwcmVwZW5kXCIpe1xuICAgICAgdGhpcy5lbGVtZW50SWRzVG9BZGQucmV2ZXJzZSgpLmZvckVhY2goZWxlbUlkID0+IHtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbUlkKSwgZWxlbSA9PiBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBlbGVtKSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG4iLCAidmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgPSAxMTtcblxuZnVuY3Rpb24gbW9ycGhBdHRycyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgdmFyIHRvTm9kZUF0dHJzID0gdG9Ob2RlLmF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHI7XG4gICAgdmFyIGF0dHJOYW1lO1xuICAgIHZhciBhdHRyTmFtZXNwYWNlVVJJO1xuICAgIHZhciBhdHRyVmFsdWU7XG4gICAgdmFyIGZyb21WYWx1ZTtcblxuICAgIC8vIGRvY3VtZW50LWZyYWdtZW50cyBkb250IGhhdmUgYXR0cmlidXRlcyBzbyBsZXRzIG5vdCBkbyBhbnl0aGluZ1xuICAgIGlmICh0b05vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgfHwgZnJvbU5vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYXR0cmlidXRlcyBvbiBvcmlnaW5hbCBET00gZWxlbWVudFxuICAgIGZvciAodmFyIGkgPSB0b05vZGVBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhdHRyID0gdG9Ob2RlQXR0cnNbaV07XG4gICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICBhdHRyTmFtZXNwYWNlVVJJID0gYXR0ci5uYW1lc3BhY2VVUkk7XG4gICAgICAgIGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgaWYgKGF0dHJOYW1lc3BhY2VVUkkpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5sb2NhbE5hbWUgfHwgYXR0ck5hbWU7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyLnByZWZpeCA9PT0gJ3htbG5zJyl7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lOyAvLyBJdCdzIG5vdCBhbGxvd2VkIHRvIHNldCBhbiBhdHRyaWJ1dGUgd2l0aCB0aGUgWE1MTlMgbmFtZXNwYWNlIHdpdGhvdXQgc3BlY2lmeWluZyB0aGUgYHhtbG5zYCBwcmVmaXhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IGV4dHJhIGF0dHJpYnV0ZXMgZm91bmQgb24gdGhlIG9yaWdpbmFsIERPTSBlbGVtZW50IHRoYXRcbiAgICAvLyB3ZXJlbid0IGZvdW5kIG9uIHRoZSB0YXJnZXQgZWxlbWVudC5cbiAgICB2YXIgZnJvbU5vZGVBdHRycyA9IGZyb21Ob2RlLmF0dHJpYnV0ZXM7XG5cbiAgICBmb3IgKHZhciBkID0gZnJvbU5vZGVBdHRycy5sZW5ndGggLSAxOyBkID49IDA7IGQtLSkge1xuICAgICAgICBhdHRyID0gZnJvbU5vZGVBdHRyc1tkXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcblxuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlKGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciByYW5nZTsgLy8gQ3JlYXRlIGEgcmFuZ2Ugb2JqZWN0IGZvciBlZmZpY2VudGx5IHJlbmRlcmluZyBzdHJpbmdzIHRvIGVsZW1lbnRzLlxudmFyIE5TX1hIVE1MID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG52YXIgZG9jID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IGRvY3VtZW50O1xudmFyIEhBU19URU1QTEFURV9TVVBQT1JUID0gISFkb2MgJiYgJ2NvbnRlbnQnIGluIGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudmFyIEhBU19SQU5HRV9TVVBQT1JUID0gISFkb2MgJiYgZG9jLmNyZWF0ZVJhbmdlICYmICdjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQnIGluIGRvYy5jcmVhdGVSYW5nZSgpO1xuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2MuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tUmFuZ2Uoc3RyKSB7XG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgICByYW5nZSA9IGRvYy5jcmVhdGVSYW5nZSgpO1xuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvYy5ib2R5KTtcbiAgICB9XG5cbiAgICB2YXIgZnJhZ21lbnQgPSByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc3RyKTtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tV3JhcChzdHIpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgIGZyYWdtZW50LmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFib3V0IHRoZSBzYW1lXG4gKiB2YXIgaHRtbCA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoc3RyLCAndGV4dC9odG1sJyk7XG4gKiByZXR1cm4gaHRtbC5ib2R5LmZpcnN0Q2hpbGQ7XG4gKlxuICogQG1ldGhvZCB0b0VsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqL1xuZnVuY3Rpb24gdG9FbGVtZW50KHN0cikge1xuICAgIHN0ciA9IHN0ci50cmltKCk7XG4gICAgaWYgKEhBU19URU1QTEFURV9TVVBQT1JUKSB7XG4gICAgICAvLyBhdm9pZCByZXN0cmljdGlvbnMgb24gY29udGVudCBmb3IgdGhpbmdzIGxpa2UgYDx0cj48dGg+SGk8L3RoPjwvdHI+YCB3aGljaFxuICAgICAgLy8gY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50IGRvZXNuJ3Qgc3VwcG9ydFxuICAgICAgLy8gPHRlbXBsYXRlPiBzdXBwb3J0IG5vdCBhdmFpbGFibGUgaW4gSUVcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpO1xuICAgIH0gZWxzZSBpZiAoSEFTX1JBTkdFX1NVUFBPUlQpIHtcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHR3byBub2RlJ3MgbmFtZXMgYXJlIHRoZSBzYW1lLlxuICpcbiAqIE5PVEU6IFdlIGRvbid0IGJvdGhlciBjaGVja2luZyBgbmFtZXNwYWNlVVJJYCBiZWNhdXNlIHlvdSB3aWxsIG5ldmVyIGZpbmQgdHdvIEhUTUwgZWxlbWVudHMgd2l0aCB0aGUgc2FtZVxuICogICAgICAgbm9kZU5hbWUgYW5kIGRpZmZlcmVudCBuYW1lc3BhY2UgVVJJcy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYiBUaGUgdGFyZ2V0IGVsZW1lbnRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVOb2RlTmFtZXMoZnJvbUVsLCB0b0VsKSB7XG4gICAgdmFyIGZyb21Ob2RlTmFtZSA9IGZyb21FbC5ub2RlTmFtZTtcbiAgICB2YXIgdG9Ob2RlTmFtZSA9IHRvRWwubm9kZU5hbWU7XG4gICAgdmFyIGZyb21Db2RlU3RhcnQsIHRvQ29kZVN0YXJ0O1xuXG4gICAgaWYgKGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmcm9tQ29kZVN0YXJ0ID0gZnJvbU5vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG4gICAgdG9Db2RlU3RhcnQgPSB0b05vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgYSB2aXJ0dWFsIERPTSBub2RlIG9yIFNWRyBub2RlIHRoZW4gd2UgbWF5XG4gICAgLy8gbmVlZCB0byBub3JtYWxpemUgdGhlIHRhZyBuYW1lIGJlZm9yZSBjb21wYXJpbmcuIE5vcm1hbCBIVE1MIGVsZW1lbnRzIHRoYXQgYXJlXG4gICAgLy8gaW4gdGhlIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgLy8gYXJlIGNvbnZlcnRlZCB0byB1cHBlciBjYXNlXG4gICAgaWYgKGZyb21Db2RlU3RhcnQgPD0gOTAgJiYgdG9Db2RlU3RhcnQgPj0gOTcpIHsgLy8gZnJvbSBpcyB1cHBlciBhbmQgdG8gaXMgbG93ZXJcbiAgICAgICAgcmV0dXJuIGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH0gZWxzZSBpZiAodG9Db2RlU3RhcnQgPD0gOTAgJiYgZnJvbUNvZGVTdGFydCA+PSA5NykgeyAvLyB0byBpcyB1cHBlciBhbmQgZnJvbSBpcyBsb3dlclxuICAgICAgICByZXR1cm4gdG9Ob2RlTmFtZSA9PT0gZnJvbU5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gZWxlbWVudCwgb3B0aW9uYWxseSB3aXRoIGEga25vd24gbmFtZXNwYWNlIFVSSS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgZWxlbWVudCBuYW1lLCBlLmcuICdkaXYnIG9yICdzdmcnXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWVzcGFjZVVSSV0gdGhlIGVsZW1lbnQncyBuYW1lc3BhY2UgVVJJLCBpLmUuIHRoZSB2YWx1ZSBvZlxuICogaXRzIGB4bWxuc2AgYXR0cmlidXRlIG9yIGl0cyBpbmZlcnJlZCBuYW1lc3BhY2UuXG4gKlxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWUsIG5hbWVzcGFjZVVSSSkge1xuICAgIHJldHVybiAhbmFtZXNwYWNlVVJJIHx8IG5hbWVzcGFjZVVSSSA9PT0gTlNfWEhUTUwgP1xuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudChuYW1lKSA6XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIGNoaWxkcmVuIG9mIG9uZSBET00gZWxlbWVudCB0byBhbm90aGVyIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB0b0VsLmFwcGVuZENoaWxkKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiB0b0VsO1xufVxuXG5mdW5jdGlvbiBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgbmFtZSkge1xuICAgIGlmIChmcm9tRWxbbmFtZV0gIT09IHRvRWxbbmFtZV0pIHtcbiAgICAgICAgZnJvbUVsW25hbWVdID0gdG9FbFtuYW1lXTtcbiAgICAgICAgaWYgKGZyb21FbFtuYW1lXSkge1xuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShuYW1lLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG52YXIgc3BlY2lhbEVsSGFuZGxlcnMgPSB7XG4gICAgT1BUSU9OOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBmcm9tRWwucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnROYW1lID0gcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlICYmIHBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJlbnROYW1lID09PSAnU0VMRUNUJyAmJiAhcGFyZW50Tm9kZS5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbUVsLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSAmJiAhdG9FbC5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBNUyBFZGdlIGJ1ZyB3aGVyZSB0aGUgJ3NlbGVjdGVkJyBhdHRyaWJ1dGUgY2FuIG9ubHkgYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlZCBpZiBzZXQgdG8gYSBub24tZW1wdHkgdmFsdWU6XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMDg3Njc5L1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIHJlc2V0IHNlbGVjdCBlbGVtZW50J3Mgc2VsZWN0ZWRJbmRleCB0byAtMSwgb3RoZXJ3aXNlIHNldHRpbmdcbiAgICAgICAgICAgICAgICAvLyBmcm9tRWwuc2VsZWN0ZWQgdXNpbmcgdGhlIHN5bmNCb29sZWFuQXR0clByb3AgYmVsb3cgaGFzIG5vIGVmZmVjdC5cbiAgICAgICAgICAgICAgICAvLyBUaGUgY29ycmVjdCBzZWxlY3RlZEluZGV4IHdpbGwgYmUgc2V0IGluIHRoZSBTRUxFQ1Qgc3BlY2lhbCBoYW5kbGVyIGJlbG93LlxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnc2VsZWN0ZWQnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRoZSBcInZhbHVlXCIgYXR0cmlidXRlIGlzIHNwZWNpYWwgZm9yIHRoZSA8aW5wdXQ+IGVsZW1lbnQgc2luY2UgaXQgc2V0c1xuICAgICAqIHRoZSBpbml0aWFsIHZhbHVlLiBDaGFuZ2luZyB0aGUgXCJ2YWx1ZVwiIGF0dHJpYnV0ZSB3aXRob3V0IGNoYW5naW5nIHRoZVxuICAgICAqIFwidmFsdWVcIiBwcm9wZXJ0eSB3aWxsIGhhdmUgbm8gZWZmZWN0IHNpbmNlIGl0IGlzIG9ubHkgdXNlZCB0byB0aGUgc2V0IHRoZVxuICAgICAqIGluaXRpYWwgdmFsdWUuICBTaW1pbGFyIGZvciB0aGUgXCJjaGVja2VkXCIgYXR0cmlidXRlLCBhbmQgXCJkaXNhYmxlZFwiLlxuICAgICAqL1xuICAgIElOUFVUOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdjaGVja2VkJyk7XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnZGlzYWJsZWQnKTtcblxuICAgICAgICBpZiAoZnJvbUVsLnZhbHVlICE9PSB0b0VsLnZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSB0b0VsLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0b0VsLmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBURVhUQVJFQTogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaXJzdENoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGlmIChmaXJzdENoaWxkKSB7XG4gICAgICAgICAgICAvLyBOZWVkZWQgZm9yIElFLiBBcHBhcmVudGx5IElFIHNldHMgdGhlIHBsYWNlaG9sZGVyIGFzIHRoZVxuICAgICAgICAgICAgLy8gbm9kZSB2YWx1ZSBhbmQgdmlzZSB2ZXJzYS4gVGhpcyBpZ25vcmVzIGFuIGVtcHR5IHVwZGF0ZS5cbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGZpcnN0Q2hpbGQubm9kZVZhbHVlO1xuXG4gICAgICAgICAgICBpZiAob2xkVmFsdWUgPT0gbmV3VmFsdWUgfHwgKCFuZXdWYWx1ZSAmJiBvbGRWYWx1ZSA9PSBmcm9tRWwucGxhY2Vob2xkZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaXJzdENoaWxkLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBTRUxFQ1Q6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb29wIHRocm91Z2ggY2hpbGRyZW4gb2YgZnJvbUVsLCBub3QgdG9FbCBzaW5jZSBub2RlcyBjYW4gYmUgbW92ZWRcbiAgICAgICAgICAgIC8vIGZyb20gdG9FbCB0byBmcm9tRWwgZGlyZWN0bHkgd2hlbiBtb3JwaGluZy5cbiAgICAgICAgICAgIC8vIEF0IHRoZSB0aW1lIHRoaXMgc3BlY2lhbCBoYW5kbGVyIGlzIGludm9rZWQsIGFsbCBjaGlsZHJlbiBoYXZlIGFscmVhZHkgYmVlbiBtb3JwaGVkXG4gICAgICAgICAgICAvLyBhbmQgYXBwZW5kZWQgdG8gLyByZW1vdmVkIGZyb20gZnJvbUVsLCBzbyB1c2luZyBmcm9tRWwgaGVyZSBpcyBzYWZlIGFuZCBjb3JyZWN0LlxuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgb3B0Z3JvdXA7XG4gICAgICAgICAgICB2YXIgbm9kZU5hbWU7XG4gICAgICAgICAgICB3aGlsZShjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgIG5vZGVOYW1lID0gY3VyQ2hpbGQubm9kZU5hbWUgJiYgY3VyQ2hpbGQubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmcm9tRWwuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEgPSAxMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgcmV0dXJuIChub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgbm9kZS5pZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycykge1xuXG4gIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICB0b05vZGUgPSB0b05vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuXG4gICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uRWxVcGRhdGVkID0gb3B0aW9ucy5vbkVsVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIHNraXBGcm9tQ2hpbGRyZW4gPSBvcHRpb25zLnNraXBGcm9tQ2hpbGRyZW4gfHwgbm9vcDtcbiAgICB2YXIgYWRkQ2hpbGQgPSBvcHRpb25zLmFkZENoaWxkIHx8IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTsgfTtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciBrZXllZFJlbW92YWxMaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBhZGRLZXllZFJlbW92YWwoa2V5KSB7XG4gICAgICBrZXllZFJlbW92YWxMaXN0LnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuXG4gICAgICAgICAgdmFyIGtleSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChza2lwS2V5ZWROb2RlcyAmJiAoa2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCkpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgc2tpcHBpbmcga2V5ZWQgbm9kZXMgdGhlbiB3ZSBhZGQgdGhlIGtleVxuICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVwb3J0IHRoZSBub2RlIGFzIGRpc2NhcmRlZCBpZiBpdCBpcyBub3Qga2V5ZWQuIFdlIGRvIHRoaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGRpc2NhcmQgdGhlbSBpbiBvbmUgZmluYWwgcGFzcy5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJlbW92ZXMgYSBET00gbm9kZSBvdXQgb2YgdGhlIG9yaWdpbmFsIERPTVxuICAgICpcbiAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgKiBAcGFyYW0gIHtOb2RlfSBwYXJlbnROb2RlIFRoZSBub2RlcyBwYXJlbnRcbiAgICAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBLZXllZE5vZGVzIElmIHRydWUgdGhlbiBlbGVtZW50cyB3aXRoIGtleXMgd2lsbCBiZSBza2lwcGVkIGFuZCBub3QgZGlzY2FyZGVkLlxuICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlLCBwYXJlbnROb2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICBvbk5vZGVEaXNjYXJkZWQobm9kZSk7XG4gICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgLy8gICAgICAgICByb290LFxuICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBlbDtcbiAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAvLyAgICAgdmFyIGVsO1xuICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2FsayByZWN1cnNpdmVseVxuICAgICAgICAgIGluZGV4VHJlZShjdXJDaGlsZCk7XG5cbiAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5kZXhUcmVlKGZyb21Ob2RlKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZU5vZGVBZGRlZChlbCkge1xuICAgICAgb25Ob2RlQWRkZWQoZWwpO1xuXG4gICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIHZhciB1bm1hdGNoZWRGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBba2V5XTtcbiAgICAgICAgICAvLyBpZiB3ZSBmaW5kIGEgZHVwbGljYXRlICNpZCBub2RlIGluIGNhY2hlLCByZXBsYWNlIGBlbGAgd2l0aCBjYWNoZSB2YWx1ZVxuICAgICAgICAgIC8vIGFuZCBtb3JwaCBpdCB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICBpZiAodW5tYXRjaGVkRnJvbUVsICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyQ2hpbGQsIHVubWF0Y2hlZEZyb21FbCkpIHtcbiAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FsbCBmb3IgY3VyQ2hpbGQgYW5kIGl0J3MgY2hpbGRyZW4gdG8gc2VlIGlmIHdlIGZpbmQgc29tZXRoaW5nIGluXG4gICAgICAgICAgLy8gZnJvbU5vZGVzTG9va3VwXG4gICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpc1xuICAgICAgLy8gbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkXG4gICAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgaWYgKChjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkpIHtcbiAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcblxuICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBmcm9tTm9kZXNMb29rdXBbdG9FbEtleV07XG4gICAgICB9XG5cbiAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIHZhciBiZWZvcmVVcGRhdGVSZXN1bHQgPSBvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpO1xuICAgICAgICBpZiAoYmVmb3JlVXBkYXRlUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChiZWZvcmVVcGRhdGVSZXN1bHQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIGZyb21FbCA9IGJlZm9yZVVwZGF0ZVJlc3VsdDtcbiAgICAgICAgICAvLyByZWluZGV4IHRoZSBuZXcgZnJvbUVsIGluIGNhc2UgaXQncyBub3QgaW4gdGhlIHNhbWVcbiAgICAgICAgICAvLyB0cmVlIGFzIHRoZSBvcmlnaW5hbCBmcm9tRWxcbiAgICAgICAgICAvLyAoUGhvZW5peCBMaXZlVmlldyBzb21ldGltZXMgcmV0dXJucyBhIGNsb25lZCB0cmVlLFxuICAgICAgICAgIC8vICBidXQga2V5ZWQgbG9va3VwcyB3b3VsZCBzdGlsbCBwb2ludCB0byB0aGUgb3JpZ2luYWwgdHJlZSlcbiAgICAgICAgICBpbmRleFRyZWUoZnJvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50IGZpcnN0XG4gICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgb25FbFVwZGF0ZWQoZnJvbUVsKTtcblxuICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbUVsLm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXJzLlRFWFRBUkVBKGZyb21FbCwgdG9FbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgIHZhciBza2lwRnJvbSA9IHNraXBGcm9tQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuXG4gICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG5cbiAgICAgIC8vIHdhbGsgdGhlIGNoaWxkcmVuXG4gICAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgY3VyVG9Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgLy8gd2FsayB0aGUgZnJvbU5vZGUgY2hpbGRyZW4gYWxsIHRoZSB3YXkgdGhyb3VnaFxuICAgICAgICB3aGlsZSAoIXNraXBGcm9tICYmIGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgLy8gdGhpcyBtZWFucyBpZiB0aGUgY3VyRnJvbU5vZGVDaGlsZCBkb2VzbnQgaGF2ZSBhIG1hdGNoIHdpdGggdGhlIGN1clRvTm9kZUNoaWxkXG4gICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZUNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuXG4gICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGFyZ2V0IG5vZGUgaGFzIGEga2V5IHNvIHdlIHdhbnQgdG8gbWF0Y2ggaXQgdXAgd2l0aCB0aGUgY29ycmVjdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBzaW5nbGUgZWxlbWVudCByZW1vdmFscy4gVG8gYXZvaWQgcmVtb3ZpbmcgdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIG5vZGUgb3V0IG9mIHRoZSB0cmVlIChzaW5jZSB0aGF0IGNhbiBicmVhayBDU1MgdHJhbnNpdGlvbnMsIGV0Yy4pLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpb24gdG8gcHJvcGVybHkgbWF0Y2ggdXAgdGhlIGtleWVkIHRhcmdldCBlbGVtZW50IHdpdGggaXRzIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgIC8vIExldCdzIG1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gaXQuXG5cbiAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSB1c2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgcmVwbGFjZUNoaWxkIGJlY2F1c2Ugd2Ugd2FudCB0byBnbyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGxpZmVjeWNsZSBob29rcyBhcmUgY29ycmVjdGx5IGludm9rZWRcbiAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG1hdGNoaW5nRnJvbUVsO1xuICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5vZGVzIGFyZSBub3QgY29tcGF0aWJsZSBzaW5jZSB0aGUgXCJ0b1wiIG5vZGUgaGFzIGEga2V5IGFuZCB0aGVyZVxuICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHwgY3VyRnJvbU5vZGVUeXBlID09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRvIGFzIHdlIGFscmVhZHkgcmVjdXJzaXZlbHkgY2FsbGVkIG1vcnBoQ2hpbGRyZW4gYWJvdmVcbiAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgLy8gbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTS4gSG93ZXZlciwgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSBmcm9tIG5vZGUgaXMgbm90IGtleWVkXG4gICAgICAgICAgLy8gc2luY2UgaXQgaXMgcG9zc2libGUgdGhhdCBhIGtleWVkIG5vZGUgbWlnaHQgbWF0Y2ggdXAgd2l0aCBhIG5vZGUgc29tZXdoZXJlIGVsc2UgaW4gdGhlXG4gICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAvLyBob21lIGluIHRoZSBmaW5hbCBET00gdHJlZS4gQWZ0ZXIgZXZlcnl0aGluZyBpcyBkb25lIHdlIHdpbGwgcmVtb3ZlIGFueSBrZXllZCBub2Rlc1xuICAgICAgICAgIC8vIHRoYXQgZGlkbid0IGZpbmQgYSBob21lXG4gICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgIH0gLy8gRU5EOiB3aGlsZShjdXJGcm9tTm9kZUNoaWxkKSB7fVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICBpZighc2tpcEZyb20peyBhZGRDaGlsZChmcm9tRWwsIG1hdGNoaW5nRnJvbUVsKTsgfVxuICAgICAgICAgIG1vcnBoRWwobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENoaWxkKGZyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIGNsZWFudXBGcm9tRWwoZnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBjdXJGcm9tTm9kZUtleSk7XG5cbiAgICAgIHZhciBzcGVjaWFsRWxIYW5kbGVyID0gc3BlY2lhbEVsSGFuZGxlcnNbZnJvbUVsLm5vZGVOYW1lXTtcbiAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXIoZnJvbUVsLCB0b0VsKTtcbiAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhDaGlsZHJlbiguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgLy8gY29tcGF0aWJsZSAoZS5nLiA8ZGl2PiAtLT4gPHNwYW4+IG9yIDxkaXY+IC0tPiBURVhUKVxuICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICBpZiAoIWNvbXBhcmVOb2RlTmFtZXMoZnJvbU5vZGUsIHRvTm9kZSkpIHtcbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vdmVDaGlsZHJlbihmcm9tTm9kZSwgY3JlYXRlRWxlbWVudE5TKHRvTm9kZS5ub2RlTmFtZSwgdG9Ob2RlLm5hbWVzcGFjZVVSSSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBtb3JwaGVkTm9kZVR5cGUpIHtcbiAgICAgICAgICBpZiAobW9ycGhlZE5vZGUubm9kZVZhbHVlICE9PSB0b05vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUZXh0IG5vZGUgdG8gc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb3JwaGVkTm9kZSA9PT0gdG9Ob2RlKSB7XG4gICAgICAvLyBUaGUgXCJ0byBub2RlXCIgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIFwiZnJvbSBub2RlXCIgc28gd2UgaGFkIHRvXG4gICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgLy8gV2Ugbm93IG5lZWQgdG8gbG9vcCBvdmVyIGFueSBrZXllZCBub2RlcyB0aGF0IG1pZ2h0IG5lZWQgdG8gYmVcbiAgICAgIC8vIHJlbW92ZWQuIFdlIG9ubHkgZG8gdGhlIHJlbW92YWwgaWYgd2Uga25vdyB0aGF0IHRoZSBrZXllZCBub2RlXG4gICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgLy8gaXQgb3V0IG9mIGZyb21Ob2Rlc0xvb2t1cCBhbmQgd2UgdXNlIGZyb21Ob2Rlc0xvb2t1cCB0byBkZXRlcm1pbmVcbiAgICAgIC8vIGlmIGEga2V5ZWQgbm9kZSBoYXMgYmVlbiBtYXRjaGVkIHVwIG9yIG5vdFxuICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49a2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxUb1JlbW92ZSA9IGZyb21Ob2Rlc0xvb2t1cFtrZXllZFJlbW92YWxMaXN0W2ldXTtcbiAgICAgICAgICBpZiAoZWxUb1JlbW92ZSkge1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgaWYgKG1vcnBoZWROb2RlLmFjdHVhbGl6ZSkge1xuICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgfTtcbn1cblxudmFyIG1vcnBoZG9tID0gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3JwaGRvbTtcbiIsICJpbXBvcnQge1xuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfUFJVTkUsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NLSVAsXG4gIFBIWF9NQUdJQ19JRCxcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSSUdHRVJfQUNUSU9OLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfU1RSRUFNLFxuICBQSFhfU1RSRUFNX1JFRixcbiAgUEhYX1ZJRVdQT1JUX1RPUCxcbiAgUEhYX1ZJRVdQT1JUX0JPVFRPTSxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgZGV0ZWN0RHVwbGljYXRlSWRzLFxuICBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyxcbiAgaXNDaWRcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRE9NUG9zdE1vcnBoUmVzdG9yZXIgZnJvbSBcIi4vZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXJcIlxuaW1wb3J0IG1vcnBoZG9tIGZyb20gXCJtb3JwaGRvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBhdGNoIHtcbiAgY29uc3RydWN0b3IodmlldywgY29udGFpbmVyLCBpZCwgaHRtbCwgc3RyZWFtcywgdGFyZ2V0Q0lELCBvcHRzPXt9KXtcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJcbiAgICB0aGlzLmlkID0gaWRcbiAgICB0aGlzLnJvb3RJRCA9IHZpZXcucm9vdC5pZFxuICAgIHRoaXMuaHRtbCA9IGh0bWxcbiAgICB0aGlzLnN0cmVhbXMgPSBzdHJlYW1zXG4gICAgdGhpcy5zdHJlYW1JbnNlcnRzID0ge31cbiAgICB0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmUgPSB7fVxuICAgIHRoaXMudGFyZ2V0Q0lEID0gdGFyZ2V0Q0lEXG4gICAgdGhpcy5jaWRQYXRjaCA9IGlzQ2lkKHRoaXMudGFyZ2V0Q0lEKVxuICAgIHRoaXMucGVuZGluZ1JlbW92ZXMgPSBbXVxuICAgIHRoaXMucGh4UmVtb3ZlID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoXCJyZW1vdmVcIilcbiAgICB0aGlzLnRhcmdldENvbnRhaW5lciA9IHRoaXMuaXNDSURQYXRjaCgpID8gdGhpcy50YXJnZXRDSURDb250YWluZXIoaHRtbCkgOiBjb250YWluZXJcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHtcbiAgICAgIGJlZm9yZWFkZGVkOiBbXSwgYmVmb3JldXBkYXRlZDogW10sIGJlZm9yZXBoeENoaWxkQWRkZWQ6IFtdLFxuICAgICAgYWZ0ZXJhZGRlZDogW10sIGFmdGVydXBkYXRlZDogW10sIGFmdGVyZGlzY2FyZGVkOiBbXSwgYWZ0ZXJwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVydHJhbnNpdGlvbnNEaXNjYXJkZWQ6IFtdXG4gICAgfVxuICAgIHRoaXMud2l0aENoaWxkcmVuID0gb3B0cy53aXRoQ2hpbGRyZW4gfHwgb3B0cy51bmRvUmVmIHx8IGZhbHNlXG4gICAgdGhpcy51bmRvUmVmID0gb3B0cy51bmRvUmVmXG4gIH1cblxuICBiZWZvcmUoa2luZCwgY2FsbGJhY2speyB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cbiAgYWZ0ZXIoa2luZCwgY2FsbGJhY2speyB0aGlzLmNhbGxiYWNrc1tgYWZ0ZXIke2tpbmR9YF0ucHVzaChjYWxsYmFjaykgfVxuXG4gIHRyYWNrQmVmb3JlKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BiZWZvcmUke2tpbmR9YF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSlcbiAgfVxuXG4gIHRyYWNrQWZ0ZXIoa2luZCwgLi4uYXJncyl7XG4gICAgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICBtYXJrUHJ1bmFibGVDb250ZW50Rm9yUmVtb3ZhbCgpe1xuICAgIGxldCBwaHhVcGRhdGUgPSB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhQSFhfVVBEQVRFKVxuICAgIERPTS5hbGwodGhpcy5jb250YWluZXIsIGBbJHtwaHhVcGRhdGV9PWFwcGVuZF0gPiAqLCBbJHtwaHhVcGRhdGV9PXByZXBlbmRdID4gKmAsIGVsID0+IHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUFJVTkUsIFwiXCIpXG4gICAgfSlcbiAgfVxuXG4gIHBlcmZvcm0oaXNKb2luUGF0Y2gpe1xuICAgIGxldCB7dmlldywgbGl2ZVNvY2tldCwgaHRtbCwgY29udGFpbmVyLCB0YXJnZXRDb250YWluZXJ9ID0gdGhpc1xuICAgIGlmKHRoaXMuaXNDSURQYXRjaCgpICYmICF0YXJnZXRDb250YWluZXIpeyByZXR1cm4gfVxuXG4gICAgbGV0IGZvY3VzZWQgPSBsaXZlU29ja2V0LmdldEFjdGl2ZUVsZW1lbnQoKVxuICAgIGxldCB7c2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZH0gPSBmb2N1c2VkICYmIERPTS5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSA/IGZvY3VzZWQgOiB7fVxuICAgIGxldCBwaHhVcGRhdGUgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSlcbiAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUClcbiAgICBsZXQgcGh4Vmlld3BvcnRCb3R0b20gPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1ZJRVdQT1JUX0JPVFRPTSlcbiAgICBsZXQgcGh4VHJpZ2dlckV4dGVybmFsID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9UUklHR0VSX0FDVElPTilcbiAgICBsZXQgYWRkZWQgPSBbXVxuICAgIGxldCB1cGRhdGVzID0gW11cbiAgICBsZXQgYXBwZW5kUHJlcGVuZFVwZGF0ZXMgPSBbXVxuXG4gICAgbGV0IGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IG51bGxcblxuICAgIGZ1bmN0aW9uIG1vcnBoKHRhcmdldENvbnRhaW5lciwgc291cmNlLCB3aXRoQ2hpbGRyZW49dGhpcy53aXRoQ2hpbGRyZW4pe1xuICAgICAgbGV0IG1vcnBoQ2FsbGJhY2tzID0ge1xuICAgICAgICAvLyBub3JtYWxseSwgd2UgYXJlIHJ1bm5pbmcgd2l0aCBjaGlsZHJlbk9ubHksIGFzIHRoZSBwYXRjaCBIVE1MIGZvciBhIExWXG4gICAgICAgIC8vIGRvZXMgbm90IGluY2x1ZGUgdGhlIExWIGF0dHJzIChkYXRhLXBoeC1zZXNzaW9uLCBldGMuKVxuICAgICAgICAvLyB3aGVuIHdlIGFyZSBwYXRjaGluZyBhIGxpdmUgY29tcG9uZW50LCB3ZSBkbyB3YW50IHRvIHBhdGNoIHRoZSByb290IGVsZW1lbnQgYXMgd2VsbDtcbiAgICAgICAgLy8gYW5vdGhlciBjYXNlIGlzIHRoZSByZWN1cnNpdmUgcGF0Y2ggb2YgYSBzdHJlYW0gaXRlbSB0aGF0IHdhcyBrZXB0IG9uIHJlc2V0ICgtPiBvbkJlZm9yZU5vZGVBZGRlZClcbiAgICAgICAgY2hpbGRyZW5Pbmx5OiB0YXJnZXRDb250YWluZXIuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpID09PSBudWxsICYmICF3aXRoQ2hpbGRyZW4sXG4gICAgICAgIGdldE5vZGVLZXk6IChub2RlKSA9PiB7XG4gICAgICAgICAgaWYoRE9NLmlzUGh4RGVzdHJveWVkKG5vZGUpKXsgcmV0dXJuIG51bGwgfVxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBqb2luIHBhdGNoLCB0aGVuIGJ5IGRlZmluaXRpb24gdGhlcmUgd2FzIG5vIFBIWF9NQUdJQ19JRC5cbiAgICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCB0byByZWR1Y2UgdGhlIGFtb3VudCBvZiBlbGVtZW50cyBtb3JwaGRvbSBkaXNjYXJkcy5cbiAgICAgICAgICBpZihpc0pvaW5QYXRjaCl7IHJldHVybiBub2RlLmlkIH1cbiAgICAgICAgICByZXR1cm4gbm9kZS5pZCB8fCAobm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoUEhYX01BR0lDX0lEKSlcbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2tpcCBpbmRleGluZyBmcm9tIGNoaWxkcmVuIHdoZW4gY29udGFpbmVyIGlzIHN0cmVhbVxuICAgICAgICBza2lwRnJvbUNoaWxkcmVuOiAoZnJvbSkgPT4geyByZXR1cm4gZnJvbS5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSA9PT0gUEhYX1NUUkVBTSB9LFxuICAgICAgICAvLyB0ZWxsIG1vcnBoZG9tIGhvdyB0byBhZGQgYSBjaGlsZFxuICAgICAgICBhZGRDaGlsZDogKHBhcmVudCwgY2hpbGQpID0+IHtcbiAgICAgICAgICBsZXQge3JlZiwgc3RyZWFtQXR9ID0gdGhpcy5nZXRTdHJlYW1JbnNlcnQoY2hpbGQpXG4gICAgICAgICAgaWYocmVmID09PSB1bmRlZmluZWQpeyByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKSB9XG5cbiAgICAgICAgICB0aGlzLnNldFN0cmVhbVJlZihjaGlsZCwgcmVmKVxuXG4gICAgICAgICAgLy8gc3RyZWFtaW5nXG4gICAgICAgICAgaWYoc3RyZWFtQXQgPT09IDApe1xuICAgICAgICAgICAgcGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgY2hpbGQpXG4gICAgICAgICAgfSBlbHNlIGlmKHN0cmVhbUF0ID09PSAtMSl7XG4gICAgICAgICAgICBsZXQgbGFzdENoaWxkID0gcGFyZW50Lmxhc3RFbGVtZW50Q2hpbGRcbiAgICAgICAgICAgIGlmKGxhc3RDaGlsZCAmJiAhbGFzdENoaWxkLmhhc0F0dHJpYnV0ZShQSFhfU1RSRUFNX1JFRikpe1xuICAgICAgICAgICAgICBsZXQgbm9uU3RyZWFtQ2hpbGQgPSBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZChjID0+ICFjLmhhc0F0dHJpYnV0ZShQSFhfU1RSRUFNX1JFRikpXG4gICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIG5vblN0cmVhbUNoaWxkKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZihzdHJlYW1BdCA+IDApe1xuICAgICAgICAgICAgbGV0IHNpYmxpbmcgPSBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbilbc3RyZWFtQXRdXG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBzaWJsaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVOb2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIERPTS5tYWludGFpblByaXZhdGVIb29rcyhlbCwgZWwsIHBoeFZpZXdwb3J0VG9wLCBwaHhWaWV3cG9ydEJvdHRvbSlcbiAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwiYWRkZWRcIiwgZWwpXG5cbiAgICAgICAgICBsZXQgbW9ycGhlZEVsID0gZWxcbiAgICAgICAgICAvLyB0aGlzIGlzIGEgc3RyZWFtIGl0ZW0gdGhhdCB3YXMga2VwdCBvbiByZXNldCwgcmVjdXJzaXZlbHkgbW9ycGggaXRcbiAgICAgICAgICBpZih0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmVbZWwuaWRdKXtcbiAgICAgICAgICAgIG1vcnBoZWRFbCA9IHRoaXMuc3RyZWFtQ29tcG9uZW50UmVzdG9yZVtlbC5pZF1cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmVbZWwuaWRdXG4gICAgICAgICAgICBtb3JwaC5jYWxsKHRoaXMsIG1vcnBoZWRFbCwgZWwsIHRydWUpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG1vcnBoZWRFbFxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVBZGRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlKXsgdGhpcy5tYXliZVJlT3JkZXJTdHJlYW0oZWwsIHRydWUpIH1cblxuICAgICAgICAgIC8vIGhhY2sgdG8gZml4IFNhZmFyaSBoYW5kbGluZyBvZiBpbWcgc3Jjc2V0IGFuZCB2aWRlbyB0YWdzXG4gICAgICAgICAgaWYoZWwgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50ICYmIGVsLnNyY3NldCl7XG4gICAgICAgICAgICBlbC5zcmNzZXQgPSBlbC5zcmNzZXRcbiAgICAgICAgICB9IGVsc2UgaWYoZWwgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50ICYmIGVsLmF1dG9wbGF5KXtcbiAgICAgICAgICAgIGVsLnBsYXkoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZigoRE9NLmlzUGh4Q2hpbGQoZWwpICYmIHZpZXcub3duc0VsZW1lbnQoZWwpKSB8fCBET00uaXNQaHhTdGlja3koZWwpICYmIHZpZXcub3duc0VsZW1lbnQoZWwucGFyZW50Tm9kZSkpe1xuICAgICAgICAgICAgdGhpcy50cmFja0FmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbClcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkZWQucHVzaChlbClcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlRGlzY2FyZGVkOiAoZWwpID0+IHRoaXMub25Ob2RlRGlzY2FyZGVkKGVsKSxcbiAgICAgICAgb25CZWZvcmVOb2RlRGlzY2FyZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9QUlVORSkgIT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICAgICAgaWYoZWwucGFyZW50RWxlbWVudCAhPT0gbnVsbCAmJiBlbC5pZCAmJlxuICAgICAgICAgICAgRE9NLmlzUGh4VXBkYXRlKGVsLnBhcmVudEVsZW1lbnQsIHBoeFVwZGF0ZSwgW1BIWF9TVFJFQU0sIFwiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHRoaXMubWF5YmVQZW5kaW5nUmVtb3ZlKGVsKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYodGhpcy5za2lwQ0lEU2libGluZyhlbCkpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgb25FbFVwZGF0ZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpe1xuICAgICAgICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gZWxcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlcy5wdXNoKGVsKVxuICAgICAgICAgIHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGVsLCBmYWxzZSlcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVFbFVwZGF0ZWQ6IChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgICAgICAvLyBpZiB3ZSBhcmUgcGF0Y2hpbmcgdGhlIHJvb3QgdGFyZ2V0IGNvbnRhaW5lciBhbmQgdGhlIGlkIGhhcyBjaGFuZ2VkLCB0cmVhdCBpdCBhcyBhIG5ldyBub2RlXG4gICAgICAgICAgLy8gYnkgcmVwbGFjaW5nIHRoZSBmcm9tRWwgd2l0aCB0aGUgdG9FbCwgd2hpY2ggZW5zdXJlcyBob29rcyBhcmUgdG9ybiBkb3duIGFuZCByZS1jcmVhdGVkXG4gICAgICAgICAgaWYoZnJvbUVsLmlkICYmIGZyb21FbC5pc1NhbWVOb2RlKHRhcmdldENvbnRhaW5lcikgJiYgZnJvbUVsLmlkICE9PSB0b0VsLmlkKXtcbiAgICAgICAgICAgIG1vcnBoQ2FsbGJhY2tzLm9uTm9kZURpc2NhcmRlZChmcm9tRWwpXG4gICAgICAgICAgICBmcm9tRWwucmVwbGFjZVdpdGgodG9FbClcbiAgICAgICAgICAgIHJldHVybiBtb3JwaENhbGxiYWNrcy5vbk5vZGVBZGRlZCh0b0VsKVxuICAgICAgICAgIH1cbiAgICAgICAgICBET00uc3luY1BlbmRpbmdBdHRycyhmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgRE9NLm1haW50YWluUHJpdmF0ZUhvb2tzKGZyb21FbCwgdG9FbCwgcGh4Vmlld3BvcnRUb3AsIHBoeFZpZXdwb3J0Qm90dG9tKVxuICAgICAgICAgIERPTS5jbGVhbkNoaWxkTm9kZXModG9FbCwgcGh4VXBkYXRlKVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcodG9FbCkpe1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGxpdmUgY29tcG9uZW50IHVzZWQgaW4gYSBzdHJlYW0sIHdlIG1heSBuZWVkIHRvIHJlb3JkZXIgaXRcbiAgICAgICAgICAgIHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNQaHhTdGlja3koZnJvbUVsKSl7XG4gICAgICAgICAgICBbUEhYX1NFU1NJT04sIFBIWF9TVEFUSUMsIFBIWF9ST09UX0lEXVxuICAgICAgICAgICAgICAubWFwKGF0dHIgPT4gW2F0dHIsIGZyb21FbC5nZXRBdHRyaWJ1dGUoYXR0ciksIHRvRWwuZ2V0QXR0cmlidXRlKGF0dHIpXSlcbiAgICAgICAgICAgICAgLmZvckVhY2goKFthdHRyLCBmcm9tVmFsLCB0b1ZhbF0pID0+IHtcbiAgICAgICAgICAgICAgICBpZih0b1ZhbCAmJiBmcm9tVmFsICE9PSB0b1ZhbCl7IGZyb21FbC5zZXRBdHRyaWJ1dGUoYXR0ciwgdG9WYWwpIH1cbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKERPTS5pc0lnbm9yZWQoZnJvbUVsLCBwaHhVcGRhdGUpIHx8IChmcm9tRWwuZm9ybSAmJiBmcm9tRWwuZm9ybS5pc1NhbWVOb2RlKGV4dGVybmFsRm9ybVRyaWdnZXJlZCkpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2lzSWdub3JlZDogRE9NLmlzSWdub3JlZChmcm9tRWwsIHBoeFVwZGF0ZSl9KVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGZyb21FbC50eXBlID09PSBcIm51bWJlclwiICYmIChmcm9tRWwudmFsaWRpdHkgJiYgZnJvbUVsLnZhbGlkaXR5LmJhZElucHV0KSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIFBIWF9SRUZfU1JDLCBpdCBpcyBsb2FkaW5nIG9yIGxvY2tlZCBhbmQgYXdhaXRpbmcgYW4gYWNrLlxuICAgICAgICAgIC8vIElmIGl0J3MgbG9ja2VkLCB3ZSBjbG9uZSB0aGUgZnJvbUVsIHRyZWUgYW5kIGluc3RydWN0IG1vcnBoZG9tIHRvIHVzZVxuICAgICAgICAgIC8vIHRoZSBjbG9uZWQgdHJlZSBhcyB0aGUgc291cmNlIG9mIHRoZSBtb3JwaCBmb3IgdGhpcyBicmFuY2ggZnJvbSBoZXJlIG9uIG91dC5cbiAgICAgICAgICAvLyBXZSBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBjbG9uZWQgdHJlZSBpbiB0aGUgZWxlbWVudCdzIHByaXZhdGUgZGF0YSwgYW5kXG4gICAgICAgICAgLy8gb24gYWNrICh2aWV3LnVuZG9SZWZzKSwgd2UgbW9ycGggdGhlIGNsb25lZCB0cmVlIHdpdGggdGhlIHRydWUgZnJvbUVsIGluIHRoZSBET00gdG9cbiAgICAgICAgICAvLyBhcHBseSBhbnkgY2hhbmdlcyB0aGF0IGhhcHBlbmVkIHdoaWxlIHRoZSBlbGVtZW50IHdhcyBsb2NrZWQuXG4gICAgICAgICAgbGV0IGlzRm9jdXNlZEZvcm1FbCA9IGZvY3VzZWQgJiYgZnJvbUVsLmlzU2FtZU5vZGUoZm9jdXNlZCkgJiYgRE9NLmlzRm9ybUlucHV0KGZyb21FbClcbiAgICAgICAgICBsZXQgZm9jdXNlZFNlbGVjdENoYW5nZWQgPSBpc0ZvY3VzZWRGb3JtRWwgJiYgdGhpcy5pc0NoYW5nZWRTZWxlY3QoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgIC8vIG9ubHkgcGVyZm9ybSB0aGUgY2xvbmUgc3RlcCBpZiB0aGlzIGlzIG5vdCBhIHBhdGNoIHRoYXQgdW5sb2Nrc1xuICAgICAgICAgIGlmKGZyb21FbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKSAhPSB0aGlzLnVuZG9SZWYpe1xuICAgICAgICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoZnJvbUVsKSl7XG4gICAgICAgICAgICAgIERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2lzSWdub3JlZDogdHJ1ZX0pXG4gICAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgbGV0IGlzTG9ja2VkID0gZnJvbUVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgICAgICAgICBsZXQgY2xvbmUgPSBpc0xvY2tlZCA/IERPTS5wcml2YXRlKGZyb21FbCwgUEhYX1JFRl9MT0NLKSB8fCBmcm9tRWwuY2xvbmVOb2RlKHRydWUpIDogbnVsbFxuICAgICAgICAgICAgaWYoY2xvbmUpe1xuICAgICAgICAgICAgICBET00ucHV0UHJpdmF0ZShmcm9tRWwsIFBIWF9SRUZfTE9DSywgY2xvbmUpXG4gICAgICAgICAgICAgIGlmKCFpc0ZvY3VzZWRGb3JtRWwpe1xuICAgICAgICAgICAgICAgIGZyb21FbCA9IGNsb25lXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgICAgICAgIGlmKERPTS5pc1BoeENoaWxkKHRvRWwpKXtcbiAgICAgICAgICAgIGxldCBwcmV2U2Vzc2lvbiA9IGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtleGNsdWRlOiBbUEhYX1NUQVRJQ119KVxuICAgICAgICAgICAgaWYocHJldlNlc3Npb24gIT09IFwiXCIpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCBwcmV2U2Vzc2lvbikgfVxuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290SUQpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGlmIHdlIGFyZSB1bmRvaW5nIGEgbG9jaywgY29weSBwb3RlbnRpYWxseSBuZXN0ZWQgY2xvbmVzIG92ZXJcbiAgICAgICAgICBpZih0aGlzLnVuZG9SZWYgJiYgRE9NLnByaXZhdGUodG9FbCwgUEhYX1JFRl9MT0NLKSl7XG4gICAgICAgICAgICBET00ucHV0UHJpdmF0ZShmcm9tRWwsIFBIWF9SRUZfTE9DSywgRE9NLnByaXZhdGUodG9FbCwgUEhYX1JFRl9MT0NLKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbm93IGNvcHkgcmVndWxhciBET00ucHJpdmF0ZSBkYXRhXG4gICAgICAgICAgRE9NLmNvcHlQcml2YXRlcyh0b0VsLCBmcm9tRWwpXG5cbiAgICAgICAgICAvLyBza2lwIHBhdGNoaW5nIGZvY3VzZWQgaW5wdXRzIHVubGVzcyBmb2N1cyBpcyBhIHNlbGVjdCB0aGF0IGhhcyBjaGFuZ2VkIG9wdGlvbnNcbiAgICAgICAgICBpZihpc0ZvY3VzZWRGb3JtRWwgJiYgZnJvbUVsLnR5cGUgIT09IFwiaGlkZGVuXCIgJiYgIWZvY3VzZWRTZWxlY3RDaGFuZ2VkKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5tZXJnZUZvY3VzZWRJbnB1dChmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyhmcm9tRWwpXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYmx1ciBmb2N1c2VkIHNlbGVjdCBpZiBpdCBjaGFuZ2VkIHNvIG5hdGl2ZSBVSSBpcyB1cGRhdGVkIChpZSBzYWZhcmkgd29uJ3QgdXBkYXRlIHZpc2libGUgb3B0aW9ucylcbiAgICAgICAgICAgIGlmKGZvY3VzZWRTZWxlY3RDaGFuZ2VkKXsgZnJvbUVsLmJsdXIoKSB9XG4gICAgICAgICAgICBpZihET00uaXNQaHhVcGRhdGUodG9FbCwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSl7XG4gICAgICAgICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLnB1c2gobmV3IERPTVBvc3RNb3JwaFJlc3RvcmVyKGZyb21FbCwgdG9FbCwgdG9FbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIERPTS5zeW5jQXR0cnNUb1Byb3BzKHRvRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKHRvRWwpXG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICByZXR1cm4gZnJvbUVsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtb3JwaGRvbSh0YXJnZXRDb250YWluZXIsIHNvdXJjZSwgbW9ycGhDYWxsYmFja3MpXG4gICAgfVxuXG4gICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGNvbnRhaW5lcilcbiAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBjb250YWluZXIsIGNvbnRhaW5lcilcblxuICAgIGxpdmVTb2NrZXQudGltZShcIm1vcnBoZG9tXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RyZWFtcy5mb3JFYWNoKChbcmVmLCBpbnNlcnRzLCBkZWxldGVJZHMsIHJlc2V0XSkgPT4ge1xuICAgICAgICBpbnNlcnRzLmZvckVhY2goKFtrZXksIHN0cmVhbUF0LCBsaW1pdF0pID0+IHtcbiAgICAgICAgICB0aGlzLnN0cmVhbUluc2VydHNba2V5XSA9IHtyZWYsIHN0cmVhbUF0LCBsaW1pdCwgcmVzZXR9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKHJlc2V0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgIERPTS5hbGwoY29udGFpbmVyLCBgWyR7UEhYX1NUUkVBTV9SRUZ9PVwiJHtyZWZ9XCJdYCwgY2hpbGQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVTdHJlYW1DaGlsZEVsZW1lbnQoY2hpbGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBkZWxldGVJZHMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgbGV0IGNoaWxkID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7aWR9XCJdYClcbiAgICAgICAgICBpZihjaGlsZCl7IHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKSB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBjbGVhciBzdHJlYW0gaXRlbXMgZnJvbSB0aGUgZGVhZCByZW5kZXIgaWYgdGhleSBhcmUgbm90IGluc2VydGVkIGFnYWluXG4gICAgICBpZihpc0pvaW5QYXRjaCl7XG4gICAgICAgIERPTS5hbGwodGhpcy5jb250YWluZXIsIGBbJHtwaHhVcGRhdGV9PSR7UEhYX1NUUkVBTX1dYCwgZWwgPT4ge1xuICAgICAgICAgIEFycmF5LmZyb20oZWwuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVTdHJlYW1DaGlsZEVsZW1lbnQoY2hpbGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgbW9ycGguY2FsbCh0aGlzLCB0YXJnZXRDb250YWluZXIsIGh0bWwpXG4gICAgfSlcblxuICAgIGlmKGxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgICBkZXRlY3REdXBsaWNhdGVJZHMoKVxuICAgICAgZGV0ZWN0SW52YWxpZFN0cmVhbUluc2VydHModGhpcy5zdHJlYW1JbnNlcnRzKVxuICAgICAgLy8gd2FybiBpZiB0aGVyZSBhcmUgYW55IGlucHV0cyBuYW1lZCBcImlkXCJcbiAgICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWU9aWRdXCIpKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBpZihub2RlLmZvcm0pe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJEZXRlY3RlZCBhbiBpbnB1dCB3aXRoIG5hbWU9XFxcImlkXFxcIiBpbnNpZGUgYSBmb3JtISBUaGlzIHdpbGwgY2F1c2UgcHJvYmxlbXMgd2hlbiBwYXRjaGluZyB0aGUgRE9NLlxcblwiLCBub2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGFwcGVuZFByZXBlbmRVcGRhdGVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50aW1lKFwicG9zdC1tb3JwaCBhcHBlbmQvcHJlcGVuZCByZXN0b3JhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLmZvckVhY2godXBkYXRlID0+IHVwZGF0ZS5wZXJmb3JtKCkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxpdmVTb2NrZXQuc2lsZW5jZUV2ZW50cygoKSA9PiBET00ucmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpKVxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGRvY3VtZW50LCBcInBoeDp1cGRhdGVcIilcbiAgICBhZGRlZC5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcImFkZGVkXCIsIGVsKSlcbiAgICB1cGRhdGVzLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwidXBkYXRlZFwiLCBlbCkpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25QZW5kaW5nUmVtb3ZlcygpXG5cbiAgICBpZihleHRlcm5hbEZvcm1UcmlnZ2VyZWQpe1xuICAgICAgbGl2ZVNvY2tldC51bmxvYWQoKVxuICAgICAgLy8gdXNlIHByb3RvdHlwZSdzIHN1Ym1pdCBpbiBjYXNlIHRoZXJlJ3MgYSBmb3JtIGNvbnRyb2wgd2l0aCBuYW1lIG9yIGlkIG9mIFwic3VibWl0XCJcbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRm9ybUVsZW1lbnQvc3VibWl0XG4gICAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkKS5zdWJtaXQuY2FsbChleHRlcm5hbEZvcm1UcmlnZ2VyZWQpXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBvbk5vZGVEaXNjYXJkZWQoZWwpe1xuICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgaWYoRE9NLmlzUGh4Q2hpbGQoZWwpIHx8IERPTS5pc1BoeFN0aWNreShlbCkpeyB0aGlzLmxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGVsKSB9XG4gICAgdGhpcy50cmFja0FmdGVyKFwiZGlzY2FyZGVkXCIsIGVsKVxuICB9XG5cbiAgbWF5YmVQZW5kaW5nUmVtb3ZlKG5vZGUpe1xuICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKHRoaXMucGh4UmVtb3ZlKSAhPT0gbnVsbCl7XG4gICAgICB0aGlzLnBlbmRpbmdSZW1vdmVzLnB1c2gobm9kZSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCl7XG4gICAgLy8gbWFrZSBzdXJlIHRvIG9ubHkgcmVtb3ZlIGVsZW1lbnRzIG93bmVkIGJ5IHRoZSBjdXJyZW50IHZpZXdcbiAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzMwNDdcbiAgICAvLyBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM2ODFcbiAgICBpZighdGhpcy52aWV3Lm93bnNFbGVtZW50KGNoaWxkKSl7IHJldHVybiB9XG5cbiAgICAvLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBub2RlIGlmIGl0IGlzIGFjdHVhbGx5IHJlLWFkZGVkIGluIHRoZSBzYW1lIHBhdGNoXG4gICAgLy8gd2UgZG8gTk9UIHdhbnQgdG8gZXhlY3V0ZSBwaHgtcmVtb3ZlLCB3ZSBkbyBOT1Qgd2FudCB0byBjYWxsIG9uTm9kZURpc2NhcmRlZFxuICAgIGlmKHRoaXMuc3RyZWFtSW5zZXJ0c1tjaGlsZC5pZF0pe1xuICAgICAgdGhpcy5zdHJlYW1Db21wb25lbnRSZXN0b3JlW2NoaWxkLmlkXSA9IGNoaWxkXG4gICAgICBjaGlsZC5yZW1vdmUoKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmx5IHJlbW92ZSB0aGUgZWxlbWVudCBub3cgaWYgaXQgaGFzIG5vIHBoeC1yZW1vdmUgYmluZGluZ1xuICAgICAgaWYoIXRoaXMubWF5YmVQZW5kaW5nUmVtb3ZlKGNoaWxkKSl7XG4gICAgICAgIGNoaWxkLnJlbW92ZSgpXG4gICAgICAgIHRoaXMub25Ob2RlRGlzY2FyZGVkKGNoaWxkKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFN0cmVhbUluc2VydChlbCl7XG4gICAgbGV0IGluc2VydCA9IGVsLmlkID8gdGhpcy5zdHJlYW1JbnNlcnRzW2VsLmlkXSA6IHt9XG4gICAgcmV0dXJuIGluc2VydCB8fCB7fVxuICB9XG5cbiAgc2V0U3RyZWFtUmVmKGVsLCByZWYpe1xuICAgIERPTS5wdXRTdGlja3koZWwsIFBIWF9TVFJFQU1fUkVGLCBlbCA9PiBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NUUkVBTV9SRUYsIHJlZikpXG4gIH1cblxuICBtYXliZVJlT3JkZXJTdHJlYW0oZWwsIGlzTmV3KXtcbiAgICBsZXQge3JlZiwgc3RyZWFtQXQsIHJlc2V0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGVsKVxuICAgIGlmKHN0cmVhbUF0ID09PSB1bmRlZmluZWQpeyByZXR1cm4gfVxuXG4gICAgLy8gd2UgbmVlZCB0byBzZXQgdGhlIFBIWF9TVFJFQU1fUkVGIGhlcmUgYXMgd2VsbCBhcyBhZGRDaGlsZCBpcyBpbnZva2VkIG9ubHkgZm9yIHBhcmVudHNcbiAgICB0aGlzLnNldFN0cmVhbVJlZihlbCwgcmVmKVxuXG4gICAgaWYoIXJlc2V0ICYmICFpc05ldyl7XG4gICAgICAvLyB3ZSBvbmx5IHJlb3JkZXIgaWYgdGhlIGVsZW1lbnQgaXMgbmV3IG9yIGl0J3MgYSBzdHJlYW0gcmVzZXRcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGhhcyBhIHBhcmVudCBlbGVtZW50O1xuICAgIC8vIGl0IGRvZXNuJ3QgaWYgd2UgYXJlIGN1cnJlbnRseSByZWN1cnNpdmVseSBtb3JwaGluZyAocmVzdG9yaW5nIGEgc2F2ZWQgc3RyZWFtIGNoaWxkKVxuICAgIC8vIGJlY2F1c2UgdGhlIGVsZW1lbnQgaXMgbm90IHlldCBhZGRlZCB0byB0aGUgcmVhbCBkb207XG4gICAgLy8gcmVvcmRlcmluZyBkb2VzIG5vdCBtYWtlIHNlbnNlIGluIHRoYXQgY2FzZSBhbnl3YXlcbiAgICBpZighZWwucGFyZW50RWxlbWVudCl7IHJldHVybiB9XG5cbiAgICBpZihzdHJlYW1BdCA9PT0gMCl7XG4gICAgICBlbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbCwgZWwucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZClcbiAgICB9IGVsc2UgaWYoc3RyZWFtQXQgPiAwKXtcbiAgICAgIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWwucGFyZW50RWxlbWVudC5jaGlsZHJlbilcbiAgICAgIGxldCBvbGRJbmRleCA9IGNoaWxkcmVuLmluZGV4T2YoZWwpXG4gICAgICBpZihzdHJlYW1BdCA+PSBjaGlsZHJlbi5sZW5ndGggLSAxKXtcbiAgICAgICAgZWwucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzaWJsaW5nID0gY2hpbGRyZW5bc3RyZWFtQXRdXG4gICAgICAgIGlmKG9sZEluZGV4ID4gc3RyZWFtQXQpe1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGVsLCBzaWJsaW5nLm5leHRFbGVtZW50U2libGluZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWF5YmVMaW1pdFN0cmVhbShlbClcbiAgfVxuXG4gIG1heWJlTGltaXRTdHJlYW0oZWwpe1xuICAgIGxldCB7bGltaXR9ID0gdGhpcy5nZXRTdHJlYW1JbnNlcnQoZWwpXG4gICAgbGV0IGNoaWxkcmVuID0gbGltaXQgIT09IG51bGwgJiYgQXJyYXkuZnJvbShlbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuKVxuICAgIGlmKGxpbWl0ICYmIGxpbWl0IDwgMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCAqIC0xKXtcbiAgICAgIGNoaWxkcmVuLnNsaWNlKDAsIGNoaWxkcmVuLmxlbmd0aCArIGxpbWl0KS5mb3JFYWNoKGNoaWxkID0+IHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKSlcbiAgICB9IGVsc2UgaWYobGltaXQgJiYgbGltaXQgPj0gMCAmJiBjaGlsZHJlbi5sZW5ndGggPiBsaW1pdCl7XG4gICAgICBjaGlsZHJlbi5zbGljZShsaW1pdCkuZm9yRWFjaChjaGlsZCA9PiB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkpXG4gICAgfVxuICB9XG5cbiAgdHJhbnNpdGlvblBlbmRpbmdSZW1vdmVzKCl7XG4gICAgbGV0IHtwZW5kaW5nUmVtb3ZlcywgbGl2ZVNvY2tldH0gPSB0aGlzXG4gICAgaWYocGVuZGluZ1JlbW92ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRyYW5zaXRpb25SZW1vdmVzKHBlbmRpbmdSZW1vdmVzLCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdSZW1vdmVzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZCA9IERPTS5maXJzdFBoeENoaWxkKGVsKVxuICAgICAgICAgIGlmKGNoaWxkKXsgbGl2ZVNvY2tldC5kZXN0cm95Vmlld0J5RWwoY2hpbGQpIH1cbiAgICAgICAgICBlbC5yZW1vdmUoKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBwZW5kaW5nUmVtb3ZlcylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaXNDaGFuZ2VkU2VsZWN0KGZyb21FbCwgdG9FbCl7XG4gICAgaWYoIShmcm9tRWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkgfHwgZnJvbUVsLm11bHRpcGxlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBpZihmcm9tRWwub3B0aW9ucy5sZW5ndGggIT09IHRvRWwub3B0aW9ucy5sZW5ndGgpeyByZXR1cm4gdHJ1ZSB9XG5cbiAgICAvLyBrZWVwIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgdG9FbC52YWx1ZSA9IGZyb21FbC52YWx1ZVxuXG4gICAgLy8gaW4gZ2VuZXJhbCB3ZSBoYXZlIHRvIGJlIHZlcnkgY2FyZWZ1bCB3aXRoIHVzaW5nIGlzRXF1YWxOb2RlIGFzIGl0IGRvZXMgbm90IGEgcmVsaWFibGVcbiAgICAvLyBET00gdHJlZSBlcXVhbGl0eSBjaGVjaywgYnV0IGZvciBzZWxlY3Rpb24gYXR0cmlidXRlcyBhbmQgb3B0aW9ucyBpdCB3b3JrcyBmaW5lXG4gICAgcmV0dXJuICFmcm9tRWwuaXNFcXVhbE5vZGUodG9FbClcbiAgfVxuXG4gIGlzQ0lEUGF0Y2goKXsgcmV0dXJuIHRoaXMuY2lkUGF0Y2ggfVxuXG4gIHNraXBDSURTaWJsaW5nKGVsKXtcbiAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGVsLmhhc0F0dHJpYnV0ZShQSFhfU0tJUClcbiAgfVxuXG4gIHRhcmdldENJRENvbnRhaW5lcihodG1sKXtcbiAgICBpZighdGhpcy5pc0NJRFBhdGNoKCkpeyByZXR1cm4gfVxuICAgIGxldCBbZmlyc3QsIC4uLnJlc3RdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpXG4gICAgaWYocmVzdC5sZW5ndGggPT09IDAgJiYgRE9NLmNoaWxkTm9kZUxlbmd0aChodG1sKSA9PT0gMSl7XG4gICAgICByZXR1cm4gZmlyc3RcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpcnN0ICYmIGZpcnN0LnBhcmVudE5vZGVcbiAgICB9XG4gIH1cblxuICBpbmRleE9mKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmluZGV4T2YoY2hpbGQpIH1cbn1cbiIsICJpbXBvcnQge1xuICBDT01QT05FTlRTLFxuICBEWU5BTUlDUyxcbiAgVEVNUExBVEVTLFxuICBFVkVOVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9TS0lQLFxuICBQSFhfTUFHSUNfSUQsXG4gIFJFUExZLFxuICBTVEFUSUMsXG4gIFRJVExFLFxuICBTVFJFQU0sXG4gIFJPT1QsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGlzT2JqZWN0LFxuICBsb2dFcnJvcixcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuY29uc3QgVk9JRF9UQUdTID0gbmV3IFNldChbXG4gIFwiYXJlYVwiLFxuICBcImJhc2VcIixcbiAgXCJiclwiLFxuICBcImNvbFwiLFxuICBcImNvbW1hbmRcIixcbiAgXCJlbWJlZFwiLFxuICBcImhyXCIsXG4gIFwiaW1nXCIsXG4gIFwiaW5wdXRcIixcbiAgXCJrZXlnZW5cIixcbiAgXCJsaW5rXCIsXG4gIFwibWV0YVwiLFxuICBcInBhcmFtXCIsXG4gIFwic291cmNlXCIsXG4gIFwidHJhY2tcIixcbiAgXCJ3YnJcIlxuXSlcbmNvbnN0IHF1b3RlQ2hhcnMgPSBuZXcgU2V0KFtcIidcIiwgXCJcXFwiXCJdKVxuXG5leHBvcnQgbGV0IG1vZGlmeVJvb3QgPSAoaHRtbCwgYXR0cnMsIGNsZWFySW5uZXJIVE1MKSA9PiB7XG4gIGxldCBpID0gMFxuICBsZXQgaW5zaWRlQ29tbWVudCA9IGZhbHNlXG4gIGxldCBiZWZvcmVUYWcsIGFmdGVyVGFnLCB0YWcsIHRhZ05hbWVFbmRzQXQsIGlkLCBuZXdIVE1MXG5cbiAgbGV0IGxvb2thaGVhZCA9IGh0bWwubWF0Y2goL14oXFxzKig/OjwhLS0uKj8tLT5cXHMqKSopPChbXlxcc1xcLz5dKykvKVxuICBpZihsb29rYWhlYWQgPT09IG51bGwpeyB0aHJvdyBuZXcgRXJyb3IoYG1hbGZvcm1lZCBodG1sICR7aHRtbH1gKSB9XG5cbiAgaSA9IGxvb2thaGVhZFswXS5sZW5ndGhcbiAgYmVmb3JlVGFnID0gbG9va2FoZWFkWzFdXG4gIHRhZyA9IGxvb2thaGVhZFsyXVxuICB0YWdOYW1lRW5kc0F0ID0gaVxuXG4gIC8vIFNjYW4gdGhlIG9wZW5pbmcgdGFnIGZvciBpZCwgaWYgdGhlcmUgaXMgYW55XG4gIGZvcihpOyBpIDwgaHRtbC5sZW5ndGg7IGkrKyl7XG4gICAgaWYoaHRtbC5jaGFyQXQoaSkgPT09IFwiPlwiICl7IGJyZWFrIH1cbiAgICBpZihodG1sLmNoYXJBdChpKSA9PT0gXCI9XCIpe1xuICAgICAgbGV0IGlzSWQgPSBodG1sLnNsaWNlKGkgLSAzLCBpKSA9PT0gXCIgaWRcIlxuICAgICAgaSsrXG4gICAgICBsZXQgY2hhciA9IGh0bWwuY2hhckF0KGkpXG4gICAgICBpZihxdW90ZUNoYXJzLmhhcyhjaGFyKSl7XG4gICAgICAgIGxldCBhdHRyU3RhcnRzQXQgPSBpXG4gICAgICAgIGkrK1xuICAgICAgICBmb3IoaTsgaSA8IGh0bWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGlmKGh0bWwuY2hhckF0KGkpID09PSBjaGFyKXsgYnJlYWsgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGlzSWQpe1xuICAgICAgICAgIGlkID0gaHRtbC5zbGljZShhdHRyU3RhcnRzQXQgKyAxLCBpKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgY2xvc2VBdCA9IGh0bWwubGVuZ3RoIC0gMVxuICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgd2hpbGUoY2xvc2VBdCA+PSBiZWZvcmVUYWcubGVuZ3RoICsgdGFnLmxlbmd0aCl7XG4gICAgbGV0IGNoYXIgPSBodG1sLmNoYXJBdChjbG9zZUF0KVxuICAgIGlmKGluc2lkZUNvbW1lbnQpe1xuICAgICAgaWYoY2hhciA9PT0gXCItXCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMywgY2xvc2VBdCkgPT09IFwiPCEtXCIpe1xuICAgICAgICBpbnNpZGVDb21tZW50ID0gZmFsc2VcbiAgICAgICAgY2xvc2VBdCAtPSA0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZUF0IC09IDFcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoY2hhciA9PT0gXCI+XCIgJiYgaHRtbC5zbGljZShjbG9zZUF0IC0gMiwgY2xvc2VBdCkgPT09IFwiLS1cIil7XG4gICAgICBpbnNpZGVDb21tZW50ID0gdHJ1ZVxuICAgICAgY2xvc2VBdCAtPSAzXG4gICAgfSBlbHNlIGlmKGNoYXIgPT09IFwiPlwiKXtcbiAgICAgIGJyZWFrXG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3NlQXQgLT0gMVxuICAgIH1cbiAgfVxuICBhZnRlclRhZyA9IGh0bWwuc2xpY2UoY2xvc2VBdCArIDEsIGh0bWwubGVuZ3RoKVxuXG4gIGxldCBhdHRyc1N0ciA9XG4gICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAubWFwKGF0dHIgPT4gYXR0cnNbYXR0cl0gPT09IHRydWUgPyBhdHRyIDogYCR7YXR0cn09XCIke2F0dHJzW2F0dHJdfVwiYClcbiAgICAgIC5qb2luKFwiIFwiKVxuXG4gIGlmKGNsZWFySW5uZXJIVE1MKXtcbiAgICAvLyBLZWVwIHRoZSBpZCBpZiBhbnlcbiAgICBsZXQgaWRBdHRyU3RyID0gaWQgPyBgIGlkPVwiJHtpZH1cImAgOiBcIlwiXG4gICAgaWYoVk9JRF9UQUdTLmhhcyh0YWcpKXtcbiAgICAgIG5ld0hUTUwgPSBgPCR7dGFnfSR7aWRBdHRyU3RyfSR7YXR0cnNTdHIgPT09IFwiXCIgPyBcIlwiIDogXCIgXCJ9JHthdHRyc1N0cn0vPmBcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3SFRNTCA9IGA8JHt0YWd9JHtpZEF0dHJTdHJ9JHthdHRyc1N0ciA9PT0gXCJcIiA/IFwiXCIgOiBcIiBcIn0ke2F0dHJzU3RyfT48LyR7dGFnfT5gXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCByZXN0ID0gaHRtbC5zbGljZSh0YWdOYW1lRW5kc0F0LCBjbG9zZUF0ICsgMSlcbiAgICBuZXdIVE1MID0gYDwke3RhZ30ke2F0dHJzU3RyID09PSBcIlwiID8gXCJcIiA6IFwiIFwifSR7YXR0cnNTdHJ9JHtyZXN0fWBcbiAgfVxuXG4gIHJldHVybiBbbmV3SFRNTCwgYmVmb3JlVGFnLCBhZnRlclRhZ11cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZWQge1xuICBzdGF0aWMgZXh0cmFjdChkaWZmKXtcbiAgICBsZXQge1tSRVBMWV06IHJlcGx5LCBbRVZFTlRTXTogZXZlbnRzLCBbVElUTEVdOiB0aXRsZX0gPSBkaWZmXG4gICAgZGVsZXRlIGRpZmZbUkVQTFldXG4gICAgZGVsZXRlIGRpZmZbRVZFTlRTXVxuICAgIGRlbGV0ZSBkaWZmW1RJVExFXVxuICAgIHJldHVybiB7ZGlmZiwgdGl0bGUsIHJlcGx5OiByZXBseSB8fCBudWxsLCBldmVudHM6IGV2ZW50cyB8fCBbXX1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXdJZCwgcmVuZGVyZWQpe1xuICAgIHRoaXMudmlld0lkID0gdmlld0lkXG4gICAgdGhpcy5yZW5kZXJlZCA9IHt9XG4gICAgdGhpcy5tYWdpY0lkID0gMFxuICAgIHRoaXMubWVyZ2VEaWZmKHJlbmRlcmVkKVxuICB9XG5cbiAgcGFyZW50Vmlld0lkKCl7IHJldHVybiB0aGlzLnZpZXdJZCB9XG5cbiAgdG9TdHJpbmcob25seUNpZHMpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlVG9TdHJpbmcodGhpcy5yZW5kZXJlZCwgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIHRydWUsIHt9KVxuICAgIHJldHVybiBbc3RyLCBzdHJlYW1zXVxuICB9XG5cbiAgcmVjdXJzaXZlVG9TdHJpbmcocmVuZGVyZWQsIGNvbXBvbmVudHMgPSByZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMsIGNoYW5nZVRyYWNraW5nLCByb290QXR0cnMpe1xuICAgIG9ubHlDaWRzID0gb25seUNpZHMgPyBuZXcgU2V0KG9ubHlDaWRzKSA6IG51bGxcbiAgICBsZXQgb3V0cHV0ID0ge2J1ZmZlcjogXCJcIiwgY29tcG9uZW50czogY29tcG9uZW50cywgb25seUNpZHM6IG9ubHlDaWRzLCBzdHJlYW1zOiBuZXcgU2V0KCl9XG4gICAgdGhpcy50b091dHB1dEJ1ZmZlcihyZW5kZXJlZCwgbnVsbCwgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzKVxuICAgIHJldHVybiBbb3V0cHV0LmJ1ZmZlciwgb3V0cHV0LnN0cmVhbXNdXG4gIH1cblxuICBjb21wb25lbnRDSURzKGRpZmYpeyByZXR1cm4gT2JqZWN0LmtleXMoZGlmZltDT01QT05FTlRTXSB8fCB7fSkubWFwKGkgPT4gcGFyc2VJbnQoaSkpIH1cblxuICBpc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpe1xuICAgIGlmKCFkaWZmW0NPTVBPTkVOVFNdKXsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGlmZikubGVuZ3RoID09PSAxXG4gIH1cblxuICBnZXRDb21wb25lbnQoZGlmZiwgY2lkKXsgcmV0dXJuIGRpZmZbQ09NUE9ORU5UU11bY2lkXSB9XG5cbiAgcmVzZXRSZW5kZXIoY2lkKXtcbiAgICAvLyB3ZSBhcmUgcmFjaW5nIGEgY29tcG9uZW50IGRlc3Ryb3ksIGl0IGNvdWxkIG5vdCBleGlzdCwgc29cbiAgICAvLyBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCB0cnkgdG8gc2V0IHJlc2V0IG9uIHVuZGVmaW5lZFxuICAgIGlmKHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSl7XG4gICAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0ucmVzZXQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgbWVyZ2VEaWZmKGRpZmYpe1xuICAgIGxldCBuZXdjID0gZGlmZltDT01QT05FTlRTXVxuICAgIGxldCBjYWNoZSA9IHt9XG4gICAgZGVsZXRlIGRpZmZbQ09NUE9ORU5UU11cbiAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy5tdXRhYmxlTWVyZ2UodGhpcy5yZW5kZXJlZCwgZGlmZilcbiAgICB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSB8fCB7fVxuXG4gICAgaWYobmV3Yyl7XG4gICAgICBsZXQgb2xkYyA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11cblxuICAgICAgZm9yKGxldCBjaWQgaW4gbmV3Yyl7XG4gICAgICAgIG5ld2NbY2lkXSA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChjaWQsIG5ld2NbY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2MpeyBvbGRjW2NpZF0gPSBuZXdjW2NpZF0gfVxuICAgICAgZGlmZltDT01QT05FTlRTXSA9IG5ld2NcbiAgICB9XG4gIH1cblxuICBjYWNoZWRGaW5kQ29tcG9uZW50KGNpZCwgY2RpZmYsIG9sZGMsIG5ld2MsIGNhY2hlKXtcbiAgICBpZihjYWNoZVtjaWRdKXtcbiAgICAgIHJldHVybiBjYWNoZVtjaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZGlmZiwgc3RhdCwgc2NpZCA9IGNkaWZmW1NUQVRJQ11cblxuICAgICAgaWYoaXNDaWQoc2NpZCkpe1xuICAgICAgICBsZXQgdGRpZmZcblxuICAgICAgICBpZihzY2lkID4gMCl7XG4gICAgICAgICAgdGRpZmYgPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoc2NpZCwgbmV3Y1tzY2lkXSwgb2xkYywgbmV3YywgY2FjaGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGRpZmYgPSBvbGRjWy1zY2lkXVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdCA9IHRkaWZmW1NUQVRJQ11cbiAgICAgICAgbmRpZmYgPSB0aGlzLmNsb25lTWVyZ2UodGRpZmYsIGNkaWZmLCB0cnVlKVxuICAgICAgICBuZGlmZltTVEFUSUNdID0gc3RhdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmRpZmYgPSBjZGlmZltTVEFUSUNdICE9PSB1bmRlZmluZWQgfHwgb2xkY1tjaWRdID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgIGNkaWZmIDogdGhpcy5jbG9uZU1lcmdlKG9sZGNbY2lkXSwgY2RpZmYsIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICBjYWNoZVtjaWRdID0gbmRpZmZcbiAgICAgIHJldHVybiBuZGlmZlxuICAgIH1cbiAgfVxuXG4gIG11dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1NUQVRJQ10gIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gc291cmNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2UpXG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgZG9NdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGZvcihsZXQga2V5IGluIHNvdXJjZSl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgbGV0IGlzT2JqVmFsID0gaXNPYmplY3QodmFsKVxuICAgICAgaWYoaXNPYmpWYWwgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXRWYWwsIHZhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHRhcmdldFtST09UXSl7XG4gICAgICB0YXJnZXQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8vIE1lcmdlcyBjaWQgdHJlZXMgdG9nZXRoZXIsIGNvcHlpbmcgc3RhdGljcyBmcm9tIHNvdXJjZSB0cmVlLlxuICAvL1xuICAvLyBUaGUgYHBydW5lTWFnaWNJZGAgaXMgcGFzc2VkIHRvIGNvbnRyb2wgcHJ1bmluZyB0aGUgbWFnaWNJZCBvZiB0aGVcbiAgLy8gdGFyZ2V0LiBXZSBtdXN0IGFsd2F5cyBwcnVuZSB0aGUgbWFnaWNJZCB3aGVuIHdlIGFyZSBzaGFyaW5nIHN0YXRpY3NcbiAgLy8gZnJvbSBhbm90aGVyIGNvbXBvbmVudC4gSWYgbm90IHBydW5pbmcsIHdlIHJlcGxpY2F0ZSB0aGUgbG9naWMgZnJvbVxuICAvLyBtdXRhYmxlTWVyZ2UsIHdoZXJlIHdlIHNldCBuZXdSZW5kZXIgdG8gdHJ1ZSBpZiB0aGVyZSBpcyBhIHJvb3RcbiAgLy8gKGVmZmVjdGl2ZWx5IGZvcmNpbmcgdGhlIG5ldyB2ZXJzaW9uIHRvIGJlIHJlbmRlcmVkIGluc3RlYWQgb2Ygc2tpcHBlZClcbiAgLy9cbiAgY2xvbmVNZXJnZSh0YXJnZXQsIHNvdXJjZSwgcHJ1bmVNYWdpY0lkKXtcbiAgICBsZXQgbWVyZ2VkID0gey4uLnRhcmdldCwgLi4uc291cmNlfVxuICAgIGZvcihsZXQga2V5IGluIG1lcmdlZCl7XG4gICAgICBsZXQgdmFsID0gc291cmNlW2tleV1cbiAgICAgIGxldCB0YXJnZXRWYWwgPSB0YXJnZXRba2V5XVxuICAgICAgaWYoaXNPYmplY3QodmFsKSAmJiB2YWxbU1RBVElDXSA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHZhbCwgcHJ1bmVNYWdpY0lkKVxuICAgICAgfSBlbHNlIGlmKHZhbCA9PT0gdW5kZWZpbmVkICYmIGlzT2JqZWN0KHRhcmdldFZhbCkpe1xuICAgICAgICBtZXJnZWRba2V5XSA9IHRoaXMuY2xvbmVNZXJnZSh0YXJnZXRWYWwsIHt9LCBwcnVuZU1hZ2ljSWQpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHBydW5lTWFnaWNJZCl7XG4gICAgICBkZWxldGUgbWVyZ2VkLm1hZ2ljSWRcbiAgICAgIGRlbGV0ZSBtZXJnZWQubmV3UmVuZGVyXG4gICAgfSBlbHNlIGlmKHRhcmdldFtST09UXSl7XG4gICAgICBtZXJnZWQubmV3UmVuZGVyID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICBjb21wb25lbnRUb1N0cmluZyhjaWQpe1xuICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcodGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSwgY2lkLCBudWxsKVxuICAgIGxldCBbc3RyaXBwZWRIVE1MLCBfYmVmb3JlLCBfYWZ0ZXJdID0gbW9kaWZ5Um9vdChzdHIsIHt9KVxuICAgIHJldHVybiBbc3RyaXBwZWRIVE1MLCBzdHJlYW1zXVxuICB9XG5cbiAgcHJ1bmVDSURzKGNpZHMpe1xuICAgIGNpZHMuZm9yRWFjaChjaWQgPT4gZGVsZXRlIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU11bY2lkXSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBnZXQoKXsgcmV0dXJuIHRoaXMucmVuZGVyZWQgfVxuXG4gIGlzTmV3RmluZ2VycHJpbnQoZGlmZiA9IHt9KXsgcmV0dXJuICEhZGlmZltTVEFUSUNdIH1cblxuICB0ZW1wbGF0ZVN0YXRpYyhwYXJ0LCB0ZW1wbGF0ZXMpe1xuICAgIGlmKHR5cGVvZiAocGFydCkgPT09IFwibnVtYmVyXCIpe1xuICAgICAgcmV0dXJuIHRlbXBsYXRlc1twYXJ0XVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFydFxuICAgIH1cbiAgfVxuXG4gIG5leHRNYWdpY0lEKCl7XG4gICAgdGhpcy5tYWdpY0lkKytcbiAgICByZXR1cm4gYG0ke3RoaXMubWFnaWNJZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgfVxuXG4gIC8vIENvbnZlcnRzIHJlbmRlcmVkIHRyZWUgdG8gb3V0cHV0IGJ1ZmZlci5cbiAgLy9cbiAgLy8gY2hhbmdlVHJhY2tpbmcgY29udHJvbHMgaWYgd2UgY2FuIGFwcGx5IHRoZSBQSFhfU0tJUCBvcHRpbWl6YXRpb24uXG4gIC8vIEl0IGlzIGRpc2FibGVkIGZvciBjb21wcmVoZW5zaW9ucyBzaW5jZSB3ZSBtdXN0IHJlLXJlbmRlciB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgLy8gYW5kIG5vIGluZGl2aWR1YWwgZWxlbWVudCBpcyB0cmFja2VkIGluc2lkZSB0aGUgY29tcHJlaGVuc2lvbi5cbiAgdG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzID0ge30pe1xuICAgIGlmKHJlbmRlcmVkW0RZTkFNSUNTXSl7IHJldHVybiB0aGlzLmNvbXByZWhlbnNpb25Ub0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpIH1cbiAgICBsZXQge1tTVEFUSUNdOiBzdGF0aWNzfSA9IHJlbmRlcmVkXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBpc1Jvb3QgPSByZW5kZXJlZFtST09UXVxuICAgIGxldCBwcmV2QnVmZmVyID0gb3V0cHV0LmJ1ZmZlclxuICAgIGlmKGlzUm9vdCl7IG91dHB1dC5idWZmZXIgPSBcIlwiIH1cblxuICAgIC8vIHRoaXMgY29uZGl0aW9uIGlzIGNhbGxlZCB3aGVuIGZpcnN0IHJlbmRlcmluZyBhbiBvcHRpbWl6YWJsZSBmdW5jdGlvbiBjb21wb25lbnQuXG4gICAgLy8gTEMgaGF2ZSB0aGVpciBtYWdpY0lkIHByZXZpb3VzbHkgc2V0XG4gICAgaWYoY2hhbmdlVHJhY2tpbmcgJiYgaXNSb290ICYmICFyZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgIHJlbmRlcmVkLm5ld1JlbmRlciA9IHRydWVcbiAgICAgIHJlbmRlcmVkLm1hZ2ljSWQgPSB0aGlzLm5leHRNYWdpY0lEKClcbiAgICB9XG5cbiAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF1cbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZFtpIC0gMV0sIHRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgIH1cblxuICAgIC8vIEFwcGxpZXMgdGhlIHJvb3QgdGFnIFwic2tpcFwiIG9wdGltaXphdGlvbiBpZiBzdXBwb3J0ZWQsIHdoaWNoIGNsZWFyc1xuICAgIC8vIHRoZSByb290IHRhZyBhdHRyaWJ1dGVzIGFuZCBpbm5lckhUTUwsIGFuZCBvbmx5IG1haW50YWlucyB0aGUgbWFnaWNJZC5cbiAgICAvLyBXZSBjYW4gb25seSBza2lwIHdoZW4gY2hhbmdlVHJhY2tpbmcgaXMgc3VwcG9ydGVkIChvdXRzaWRlIG9mIGEgY29tcHJlaGVuc2lvbiksXG4gICAgLy8gYW5kIHdoZW4gdGhlIHJvb3QgZWxlbWVudCBoYXNuJ3QgZXhwZXJpZW5jZWQgYW4gdW5yZW5kZXJlZCBtZXJnZSAobmV3UmVuZGVyIHRydWUpLlxuICAgIGlmKGlzUm9vdCl7XG4gICAgICBsZXQgc2tpcCA9IGZhbHNlXG4gICAgICBsZXQgYXR0cnNcbiAgICAgIC8vIFdoZW4gYSBMQyBpcyByZS1hZGRlZCB0byB0aGUgcGFnZSwgd2UgbmVlZCB0byByZS1yZW5kZXIgdGhlIGVudGlyZSBMQyB0cmVlLFxuICAgICAgLy8gdGhlcmVmb3JlIGNoYW5nZVRyYWNraW5nIGlzIGZhbHNlOyBob3dldmVyLCB3ZSBuZWVkIHRvIGtlZXAgYWxsIHRoZSBtYWdpY0lkc1xuICAgICAgLy8gZnJvbSBhbnkgZnVuY3Rpb24gY29tcG9uZW50IHNvIHRoZSBuZXh0IHRpbWUgdGhlIExDIGlzIHVwZGF0ZWQsIHdlIGNhbiBhcHBseVxuICAgICAgLy8gdGhlIHNraXAgb3B0aW1pemF0aW9uXG4gICAgICBpZihjaGFuZ2VUcmFja2luZyB8fCByZW5kZXJlZC5tYWdpY0lkKXtcbiAgICAgICAgc2tpcCA9IGNoYW5nZVRyYWNraW5nICYmICFyZW5kZXJlZC5uZXdSZW5kZXJcbiAgICAgICAgYXR0cnMgPSB7W1BIWF9NQUdJQ19JRF06IHJlbmRlcmVkLm1hZ2ljSWQsIC4uLnJvb3RBdHRyc31cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0gcm9vdEF0dHJzXG4gICAgICB9XG4gICAgICBpZihza2lwKXsgYXR0cnNbUEhYX1NLSVBdID0gdHJ1ZSB9XG4gICAgICBsZXQgW25ld1Jvb3QsIGNvbW1lbnRCZWZvcmUsIGNvbW1lbnRBZnRlcl0gPSBtb2RpZnlSb290KG91dHB1dC5idWZmZXIsIGF0dHJzLCBza2lwKVxuICAgICAgcmVuZGVyZWQubmV3UmVuZGVyID0gZmFsc2VcbiAgICAgIG91dHB1dC5idWZmZXIgPSBwcmV2QnVmZmVyICsgY29tbWVudEJlZm9yZSArIG5ld1Jvb3QgKyBjb21tZW50QWZ0ZXJcbiAgICB9XG4gIH1cblxuICBjb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBsZXQge1tEWU5BTUlDU106IGR5bmFtaWNzLCBbU1RBVElDXTogc3RhdGljcywgW1NUUkVBTV06IHN0cmVhbX0gPSByZW5kZXJlZFxuICAgIGxldCBbX3JlZiwgX2luc2VydHMsIGRlbGV0ZUlkcywgcmVzZXRdID0gc3RyZWFtIHx8IFtudWxsLCB7fSwgW10sIG51bGxdXG4gICAgc3RhdGljcyA9IHRoaXMudGVtcGxhdGVTdGF0aWMoc3RhdGljcywgdGVtcGxhdGVzKVxuICAgIGxldCBjb21wVGVtcGxhdGVzID0gdGVtcGxhdGVzIHx8IHJlbmRlcmVkW1RFTVBMQVRFU11cbiAgICBmb3IobGV0IGQgPSAwOyBkIDwgZHluYW1pY3MubGVuZ3RoOyBkKyspe1xuICAgICAgbGV0IGR5bmFtaWMgPSBkeW5hbWljc1tkXVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIC8vIEluc2lkZSBhIGNvbXByZWhlbnNpb24sIHdlIGRvbid0IHRyYWNrIGhvdyBkeW5hbWljcyBjaGFuZ2VcbiAgICAgICAgLy8gb3ZlciB0aW1lIChhbmQgZmVhdHVyZXMgbGlrZSBzdHJlYW1zIHdvdWxkIG1ha2UgdGhhdCBpbXBvc3NpYmxlXG4gICAgICAgIC8vIHVubGVzcyB3ZSBtb3ZlIHRoZSBzdHJlYW0gZGlmZmluZyBhd2F5IGZyb20gbW9ycGhkb20pLFxuICAgICAgICAvLyBzbyB3ZSBjYW4ndCBwZXJmb3JtIHJvb3QgY2hhbmdlIHRyYWNraW5nLlxuICAgICAgICBsZXQgY2hhbmdlVHJhY2tpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihkeW5hbWljW2kgLSAxXSwgY29tcFRlbXBsYXRlcywgb3V0cHV0LCBjaGFuZ2VUcmFja2luZylcbiAgICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzW2ldXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoc3RyZWFtICE9PSB1bmRlZmluZWQgJiYgKHJlbmRlcmVkW0RZTkFNSUNTXS5sZW5ndGggPiAwIHx8IGRlbGV0ZUlkcy5sZW5ndGggPiAwIHx8IHJlc2V0KSl7XG4gICAgICBkZWxldGUgcmVuZGVyZWRbU1RSRUFNXVxuICAgICAgcmVuZGVyZWRbRFlOQU1JQ1NdID0gW11cbiAgICAgIG91dHB1dC5zdHJlYW1zLmFkZChzdHJlYW0pXG4gICAgfVxuICB9XG5cbiAgZHluYW1pY1RvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcpe1xuICAgIGlmKHR5cGVvZiAocmVuZGVyZWQpID09PSBcIm51bWJlclwiKXtcbiAgICAgIGxldCBbc3RyLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpXG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0clxuICAgICAgb3V0cHV0LnN0cmVhbXMgPSBuZXcgU2V0KFsuLi5vdXRwdXQuc3RyZWFtcywgLi4uc3RyZWFtc10pXG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KHJlbmRlcmVkKSl7XG4gICAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcsIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHJlbmRlcmVkXG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlQ0lEVG9TdHJpbmcoY29tcG9uZW50cywgY2lkLCBvbmx5Q2lkcyl7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY2lkXSB8fCBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvciBDSUQgJHtjaWR9YCwgY29tcG9uZW50cylcbiAgICBsZXQgYXR0cnMgPSB7W1BIWF9DT01QT05FTlRdOiBjaWR9XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZClcbiAgICAvLyBUd28gb3B0aW1pemF0aW9uIHBhdGhzIGFwcGx5IGhlcmU6XG4gICAgLy9cbiAgICAvLyAgIDEuIFRoZSBvbmx5Q2lkcyBvcHRpbWl6YXRpb24gd29ya3MgYnkgdGhlIHNlcnZlciBkaWZmIHRlbGxpbmcgdXMgb25seSBzcGVjaWZpY1xuICAgIC8vICAgICBjaWQncyBoYXZlIGNoYW5nZWQuIFRoaXMgYWxsb3dzIHVzIHRvIHNraXAgcmVuZGVyaW5nIGFueSBjb21wb25lbnQgdGhhdCBoYXNuJ3QgY2hhbmdlZCxcbiAgICAvLyAgICAgd2hpY2ggdWx0aW1hdGVseSBzZXRzIFBIWF9TS0lQIHJvb3QgYXR0cmlidXRlIGFuZCBhdm9pZHMgcmVuZGVyaW5nIHRoZSBpbm5lckhUTUwuXG4gICAgLy9cbiAgICAvLyAgIDIuIFRoZSByb290IFBIWF9TS0lQIG9wdGltaXphdGlvbiBnZW5lcmFsaXplcyB0byBhbGwgSEVFeCBmdW5jdGlvbiBjb21wb25lbnRzLCBhbmRcbiAgICAvLyAgICAgd29ya3MgaW4gdGhlIHNhbWUgUEhYX1NLSVAgYXR0cmlidXRlIGZhc2hpb24gYXMgMSwgYnV0IHRoZSBuZXdSZW5kZXIgdHJhY2tpbmcgaXMgZG9uZVxuICAgIC8vICAgICBhdCB0aGUgZ2VuZXJhbCBkaWZmIG1lcmdlIGxldmVsLiBJZiB3ZSBtZXJnZSBhIGRpZmYgd2l0aCBuZXcgZHluYW1pY3MsIHdlIG5lY2Vzc2FyaWx5IGhhdmVcbiAgICAvLyAgICAgZXhwZXJpZW5jZWQgYSBjaGFuZ2Ugd2hpY2ggbXVzdCBiZSBhIG5ld1JlbmRlciwgYW5kIHRodXMgd2UgY2FuJ3Qgc2tpcCB0aGUgcmVuZGVyLlxuICAgIC8vXG4gICAgLy8gQm90aCBvcHRpbWl6YXRpb24gZmxvd3MgYXBwbHkgaGVyZS4gbmV3UmVuZGVyIGlzIHNldCBiYXNlZCBvbiB0aGUgb25seUNpZHMgb3B0aW1pemF0aW9uLCBhbmRcbiAgICAvLyB3ZSB0cmFjayBhIGRldGVybWluaXN0aWMgbWFnaWNJZCBiYXNlZCBvbiB0aGUgY2lkLlxuICAgIC8vXG4gICAgLy8gY2hhbmdlVHJhY2tpbmcgaXMgYWJvdXQgdGhlIGVudGlyZSB0cmVlXG4gICAgLy8gbmV3UmVuZGVyIGlzIGFib3V0IHRoZSBjdXJyZW50IHJvb3QgaW4gdGhlIHRyZWVcbiAgICAvL1xuICAgIC8vIEJ5IGRlZmF1bHQgY2hhbmdlVHJhY2tpbmcgaXMgZW5hYmxlZCwgYnV0IHdlIHNwZWNpYWwgY2FzZSB0aGUgZmxvdyB3aGVyZSB0aGUgY2xpZW50IGlzIHBydW5pbmdcbiAgICAvLyBjaWRzIGFuZCB0aGUgc2VydmVyIGFkZHMgdGhlIGNvbXBvbmVudCBiYWNrLiBJbiBzdWNoIGNhc2VzLCB3ZSBleHBsaWNpdGx5IGRpc2FibGUgY2hhbmdlVHJhY2tpbmdcbiAgICAvLyB3aXRoIHJlc2V0UmVuZGVyIGZvciB0aGlzIGNpZCwgdGhlbiByZS1lbmFibGUgaXQgYWZ0ZXIgdGhlIHJlY3Vyc2l2ZSBjYWxsIHRvIHNraXAgdGhlIG9wdGltaXphdGlvblxuICAgIC8vIGZvciB0aGUgZW50aXJlIGNvbXBvbmVudCB0cmVlLlxuICAgIGNvbXBvbmVudC5uZXdSZW5kZXIgPSAhc2tpcFxuICAgIGNvbXBvbmVudC5tYWdpY0lkID0gYGMke2NpZH0tJHt0aGlzLnBhcmVudFZpZXdJZCgpfWBcbiAgICAvLyBlbmFibGUgY2hhbmdlIHRyYWNraW5nIGFzIGxvbmcgYXMgdGhlIGNvbXBvbmVudCBoYXNuJ3QgYmVlbiByZXNldFxuICAgIGxldCBjaGFuZ2VUcmFja2luZyA9ICFjb21wb25lbnQucmVzZXRcbiAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyhjb21wb25lbnQsIGNvbXBvbmVudHMsIG9ubHlDaWRzLCBjaGFuZ2VUcmFja2luZywgYXR0cnMpXG4gICAgLy8gZGlzYWJsZSByZXNldCBhZnRlciB3ZSd2ZSByZW5kZXJlZFxuICAgIGRlbGV0ZSBjb21wb25lbnQucmVzZXRcblxuICAgIHJldHVybiBbaHRtbCwgc3RyZWFtc11cbiAgfVxufVxuIiwgImltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBBUklBIGZyb20gXCIuL2FyaWFcIlxuXG5sZXQgZm9jdXNTdGFjayA9IFtdXG5sZXQgZGVmYXVsdF90cmFuc2l0aW9uX3RpbWUgPSAyMDBcblxubGV0IEpTID0ge1xuICAvLyBwcml2YXRlXG4gIGV4ZWMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGRlZmF1bHRzKXtcbiAgICBsZXQgW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc10gPSBkZWZhdWx0cyB8fCBbbnVsbCwge2NhbGxiYWNrOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jYWxsYmFja31dXG4gICAgbGV0IGNvbW1hbmRzID0gcGh4RXZlbnQuY2hhckF0KDApID09PSBcIltcIiA/XG4gICAgICBKU09OLnBhcnNlKHBoeEV2ZW50KSA6IFtbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXV1cblxuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYoa2luZCA9PT0gZGVmYXVsdEtpbmQpe1xuICAgICAgICAvLyBhbHdheXMgcHJlZmVyIHRoZSBhcmdzLCBidXQga2VlcCBleGlzdGluZyBrZXlzIGZyb20gdGhlIGRlZmF1bHRBcmdzXG4gICAgICAgIGFyZ3MgPSB7Li4uZGVmYXVsdEFyZ3MsIC4uLmFyZ3N9XG4gICAgICAgIGFyZ3MuY2FsbGJhY2sgPSBhcmdzLmNhbGxiYWNrIHx8IGRlZmF1bHRBcmdzLmNhbGxiYWNrXG4gICAgICB9XG4gICAgICB0aGlzLmZpbHRlclRvRWxzKHZpZXcubGl2ZVNvY2tldCwgc291cmNlRWwsIGFyZ3MpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICB0aGlzW2BleGVjXyR7a2luZH1gXShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIGFyZ3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgaXNWaXNpYmxlKGVsKXtcbiAgICByZXR1cm4gISEoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0IHx8IGVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMClcbiAgfSxcblxuICAvLyByZXR1cm5zIHRydWUgaWYgYW55IHBhcnQgb2YgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSB2aWV3cG9ydFxuICBpc0luVmlld3BvcnQoZWwpe1xuICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgY29uc3Qgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcblxuICAgIHJldHVybiAoXG4gICAgICByZWN0LnJpZ2h0ID4gMCAmJlxuICAgICAgcmVjdC5ib3R0b20gPiAwICYmXG4gICAgICByZWN0LmxlZnQgPCB3aW5kb3dXaWR0aCAmJlxuICAgICAgcmVjdC50b3AgPCB3aW5kb3dIZWlnaHRcbiAgICApXG4gIH0sXG5cbiAgLy8gcHJpdmF0ZVxuXG4gIC8vIGNvbW1hbmRzXG5cbiAgZXhlY19leGVjKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHIsIHRvfSl7XG4gICAgbGV0IGVuY29kZWRKUyA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKVxuICAgIGlmKCFlbmNvZGVkSlMpeyB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICR7YXR0cn0gdG8gY29udGFpbiBKUyBjb21tYW5kIG9uIFwiJHt0b31cImApIH1cbiAgICB2aWV3LmxpdmVTb2NrZXQuZXhlY0pTKGVsLCBlbmNvZGVkSlMsIGV2ZW50VHlwZSlcbiAgfSxcblxuICBleGVjX2Rpc3BhdGNoKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2V2ZW50LCBkZXRhaWwsIGJ1YmJsZXN9KXtcbiAgICBkZXRhaWwgPSBkZXRhaWwgfHwge31cbiAgICBkZXRhaWwuZGlzcGF0Y2hlciA9IHNvdXJjZUVsXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZWwsIGV2ZW50LCB7ZGV0YWlsLCBidWJibGVzfSlcbiAgfSxcblxuICBleGVjX3B1c2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKXtcbiAgICBsZXQge2V2ZW50LCBkYXRhLCB0YXJnZXQsIHBhZ2VfbG9hZGluZywgbG9hZGluZywgdmFsdWUsIGRpc3BhdGNoZXIsIGNhbGxiYWNrfSA9IGFyZ3NcbiAgICBsZXQgcHVzaE9wdHMgPSB7bG9hZGluZywgdmFsdWUsIHRhcmdldCwgcGFnZV9sb2FkaW5nOiAhIXBhZ2VfbG9hZGluZ31cbiAgICBsZXQgdGFyZ2V0U3JjID0gZXZlbnRUeXBlID09PSBcImNoYW5nZVwiICYmIGRpc3BhdGNoZXIgPyBkaXNwYXRjaGVyIDogc291cmNlRWxcbiAgICBsZXQgcGh4VGFyZ2V0ID0gdGFyZ2V0IHx8IHRhcmdldFNyYy5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFwidGFyZ2V0XCIpKSB8fCB0YXJnZXRTcmNcbiAgICBjb25zdCBoYW5kbGVyID0gKHRhcmdldFZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgaWYoIXRhcmdldFZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICBpZihldmVudFR5cGUgPT09IFwiY2hhbmdlXCIpe1xuICAgICAgICBsZXQge25ld0NpZCwgX3RhcmdldH0gPSBhcmdzXG4gICAgICAgIF90YXJnZXQgPSBfdGFyZ2V0IHx8IChET00uaXNGb3JtSW5wdXQoc291cmNlRWwpID8gc291cmNlRWwubmFtZSA6IHVuZGVmaW5lZClcbiAgICAgICAgaWYoX3RhcmdldCl7IHB1c2hPcHRzLl90YXJnZXQgPSBfdGFyZ2V0IH1cbiAgICAgICAgdGFyZ2V0Vmlldy5wdXNoSW5wdXQoc291cmNlRWwsIHRhcmdldEN0eCwgbmV3Q2lkLCBldmVudCB8fCBwaHhFdmVudCwgcHVzaE9wdHMsIGNhbGxiYWNrKVxuICAgICAgfSBlbHNlIGlmKGV2ZW50VHlwZSA9PT0gXCJzdWJtaXRcIil7XG4gICAgICAgIGxldCB7c3VibWl0dGVyfSA9IGFyZ3NcbiAgICAgICAgdGFyZ2V0Vmlldy5zdWJtaXRGb3JtKHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBzdWJtaXR0ZXIsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFZpZXcucHVzaEV2ZW50KGV2ZW50VHlwZSwgc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIGRhdGEsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaW4gY2FzZSBvZiBmb3JtUmVjb3ZlcnksIHRhcmdldFZpZXcgYW5kIHRhcmdldEN0eCBhcmUgcGFzc2VkIGFzIGFyZ3VtZW50XG4gICAgLy8gYXMgdGhleSBhcmUgbG9va2VkIHVwIGluIGEgdGVtcGxhdGUgZWxlbWVudCwgbm90IHRoZSByZWFsIERPTVxuICAgIGlmKGFyZ3MudGFyZ2V0VmlldyAmJiBhcmdzLnRhcmdldEN0eCl7XG4gICAgICBoYW5kbGVyKGFyZ3MudGFyZ2V0VmlldywgYXJncy50YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIGV4ZWNfbmF2aWdhdGUoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgcmVwbGFjZSA/IFwicmVwbGFjZVwiIDogXCJwdXNoXCIsIG51bGwsIHNvdXJjZUVsKVxuICB9LFxuXG4gIGV4ZWNfcGF0Y2goZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5wdXNoSGlzdG9yeVBhdGNoKGUsIGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiLCBzb3VyY2VFbClcbiAgfSxcblxuICBleGVjX2ZvY3VzKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5hdHRlbXB0Rm9jdXMoZWwpXG4gICAgLy8gaW4gY2FzZSB0aGUgSlMuZm9jdXMgY29tbWFuZCBpcyBpbiBhIEpTLnNob3cvaGlkZS90b2dnbGUgY2hhaW4sIGZvciBzaG93IHdlIG5lZWRcbiAgICAvLyB0byB3YWl0IGZvciBKUy5zaG93IHRvIGhhdmUgdXBkYXRlZCB0aGUgZWxlbWVudCdzIGRpc3BsYXkgcHJvcGVydHkgKHNlZSBleGVjX3RvZ2dsZSlcbiAgICAvLyBidXQgdGhhdCBydW4gaW4gbmVzdGVkIGFuaW1hdGlvbiBmcmFtZXMsIHRoZXJlZm9yZSB3ZSBuZWVkIHRvIHVzZSB0aGVtIGhlcmUgYXMgd2VsbFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBBUklBLmF0dGVtcHRGb2N1cyhlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX2ZvY3VzX2ZpcnN0KGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbClcbiAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbCkpXG4gICAgfSlcbiAgfSxcblxuICBleGVjX3B1c2hfZm9jdXMoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKXtcbiAgICBmb2N1c1N0YWNrLnB1c2goZWwgfHwgc291cmNlRWwpXG4gIH0sXG5cbiAgZXhlY19wb3BfZm9jdXMoX2UsIF9ldmVudFR5cGUsIF9waHhFdmVudCwgX3ZpZXcsIF9zb3VyY2VFbCwgX2VsKXtcbiAgICBjb25zdCBlbCA9IGZvY3VzU3RhY2sucG9wKClcbiAgICBpZihlbCl7XG4gICAgICBlbC5mb2N1cygpXG4gICAgICAvLyBpZiB5b3Ugd29uZGVyIGFib3V0IHRoZSBuZXN0ZWQgYW5pbWF0aW9uIGZyYW1lcywgc2VlIGV4ZWNfZm9jdXNcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGVsLmZvY3VzKCkpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBleGVjX2FkZF9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgbmFtZXMsIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3JlbW92ZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9jbGFzcyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZV9hdHRyKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHI6IFthdHRyLCB2YWwxLCB2YWwyXX0pe1xuICAgIHRoaXMudG9nZ2xlQXR0cihlbCwgYXR0ciwgdmFsMSwgdmFsMilcbiAgfSxcblxuICBleGVjX3RyYW5zaXRpb24oZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dGltZSwgdHJhbnNpdGlvbiwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3RvZ2dsZShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lLCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3Nob3coZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmd9KXtcbiAgICB0aGlzLnNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY19oaWRlKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy5oaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKVxuICB9LFxuXG4gIGV4ZWNfc2V0X2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cjogW2F0dHIsIHZhbF19KXtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2F0dHIoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cn0pe1xuICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgfSxcblxuICAvLyB1dGlscyBmb3IgY29tbWFuZHNcblxuICBzaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZighdGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIG51bGwsIHRpbWUsIGJsb2NraW5nKVxuICAgIH1cbiAgfSxcblxuICBoaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKXtcbiAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgbnVsbCwgdHJhbnNpdGlvbiwgdGltZSwgYmxvY2tpbmcpXG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUsIGJsb2NraW5nKXtcbiAgICB0aW1lID0gdGltZSB8fCBkZWZhdWx0X3RyYW5zaXRpb25fdGltZVxuICAgIGxldCBbaW5DbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcywgaW5FbmRDbGFzc2VzXSA9IGlucyB8fCBbW10sIFtdLCBbXV1cbiAgICBsZXQgW291dENsYXNzZXMsIG91dFN0YXJ0Q2xhc3Nlcywgb3V0RW5kQ2xhc3Nlc10gPSBvdXRzIHx8IFtbXSwgW10sIFtdXVxuICAgIGlmKGluQ2xhc3Nlcy5sZW5ndGggPiAwIHx8IG91dENsYXNzZXMubGVuZ3RoID4gMCl7XG4gICAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0U3RhcnRDbGFzc2VzLCBpbkNsYXNzZXMuY29uY2F0KGluU3RhcnRDbGFzc2VzKS5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRDbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dEVuZENsYXNzZXMsIG91dFN0YXJ0Q2xhc3NlcykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZihldmVudFR5cGUgPT09IFwicmVtb3ZlXCIpeyByZXR1cm4gfVxuICAgICAgICBsZXQgb25TdGFydCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5TdGFydENsYXNzZXMsIG91dENsYXNzZXMuY29uY2F0KG91dFN0YXJ0Q2xhc3NlcykuY29uY2F0KG91dEVuZENsYXNzZXMpKVxuICAgICAgICAgIGNvbnN0IHN0aWNreURpc3BsYXkgPSBkaXNwbGF5IHx8IHRoaXMuZGVmYXVsdERpc3BsYXkoZWwpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhZGQgdGhlIHN0YXJ0aW5nICsgYWN0aXZlIGNsYXNzLCBUSEVOIG1ha2UgdGhlIGVsZW1lbnQgdmlzaWJsZVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGlmIHdlIHRvZ2dsZWQgdGhlIHZpc2liaWxpdHkgZWFybGllciBjc3MgYW5pbWF0aW9uc1xuICAgICAgICAgICAgLy8gd291bGQgZmxpY2tlciwgYXMgdGhlIGVsZW1lbnQgYmVjb21lcyB2aXNpYmxlIGJlZm9yZSB0aGUgYWN0aXZlIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gY2xhc3MgaXMgc2V0IChzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM0NTYpXG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5DbGFzc2VzLCBbXSlcbiAgICAgICAgICAgIC8vIGFkZE9yUmVtb3ZlQ2xhc3NlcyB1c2VzIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGl0c2VsZiwgdGhlcmVmb3JlIHdlIG5lZWQgdG8gbW92ZSB0aGUgcHV0U3RpY2t5XG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBuZXh0IHJlcXVlc3RBbmltYXRpb25GcmFtZS4uLlxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkVuZENsYXNzZXMsIGluU3RhcnRDbGFzc2VzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGxldCBvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIGluQ2xhc3Nlcy5jb25jYXQoaW5FbmRDbGFzc2VzKSlcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LWVuZFwiKSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICAgIG9uU3RhcnQoKVxuICAgICAgICAgIHNldFRpbWVvdXQob25FbmQsIHRpbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRW5kKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtc3RhcnRcIikpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICAgIGxldCBzdGlja3lEaXNwbGF5ID0gZGlzcGxheSB8fCB0aGlzLmRlZmF1bHREaXNwbGF5KGVsKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IHN0aWNreURpc3BsYXkpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZUNsYXNzZXMoZWwsIGNsYXNzZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcsIGJsb2NraW5nKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGxldCBbcHJldkFkZHMsIHByZXZSZW1vdmVzXSA9IERPTS5nZXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBbW10sIFtdXSlcbiAgICAgIGxldCBuZXdBZGRzID0gY2xhc3Nlcy5maWx0ZXIobmFtZSA9PiBwcmV2QWRkcy5pbmRleE9mKG5hbWUpIDwgMCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBjbGFzc2VzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBuZXdBZGRzLCBuZXdSZW1vdmVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZylcbiAgICB9KVxuICB9LFxuXG4gIHRvZ2dsZUF0dHIoZWwsIGF0dHIsIHZhbDEsIHZhbDIpe1xuICAgIGlmKGVsLmhhc0F0dHJpYnV0ZShhdHRyKSl7XG4gICAgICBpZih2YWwyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAvLyB0b2dnbGUgYmV0d2VlbiB2YWwxIGFuZCB2YWwyXG4gICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZShhdHRyKSA9PT0gdmFsMSl7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDJdXSwgW10pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlbW92ZSBhdHRyXG4gICAgICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbDFdXSwgW10pXG4gICAgfVxuICB9LFxuXG4gIGFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcywgcmVtb3ZlcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpe1xuICAgIHRpbWUgPSB0aW1lIHx8IGRlZmF1bHRfdHJhbnNpdGlvbl90aW1lXG4gICAgbGV0IFt0cmFuc2l0aW9uUnVuLCB0cmFuc2l0aW9uU3RhcnQsIHRyYW5zaXRpb25FbmRdID0gdHJhbnNpdGlvbiB8fCBbW10sIFtdLCBbXV1cbiAgICBpZih0cmFuc2l0aW9uUnVuLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uU3RhcnQsIFtdLmNvbmNhdCh0cmFuc2l0aW9uUnVuKS5jb25jYXQodHJhbnNpdGlvbkVuZCkpXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uUnVuLCBbXSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uRW5kLCB0cmFuc2l0aW9uU3RhcnQpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLmNvbmNhdCh0cmFuc2l0aW9uRW5kKSwgcmVtb3Zlcy5jb25jYXQodHJhbnNpdGlvblJ1bikuY29uY2F0KHRyYW5zaXRpb25TdGFydCkpXG4gICAgICBpZihibG9ja2luZyA9PT0gZmFsc2Upe1xuICAgICAgICBvblN0YXJ0KClcbiAgICAgICAgc2V0VGltZW91dChvbkRvbmUsIHRpbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgW1tdLCBbXV0pXG4gICAgICBsZXQga2VlcEFkZHMgPSBhZGRzLmZpbHRlcihuYW1lID0+IHByZXZBZGRzLmluZGV4T2YobmFtZSkgPCAwICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQga2VlcFJlbW92ZXMgPSByZW1vdmVzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBuZXdBZGRzID0gcHJldkFkZHMuZmlsdGVyKG5hbWUgPT4gcmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBBZGRzKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBhZGRzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcFJlbW92ZXMpXG5cbiAgICAgIERPTS5wdXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LnJlbW92ZSguLi5uZXdSZW1vdmVzKVxuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LmFkZCguLi5uZXdBZGRzKVxuICAgICAgICByZXR1cm4gW25ld0FkZHMsIG5ld1JlbW92ZXNdXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgc2V0T3JSZW1vdmVBdHRycyhlbCwgc2V0cywgcmVtb3Zlcyl7XG4gICAgbGV0IFtwcmV2U2V0cywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJhdHRyc1wiLCBbW10sIFtdXSlcblxuICAgIGxldCBhbHRlcmVkQXR0cnMgPSBzZXRzLm1hcCgoW2F0dHIsIF92YWxdKSA9PiBhdHRyKS5jb25jYXQocmVtb3ZlcylcbiAgICBsZXQgbmV3U2V0cyA9IHByZXZTZXRzLmZpbHRlcigoW2F0dHIsIF92YWxdKSA9PiAhYWx0ZXJlZEF0dHJzLmluY2x1ZGVzKGF0dHIpKS5jb25jYXQoc2V0cylcbiAgICBsZXQgbmV3UmVtb3ZlcyA9IHByZXZSZW1vdmVzLmZpbHRlcigoYXR0cikgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHJlbW92ZXMpXG5cbiAgICBET00ucHV0U3RpY2t5KGVsLCBcImF0dHJzXCIsIGN1cnJlbnRFbCA9PiB7XG4gICAgICBuZXdSZW1vdmVzLmZvckVhY2goYXR0ciA9PiBjdXJyZW50RWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpKVxuICAgICAgbmV3U2V0cy5mb3JFYWNoKChbYXR0ciwgdmFsXSkgPT4gY3VycmVudEVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpKVxuICAgICAgcmV0dXJuIFtuZXdTZXRzLCBuZXdSZW1vdmVzXVxuICAgIH0pXG4gIH0sXG5cbiAgaGFzQWxsQ2xhc3NlcyhlbCwgY2xhc3Nlcyl7IHJldHVybiBjbGFzc2VzLmV2ZXJ5KG5hbWUgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKSB9LFxuXG4gIGlzVG9nZ2xlZE91dChlbCwgb3V0Q2xhc3Nlcyl7XG4gICAgcmV0dXJuICF0aGlzLmlzVmlzaWJsZShlbCkgfHwgdGhpcy5oYXNBbGxDbGFzc2VzKGVsLCBvdXRDbGFzc2VzKVxuICB9LFxuXG4gIGZpbHRlclRvRWxzKGxpdmVTb2NrZXQsIHNvdXJjZUVsLCB7dG99KXtcbiAgICBsZXQgZGVmYXVsdFF1ZXJ5ID0gKCkgPT4ge1xuICAgICAgaWYodHlwZW9mKHRvKSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRvKVxuICAgICAgfSBlbHNlIGlmKHRvLmNsb3Nlc3Qpe1xuICAgICAgICBsZXQgdG9FbCA9IHNvdXJjZUVsLmNsb3Nlc3QodG8uY2xvc2VzdClcbiAgICAgICAgcmV0dXJuIHRvRWwgPyBbdG9FbF0gOiBbXVxuICAgICAgfSBlbHNlIGlmKHRvLmlubmVyKXtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUVsLnF1ZXJ5U2VsZWN0b3JBbGwodG8uaW5uZXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0byA/IGxpdmVTb2NrZXQuanNRdWVyeVNlbGVjdG9yQWxsKHNvdXJjZUVsLCB0bywgZGVmYXVsdFF1ZXJ5KSA6IFtzb3VyY2VFbF1cbiAgfSxcblxuICBkZWZhdWx0RGlzcGxheShlbCl7XG4gICAgcmV0dXJuIHt0cjogXCJ0YWJsZS1yb3dcIiwgdGQ6IFwidGFibGUtY2VsbFwifVtlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCldIHx8IFwiYmxvY2tcIlxuICB9LFxuXG4gIHRyYW5zaXRpb25DbGFzc2VzKHZhbCl7XG4gICAgaWYoIXZhbCl7IHJldHVybiBudWxsIH1cblxuICAgIGxldCBbdHJhbnMsIHRTdGFydCwgdEVuZF0gPSBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwgOiBbdmFsLnNwbGl0KFwiIFwiKSwgW10sIFtdXVxuICAgIHRyYW5zID0gQXJyYXkuaXNBcnJheSh0cmFucykgPyB0cmFucyA6IHRyYW5zLnNwbGl0KFwiIFwiKVxuICAgIHRTdGFydCA9IEFycmF5LmlzQXJyYXkodFN0YXJ0KSA/IHRTdGFydCA6IHRTdGFydC5zcGxpdChcIiBcIilcbiAgICB0RW5kID0gQXJyYXkuaXNBcnJheSh0RW5kKSA/IHRFbmQgOiB0RW5kLnNwbGl0KFwiIFwiKVxuICAgIHJldHVybiBbdHJhbnMsIHRTdGFydCwgdEVuZF1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKU1xuIiwgImltcG9ydCBKUyBmcm9tIFwiLi9qc1wiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmNvbnN0IEhPT0tfSUQgPSBcImhvb2tJZFwiXG5cbmxldCB2aWV3SG9va0lEID0gMVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0hvb2sge1xuICBzdGF0aWMgbWFrZUlEKCl7IHJldHVybiB2aWV3SG9va0lEKysgfVxuICBzdGF0aWMgZWxlbWVudElEKGVsKXsgcmV0dXJuIERPTS5wcml2YXRlKGVsLCBIT09LX0lEKSB9XG5cbiAgY29uc3RydWN0b3IodmlldywgZWwsIGNhbGxiYWNrcyl7XG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5fX2F0dGFjaFZpZXcodmlldylcbiAgICB0aGlzLl9fY2FsbGJhY2tzID0gY2FsbGJhY2tzXG4gICAgdGhpcy5fX2xpc3RlbmVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgSE9PS19JRCwgdGhpcy5jb25zdHJ1Y3Rvci5tYWtlSUQoKSlcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9fY2FsbGJhY2tzKXsgdGhpc1trZXldID0gdGhpcy5fX2NhbGxiYWNrc1trZXldIH1cbiAgfVxuXG4gIF9fYXR0YWNoVmlldyh2aWV3KXtcbiAgICBpZih2aWV3KXtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4gdmlld1xuICAgICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX192aWV3ID0gKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGhvb2sgbm90IHlldCBhdHRhY2hlZCB0byBhIGxpdmUgdmlldzogJHt0aGlzLmVsLm91dGVySFRNTH1gKVxuICAgICAgfVxuICAgICAgdGhpcy5saXZlU29ja2V0ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIF9fbW91bnRlZCgpeyB0aGlzLm1vdW50ZWQgJiYgdGhpcy5tb3VudGVkKCkgfVxuICBfX3VwZGF0ZWQoKXsgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpIH1cbiAgX19iZWZvcmVVcGRhdGUoKXsgdGhpcy5iZWZvcmVVcGRhdGUgJiYgdGhpcy5iZWZvcmVVcGRhdGUoKSB9XG4gIF9fZGVzdHJveWVkKCl7XG4gICAgdGhpcy5kZXN0cm95ZWQgJiYgdGhpcy5kZXN0cm95ZWQoKVxuICAgIERPTS5kZWxldGVQcml2YXRlKHRoaXMuZWwsIEhPT0tfSUQpIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNDk2XG4gIH1cbiAgX19yZWNvbm5lY3RlZCgpe1xuICAgIGlmKHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCl7XG4gICAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWNvbm5lY3RlZCAmJiB0aGlzLnJlY29ubmVjdGVkKClcbiAgICB9XG4gIH1cbiAgX19kaXNjb25uZWN0ZWQoKXtcbiAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSB0cnVlXG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgJiYgdGhpcy5kaXNjb25uZWN0ZWQoKVxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIHRoZSBob29rIHRvIEpTIGNvbW1hbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge1ZpZXdIb29rfSBob29rIC0gVGhlIFZpZXdIb29rIGluc3RhbmNlIHRvIGJpbmQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIG1ldGhvZHMgdG8gbWFuaXB1bGF0ZSB0aGUgRE9NIGFuZCBleGVjdXRlIEphdmFTY3JpcHQuXG4gICAqL1xuICBqcygpe1xuICAgIGxldCBob29rID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogRXhlY3V0ZXMgZW5jb2RlZCBKYXZhU2NyaXB0IGluIHRoZSBjb250ZXh0IG9mIHRoZSBob29rIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGVuY29kZWRKUyAtIFRoZSBlbmNvZGVkIEphdmFTY3JpcHQgc3RyaW5nIHRvIGV4ZWN1dGUuXG4gICAgICAgKi9cbiAgICAgIGV4ZWMoZW5jb2RlZEpTKXtcbiAgICAgICAgaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0LmV4ZWNKUyhob29rLmVsLCBlbmNvZGVkSlMsIFwiaG9va1wiKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTaG93cyBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gc2hvdy5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldCB3aGVuIHNob3dpbmcuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZV0gLSBUaGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMuIERlZmF1bHRzIDIwMC5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgc2hvdyhlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5zaG93KFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEhpZGVzIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBoaWRlLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnRyYW5zaXRpb25dIC0gVGhlIENTUyB0cmFuc2l0aW9uIGNsYXNzZXMgdG8gc2V0IHdoZW4gaGlkaW5nLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLiBEZWZhdWx0cyAyMDAuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJsb2NraW5nXSAtIFRoZSBib29sZWFuIGZsYWcgdG8gYmxvY2sgdGhlIFVJIGR1cmluZyB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqICAgRGVmYXVsdHMgYHRydWVgLlxuICAgICAgICovXG4gICAgICBoaWRlKGVsLCBvcHRzID0ge30pe1xuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLmhpZGUoXCJob29rXCIsIG93bmVyLCBlbCwgbnVsbCwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgdGhlIHZpc2liaWxpdHkgb2YgYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5kaXNwbGF5XSAtIFRoZSBDU1MgZGlzcGxheSB2YWx1ZSB0byBzZXQuIERlZmF1bHRzIFwiYmxvY2tcIi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5pbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyBmb3Igc2hvd2luZy5cbiAgICAgICAqICAgQWNjZXB0cyBlaXRoZXIgdGhlIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgaW4sIG9yXG4gICAgICAgKiAgIGEgMy10dXBsZSBjb250YWluaW5nIHRoZSB0cmFuc2l0aW9uIGNsYXNzLCB0aGUgY2xhc3MgdG8gYXBwbHlcbiAgICAgICAqICAgdG8gc3RhcnQgdGhlIHRyYW5zaXRpb24sIGFuZCB0aGUgZW5kaW5nIHRyYW5zaXRpb24gY2xhc3MsIHN1Y2ggYXM6XG4gICAgICAgKlxuICAgICAgICogICAgICAgW1wiZWFzZS1vdXQgZHVyYXRpb24tMzAwXCIsIFwib3BhY2l0eS0wXCIsIFwib3BhY2l0eS0xMDBcIl1cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMub3V0XSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIGZvciBoaWRpbmcuXG4gICAgICAgKiAgIEFjY2VwdHMgZWl0aGVyIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgb3V0LCBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHRvZ2dsZShlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBvcHRzLmluID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy5pbilcbiAgICAgICAgb3B0cy5vdXQgPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLm91dClcbiAgICAgICAgSlMudG9nZ2xlKFwiaG9va1wiLCBvd25lciwgZWwsIG9wdHMuZGlzcGxheSwgb3B0cy5pbiwgb3B0cy5vdXQsIG9wdHMudGltZSwgb3B0cy5ibG9ja2luZylcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyBDU1MgY2xhc3NlcyB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYWRkIGNsYXNzZXMgdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byBhZGQuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gcHJvcGVydHkgdG8gc2V0LlxuICAgICAgICogICBBY2NlcHRzIGEgc3RyaW5nIG9mIGNsYXNzZXMgdG8gYXBwbHkgd2hlbiBhZGRpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMFwiLCBcIm9wYWNpdHktMTAwXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgYWRkQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG5hbWVzLCBbXSwgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmVzIENTUyBjbGFzc2VzIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSBjbGFzc2VzIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byByZW1vdmUuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyB0byBzZXQuXG4gICAgICAgKiAgIEFjY2VwdHMgYSBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHJlbW92aW5nIGNsYXNzZXMgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIm9wYWNpdHktMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBuYW1lcywgb3B0cyA9IHt9KXtcbiAgICAgICAgb3B0cy50cmFuc2l0aW9uID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy50cmFuc2l0aW9uKVxuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBuYW1lcywgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIENTUyBjbGFzc2VzIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgY2xhc3NlcyBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBuYW1lcyAtIFRoZSBjbGFzcyBuYW1lKHMpIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldC5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdG9nZ2xpbmcgY2xhc3NlcyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdG9nZ2xlQ2xhc3MoZWwsIG5hbWVzLCBvcHRzID0ge30pe1xuICAgICAgICBvcHRzLnRyYW5zaXRpb24gPSBKUy50cmFuc2l0aW9uQ2xhc3NlcyhvcHRzLnRyYW5zaXRpb24pXG4gICAgICAgIG5hbWVzID0gQXJyYXkuaXNBcnJheShuYW1lcykgPyBuYW1lcyA6IG5hbWVzLnNwbGl0KFwiIFwiKVxuICAgICAgICBsZXQgb3duZXIgPSBob29rLl9fdmlldygpLmxpdmVTb2NrZXQub3duZXIoZWwpXG4gICAgICAgIEpTLnRvZ2dsZUNsYXNzZXMoZWwsIG5hbWVzLCBvcHRzLnRyYW5zaXRpb24sIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFwcGxpZXMgYSBDU1MgdHJhbnNpdGlvbiB0byBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYXBwbHkgdGhlIHRyYW5zaXRpb24gdG8uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdHJhbnNpdGlvbiAtIFRoZSB0cmFuc2l0aW9uIGNsYXNzKGVzKSB0byBhcHBseS5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gdHJhbnNpdGlvbmluZyBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwib3BhY2l0eS0wXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgdHJhbnNpdGlvbihlbCwgdHJhbnNpdGlvbiwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBbXSwgSlMudHJhbnNpdGlvbkNsYXNzZXModHJhbnNpdGlvbiksIG9wdHMudGltZSwgb3duZXIsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNldHMgYW4gYXR0cmlidXRlIG9uIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byBzZXQgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHNldC5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwgLSBUaGUgdmFsdWUgdG8gc2V0IGZvciB0aGUgYXR0cmlidXRlLlxuICAgICAgICovXG4gICAgICBzZXRBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbCl7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKSB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZXMgYW4gYXR0cmlidXRlIGZyb20gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byByZW1vdmUuXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShlbCwgYXR0cil7IEpTLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtdLCBbYXR0cl0pIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlcyBhbiBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudCBiZXR3ZWVuIHR3byB2YWx1ZXMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUgdGhlIGF0dHJpYnV0ZSBvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHRvZ2dsZS5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwxIC0gVGhlIGZpcnN0IHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbDIgLSBUaGUgc2Vjb25kIHZhbHVlIHRvIHRvZ2dsZSBiZXR3ZWVuLlxuICAgICAgICovXG4gICAgICB0b2dnbGVBdHRyaWJ1dGUoZWwsIGF0dHIsIHZhbDEsIHZhbDIpeyBKUy50b2dnbGVBdHRyKGVsLCBhdHRyLCB2YWwxLCB2YWwyKSB9LFxuICAgIH1cbiAgfVxuXG4gIHB1c2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9LCBvblJlcGx5KXtcbiAgICBpZihvblJlcGx5ID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZWYgPSB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIChyZXBseSwgX3JlZikgPT4gcmVzb2x2ZShyZXBseSkpXG4gICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwidW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLnB1c2hIb29rRXZlbnQodGhpcy5lbCwgbnVsbCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gIH1cblxuICBwdXNoRXZlbnRUbyhwaHhUYXJnZXQsIGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkpe1xuICAgIGlmKG9uUmVwbHkgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZiA9IHZpZXcucHVzaEhvb2tFdmVudCh0aGlzLmVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCAocmVwbHksIF9yZWYpID0+IHJlc29sdmUocmVwbHkpKVxuICAgICAgICAgICAgaWYocmVmID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fdmlldygpLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICByZXR1cm4gdmlldy5wdXNoSG9va0V2ZW50KHRoaXMuZWwsIHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IGNhbGxiYWNrUmVmID0gKGN1c3RvbUV2ZW50LCBieXBhc3MpID0+IGJ5cGFzcyA/IGV2ZW50IDogY2FsbGJhY2soY3VzdG9tRXZlbnQuZGV0YWlsKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmFkZChjYWxsYmFja1JlZilcbiAgICByZXR1cm4gY2FsbGJhY2tSZWZcbiAgfVxuXG4gIHJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKXtcbiAgICBsZXQgZXZlbnQgPSBjYWxsYmFja1JlZihudWxsLCB0cnVlKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFja1JlZilcbiAgfVxuXG4gIHVwbG9hZChuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkuZGlzcGF0Y2hVcGxvYWRzKG51bGwsIG5hbWUsIGZpbGVzKVxuICB9XG5cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3KCkud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcuZGlzcGF0Y2hVcGxvYWRzKHRhcmdldEN0eCwgbmFtZSwgZmlsZXMpXG4gICAgfSlcbiAgfVxuXG4gIF9fY2xlYW51cF9fKCl7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrUmVmID0+IHRoaXMucmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpKVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCxcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgQ09OU0VDVVRJVkVfUkVMT0FEUyxcbiAgUEhYX0FVVE9fUkVDT1ZFUixcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0NPTk5FQ1RFRF9DTEFTUyxcbiAgUEhYX0RJU0FCTEVfV0lUSCxcbiAgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLFxuICBQSFhfRElTQUJMRUQsXG4gIFBIWF9MT0FESU5HX0NMQVNTLFxuICBQSFhfRVJST1JfQ0xBU1MsXG4gIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1MsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9IT09LLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJPR1JFU1MsXG4gIFBIWF9SRUFET05MWSxcbiAgUEhYX1JFRl9MT0FESU5HLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9UUkFDS19TVEFUSUMsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9NQUlOLFxuICBQSFhfTU9VTlRFRCxcbiAgUFVTSF9USU1FT1VULFxuICBQSFhfVklFV1BPUlRfVE9QLFxuICBQSFhfVklFV1BPUlRfQk9UVE9NLFxuICBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGlzRW1wdHksXG4gIGlzRXF1YWxPYmosXG4gIGxvZ0Vycm9yLFxuICBtYXliZSxcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRWxlbWVudFJlZiBmcm9tIFwiLi9lbGVtZW50X3JlZlwiXG5pbXBvcnQgRE9NUGF0Y2ggZnJvbSBcIi4vZG9tX3BhdGNoXCJcbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5pbXBvcnQgUmVuZGVyZWQgZnJvbSBcIi4vcmVuZGVyZWRcIlxuaW1wb3J0IFZpZXdIb29rIGZyb20gXCIuL3ZpZXdfaG9va1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5leHBvcnQgbGV0IHByZXBlbmRGb3JtRGF0YUtleSA9IChrZXksIHByZWZpeCkgPT4ge1xuICBsZXQgaXNBcnJheSA9IGtleS5lbmRzV2l0aChcIltdXCIpXG4gIC8vIFJlbW92ZSB0aGUgXCJbXVwiIGlmIGl0J3MgYW4gYXJyYXlcbiAgbGV0IGJhc2VLZXkgPSBpc0FycmF5ID8ga2V5LnNsaWNlKDAsIC0yKSA6IGtleVxuICAvLyBSZXBsYWNlIGxhc3Qgb2NjdXJyZW5jZSBvZiBrZXkgYmVmb3JlIGEgY2xvc2luZyBicmFja2V0IG9yIHRoZSBlbmQgd2l0aCBrZXkgcGx1cyBzdWZmaXhcbiAgYmFzZUtleSA9IGJhc2VLZXkucmVwbGFjZSgvKFteXFxbXFxdXSspKFxcXT8kKS8sIGAke3ByZWZpeH0kMSQyYClcbiAgLy8gQWRkIGJhY2sgdGhlIFwiW11cIiBpZiBpdCB3YXMgYW4gYXJyYXlcbiAgaWYoaXNBcnJheSl7IGJhc2VLZXkgKz0gXCJbXVwiIH1cbiAgcmV0dXJuIGJhc2VLZXlcbn1cblxubGV0IHNlcmlhbGl6ZUZvcm0gPSAoZm9ybSwgbWV0YWRhdGEsIG9ubHlOYW1lcyA9IFtdKSA9PiB7XG4gIGNvbnN0IHtzdWJtaXR0ZXIsIC4uLm1ldGF9ID0gbWV0YWRhdGFcblxuICAvLyBXZSBtdXN0IGluamVjdCB0aGUgc3VibWl0dGVyIGluIHRoZSBvcmRlciB0aGF0IGl0IGV4aXN0cyBpbiB0aGUgRE9NXG4gIC8vIHJlbGF0aXZlIHRvIG90aGVyIGlucHV0cy4gRm9yIGV4YW1wbGUsIGZvciBjaGVja2JveCBncm91cHMsIHRoZSBvcmRlciBtdXN0IGJlIG1haW50YWluZWQuXG4gIGxldCBpbmplY3RlZEVsZW1lbnRcbiAgaWYoc3VibWl0dGVyICYmIHN1Ym1pdHRlci5uYW1lKXtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgIGlucHV0LnR5cGUgPSBcImhpZGRlblwiXG4gICAgLy8gc2V0IHRoZSBmb3JtIGF0dHJpYnV0ZSBpZiB0aGUgc3VibWl0dGVyIGhhcyBvbmU7XG4gICAgLy8gdGhpcyBjYW4gaGFwcGVuIGlmIHRoZSBlbGVtZW50IGlzIG91dHNpZGUgdGhlIGFjdHVhbCBmb3JtIGVsZW1lbnRcbiAgICBjb25zdCBmb3JtSWQgPSBzdWJtaXR0ZXIuZ2V0QXR0cmlidXRlKFwiZm9ybVwiKVxuICAgIGlmKGZvcm1JZCl7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJmb3JtXCIsIGZvcm1JZClcbiAgICB9XG4gICAgaW5wdXQubmFtZSA9IHN1Ym1pdHRlci5uYW1lXG4gICAgaW5wdXQudmFsdWUgPSBzdWJtaXR0ZXIudmFsdWVcbiAgICBzdWJtaXR0ZXIucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoaW5wdXQsIHN1Ym1pdHRlcilcbiAgICBpbmplY3RlZEVsZW1lbnQgPSBpbnB1dFxuICB9XG5cbiAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSlcbiAgY29uc3QgdG9SZW1vdmUgPSBbXVxuXG4gIGZvcm1EYXRhLmZvckVhY2goKHZhbCwga2V5LCBfaW5kZXgpID0+IHtcbiAgICBpZih2YWwgaW5zdGFuY2VvZiBGaWxlKXsgdG9SZW1vdmUucHVzaChrZXkpIH1cbiAgfSlcblxuICAvLyBDbGVhbnVwIGFmdGVyIGJ1aWxkaW5nIGZpbGVEYXRhXG4gIHRvUmVtb3ZlLmZvckVhY2goa2V5ID0+IGZvcm1EYXRhLmRlbGV0ZShrZXkpKVxuXG4gIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKVxuXG4gIGxldCBlbGVtZW50cyA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cylcbiAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSl7XG4gICAgaWYob25seU5hbWVzLmxlbmd0aCA9PT0gMCB8fCBvbmx5TmFtZXMuaW5kZXhPZihrZXkpID49IDApe1xuICAgICAgbGV0IGlucHV0cyA9IGVsZW1lbnRzLmZpbHRlcihpbnB1dCA9PiBpbnB1dC5uYW1lID09PSBrZXkpXG4gICAgICBsZXQgaXNVbnVzZWQgPSAhaW5wdXRzLnNvbWUoaW5wdXQgPT4gKERPTS5wcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQpIHx8IERPTS5wcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRCkpKVxuICAgICAgbGV0IGhpZGRlbiA9IGlucHV0cy5ldmVyeShpbnB1dCA9PiBpbnB1dC50eXBlID09PSBcImhpZGRlblwiKVxuICAgICAgaWYoaXNVbnVzZWQgJiYgIShzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUgPT0ga2V5KSAmJiAhaGlkZGVuKXtcbiAgICAgICAgcGFyYW1zLmFwcGVuZChwcmVwZW5kRm9ybURhdGFLZXkoa2V5LCBcIl91bnVzZWRfXCIpLCBcIlwiKVxuICAgICAgfVxuICAgICAgcGFyYW1zLmFwcGVuZChrZXksIHZhbClcbiAgICB9XG4gIH1cblxuICAvLyByZW1vdmUgdGhlIGluamVjdGVkIGVsZW1lbnQgYWdhaW5cbiAgLy8gKGl0IHdvdWxkIGJlIHJlbW92ZWQgYnkgdGhlIG5leHQgZG9tIHBhdGNoIGFueXdheSwgYnV0IHRoaXMgaXMgY2xlYW5lcilcbiAgaWYoc3VibWl0dGVyICYmIGluamVjdGVkRWxlbWVudCl7XG4gICAgc3VibWl0dGVyLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoaW5qZWN0ZWRFbGVtZW50KVxuICB9XG5cbiAgZm9yKGxldCBtZXRhS2V5IGluIG1ldGEpeyBwYXJhbXMuYXBwZW5kKG1ldGFLZXksIG1ldGFbbWV0YUtleV0pIH1cblxuICByZXR1cm4gcGFyYW1zLnRvU3RyaW5nKClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG4gIHN0YXRpYyBjbG9zZXN0VmlldyhlbCl7XG4gICAgbGV0IGxpdmVWaWV3RWwgPSBlbC5jbG9zZXN0KFBIWF9WSUVXX1NFTEVDVE9SKVxuICAgIHJldHVybiBsaXZlVmlld0VsID8gRE9NLnByaXZhdGUobGl2ZVZpZXdFbCwgXCJ2aWV3XCIpIDogbnVsbFxuICB9XG5cbiAgY29uc3RydWN0b3IoZWwsIGxpdmVTb2NrZXQsIHBhcmVudFZpZXcsIGZsYXNoLCBsaXZlUmVmZXJlcil7XG4gICAgdGhpcy5pc0RlYWQgPSBmYWxzZVxuICAgIHRoaXMubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiAgICB0aGlzLmZsYXNoID0gZmxhc2hcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudFZpZXdcbiAgICB0aGlzLnJvb3QgPSBwYXJlbnRWaWV3ID8gcGFyZW50Vmlldy5yb290IDogdGhpc1xuICAgIHRoaXMuZWwgPSBlbFxuICAgIERPTS5wdXRQcml2YXRlKHRoaXMuZWwsIFwidmlld1wiLCB0aGlzKVxuICAgIHRoaXMuaWQgPSB0aGlzLmVsLmlkXG4gICAgdGhpcy5yZWYgPSAwXG4gICAgdGhpcy5sYXN0QWNrUmVmID0gbnVsbFxuICAgIHRoaXMuY2hpbGRKb2lucyA9IDBcbiAgICB0aGlzLmxvYWRlclRpbWVyID0gbnVsbFxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICB0aGlzLnBlbmRpbmdGb3JtcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMucmVkaXJlY3QgPSBmYWxzZVxuICAgIHRoaXMuaHJlZiA9IG51bGxcbiAgICB0aGlzLmpvaW5Db3VudCA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuam9pbkNvdW50IC0gMSA6IDBcbiAgICB0aGlzLmpvaW5BdHRlbXB0cyA9IDBcbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gdHJ1ZVxuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2VcbiAgICB0aGlzLmpvaW5DYWxsYmFjayA9IGZ1bmN0aW9uKG9uRG9uZSl7IG9uRG9uZSAmJiBvbkRvbmUoKSB9XG4gICAgdGhpcy5zdG9wQ2FsbGJhY2sgPSBmdW5jdGlvbigpeyB9XG4gICAgdGhpcy5wZW5kaW5nSm9pbk9wcyA9IHRoaXMucGFyZW50ID8gbnVsbCA6IFtdXG4gICAgdGhpcy52aWV3SG9va3MgPSB7fVxuICAgIHRoaXMuZm9ybVN1Ym1pdHMgPSBbXVxuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLnBhcmVudCA/IG51bGwgOiB7fVxuICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSA9IHt9XG4gICAgdGhpcy5mb3Jtc0ZvclJlY292ZXJ5ID0ge31cbiAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmxpdmVTb2NrZXQuY2hhbm5lbChgbHY6JHt0aGlzLmlkfWAsICgpID0+IHtcbiAgICAgIGxldCB1cmwgPSB0aGlzLmhyZWYgJiYgdGhpcy5leHBhbmRVUkwodGhpcy5ocmVmKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVkaXJlY3Q6IHRoaXMucmVkaXJlY3QgPyB1cmwgOiB1bmRlZmluZWQsXG4gICAgICAgIHVybDogdGhpcy5yZWRpcmVjdCA/IHVuZGVmaW5lZCA6IHVybCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHBhcmFtczogdGhpcy5jb25uZWN0UGFyYW1zKGxpdmVSZWZlcmVyKSxcbiAgICAgICAgc2Vzc2lvbjogdGhpcy5nZXRTZXNzaW9uKCksXG4gICAgICAgIHN0YXRpYzogdGhpcy5nZXRTdGF0aWMoKSxcbiAgICAgICAgZmxhc2g6IHRoaXMuZmxhc2gsXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHNldEhyZWYoaHJlZil7IHRoaXMuaHJlZiA9IGhyZWYgfVxuXG4gIHNldFJlZGlyZWN0KGhyZWYpe1xuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlXG4gICAgdGhpcy5ocmVmID0gaHJlZlxuICB9XG5cbiAgaXNNYWluKCl7IHJldHVybiB0aGlzLmVsLmhhc0F0dHJpYnV0ZShQSFhfTUFJTikgfVxuXG4gIGNvbm5lY3RQYXJhbXMobGl2ZVJlZmVyZXIpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG4gICAgcGFyYW1zW1wiX21vdW50X2F0dGVtcHRzXCJdID0gdGhpcy5qb2luQXR0ZW1wdHNcbiAgICBwYXJhbXNbXCJfbGl2ZV9yZWZlcmVyXCJdID0gbGl2ZVJlZmVyZXJcbiAgICB0aGlzLmpvaW5BdHRlbXB0cysrXG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfTE9BRElOR19DTEFTUyxcbiAgICAgIFBIWF9FUlJPUl9DTEFTUyxcbiAgICAgIFBIWF9DTElFTlRfRVJST1JfQ0xBU1MsXG4gICAgICBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9MT0FESU5HX0NMQVNTKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWNBbGwoYmluZGluZyl7XG4gICAgRE9NLmFsbCh0aGlzLmVsLCBgWyR7YmluZGluZ31dYCwgZWwgPT4gdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKGJpbmRpbmcpKSlcbiAgfVxuXG4gIGhpZGVMb2FkZXIoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoUEhYX0NPTk5FQ1RFRF9DTEFTUylcbiAgICB0aGlzLmV4ZWNBbGwodGhpcy5iaW5kaW5nKFwiY29ubmVjdGVkXCIpKVxuICB9XG5cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX3JlY29ubmVjdGVkKCkgfVxuICB9XG5cbiAgbG9nKGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIC8vIGNhbGxzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSB2aWV3IGFuZCB0YXJnZXQgZWxlbWVudCBmb3IgdGhlIGdpdmVuIHBoeFRhcmdldFxuICAvLyB0YXJnZXRzIGNhbiBiZTpcbiAgLy8gICogYW4gZWxlbWVudCBpdHNlbGYsIHRoZW4gaXQgaXMgc2ltcGx5IHBhc3NlZCB0byBsaXZlU29ja2V0Lm93bmVyO1xuICAvLyAgKiBhIENJRCAoQ29tcG9uZW50IElEKSwgdGhlbiB3ZSBmaXJzdCBzZWFyY2ggdGhlIGNvbXBvbmVudCdzIGVsZW1lbnQgaW4gdGhlIERPTVxuICAvLyAgKiBhIHNlbGVjdG9yLCB0aGVuIHdlIHNlYXJjaCB0aGUgc2VsZWN0b3IgaW4gdGhlIERPTSBhbmQgY2FsbCB0aGUgY2FsbGJhY2tcbiAgLy8gICAgZm9yIGVhY2ggZWxlbWVudCBmb3VuZCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIG93bmVyIHZpZXdcbiAgd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrLCBkb20gPSBkb2N1bWVudCwgdmlld0VsKXtcbiAgICAvLyBpbiB0aGUgZm9ybSByZWNvdmVyeSBjYXNlIHdlIHNlYXJjaCBpbiBhIHRlbXBsYXRlIGZyYWdtZW50IGluc3RlYWQgb2ZcbiAgICAvLyB0aGUgcmVhbCBkb20sIHRoZXJlZm9yZSB3ZSBvcHRpb25hbGx5IHBhc3MgZG9tIGFuZCB2aWV3RWxcblxuICAgIGlmKHBoeFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IHBoeFRhcmdldCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpe1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5vd25lcihwaHhUYXJnZXQsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgcGh4VGFyZ2V0KSlcbiAgICB9XG5cbiAgICBpZihpc0NpZChwaHhUYXJnZXQpKXtcbiAgICAgIGxldCB0YXJnZXRzID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh2aWV3RWwgfHwgdGhpcy5lbCwgcGh4VGFyZ2V0KVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApe1xuICAgICAgICBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvdW5kIG1hdGNoaW5nIHBoeC10YXJnZXQgb2YgJHtwaHhUYXJnZXR9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMsIHBhcnNlSW50KHBoeFRhcmdldCkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRzID0gQXJyYXkuZnJvbShkb20ucXVlcnlTZWxlY3RvckFsbChwaHhUYXJnZXQpKVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm90aGluZyBmb3VuZCBtYXRjaGluZyB0aGUgcGh4LXRhcmdldCBzZWxlY3RvciBcIiR7cGh4VGFyZ2V0fVwiYCkgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldCA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHRhcmdldCkpKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5RGlmZih0eXBlLCByYXdEaWZmLCBjYWxsYmFjayl7XG4gICAgdGhpcy5sb2codHlwZSwgKCkgPT4gW1wiXCIsIGNsb25lKHJhd0RpZmYpXSlcbiAgICBsZXQge2RpZmYsIHJlcGx5LCBldmVudHMsIHRpdGxlfSA9IFJlbmRlcmVkLmV4dHJhY3QocmF3RGlmZilcbiAgICBjYWxsYmFjayh7ZGlmZiwgcmVwbHksIGV2ZW50c30pXG4gICAgaWYodHlwZW9mIHRpdGxlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT0gXCJtb3VudFwiKXsgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBET00ucHV0VGl0bGUodGl0bGUpKSB9XG4gIH1cblxuICBvbkpvaW4ocmVzcCl7XG4gICAgbGV0IHtyZW5kZXJlZCwgY29udGFpbmVyLCBsaXZldmlld192ZXJzaW9ufSA9IHJlc3BcbiAgICBpZihjb250YWluZXIpe1xuICAgICAgbGV0IFt0YWcsIGF0dHJzXSA9IGNvbnRhaW5lclxuICAgICAgdGhpcy5lbCA9IERPTS5yZXBsYWNlUm9vdENvbnRhaW5lcih0aGlzLmVsLCB0YWcsIGF0dHJzKVxuICAgIH1cbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmZsYXNoID0gbnVsbFxuICAgIGlmKHRoaXMucm9vdCA9PT0gdGhpcyl7XG4gICAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB0aGlzLmdldEZvcm1zRm9yUmVjb3ZlcnkoKVxuICAgIH1cbiAgICBpZih0aGlzLmlzTWFpbigpICYmIHdpbmRvdy5oaXN0b3J5LnN0YXRlID09PSBudWxsKXtcbiAgICAgIC8vIHNldCBpbml0aWFsIGhpc3RvcnkgZW50cnkgaWYgdGhpcyBpcyB0aGUgZmlyc3QgcGFnZSBsb2FkIChubyBoaXN0b3J5KVxuICAgICAgQnJvd3Nlci5wdXNoU3RhdGUoXCJyZXBsYWNlXCIsIHtcbiAgICAgICAgdHlwZTogXCJwYXRjaFwiLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgcG9zaXRpb246IHRoaXMubGl2ZVNvY2tldC5jdXJyZW50SGlzdG9yeVBvc2l0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGxpdmV2aWV3X3ZlcnNpb24gIT09IHRoaXMubGl2ZVNvY2tldC52ZXJzaW9uKCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTGl2ZVZpZXcgYXNzZXQgdmVyc2lvbiBtaXNtYXRjaC4gSmF2YVNjcmlwdCB2ZXJzaW9uICR7dGhpcy5saXZlU29ja2V0LnZlcnNpb24oKX0gdnMuIHNlcnZlciAke2xpdmV2aWV3X3ZlcnNpb259LiBUbyBhdm9pZCBpc3N1ZXMsIHBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGFzc2V0cyB1c2UgdGhlIHNhbWUgdmVyc2lvbiBhcyB0aGUgc2VydmVyLmApXG4gICAgfVxuXG4gICAgQnJvd3Nlci5kcm9wTG9jYWwodGhpcy5saXZlU29ja2V0LmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTKVxuICAgIHRoaXMuYXBwbHlEaWZmKFwibW91bnRcIiwgcmVuZGVyZWQsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IG5ldyBSZW5kZXJlZCh0aGlzLmlkLCBkaWZmKVxuICAgICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyQ29udGFpbmVyKG51bGwsIFwiam9pblwiKVxuICAgICAgdGhpcy5kcm9wUGVuZGluZ1JlZnMoKVxuICAgICAgdGhpcy5qb2luQ291bnQrK1xuICAgICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG5cbiAgICAgIHRoaXMubWF5YmVSZWNvdmVyRm9ybXMoaHRtbCwgKCkgPT4ge1xuICAgICAgICB0aGlzLm9uSm9pbkNvbXBsZXRlKHJlc3AsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRyb3BQZW5kaW5nUmVmcygpe1xuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYCwgZWwgPT4ge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfTE9BRElORylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQylcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbkNvbXBsZXRlKHtsaXZlX3BhdGNofSwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICAvLyBJbiBvcmRlciB0byBwcm92aWRlIGEgYmV0dGVyIGV4cGVyaWVuY2UsIHdlIHdhbnQgdG8gam9pblxuICAgIC8vIGFsbCBMaXZlVmlld3MgZmlyc3QgYW5kIG9ubHkgdGhlbiBhcHBseSB0aGVpciBwYXRjaGVzLlxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSB8fCAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LmlzSm9pblBlbmRpbmcoKSkpe1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgIH1cblxuICAgIC8vIE9uZSBkb3duc2lkZSBvZiB0aGlzIGFwcHJvYWNoIGlzIHRoYXQgd2UgbmVlZCB0byBmaW5kIHBoeENoaWxkcmVuXG4gICAgLy8gaW4gdGhlIGh0bWwgZnJhZ21lbnQsIGluc3RlYWQgb2YgZGlyZWN0bHkgb24gdGhlIERPTS4gVGhlIGZyYWdtZW50XG4gICAgLy8gYWxzbyBkb2VzIG5vdCBpbmNsdWRlIFBIWF9TVEFUSUMsIHNvIHdlIG5lZWQgdG8gY29weSBpdCBvdmVyIGZyb21cbiAgICAvLyB0aGUgRE9NLlxuICAgIGxldCBuZXdDaGlsZHJlbiA9IERPTS5maW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHRoaXMuaWQpLmZpbHRlcih0b0VsID0+IHtcbiAgICAgIGxldCBmcm9tRWwgPSB0b0VsLmlkICYmIHRoaXMuZWwucXVlcnlTZWxlY3RvcihgW2lkPVwiJHt0b0VsLmlkfVwiXWApXG4gICAgICBsZXQgcGh4U3RhdGljID0gZnJvbUVsICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICAgIGlmKHBoeFN0YXRpYyl7IHRvRWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHBoeFN0YXRpYykgfVxuICAgICAgLy8gc2V0IFBIWF9ST09UX0lEIHRvIHByZXZlbnQgZXZlbnRzIGZyb20gYmVpbmcgZGlzcGF0Y2hlZCB0byB0aGUgcm9vdCB2aWV3XG4gICAgICAvLyB3aGlsZSB0aGUgY2hpbGQgam9pbiBpcyBzdGlsbCBwZW5kaW5nXG4gICAgICBpZihmcm9tRWwpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3QuaWQpIH1cbiAgICAgIHJldHVybiB0aGlzLmpvaW5DaGlsZCh0b0VsKVxuICAgIH0pXG5cbiAgICBpZihuZXdDaGlsZHJlbi5sZW5ndGggPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICAgIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXSlcbiAgICB9XG4gIH1cblxuICBhdHRhY2hUcnVlRG9jRWwoKXtcbiAgICB0aGlzLmVsID0gRE9NLmJ5SWQodGhpcy5pZClcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKVxuICB9XG5cbiAgLy8gdGhpcyBpcyBpbnZva2VkIGZvciBkZWFkIGFuZCBsaXZlIHZpZXdzLCBzbyB3ZSBtdXN0IGZpbHRlciBieVxuICAvLyBieSBvd25lciB0byBlbnN1cmUgd2UgYXJlbid0IGR1cGxpY2F0aW5nIGhvb2tzIGFjcm9zcyBkaXNjb25uZWN0XG4gIC8vIGFuZCBjb25uZWN0ZWQgc3RhdGVzLiBUaGlzIGFsc28gaGFuZGxlcyBjYXNlcyB3aGVyZSBob29rcyBleGlzdFxuICAvLyBpbiBhIHJvb3QgbGF5b3V0IHdpdGggYSBMViBpbiB0aGUgYm9keVxuICBleGVjTmV3TW91bnRlZChwYXJlbnQgPSB0aGlzLmVsKXtcbiAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUClcbiAgICBsZXQgcGh4Vmlld3BvcnRCb3R0b20gPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX0JPVFRPTSlcbiAgICBET00uYWxsKHBhcmVudCwgYFske3BoeFZpZXdwb3J0VG9wfV0sIFske3BoeFZpZXdwb3J0Qm90dG9tfV1gLCBob29rRWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChob29rRWwpKXtcbiAgICAgICAgRE9NLm1haW50YWluUHJpdmF0ZUhvb2tzKGhvb2tFbCwgaG9va0VsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dLCBbZGF0YS1waHgtJHtQSFhfSE9PS31dYCwgaG9va0VsID0+IHtcbiAgICAgIGlmKHRoaXMub3duc0VsZW1lbnQoaG9va0VsKSl7XG4gICAgICAgIHRoaXMubWF5YmVBZGROZXdIb29rKGhvb2tFbClcbiAgICAgIH1cbiAgICB9KVxuICAgIERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9NT1VOVEVEKX1dYCwgZWwgPT4ge1xuICAgICAgaWYodGhpcy5vd25zRWxlbWVudChlbCkpe1xuICAgICAgICB0aGlzLm1heWJlTW91bnRlZChlbClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKXtcbiAgICB0aGlzLmF0dGFjaFRydWVEb2NFbCgpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIHN0cmVhbXMsIG51bGwpXG4gICAgcGF0Y2gubWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKVxuICAgIHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCBmYWxzZSwgdHJ1ZSlcbiAgICB0aGlzLmpvaW5OZXdDaGlsZHJlbigpXG4gICAgdGhpcy5leGVjTmV3TW91bnRlZCgpXG5cbiAgICB0aGlzLmpvaW5QZW5kaW5nID0gZmFsc2VcbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG5cbiAgICBpZihsaXZlX3BhdGNoKXtcbiAgICAgIGxldCB7a2luZCwgdG99ID0gbGl2ZV9wYXRjaFxuICAgICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgICB9XG4gICAgdGhpcy5oaWRlTG9hZGVyKClcbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEpeyB0aGlzLnRyaWdnZXJSZWNvbm5lY3RlZCgpIH1cbiAgICB0aGlzLnN0b3BDYWxsYmFjaygpXG4gIH1cblxuICB0cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhmcm9tRWwsIHRvRWwpe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25CZWZvcmVFbFVwZGF0ZWRcIiwgW2Zyb21FbCwgdG9FbF0pXG4gICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soZnJvbUVsKVxuICAgIGxldCBpc0lnbm9yZWQgPSBob29rICYmIERPTS5pc0lnbm9yZWQoZnJvbUVsLCB0aGlzLmJpbmRpbmcoUEhYX1VQREFURSkpXG4gICAgaWYoaG9vayAmJiAhZnJvbUVsLmlzRXF1YWxOb2RlKHRvRWwpICYmICEoaXNJZ25vcmVkICYmIGlzRXF1YWxPYmooZnJvbUVsLmRhdGFzZXQsIHRvRWwuZGF0YXNldCkpKXtcbiAgICAgIGhvb2suX19iZWZvcmVVcGRhdGUoKVxuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gIH1cblxuICBtYXliZU1vdW50ZWQoZWwpe1xuICAgIGxldCBwaHhNb3VudGVkID0gZWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfTU9VTlRFRCkpXG4gICAgbGV0IGhhc0JlZW5JbnZva2VkID0gcGh4TW91bnRlZCAmJiBET00ucHJpdmF0ZShlbCwgXCJtb3VudGVkXCIpXG4gICAgaWYocGh4TW91bnRlZCAmJiAhaGFzQmVlbkludm9rZWQpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgcGh4TW91bnRlZClcbiAgICAgIERPTS5wdXRQcml2YXRlKGVsLCBcIm1vdW50ZWRcIiwgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBtYXliZUFkZE5ld0hvb2soZWwpe1xuICAgIGxldCBuZXdIb29rID0gdGhpcy5hZGRIb29rKGVsKVxuICAgIGlmKG5ld0hvb2speyBuZXdIb29rLl9fbW91bnRlZCgpIH1cbiAgfVxuXG4gIHBlcmZvcm1QYXRjaChwYXRjaCwgcHJ1bmVDaWRzLCBpc0pvaW5QYXRjaCA9IGZhbHNlKXtcbiAgICBsZXQgcmVtb3ZlZEVscyA9IFtdXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuICAgIGxldCB1cGRhdGVkSG9va0lkcyA9IG5ldyBTZXQoKVxuXG4gICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvblBhdGNoU3RhcnRcIiwgW3BhdGNoLnRhcmdldENvbnRhaW5lcl0pXG5cbiAgICBwYXRjaC5hZnRlcihcImFkZGVkXCIsIGVsID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25Ob2RlQWRkZWRcIiwgW2VsXSlcbiAgICAgIGxldCBwaHhWaWV3cG9ydFRvcCA9IHRoaXMuYmluZGluZyhQSFhfVklFV1BPUlRfVE9QKVxuICAgICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gdGhpcy5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgICBET00ubWFpbnRhaW5Qcml2YXRlSG9va3MoZWwsIGVsLCBwaHhWaWV3cG9ydFRvcCwgcGh4Vmlld3BvcnRCb3R0b20pXG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhlbClcbiAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVNb3VudGVkKGVsKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbCA9PiB7XG4gICAgICBpZihET00uaXNQaHhTdGlja3koZWwpKXtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LmpvaW5Sb290Vmlld3MoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybShpc0pvaW5QYXRjaClcbiAgICB0aGlzLmFmdGVyRWxlbWVudHNSZW1vdmVkKHJlbW92ZWRFbHMsIHBydW5lQ2lkcylcblxuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25QYXRjaEVuZFwiLCBbcGF0Y2gudGFyZ2V0Q29udGFpbmVyXSlcbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgbGV0IGhvb2tzID0gRE9NLmFsbChwYXJlbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV0sIFtkYXRhLXBoeC1ob29rXWApXG4gICAgICBjb21wb25lbnRzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBsZXQgY2lkID0gdGhpcy5jb21wb25lbnRJRChlbClcbiAgICAgICAgaWYoaXNDaWQoY2lkKSAmJiBkZXN0cm95ZWRDSURzLmluZGV4T2YoY2lkKSA9PT0gLTEpeyBkZXN0cm95ZWRDSURzLnB1c2goY2lkKSB9XG4gICAgICB9KVxuICAgICAgaG9va3MuY29uY2F0KHBhcmVudCkuZm9yRWFjaChob29rRWwgPT4ge1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMuZ2V0SG9vayhob29rRWwpXG4gICAgICAgIGhvb2sgJiYgdGhpcy5kZXN0cm95SG9vayhob29rKVxuICAgICAgfSlcbiAgICB9KVxuICAgIC8vIFdlIHNob3VsZCBub3QgcHJ1bmVDaWRzIG9uIGpvaW5zLiBPdGhlcndpc2UsIGluIGNhc2Ugb2ZcbiAgICAvLyByZWpvaW5zLCB3ZSBtYXkgbm90aWZ5IGNpZHMgdGhhdCBubyBsb25nZXIgYmVsb25nIHRvIHRoZVxuICAgIC8vIGN1cnJlbnQgTGl2ZVZpZXcgdG8gYmUgcmVtb3ZlZC5cbiAgICBpZihwcnVuZUNpZHMpe1xuICAgICAgdGhpcy5tYXliZVB1c2hDb21wb25lbnRzRGVzdHJveWVkKGRlc3Ryb3llZENJRHMpXG4gICAgfVxuICB9XG5cbiAgam9pbk5ld0NoaWxkcmVuKCl7XG4gICAgRE9NLmZpbmRQaHhDaGlsZHJlbih0aGlzLmVsLCB0aGlzLmlkKS5mb3JFYWNoKGVsID0+IHRoaXMuam9pbkNoaWxkKGVsKSlcbiAgfVxuXG4gIG1heWJlUmVjb3ZlckZvcm1zKGh0bWwsIGNhbGxiYWNrKXtcbiAgICBjb25zdCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICBjb25zdCBvbGRGb3JtcyA9IHRoaXMucm9vdC5mb3Jtc0ZvclJlY292ZXJ5XG4gICAgLy8gU28gd2h5IGRvIHdlIGNyZWF0ZSBhIHRlbXBsYXRlIGVsZW1lbnQgaGVyZT9cbiAgICAvLyBPbmUgd2F5IHRvIHJlY292ZXIgZm9ybXMgd291bGQgYmUgdG8gaW1tZWRpYXRlbHkgYXBwbHkgdGhlIG1vdW50XG4gICAgLy8gcGF0Y2ggYW5kIHRoZW4gYWZ0ZXJ3YXJkcyByZWNvdmVyIHRoZSBmb3Jtcy4gSG93ZXZlciwgdGhpcyB3b3VsZFxuICAgIC8vIGNhdXNlIGEgZmxpY2tlciwgYmVjYXVzZSB0aGUgbW91bnQgcGF0Y2ggd291bGQgcmVtb3ZlIHRoZSBmb3JtIGNvbnRlbnRcbiAgICAvLyB1bnRpbCBpdCBpcyByZXN0b3JlZC4gVGhlcmVmb3JlIExWIGRlY2lkZWQgdG8gZG8gZm9ybSByZWNvdmVyeSB3aXRoIHRoZVxuICAgIC8vIHJhdyBIVE1MIGJlZm9yZSBpdCBpcyBhcHBsaWVkIGFuZCBkZWxheSB0aGUgbW91bnQgcGF0Y2ggdW50aWwgdGhlIGZvcm1cbiAgICAvLyByZWNvdmVyeSBldmVudHMgYXJlIGRvbmUuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIC8vIGJlY2F1c2Ugd2Ugd29yayB3aXRoIGEgdGVtcGxhdGUgZWxlbWVudCwgd2UgbXVzdCBtYW51YWxseSBjb3B5IHRoZSBhdHRyaWJ1dGVzXG4gICAgLy8gb3RoZXJ3aXNlIHRoZSBvd25lciAvIHRhcmdldCBoZWxwZXJzIGRvbid0IHdvcmsgcHJvcGVybHlcbiAgICBjb25zdCByb290RWwgPSB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgcm9vdEVsLmlkID0gdGhpcy5pZFxuICAgIHJvb3RFbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdC5pZClcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCB0aGlzLmdldFNlc3Npb24oKSlcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHRoaXMuZ2V0U3RhdGljKCkpXG4gICAgcm9vdEVsLnNldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lELCB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmlkIDogbnVsbClcblxuICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm0gZWxlbWVudHMgaW4gdGhlIG5ldyBIVE1MIGZvciB0aGUgTFZcbiAgICAvLyBhbmQgbG9vayBmb3Igb2xkIGZvcm1zIGluIHRoZSBgZm9ybXNGb3JSZWNvdmVyeWAgb2JqZWN0O1xuICAgIC8vIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IGNhbiBhbHNvIGNvbnRhaW4gZm9ybXMgZnJvbSBjaGlsZCB2aWV3c1xuICAgIGNvbnN0IGZvcm1zVG9SZWNvdmVyID1cbiAgICAgIC8vIHdlIGdvIG92ZXIgYWxsIGZvcm1zIGluIHRoZSBuZXcgRE9NOyBiZWNhdXNlIHRoaXMgaXMgb25seSB0aGUgSFRNTCBmb3IgdGhlIGN1cnJlbnRcbiAgICAgIC8vIHZpZXcsIHdlIGNhbiBiZSBzdXJlIHRoYXQgYWxsIGZvcm1zIGFyZSBvd25lZCBieSB0aGlzIHZpZXc6XG4gICAgICBET00uYWxsKHRlbXBsYXRlLmNvbnRlbnQsIFwiZm9ybVwiKVxuICAgICAgICAvLyBvbmx5IHJlY292ZXIgZm9ybXMgdGhhdCBoYXZlIGFuIGlkIGFuZCBhcmUgaW4gdGhlIG9sZCBET01cbiAgICAgICAgLmZpbHRlcihuZXdGb3JtID0+IG5ld0Zvcm0uaWQgJiYgb2xkRm9ybXNbbmV3Rm9ybS5pZF0pXG4gICAgICAgIC8vIGFiYW5kb24gZm9ybXMgd2UgYWxyZWFkeSB0cmllZCB0byByZWNvdmVyIHRvIHByZXZlbnQgbG9vcGluZyBhIGZhaWxlZCBzdGF0ZVxuICAgICAgICAuZmlsdGVyKG5ld0Zvcm0gPT4gIXRoaXMucGVuZGluZ0Zvcm1zLmhhcyhuZXdGb3JtLmlkKSlcbiAgICAgICAgLy8gb25seSByZWNvdmVyIGlmIHRoZSBmb3JtIGhhcyB0aGUgc2FtZSBwaHgtY2hhbmdlIHZhbHVlXG4gICAgICAgIC5maWx0ZXIobmV3Rm9ybSA9PiBvbGRGb3Jtc1tuZXdGb3JtLmlkXS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSA9PT0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKSlcbiAgICAgICAgLm1hcChuZXdGb3JtID0+IHtcbiAgICAgICAgICByZXR1cm4gW29sZEZvcm1zW25ld0Zvcm0uaWRdLCBuZXdGb3JtXVxuICAgICAgICB9KVxuXG4gICAgaWYoZm9ybXNUb1JlY292ZXIubGVuZ3RoID09PSAwKXtcbiAgICAgIHJldHVybiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgZm9ybXNUb1JlY292ZXIuZm9yRWFjaCgoW29sZEZvcm0sIG5ld0Zvcm1dLCBpKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdGb3Jtcy5hZGQobmV3Rm9ybS5pZClcbiAgICAgIC8vIGl0IGlzIGltcG9ydGFudCB0byB1c2UgdGhlIGZpcnN0RWxlbWVudENoaWxkIG9mIHRoZSB0ZW1wbGF0ZSBjb250ZW50XG4gICAgICAvLyBiZWNhdXNlIHdoZW4gdHJhdmVyc2luZyBhIGRvY3VtZW50RnJhZ21lbnQgdXNpbmcgcGFyZW50Tm9kZSwgd2Ugd29uJ3QgZXZlciBhcnJpdmUgYXRcbiAgICAgIC8vIHRoZSBmcmFnbWVudDsgYXMgdGhlIHRlbXBsYXRlIGlzIGFsd2F5cyBhIExpdmVWaWV3LCB3ZSBjYW4gYmUgc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHlcbiAgICAgIC8vIG9uZSBjaGlsZCBvbiB0aGUgcm9vdCBsZXZlbFxuICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KG9sZEZvcm0sIG5ld0Zvcm0sIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsICgpID0+IHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRm9ybXMuZGVsZXRlKG5ld0Zvcm0uaWQpXG4gICAgICAgIC8vIHdlIG9ubHkgY2FsbCB0aGUgY2FsbGJhY2sgb25jZSBhbGwgZm9ybXMgaGF2ZSBiZWVuIHJlY292ZXJlZFxuICAgICAgICBpZihpID09PSBmb3Jtc1RvUmVjb3Zlci5sZW5ndGggLSAxKXtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldENoaWxkQnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1baWRdIH1cblxuICBnZXREZXNjZW5kZW50QnlFbChlbCl7XG4gICAgaWYoZWwuaWQgPT09IHRoaXMuaWQpe1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXT8uW2VsLmlkXVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lEZXNjZW5kZW50KGlkKXtcbiAgICBmb3IobGV0IHBhcmVudElkIGluIHRoaXMucm9vdC5jaGlsZHJlbil7XG4gICAgICBmb3IobGV0IGNoaWxkSWQgaW4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXSl7XG4gICAgICAgIGlmKGNoaWxkSWQgPT09IGlkKXsgcmV0dXJuIHRoaXMucm9vdC5jaGlsZHJlbltwYXJlbnRJZF1bY2hpbGRJZF0uZGVzdHJveSgpIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBqb2luQ2hpbGQoZWwpe1xuICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGRCeUlkKGVsLmlkKVxuICAgIGlmKCFjaGlsZCl7XG4gICAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLmxpdmVTb2NrZXQsIHRoaXMpXG4gICAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1bdmlldy5pZF0gPSB2aWV3XG4gICAgICB2aWV3LmpvaW4oKVxuICAgICAgdGhpcy5jaGlsZEpvaW5zKytcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgaXNKb2luUGVuZGluZygpeyByZXR1cm4gdGhpcy5qb2luUGVuZGluZyB9XG5cbiAgYWNrSm9pbihfY2hpbGQpe1xuICAgIHRoaXMuY2hpbGRKb2lucy0tXG5cbiAgICBpZih0aGlzLmNoaWxkSm9pbnMgPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnBhcmVudC5hY2tKb2luKHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpe1xuICAgIC8vIHdlIGNhbiBjbGVhciBwZW5kaW5nIGZvcm0gcmVjb3ZlcmllcyBub3cgdGhhdCB3ZSd2ZSBqb2luZWQuXG4gICAgLy8gVGhleSBlaXRoZXIgYWxsIHJlc29sdmVkIG9yIHdlcmUgYWJhbmRvbmVkXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMuY2xlYXIoKVxuICAgIC8vIHdlIGNhbiBhbHNvIGNsZWFyIHRoZSBmb3Jtc0ZvclJlY292ZXJ5IG9iamVjdCB0byBub3Qga2VlcCBvbGQgZm9ybSBlbGVtZW50cyBhcm91bmRcbiAgICB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkgPSB7fVxuICAgIHRoaXMuam9pbkNhbGxiYWNrKCgpID0+IHtcbiAgICAgIHRoaXMucGVuZGluZ0pvaW5PcHMuZm9yRWFjaCgoW3ZpZXcsIG9wXSkgPT4ge1xuICAgICAgICBpZighdmlldy5pc0Rlc3Ryb3llZCgpKXsgb3AoKSB9XG4gICAgICB9KVxuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcyA9IFtdXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZShkaWZmLCBldmVudHMpe1xuICAgIGlmKHRoaXMuaXNKb2luUGVuZGluZygpIHx8ICh0aGlzLmxpdmVTb2NrZXQuaGFzUGVuZGluZ0xpbmsoKSAmJiB0aGlzLnJvb3QuaXNNYWluKCkpKXtcbiAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdEaWZmcy5wdXNoKHtkaWZmLCBldmVudHN9KVxuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZWQubWVyZ2VEaWZmKGRpZmYpXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuXG4gICAgLy8gV2hlbiB0aGUgZGlmZiBvbmx5IGNvbnRhaW5zIGNvbXBvbmVudCBkaWZmcywgdGhlbiB3YWxrIGNvbXBvbmVudHNcbiAgICAvLyBhbmQgcGF0Y2ggb25seSB0aGUgcGFyZW50IGNvbXBvbmVudCBjb250YWluZXJzIGZvdW5kIGluIHRoZSBkaWZmLlxuICAgIC8vIE90aGVyd2lzZSwgcGF0Y2ggZW50aXJlIExWIGNvbnRhaW5lci5cbiAgICBpZih0aGlzLnJlbmRlcmVkLmlzQ29tcG9uZW50T25seURpZmYoZGlmZikpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRpbWUoXCJjb21wb25lbnQgcGF0Y2ggY29tcGxldGVcIiwgKCkgPT4ge1xuICAgICAgICBsZXQgcGFyZW50Q2lkcyA9IERPTS5maW5kRXhpc3RpbmdQYXJlbnRDSURzKHRoaXMuZWwsIHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKSlcbiAgICAgICAgcGFyZW50Q2lkcy5mb3JFYWNoKHBhcmVudENJRCA9PiB7XG4gICAgICAgICAgaWYodGhpcy5jb21wb25lbnRQYXRjaCh0aGlzLnJlbmRlcmVkLmdldENvbXBvbmVudChkaWZmLCBwYXJlbnRDSUQpLCBwYXJlbnRDSUQpKXsgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWUgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYoIWlzRW1wdHkoZGlmZikpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRpbWUoXCJmdWxsIHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyQ29udGFpbmVyKGRpZmYsIFwidXBkYXRlXCIpXG4gICAgICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCB0aGlzLmVsLCB0aGlzLmlkLCBodG1sLCBzdHJlYW1zLCBudWxsKVxuICAgICAgICBwaHhDaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMubGl2ZVNvY2tldC5kaXNwYXRjaEV2ZW50cyhldmVudHMpXG4gICAgaWYocGh4Q2hpbGRyZW5BZGRlZCl7IHRoaXMuam9pbk5ld0NoaWxkcmVuKCkgfVxuICB9XG5cbiAgcmVuZGVyQ29udGFpbmVyKGRpZmYsIGtpbmQpe1xuICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQudGltZShgdG9TdHJpbmcgZGlmZiAoJHtraW5kfSlgLCAoKSA9PiB7XG4gICAgICBsZXQgdGFnID0gdGhpcy5lbC50YWdOYW1lXG4gICAgICAvLyBEb24ndCBza2lwIGFueSBjb21wb25lbnQgaW4gdGhlIGRpZmYgbm9yIGFueSBtYXJrZWQgYXMgcHJ1bmVkXG4gICAgICAvLyAoYXMgdGhleSBtYXkgaGF2ZSBiZWVuIGFkZGVkIGJhY2spXG4gICAgICBsZXQgY2lkcyA9IGRpZmYgPyB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikgOiBudWxsXG4gICAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZW5kZXJlZC50b1N0cmluZyhjaWRzKVxuICAgICAgcmV0dXJuIFtgPCR7dGFnfT4ke2h0bWx9PC8ke3RhZ30+YCwgc3RyZWFtc11cbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50UGF0Y2goZGlmZiwgY2lkKXtcbiAgICBpZihpc0VtcHR5KGRpZmYpKSByZXR1cm4gZmFsc2VcbiAgICBsZXQgW2h0bWwsIHN0cmVhbXNdID0gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRUb1N0cmluZyhjaWQpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIHN0cmVhbXMsIGNpZClcbiAgICBsZXQgY2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgIHJldHVybiBjaGlsZHJlbkFkZGVkXG4gIH1cblxuICBnZXRIb29rKGVsKXsgcmV0dXJuIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChlbCldIH1cblxuICBhZGRIb29rKGVsKXtcbiAgICBsZXQgaG9va0VsSWQgPSBWaWV3SG9vay5lbGVtZW50SUQoZWwpXG5cbiAgICAvLyBvbmx5IGV2ZXIgdHJ5IHRvIGFkZCBob29rcyB0byBlbGVtZW50cyBvd25lZCBieSB0aGlzIHZpZXdcbiAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgIXRoaXMub3duc0VsZW1lbnQoZWwpKXsgcmV0dXJuIH1cblxuICAgIGlmKGhvb2tFbElkICYmICF0aGlzLnZpZXdIb29rc1tob29rRWxJZF0pe1xuICAgICAgLy8gaG9vayBjcmVhdGVkLCBidXQgbm90IGF0dGFjaGVkIChjcmVhdGVIb29rIGZvciB3ZWIgY29tcG9uZW50KVxuICAgICAgbGV0IGhvb2sgPSBET00uZ2V0Q3VzdG9tRWxIb29rKGVsKSB8fCBsb2dFcnJvcihgbm8gaG9vayBmb3VuZCBmb3IgY3VzdG9tIGVsZW1lbnQ6ICR7ZWwuaWR9YClcbiAgICAgIHRoaXMudmlld0hvb2tzW2hvb2tFbElkXSA9IGhvb2tcbiAgICAgIGhvb2suX19hdHRhY2hWaWV3KHRoaXMpXG4gICAgICByZXR1cm4gaG9va1xuICAgIH1cbiAgICBlbHNlIGlmKGhvb2tFbElkIHx8ICFlbC5nZXRBdHRyaWJ1dGUpe1xuICAgICAgLy8gbm8gaG9vayBmb3VuZFxuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5ldyBob29rIGZvdW5kIHdpdGggcGh4LWhvb2sgYXR0cmlidXRlXG4gICAgICBsZXQgaG9va05hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoYGRhdGEtcGh4LSR7UEhYX0hPT0t9YCkgfHwgZWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfSE9PSykpXG4gICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5saXZlU29ja2V0LmdldEhvb2tDYWxsYmFja3MoaG9va05hbWUpXG5cbiAgICAgIGlmKGNhbGxiYWNrcyl7XG4gICAgICAgIGlmKCFlbC5pZCl7IGxvZ0Vycm9yKGBubyBET00gSUQgZm9yIGhvb2sgXCIke2hvb2tOYW1lfVwiLiBIb29rcyByZXF1aXJlIGEgdW5pcXVlIElEIG9uIGVhY2ggZWxlbWVudC5gLCBlbCkgfVxuICAgICAgICBsZXQgaG9vayA9IG5ldyBWaWV3SG9vayh0aGlzLCBlbCwgY2FsbGJhY2tzKVxuICAgICAgICB0aGlzLnZpZXdIb29rc1tWaWV3SG9vay5lbGVtZW50SUQoaG9vay5lbCldID0gaG9va1xuICAgICAgICByZXR1cm4gaG9va1xuICAgICAgfSBlbHNlIGlmKGhvb2tOYW1lICE9PSBudWxsKXtcbiAgICAgICAgbG9nRXJyb3IoYHVua25vd24gaG9vayBmb3VuZCBmb3IgXCIke2hvb2tOYW1lfVwiYCwgZWwpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUhvb2soaG9vayl7XG4gICAgLy8gX19kZXN0cm95ZWQgY2xlYXJzIHRoZSBlbGVtZW50SUQgZnJvbSB0aGUgaG9vaywgdGhlcmVmb3JlXG4gICAgLy8gd2UgbmVlZCB0byBnZXQgaXQgYmVmb3JlIGNhbGxpbmcgX19kZXN0cm95ZWRcbiAgICBjb25zdCBob29rSWQgPSBWaWV3SG9vay5lbGVtZW50SUQoaG9vay5lbClcbiAgICBob29rLl9fZGVzdHJveWVkKClcbiAgICBob29rLl9fY2xlYW51cF9fKClcbiAgICBkZWxldGUgdGhpcy52aWV3SG9va3NbaG9va0lkXVxuICB9XG5cbiAgYXBwbHlQZW5kaW5nVXBkYXRlcygpe1xuICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICB0aGlzLmVhY2hDaGlsZChjaGlsZCA9PiBjaGlsZC5hcHBseVBlbmRpbmdVcGRhdGVzKCkpXG4gIH1cblxuICBlYWNoQ2hpbGQoY2FsbGJhY2spe1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSB8fCB7fVxuICAgIGZvcihsZXQgaWQgaW4gY2hpbGRyZW4peyBjYWxsYmFjayh0aGlzLmdldENoaWxkQnlJZChpZCkpIH1cbiAgfVxuXG4gIG9uQ2hhbm5lbChldmVudCwgY2Ipe1xuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiBjYihyZXNwKV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZENoYW5uZWwoKXtcbiAgICAvLyBUaGUgZGlmZiBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgcmVndWxhciB1cGRhdGUgb3BlcmF0aW9ucy5cbiAgICAvLyBBbGwgb3RoZXIgb3BlcmF0aW9ucyBhcmUgcXVldWVkIHRvIGJlIGFwcGxpZWQgb25seSBhZnRlciBqb2luLlxuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBcImRpZmZcIiwgKHJhd0RpZmYpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmF3RGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMub25DaGFubmVsKFwicmVkaXJlY3RcIiwgKHt0bywgZmxhc2h9KSA9PiB0aGlzLm9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0pKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9yZWRpcmVjdFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUmVkaXJlY3QocmVkaXIpKVxuICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLm9uRXJyb3IocmVhc29uKSlcbiAgICB0aGlzLmNoYW5uZWwub25DbG9zZShyZWFzb24gPT4gdGhpcy5vbkNsb3NlKHJlYXNvbikpXG4gIH1cblxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKXsgdGhpcy5lYWNoQ2hpbGQoY2hpbGQgPT4gY2hpbGQuZGVzdHJveSgpKSB9XG5cbiAgb25MaXZlUmVkaXJlY3QocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmQsIGZsYXNofSA9IHJlZGlyXG4gICAgbGV0IHVybCA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OnNlcnZlci1uYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7dG8sIGtpbmQsIGZsYXNofX0pXG4gICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlSZWRpcmVjdChlLCB1cmwsIGtpbmQsIGZsYXNoKVxuICB9XG5cbiAgb25MaXZlUGF0Y2gocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmR9ID0gcmVkaXJcbiAgICB0aGlzLmhyZWYgPSB0aGlzLmV4cGFuZFVSTCh0bylcbiAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVBhdGNoKHRvLCBraW5kKVxuICB9XG5cbiAgZXhwYW5kVVJMKHRvKXtcbiAgICByZXR1cm4gdG8uc3RhcnRzV2l0aChcIi9cIikgPyBgJHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0fSR7dG99YCA6IHRvXG4gIH1cblxuICBvblJlZGlyZWN0KHt0bywgZmxhc2gsIHJlbG9hZFRva2VufSl7IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh0bywgZmxhc2gsIHJlbG9hZFRva2VuKSB9XG5cbiAgaXNEZXN0cm95ZWQoKXsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICBqb2luRGVhZCgpeyB0aGlzLmlzRGVhZCA9IHRydWUgfVxuXG4gIGpvaW5QdXNoKCl7XG4gICAgdGhpcy5qb2luUHVzaCA9IHRoaXMuam9pblB1c2ggfHwgdGhpcy5jaGFubmVsLmpvaW4oKVxuICAgIHJldHVybiB0aGlzLmpvaW5QdXNoXG4gIH1cblxuICBqb2luKGNhbGxiYWNrKXtcbiAgICB0aGlzLnNob3dMb2FkZXIodGhpcy5saXZlU29ja2V0LmxvYWRlclRpbWVvdXQpXG4gICAgdGhpcy5iaW5kQ2hhbm5lbCgpXG4gICAgaWYodGhpcy5pc01haW4oKSl7XG4gICAgICB0aGlzLnN0b3BDYWxsYmFjayA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiaW5pdGlhbFwifSlcbiAgICB9XG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSAob25Eb25lKSA9PiB7XG4gICAgICBvbkRvbmUgPSBvbkRvbmUgfHwgZnVuY3Rpb24oKXt9XG4gICAgICBjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuam9pbkNvdW50LCBvbkRvbmUpIDogb25Eb25lKClcbiAgICB9XG5cbiAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5qb2luKCksIHtcbiAgICAgIG9rOiAocmVzcCkgPT4gdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4gdGhpcy5vbkpvaW4ocmVzcCkpLFxuICAgICAgZXJyb3I6IChlcnJvcikgPT4gdGhpcy5vbkpvaW5FcnJvcihlcnJvciksXG4gICAgICB0aW1lb3V0OiAoKSA9PiB0aGlzLm9uSm9pbkVycm9yKHtyZWFzb246IFwidGltZW91dFwifSlcbiAgICB9KVxuICB9XG5cbiAgb25Kb2luRXJyb3IocmVzcCl7XG4gICAgaWYocmVzcC5yZWFzb24gPT09IFwicmVsb2FkXCIpe1xuICAgICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbYGZhaWxlZCBtb3VudCB3aXRoICR7cmVzcC5zdGF0dXN9LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZWxvYWRgLCByZXNwXSlcbiAgICAgIHRoaXMub25SZWRpcmVjdCh7dG86IHRoaXMucm9vdC5ocmVmLCByZWxvYWRUb2tlbjogcmVzcC50b2tlbn0pXG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYocmVzcC5yZWFzb24gPT09IFwidW5hdXRob3JpemVkXCIgfHwgcmVzcC5yZWFzb24gPT09IFwic3RhbGVcIil7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYXV0aG9yaXplZCBsaXZlX3JlZGlyZWN0LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZXF1ZXN0XCIsIHJlc3BdKVxuICAgICAgdGhpcy5vblJlZGlyZWN0KHt0bzogdGhpcy5yb290LmhyZWZ9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmKHJlc3AucmVkaXJlY3QgfHwgcmVzcC5saXZlX3JlZGlyZWN0KXtcbiAgICAgIHRoaXMuam9pblBlbmRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5jaGFubmVsLmxlYXZlKClcbiAgICB9XG4gICAgaWYocmVzcC5yZWRpcmVjdCl7IHJldHVybiB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHJldHVybiB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlc3AubGl2ZV9yZWRpcmVjdCkgfVxuICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widW5hYmxlIHRvIGpvaW5cIiwgcmVzcF0pXG4gICAgaWYodGhpcy5pc01haW4oKSl7XG4gICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMpIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYodGhpcy5qb2luQXR0ZW1wdHMgPj0gTUFYX0NISUxEX0pPSU5fQVRURU1QVFMpe1xuICAgICAgICAvLyBwdXQgdGhlIHJvb3QgcmV2aWV3IGludG8gcGVybWFuZW50IGVycm9yIHN0YXRlLCBidXQgZG9uJ3QgZGVzdHJveSBpdCBhcyBpdCBjYW4gcmVtYWluIGFjdGl2ZVxuICAgICAgICB0aGlzLnJvb3QuZGlzcGxheUVycm9yKFtQSFhfTE9BRElOR19DTEFTUywgUEhYX0VSUk9SX0NMQVNTLCBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXSlcbiAgICAgICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbYGdpdmluZyB1cCB0cnlpbmcgdG8gbW91bnQgYWZ0ZXIgJHtNQVhfQ0hJTERfSk9JTl9BVFRFTVBUU30gdHJpZXNgLCByZXNwXSlcbiAgICAgICAgdGhpcy5kZXN0cm95KClcbiAgICAgIH1cbiAgICAgIGxldCB0cnVlQ2hpbGRFbCA9IERPTS5ieUlkKHRoaXMuZWwuaWQpXG4gICAgICBpZih0cnVlQ2hpbGRFbCl7XG4gICAgICAgIERPTS5tZXJnZUF0dHJzKHRydWVDaGlsZEVsLCB0aGlzLmVsKVxuICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihbUEhYX0xPQURJTkdfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUywgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU10pXG4gICAgICAgIHRoaXMuZWwgPSB0cnVlQ2hpbGRFbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZXN0cm95KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkNsb3NlKHJlYXNvbil7XG4gICAgaWYodGhpcy5pc0Rlc3Ryb3llZCgpKXsgcmV0dXJuIH1cbiAgICBpZih0aGlzLmlzTWFpbigpICYmIHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHJlYXNvbiAhPT0gXCJsZWF2ZVwiKXtcbiAgICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQucmVsb2FkV2l0aEppdHRlcih0aGlzKVxuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5saXZlU29ja2V0LmRyb3BBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgLy8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBjYW4gYmUgbnVsbCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMVxuICAgIGlmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpeyBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKSB9XG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzVW5sb2FkZWQoKSl7XG4gICAgICB0aGlzLnNob3dMb2FkZXIoQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVClcbiAgICB9XG4gIH1cblxuICBvbkVycm9yKHJlYXNvbil7XG4gICAgdGhpcy5vbkNsb3NlKHJlYXNvbilcbiAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widmlldyBjcmFzaGVkXCIsIHJlYXNvbl0pIH1cbiAgICBpZighdGhpcy5saXZlU29ja2V0LmlzVW5sb2FkZWQoKSl7XG4gICAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNDb25uZWN0ZWQoKSl7XG4gICAgICAgIHRoaXMuZGlzcGxheUVycm9yKFtQSFhfTE9BRElOR19DTEFTUywgUEhYX0VSUk9SX0NMQVNTLCBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzcGxheUVycm9yKFtQSFhfTE9BRElOR19DTEFTUywgUEhYX0VSUk9SX0NMQVNTLCBQSFhfQ0xJRU5UX0VSUk9SX0NMQVNTXSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaXNwbGF5RXJyb3IoY2xhc3Nlcyl7XG4gICAgaWYodGhpcy5pc01haW4oKSl7IERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIHtkZXRhaWw6IHt0bzogdGhpcy5ocmVmLCBraW5kOiBcImVycm9yXCJ9fSkgfVxuICAgIHRoaXMuc2hvd0xvYWRlcigpXG4gICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpXG4gICAgdGhpcy5leGVjQWxsKHRoaXMuYmluZGluZyhcImRpc2Nvbm5lY3RlZFwiKSlcbiAgfVxuXG4gIHdyYXBQdXNoKGNhbGxlclB1c2gsIHJlY2VpdmVzKXtcbiAgICBsZXQgbGF0ZW5jeSA9IHRoaXMubGl2ZVNvY2tldC5nZXRMYXRlbmN5U2ltKClcbiAgICBsZXQgd2l0aExhdGVuY3kgPSBsYXRlbmN5ID9cbiAgICAgIChjYikgPT4gc2V0VGltZW91dCgoKSA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIGNiKCksIGxhdGVuY3kpIDpcbiAgICAgIChjYikgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiBjYigpXG5cbiAgICB3aXRoTGF0ZW5jeSgoKSA9PiB7XG4gICAgICBjYWxsZXJQdXNoKClcbiAgICAgICAgLnJlY2VpdmUoXCJva1wiLCByZXNwID0+IHdpdGhMYXRlbmN5KCgpID0+IHJlY2VpdmVzLm9rICYmIHJlY2VpdmVzLm9rKHJlc3ApKSlcbiAgICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZWFzb24gPT4gd2l0aExhdGVuY3koKCkgPT4gcmVjZWl2ZXMuZXJyb3IgJiYgcmVjZWl2ZXMuZXJyb3IocmVhc29uKSkpXG4gICAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB3aXRoTGF0ZW5jeSgoKSA9PiByZWNlaXZlcy50aW1lb3V0ICYmIHJlY2VpdmVzLnRpbWVvdXQoKSkpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBldmVudCwgcGF5bG9hZCl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiBQcm9taXNlLnJlamVjdCh7ZXJyb3I6IFwibm9jb25uZWN0aW9uXCJ9KSB9XG5cbiAgICBsZXQgW3JlZiwgW2VsXSwgb3B0c10gPSByZWZHZW5lcmF0b3IgPyByZWZHZW5lcmF0b3IoKSA6IFtudWxsLCBbXSwge31dXG4gICAgbGV0IG9sZEpvaW5Db3VudCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IG9uTG9hZGluZ0RvbmUgPSBmdW5jdGlvbigpe31cbiAgICBpZihvcHRzLnBhZ2VfbG9hZGluZyl7XG4gICAgICBvbkxvYWRpbmdEb25lID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7a2luZDogXCJlbGVtZW50XCIsIHRhcmdldDogZWx9KVxuICAgIH1cblxuICAgIGlmKHR5cGVvZiAocGF5bG9hZC5jaWQpICE9PSBcIm51bWJlclwiKXsgZGVsZXRlIHBheWxvYWQuY2lkIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLndyYXBQdXNoKCgpID0+IHRoaXMuY2hhbm5lbC5wdXNoKGV2ZW50LCBwYXlsb2FkLCBQVVNIX1RJTUVPVVQpLCB7XG4gICAgICAgIG9rOiAocmVzcCkgPT4ge1xuICAgICAgICAgIGlmKHJlZiAhPT0gbnVsbCl7IHRoaXMubGFzdEFja1JlZiA9IHJlZiB9XG4gICAgICAgICAgbGV0IGZpbmlzaCA9IChob29rUmVwbHkpID0+IHtcbiAgICAgICAgICAgIGlmKHJlc3AucmVkaXJlY3QpeyB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3BhdGNoKXsgdGhpcy5vbkxpdmVQYXRjaChyZXNwLmxpdmVfcGF0Y2gpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgICAgICAgICBvbkxvYWRpbmdEb25lKClcbiAgICAgICAgICAgIHJlc29sdmUoe3Jlc3A6IHJlc3AsIHJlcGx5OiBob29rUmVwbHl9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXNwLmRpZmYpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByZXNwLmRpZmYsICh7ZGlmZiwgcmVwbHksIGV2ZW50c30pID0+IHtcbiAgICAgICAgICAgICAgICBpZihyZWYgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBheWxvYWQuZXZlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cylcbiAgICAgICAgICAgICAgICBmaW5pc2gocmVwbHkpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihyZWYgIT09IG51bGwpeyB0aGlzLnVuZG9SZWZzKHJlZiwgcGF5bG9hZC5ldmVudCkgfVxuICAgICAgICAgICAgZmluaXNoKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKHJlYXNvbikgPT4gcmVqZWN0KHtlcnJvcjogcmVhc29ufSksXG4gICAgICAgIHRpbWVvdXQ6ICgpID0+IHtcbiAgICAgICAgICByZWplY3Qoe3RpbWVvdXQ6IHRydWV9KVxuICAgICAgICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSBvbGRKb2luQ291bnQpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZyhcInRpbWVvdXRcIiwgKCkgPT4gW1wicmVjZWl2ZWQgdGltZW91dCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggc2VydmVyLiBGYWxsaW5nIGJhY2sgdG8gaGFyZCByZWZyZXNoIGZvciByZWNvdmVyeVwiXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB1bmRvUmVmcyhyZWYsIHBoeEV2ZW50LCBvbmx5RWxzKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH0gLy8gZXhpdCBpZiBleHRlcm5hbCBmb3JtIHRyaWdnZXJlZFxuICAgIGxldCBzZWxlY3RvciA9IGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYFxuXG4gICAgaWYob25seUVscyl7XG4gICAgICBvbmx5RWxzID0gbmV3IFNldChvbmx5RWxzKVxuICAgICAgRE9NLmFsbChkb2N1bWVudCwgc2VsZWN0b3IsIHBhcmVudCA9PiB7XG4gICAgICAgIGlmKG9ubHlFbHMgJiYgIW9ubHlFbHMuaGFzKHBhcmVudCkpeyByZXR1cm4gfVxuICAgICAgICAvLyB1bmRvIGFueSBjaGlsZCByZWZzIHdpdGhpbiBwYXJlbnQgZmlyc3RcbiAgICAgICAgRE9NLmFsbChwYXJlbnQsIHNlbGVjdG9yLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICAgIHRoaXMudW5kb0VsUmVmKHBhcmVudCwgcmVmLCBwaHhFdmVudClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIHNlbGVjdG9yLCBlbCA9PiB0aGlzLnVuZG9FbFJlZihlbCwgcmVmLCBwaHhFdmVudCkpXG4gICAgfVxuICB9XG5cbiAgdW5kb0VsUmVmKGVsLCByZWYsIHBoeEV2ZW50KXtcbiAgICBsZXQgZWxSZWYgPSBuZXcgRWxlbWVudFJlZihlbClcblxuICAgIGVsUmVmLm1heWJlVW5kbyhyZWYsIHBoeEV2ZW50LCBjbG9uZWRUcmVlID0+IHtcbiAgICAgIC8vIHdlIG5lZWQgdG8gcGVyZm9ybSBhIGZ1bGwgcGF0Y2ggb24gdW5sb2NrZWQgZWxlbWVudHNcbiAgICAgIC8vIHRvIHBlcmZvcm0gYWxsIHRoZSBuZWNlc3NhcnkgbG9naWMgKGxpa2UgY2FsbGluZyB1cGRhdGVkIGZvciBob29rcywgZXRjLilcbiAgICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCBlbCwgdGhpcy5pZCwgY2xvbmVkVHJlZSwgW10sIG51bGwsIHt1bmRvUmVmOiByZWZ9KVxuICAgICAgY29uc3QgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgRE9NLmFsbChlbCwgYFske1BIWF9SRUZfU1JDfT1cIiR7dGhpcy5yZWZTcmMoKX1cIl1gLCBjaGlsZCA9PiB0aGlzLnVuZG9FbFJlZihjaGlsZCwgcmVmLCBwaHhFdmVudCkpXG4gICAgICBpZihwaHhDaGlsZHJlbkFkZGVkKXsgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKSB9XG4gICAgfSlcbiAgfVxuXG4gIHJlZlNyYygpeyByZXR1cm4gdGhpcy5lbC5pZCB9XG5cbiAgcHV0UmVmKGVsZW1lbnRzLCBwaHhFdmVudCwgZXZlbnRUeXBlLCBvcHRzID0ge30pe1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZisrXG4gICAgbGV0IGRpc2FibGVXaXRoID0gdGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpXG4gICAgaWYob3B0cy5sb2FkaW5nKXtcbiAgICAgIGxldCBsb2FkaW5nRWxzID0gRE9NLmFsbChkb2N1bWVudCwgb3B0cy5sb2FkaW5nKS5tYXAoZWwgPT4ge1xuICAgICAgICByZXR1cm4ge2VsLCBsb2NrOiB0cnVlLCBsb2FkaW5nOiB0cnVlfVxuICAgICAgfSlcbiAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KGxvYWRpbmdFbHMpXG4gICAgfVxuXG4gICAgZm9yKGxldCB7ZWwsIGxvY2ssIGxvYWRpbmd9IG9mIGVsZW1lbnRzKXtcbiAgICAgIGlmKCFsb2NrICYmICFsb2FkaW5nKXsgdGhyb3cgbmV3IEVycm9yKFwicHV0UmVmIHJlcXVpcmVzIGxvY2sgb3IgbG9hZGluZ1wiKSB9XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMsIHRoaXMucmVmU3JjKCkpXG4gICAgICBpZihsb2FkaW5nKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9BRElORywgbmV3UmVmKSB9XG4gICAgICBpZihsb2NrKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9DSywgbmV3UmVmKSB9XG5cbiAgICAgIGlmKCFsb2FkaW5nIHx8IChvcHRzLnN1Ym1pdHRlciAmJiAhKGVsID09PSBvcHRzLnN1Ym1pdHRlciB8fCBlbCA9PT0gb3B0cy5mb3JtKSkpeyBjb250aW51ZSB9XG5cbiAgICAgIGxldCBsb2NrQ29tcGxldGVQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDp1bmRvLWxvY2s6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICB9KVxuXG4gICAgICBsZXQgbG9hZGluZ0NvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGBwaHg6dW5kby1sb2FkaW5nOiR7bmV3UmVmfWAsICgpID0+IHJlc29sdmUoZGV0YWlsKSwge29uY2U6IHRydWV9KVxuICAgICAgfSlcblxuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgcGh4LSR7ZXZlbnRUeXBlfS1sb2FkaW5nYClcbiAgICAgIGxldCBkaXNhYmxlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aClcbiAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBudWxsKXtcbiAgICAgICAgaWYoIWVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpKXtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLCBlbC5pbm5lclRleHQpXG4gICAgICAgIH1cbiAgICAgICAgaWYoZGlzYWJsZVRleHQgIT09IFwiXCIpeyBlbC5pbm5lclRleHQgPSBkaXNhYmxlVGV4dCB9XG4gICAgICAgIC8vIFBIWF9ESVNBQkxFRCBjb3VsZCBoYXZlIGFscmVhZHkgYmVlbiBzZXQgaW4gZGlzYWJsZUZvcm1cbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCkgfHwgZWwuZGlzYWJsZWQpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgICB9XG5cbiAgICAgIGxldCBkZXRhaWwgPSB7XG4gICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgZXZlbnRUeXBlOiBldmVudFR5cGUsXG4gICAgICAgIHJlZjogbmV3UmVmLFxuICAgICAgICBpc0xvYWRpbmc6IGxvYWRpbmcsXG4gICAgICAgIGlzTG9ja2VkOiBsb2NrLFxuICAgICAgICBsb2NrRWxlbWVudHM6IGVsZW1lbnRzLmZpbHRlcigoe2xvY2t9KSA9PiBsb2NrKS5tYXAoKHtlbH0pID0+IGVsKSxcbiAgICAgICAgbG9hZGluZ0VsZW1lbnRzOiBlbGVtZW50cy5maWx0ZXIoKHtsb2FkaW5nfSkgPT4gbG9hZGluZykubWFwKCh7ZWx9KSA9PiBlbCksXG4gICAgICAgIHVubG9jazogKGVscykgPT4ge1xuICAgICAgICAgIGVscyA9IEFycmF5LmlzQXJyYXkoZWxzKSA/IGVscyA6IFtlbHNdXG4gICAgICAgICAgdGhpcy51bmRvUmVmcyhuZXdSZWYsIHBoeEV2ZW50LCBlbHMpXG4gICAgICAgIH0sXG4gICAgICAgIGxvY2tDb21wbGV0ZTogbG9ja0NvbXBsZXRlUHJvbWlzZSxcbiAgICAgICAgbG9hZGluZ0NvbXBsZXRlOiBsb2FkaW5nQ29tcGxldGVQcm9taXNlLFxuICAgICAgICBsb2NrOiAobG9ja0VsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5pc0Fja2VkKG5ld1JlZikpeyByZXR1cm4gcmVzb2x2ZShkZXRhaWwpIH1cbiAgICAgICAgICAgIGxvY2tFbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLLCBuZXdSZWYpXG4gICAgICAgICAgICBsb2NrRWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCB0aGlzLnJlZlNyYygpKVxuICAgICAgICAgICAgbG9ja0VsLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDpsb2NrLXN0b3A6JHtuZXdSZWZ9YCwgKCkgPT4gcmVzb2x2ZShkZXRhaWwpLCB7b25jZTogdHJ1ZX0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6cHVzaFwiLCB7XG4gICAgICAgIGRldGFpbDogZGV0YWlsLFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgfSkpXG4gICAgICBpZihwaHhFdmVudCl7XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwaHg6cHVzaDoke3BoeEV2ZW50fWAsIHtcbiAgICAgICAgICBkZXRhaWw6IGRldGFpbCxcbiAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW25ld1JlZiwgZWxlbWVudHMubWFwKCh7ZWx9KSA9PiBlbCksIG9wdHNdXG4gIH1cblxuICBpc0Fja2VkKHJlZil7IHJldHVybiB0aGlzLmxhc3RBY2tSZWYgIT09IG51bGwgJiYgdGhpcy5sYXN0QWNrUmVmID49IHJlZiB9XG5cbiAgY29tcG9uZW50SUQoZWwpe1xuICAgIGxldCBjaWQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpXG4gICAgcmV0dXJuIGNpZCA/IHBhcnNlSW50KGNpZCkgOiBudWxsXG4gIH1cblxuICB0YXJnZXRDb21wb25lbnRJRCh0YXJnZXQsIHRhcmdldEN0eCwgb3B0cyA9IHt9KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXsgcmV0dXJuIHRhcmdldEN0eCB9XG5cbiAgICBsZXQgY2lkT3JTZWxlY3RvciA9IG9wdHMudGFyZ2V0IHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwidGFyZ2V0XCIpKVxuICAgIGlmKGlzQ2lkKGNpZE9yU2VsZWN0b3IpKXtcbiAgICAgIHJldHVybiBwYXJzZUludChjaWRPclNlbGVjdG9yKVxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHggJiYgKGNpZE9yU2VsZWN0b3IgIT09IG51bGwgfHwgb3B0cy50YXJnZXQpKXtcbiAgICAgIHJldHVybiB0aGlzLmNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eCl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7XG4gICAgICByZXR1cm4gdGFyZ2V0Q3R4XG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCl7XG4gICAgICByZXR1cm4gbWF5YmUodGFyZ2V0Q3R4LmNsb3Nlc3QoYFske1BIWF9DT01QT05FTlR9XWApLCBlbCA9PiB0aGlzLm93bnNFbGVtZW50KGVsKSAmJiB0aGlzLmNvbXBvbmVudElEKGVsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwdXNoSG9va0V2ZW50KGVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5KXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgIHRoaXMubG9nKFwiaG9va1wiLCAoKSA9PiBbXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIsIGV2ZW50LCBwYXlsb2FkXSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgW3JlZiwgZWxzLCBvcHRzXSA9IHRoaXMucHV0UmVmKFt7ZWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XSwgZXZlbnQsIFwiaG9va1wiKVxuICAgIHRoaXMucHVzaFdpdGhSZXBseSgoKSA9PiBbcmVmLCBlbHMsIG9wdHNdLCBcImV2ZW50XCIsIHtcbiAgICAgIHR5cGU6IFwiaG9va1wiLFxuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgdmFsdWU6IHBheWxvYWQsXG4gICAgICBjaWQ6IHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9KS50aGVuKCh7cmVzcDogX3Jlc3AsIHJlcGx5OiBob29rUmVwbHl9KSA9PiBvblJlcGx5KGhvb2tSZXBseSwgcmVmKSlcblxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIGV4dHJhY3RNZXRhKGVsLCBtZXRhLCB2YWx1ZSl7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGxldCBuYW1lID0gZWwuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBpZihuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSl7IG1ldGFbbmFtZS5yZXBsYWNlKHByZWZpeCwgXCJcIildID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH1cbiAgICB9XG4gICAgaWYoZWwudmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhKGVsIGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50KSl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWVcblxuICAgICAgaWYoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKXtcbiAgICAgICAgZGVsZXRlIG1ldGEudmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsdWUpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpeyBtZXRhW2tleV0gPSB2YWx1ZVtrZXldIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFcbiAgfVxuXG4gIHB1c2hFdmVudCh0eXBlLCBlbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgbWV0YSwgb3B0cyA9IHt9LCBvblJlcGx5KXtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW3tlbCwgbG9hZGluZzogdHJ1ZSwgbG9jazogdHJ1ZX1dLCBwaHhFdmVudCwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIH0pLnRoZW4oKHtyZXBseX0pID0+IG9uUmVwbHkgJiYgb25SZXBseShyZXBseSkpXG4gIH1cblxuICBwdXNoRmlsZVByb2dyZXNzKGZpbGVFbCwgZW50cnlSZWYsIHByb2dyZXNzLCBvblJlcGx5ID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIHRoaXMubGl2ZVNvY2tldC53aXRoaW5Pd25lcnMoZmlsZUVsLmZvcm0sICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcucHVzaFdpdGhSZXBseShudWxsLCBcInByb2dyZXNzXCIsIHtcbiAgICAgICAgZXZlbnQ6IGZpbGVFbC5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFBIWF9QUk9HUkVTUykpLFxuICAgICAgICByZWY6IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyeV9yZWY6IGVudHJ5UmVmLFxuICAgICAgICBwcm9ncmVzczogcHJvZ3Jlc3MsXG4gICAgICAgIGNpZDogdmlldy50YXJnZXRDb21wb25lbnRJRChmaWxlRWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgfSkudGhlbigoe3Jlc3B9KSA9PiBvblJlcGx5KHJlc3ApKVxuICAgIH0pXG4gIH1cblxuICBwdXNoSW5wdXQoaW5wdXRFbCwgdGFyZ2V0Q3R4LCBmb3JjZUNpZCwgcGh4RXZlbnQsIG9wdHMsIGNhbGxiYWNrKXtcbiAgICBpZighaW5wdXRFbC5mb3JtKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImZvcm0gZXZlbnRzIHJlcXVpcmUgdGhlIGlucHV0IHRvIGJlIGluc2lkZSBhIGZvcm1cIilcbiAgICB9XG5cbiAgICBsZXQgdXBsb2Fkc1xuICAgIGxldCBjaWQgPSBpc0NpZChmb3JjZUNpZCkgPyBmb3JjZUNpZCA6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgsIG9wdHMpXG4gICAgbGV0IHJlZkdlbmVyYXRvciA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnB1dFJlZihbXG4gICAgICAgIHtlbDogaW5wdXRFbCwgbG9hZGluZzogdHJ1ZSwgbG9jazogdHJ1ZX0sXG4gICAgICAgIHtlbDogaW5wdXRFbC5mb3JtLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfVxuICAgICAgXSwgcGh4RXZlbnQsIFwiY2hhbmdlXCIsIG9wdHMpXG4gICAgfVxuICAgIGxldCBmb3JtRGF0YVxuICAgIGxldCBtZXRhICA9IHRoaXMuZXh0cmFjdE1ldGEoaW5wdXRFbC5mb3JtKVxuICAgIGlmKGlucHV0RWwgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCl7IG1ldGEuc3VibWl0dGVyID0gaW5wdXRFbCB9XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKSl7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCB7X3RhcmdldDogb3B0cy5fdGFyZ2V0LCAuLi5tZXRhfSwgW2lucHV0RWwubmFtZV0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShpbnB1dEVsLmZvcm0sIHtfdGFyZ2V0OiBvcHRzLl90YXJnZXQsIC4uLm1ldGF9KVxuICAgIH1cbiAgICBpZihET00uaXNVcGxvYWRJbnB1dChpbnB1dEVsKSAmJiBpbnB1dEVsLmZpbGVzICYmIGlucHV0RWwuZmlsZXMubGVuZ3RoID4gMCl7XG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyhpbnB1dEVsLCBBcnJheS5mcm9tKGlucHV0RWwuZmlsZXMpKVxuICAgIH1cbiAgICB1cGxvYWRzID0gTGl2ZVVwbG9hZGVyLnNlcmlhbGl6ZVVwbG9hZHMoaW5wdXRFbClcblxuICAgIGxldCBldmVudCA9IHtcbiAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgdXBsb2FkczogdXBsb2FkcyxcbiAgICAgIGNpZDogY2lkXG4gICAgfVxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwgZXZlbnQpLnRoZW4oKHtyZXNwfSkgPT4ge1xuICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgRE9NLmlzQXV0b1VwbG9hZChpbnB1dEVsKSl7XG4gICAgICAgIC8vIHRoZSBlbGVtZW50IGNvdWxkIGJlIGluc2lkZSBhIGxvY2tlZCBwYXJlbnQgZm9yIG90aGVyIHVucmVsYXRlZCBjaGFuZ2VzO1xuICAgICAgICAvLyB3ZSBjYW4gb25seSBzdGFydCB1cGxvYWRzIHdoZW4gdGhlIHRyZWUgaXMgdW5sb2NrZWQgYW5kIHRoZVxuICAgICAgICAvLyBuZWNlc3NhcnkgZGF0YSBhdHRyaWJ1dGVzIGFyZSBzZXQgaW4gdGhlIHJlYWwgRE9NXG4gICAgICAgIEVsZW1lbnRSZWYub25VbmxvY2soaW5wdXRFbCwgKCkgPT4ge1xuICAgICAgICAgIGlmKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgbGV0IFtyZWYsIF9lbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudCwgW2lucHV0RWwuZm9ybV0pXG4gICAgICAgICAgICB0aGlzLnVwbG9hZEZpbGVzKGlucHV0RWwuZm9ybSwgcGh4RXZlbnQsIHRhcmdldEN0eCwgcmVmLCBjaWQsIChfdXBsb2FkcykgPT4ge1xuICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJBd2FpdGluZ1N1Ym1pdChpbnB1dEVsLmZvcm0sIHBoeEV2ZW50KVxuICAgICAgICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZiwgcGh4RXZlbnQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3ApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHRyaWdnZXJBd2FpdGluZ1N1Ym1pdChmb3JtRWwsIHBoeEV2ZW50KXtcbiAgICBsZXQgYXdhaXRpbmdTdWJtaXQgPSB0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpXG4gICAgaWYoYXdhaXRpbmdTdWJtaXQpe1xuICAgICAgbGV0IFtfZWwsIF9yZWYsIF9vcHRzLCBjYWxsYmFja10gPSBhd2FpdGluZ1N1Ym1pdFxuICAgICAgdGhpcy5jYW5jZWxTdWJtaXQoZm9ybUVsLCBwaHhFdmVudClcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBnZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKXtcbiAgICByZXR1cm4gdGhpcy5mb3JtU3VibWl0cy5maW5kKChbZWwsIF9yZWYsIF9vcHRzLCBfY2FsbGJhY2tdKSA9PiBlbC5pc1NhbWVOb2RlKGZvcm1FbCkpXG4gIH1cblxuICBzY2hlZHVsZVN1Ym1pdChmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgdGhpcy5mb3JtU3VibWl0cy5wdXNoKFtmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2tdKVxuICB9XG5cbiAgY2FuY2VsU3VibWl0KGZvcm1FbCwgcGh4RXZlbnQpe1xuICAgIHRoaXMuZm9ybVN1Ym1pdHMgPSB0aGlzLmZvcm1TdWJtaXRzLmZpbHRlcigoW2VsLCByZWYsIF9vcHRzLCBfY2FsbGJhY2tdKSA9PiB7XG4gICAgICBpZihlbC5pc1NhbWVOb2RlKGZvcm1FbCkpe1xuICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZiwgcGh4RXZlbnQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGlzYWJsZUZvcm0oZm9ybUVsLCBwaHhFdmVudCwgb3B0cyA9IHt9KXtcbiAgICBsZXQgZmlsdGVySWdub3JlZCA9IGVsID0+IHtcbiAgICAgIGxldCB1c2VySWdub3JlZCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGVsLCBgJHt0aGlzLmJpbmRpbmcoUEhYX1VQREFURSl9PWlnbm9yZWAsIGVsLmZvcm0pXG4gICAgICByZXR1cm4gISh1c2VySWdub3JlZCB8fCBjbG9zZXN0UGh4QmluZGluZyhlbCwgXCJkYXRhLXBoeC11cGRhdGU9aWdub3JlXCIsIGVsLmZvcm0pKVxuICAgIH1cbiAgICBsZXQgZmlsdGVyRGlzYWJsZXMgPSBlbCA9PiB7XG4gICAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKSlcbiAgICB9XG4gICAgbGV0IGZpbHRlckJ1dHRvbiA9IGVsID0+IGVsLnRhZ05hbWUgPT0gXCJCVVRUT05cIlxuXG4gICAgbGV0IGZpbHRlcklucHV0ID0gZWwgPT4gW1wiSU5QVVRcIiwgXCJURVhUQVJFQVwiLCBcIlNFTEVDVFwiXS5pbmNsdWRlcyhlbC50YWdOYW1lKVxuXG4gICAgbGV0IGZvcm1FbGVtZW50cyA9IEFycmF5LmZyb20oZm9ybUVsLmVsZW1lbnRzKVxuICAgIGxldCBkaXNhYmxlcyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVyRGlzYWJsZXMpXG4gICAgbGV0IGJ1dHRvbnMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckJ1dHRvbikuZmlsdGVyKGZpbHRlcklnbm9yZWQpXG4gICAgbGV0IGlucHV0cyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVySW5wdXQpLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuXG4gICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgYnV0dG9uLmRpc2FibGVkKVxuICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxuICAgIH0pXG4gICAgaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9SRUFET05MWSwgaW5wdXQucmVhZE9ubHkpXG4gICAgICBpbnB1dC5yZWFkT25seSA9IHRydWVcbiAgICAgIGlmKGlucHV0LmZpbGVzKXtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgaW5wdXQuZGlzYWJsZWQpXG4gICAgICAgIGlucHV0LmRpc2FibGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgbGV0IGZvcm1FbHMgPSBkaXNhYmxlcy5jb25jYXQoYnV0dG9ucykuY29uY2F0KGlucHV0cykubWFwKGVsID0+IHtcbiAgICAgIHJldHVybiB7ZWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XG4gICAgfSlcblxuICAgIC8vIHdlIHJldmVyc2UgdGhlIG9yZGVyIHNvIGZvcm0gY2hpbGRyZW4gYXJlIGFscmVhZHkgbG9ja2VkIGJ5IHRoZSB0aW1lXG4gICAgLy8gdGhlIGZvcm0gaXMgbG9ja2VkXG4gICAgbGV0IGVscyA9IFt7ZWw6IGZvcm1FbCwgbG9hZGluZzogdHJ1ZSwgbG9jazogZmFsc2V9XS5jb25jYXQoZm9ybUVscykucmV2ZXJzZSgpXG4gICAgcmV0dXJuIHRoaXMucHV0UmVmKGVscywgcGh4RXZlbnQsIFwic3VibWl0XCIsIG9wdHMpXG4gIH1cblxuICBwdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIHN1Ym1pdHRlciwgb3B0cywgb25SZXBseSl7XG4gICAgbGV0IHJlZkdlbmVyYXRvciA9ICgpID0+IHRoaXMuZGlzYWJsZUZvcm0oZm9ybUVsLCBwaHhFdmVudCwge1xuICAgICAgLi4ub3B0cyxcbiAgICAgIGZvcm06IGZvcm1FbCxcbiAgICAgIHN1Ym1pdHRlcjogc3VibWl0dGVyXG4gICAgfSlcbiAgICBsZXQgY2lkID0gdGhpcy50YXJnZXRDb21wb25lbnRJRChmb3JtRWwsIHRhcmdldEN0eClcbiAgICBpZihMaXZlVXBsb2FkZXIuaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKSl7XG4gICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHB1c2ggPSAoKSA9PiB0aGlzLnB1c2hGb3JtU3VibWl0KGZvcm1FbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgc3VibWl0dGVyLCBvcHRzLCBvblJlcGx5KVxuICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVTdWJtaXQoZm9ybUVsLCByZWYsIG9wdHMsIHB1c2gpXG4gICAgfSBlbHNlIGlmKExpdmVVcGxvYWRlci5pbnB1dHNBd2FpdGluZ1ByZWZsaWdodChmb3JtRWwpLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IFtyZWYsIGVsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHByb3h5UmVmR2VuID0gKCkgPT4gW3JlZiwgZWxzLCBvcHRzXVxuICAgICAgdGhpcy51cGxvYWRGaWxlcyhmb3JtRWwsIHBoeEV2ZW50LCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgLy8gaWYgd2Ugc3RpbGwgaGF2aW5nIHBlbmRpbmcgcHJlZmxpZ2h0cyBpdCBtZWFucyB3ZSBoYXZlIGludmFsaWQgZW50cmllc1xuICAgICAgICAvLyBhbmQgdGhlIHBoeC1zdWJtaXQgY2Fubm90IGJlIGNvbXBsZXRlZFxuICAgICAgICBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICB9XG4gICAgICAgIGxldCBtZXRhID0gdGhpcy5leHRyYWN0TWV0YShmb3JtRWwpXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsLCB7c3VibWl0dGVyLCAuLi5tZXRhfSlcbiAgICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHByb3h5UmVmR2VuLCBcImV2ZW50XCIsIHtcbiAgICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgICAgIGNpZDogY2lkXG4gICAgICAgIH0pLnRoZW4oKHtyZXNwfSkgPT4gb25SZXBseShyZXNwKSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCEoZm9ybUVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX1NSQykgJiYgZm9ybUVsLmNsYXNzTGlzdC5jb250YWlucyhcInBoeC1zdWJtaXQtbG9hZGluZ1wiKSkpe1xuICAgICAgbGV0IG1ldGEgPSB0aGlzLmV4dHJhY3RNZXRhKGZvcm1FbClcbiAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsLCB7c3VibWl0dGVyLCAuLi5tZXRhfSlcbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwge1xuICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgIGNpZDogY2lkXG4gICAgICB9KS50aGVuKCh7cmVzcH0pID0+IG9uUmVwbHkocmVzcCkpXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkRmlsZXMoZm9ybUVsLCBwaHhFdmVudCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgb25Db21wbGV0ZSl7XG4gICAgbGV0IGpvaW5Db3VudEF0VXBsb2FkID0gdGhpcy5qb2luQ291bnRcbiAgICBsZXQgaW5wdXRFbHMgPSBMaXZlVXBsb2FkZXIuYWN0aXZlRmlsZUlucHV0cyhmb3JtRWwpXG4gICAgbGV0IG51bUZpbGVJbnB1dHNJblByb2dyZXNzID0gaW5wdXRFbHMubGVuZ3RoXG5cbiAgICAvLyBnZXQgZWFjaCBmaWxlIGlucHV0XG4gICAgaW5wdXRFbHMuZm9yRWFjaChpbnB1dEVsID0+IHtcbiAgICAgIGxldCB1cGxvYWRlciA9IG5ldyBMaXZlVXBsb2FkZXIoaW5wdXRFbCwgdGhpcywgKCkgPT4ge1xuICAgICAgICBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcy0tXG4gICAgICAgIGlmKG51bUZpbGVJbnB1dHNJblByb2dyZXNzID09PSAwKXsgb25Db21wbGV0ZSgpIH1cbiAgICAgIH0pXG5cbiAgICAgIGxldCBlbnRyaWVzID0gdXBsb2FkZXIuZW50cmllcygpLm1hcChlbnRyeSA9PiBlbnRyeS50b1ByZWZsaWdodFBheWxvYWQoKSlcblxuICAgICAgaWYoZW50cmllcy5sZW5ndGggPT09IDApe1xuICAgICAgICBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcy0tXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgICAgcmVmOiBpbnB1dEVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRiksXG4gICAgICAgIGVudHJpZXM6IGVudHJpZXMsXG4gICAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChpbnB1dEVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wic2VuZGluZyBwcmVmbGlnaHQgcmVxdWVzdFwiLCBwYXlsb2FkXSlcblxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KG51bGwsIFwiYWxsb3dfdXBsb2FkXCIsIHBheWxvYWQpLnRoZW4oKHtyZXNwfSkgPT4ge1xuICAgICAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbXCJnb3QgcHJlZmxpZ2h0IHJlc3BvbnNlXCIsIHJlc3BdKVxuICAgICAgICAvLyB0aGUgcHJlZmxpZ2h0IHdpbGwgcmVqZWN0IGVudHJpZXMgYmV5b25kIHRoZSBtYXggZW50cmllc1xuICAgICAgICAvLyBzbyB3ZSBlcnJvciBhbmQgY2FuY2VsIGVudHJpZXMgb24gdGhlIGNsaWVudCB0aGF0IGFyZSBtaXNzaW5nIGZyb20gdGhlIHJlc3BvbnNlXG4gICAgICAgIHVwbG9hZGVyLmVudHJpZXMoKS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICBpZihyZXNwLmVudHJpZXMgJiYgIXJlc3AuZW50cmllc1tlbnRyeS5yZWZdKXtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmFpbGVkRW50cnlQcmVmbGlnaHQoZW50cnkucmVmLCBcImZhaWxlZCBwcmVmbGlnaHRcIiwgdXBsb2FkZXIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAvLyBmb3IgYXV0byB1cGxvYWRzLCB3ZSBtYXkgaGF2ZSBhbiBlbXB0eSBlbnRyaWVzIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlclxuICAgICAgICAvLyBmb3IgZm9ybSBzdWJtaXRzIHRoYXQgY29udGFpbiBpbnZhbGlkIGVudHJpZXNcbiAgICAgICAgaWYocmVzcC5lcnJvciB8fCBPYmplY3Qua2V5cyhyZXNwLmVudHJpZXMpLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICAgIGxldCBlcnJvcnMgPSByZXNwLmVycm9yIHx8IFtdXG4gICAgICAgICAgZXJyb3JzLm1hcCgoW2VudHJ5X3JlZiwgcmVhc29uXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVGYWlsZWRFbnRyeVByZWZsaWdodChlbnRyeV9yZWYsIHJlYXNvbiwgdXBsb2FkZXIpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgb25FcnJvciA9IChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uRXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gam9pbkNvdW50QXRVcGxvYWQpeyBjYWxsYmFjaygpIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwbG9hZGVyLmluaXRBZGFwdGVyVXBsb2FkKHJlc3AsIG9uRXJyb3IsIHRoaXMubGl2ZVNvY2tldClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmFpbGVkRW50cnlQcmVmbGlnaHQodXBsb2FkUmVmLCByZWFzb24sIHVwbG9hZGVyKXtcbiAgICBpZih1cGxvYWRlci5pc0F1dG9VcGxvYWQoKSl7XG4gICAgICAvLyB1cGxvYWRSZWYgbWF5IGJlIHRvcCBsZXZlbCB1cGxvYWQgY29uZmlnIHJlZiBvciBlbnRyeSByZWZcbiAgICAgIGxldCBlbnRyeSA9IHVwbG9hZGVyLmVudHJpZXMoKS5maW5kKGVudHJ5ID0+IGVudHJ5LnJlZiA9PT0gdXBsb2FkUmVmLnRvU3RyaW5nKCkpXG4gICAgICBpZihlbnRyeSl7IGVudHJ5LmNhbmNlbCgpIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdXBsb2FkZXIuZW50cmllcygpLm1hcChlbnRyeSA9PiBlbnRyeS5jYW5jZWwoKSlcbiAgICB9XG4gICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW2BlcnJvciBmb3IgZW50cnkgJHt1cGxvYWRSZWZ9YCwgcmVhc29uXSlcbiAgfVxuXG4gIGRpc3BhdGNoVXBsb2Fkcyh0YXJnZXRDdHgsIG5hbWUsIGZpbGVzT3JCbG9icyl7XG4gICAgbGV0IHRhcmdldEVsZW1lbnQgPSB0aGlzLnRhcmdldEN0eEVsZW1lbnQodGFyZ2V0Q3R4KSB8fCB0aGlzLmVsXG4gICAgbGV0IGlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKHRhcmdldEVsZW1lbnQpLmZpbHRlcihlbCA9PiBlbC5uYW1lID09PSBuYW1lKVxuICAgIGlmKGlucHV0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm8gbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApIH1cbiAgICBlbHNlIGlmKGlucHV0cy5sZW5ndGggPiAxKXsgbG9nRXJyb3IoYGR1cGxpY2F0ZSBsaXZlIGZpbGUgaW5wdXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBuYW1lIFwiJHtuYW1lfVwiYCkgfVxuICAgIGVsc2UgeyBET00uZGlzcGF0Y2hFdmVudChpbnB1dHNbMF0sIFBIWF9UUkFDS19VUExPQURTLCB7ZGV0YWlsOiB7ZmlsZXM6IGZpbGVzT3JCbG9ic319KSB9XG4gIH1cblxuICB0YXJnZXRDdHhFbGVtZW50KHRhcmdldEN0eCl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7XG4gICAgICBsZXQgW3RhcmdldF0gPSBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIHRhcmdldEN0eClcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9IGVsc2UgaWYodGFyZ2V0Q3R4KXtcbiAgICAgIHJldHVybiB0YXJnZXRDdHhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBwdXNoRm9ybVJlY292ZXJ5KG9sZEZvcm0sIG5ld0Zvcm0sIHRlbXBsYXRlRG9tLCBjYWxsYmFjayl7XG4gICAgLy8gd2UgYXJlIG9ubHkgcmVjb3ZlcmluZyBmb3JtcyBpbnNpZGUgdGhlIGN1cnJlbnQgdmlldywgdGhlcmVmb3JlIGl0IGlzIHNhZmUgdG9cbiAgICAvLyBza2lwIHdpdGhpbk93bmVycyBoZXJlIGFuZCBhbHdheXMgdXNlIHRoaXMgd2hlbiByZWZlcnJpbmcgdG8gdGhlIHZpZXdcbiAgICBjb25zdCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICBjb25zdCBwaHhUYXJnZXQgPSBuZXdGb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJ0YXJnZXRcIikpIHx8IG5ld0Zvcm1cbiAgICBjb25zdCBwaHhFdmVudCA9IG5ld0Zvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfQVVUT19SRUNPVkVSKSkgfHwgbmV3Rm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKVxuICAgIGNvbnN0IGlucHV0cyA9IEFycmF5LmZyb20ob2xkRm9ybS5lbGVtZW50cykuZmlsdGVyKGVsID0+IERPTS5pc0Zvcm1JbnB1dChlbCkgJiYgZWwubmFtZSAmJiAhZWwuaGFzQXR0cmlidXRlKHBoeENoYW5nZSkpXG4gICAgaWYoaW5wdXRzLmxlbmd0aCA9PT0gMCl7IHJldHVybiB9XG5cbiAgICAvLyB3ZSBtdXN0IGNsZWFyIHRyYWNrZWQgdXBsb2FkcyBiZWZvcmUgcmVjb3ZlcnkgYXMgdGhleSBubyBsb25nZXIgaGF2ZSB2YWxpZCByZWZzXG4gICAgaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gaW5wdXQuaGFzQXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSAmJiBMaXZlVXBsb2FkZXIuY2xlYXJGaWxlcyhpbnB1dCkpXG4gICAgLy8gcHVzaElucHV0IGFzc3VtZXMgdGhhdCB0aGVyZSBpcyBhIHNvdXJjZSBlbGVtZW50IHRoYXQgaW5pdGlhdGVkIHRoZSBjaGFuZ2U7XG4gICAgLy8gYmVjYXVzZSB0aGlzIGlzIG5vdCB0aGUgY2FzZSB3aGVuIHdlIHJlY292ZXIgZm9ybXMsIHdlIHByb3ZpZGUgdGhlIGZpcnN0IGlucHV0IHdlIGZpbmRcbiAgICBsZXQgaW5wdXQgPSBpbnB1dHMuZmluZChlbCA9PiBlbC50eXBlICE9PSBcImhpZGRlblwiKSB8fCBpbnB1dHNbMF1cblxuICAgIC8vIGluIHRoZSBjYXNlIHRoYXQgdGhlcmUgYXJlIG11bHRpcGxlIHRhcmdldHMsIHdlIGNvdW50IHRoZSBudW1iZXIgb2YgcGVuZGluZyByZWNvdmVyeSBldmVudHNcbiAgICAvLyBhbmQgb25seSBjYWxsIHRoZSBjYWxsYmFjayBvbmNlIGFsbCBldmVudHMgaGF2ZSBiZWVuIHByb2Nlc3NlZFxuICAgIGxldCBwZW5kaW5nID0gMFxuICAgIC8vIHdpdGhpblRhcmdldHMocGh4VGFyZ2V0LCBjYWxsYmFjaywgZG9tLCB2aWV3RWwpXG4gICAgdGhpcy53aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgKHRhcmdldFZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgY29uc3QgY2lkID0gdGhpcy50YXJnZXRDb21wb25lbnRJRChuZXdGb3JtLCB0YXJnZXRDdHgpXG4gICAgICBwZW5kaW5nKytcbiAgICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OmZvcm0tcmVjb3ZlcnlcIiwge2RldGFpbDoge3NvdXJjZUVsZW1lbnQ6IG9sZEZvcm19fSlcbiAgICAgIEpTLmV4ZWMoZSwgXCJjaGFuZ2VcIiwgcGh4RXZlbnQsIHRoaXMsIGlucHV0LCBbXCJwdXNoXCIsIHtcbiAgICAgICAgX3RhcmdldDogaW5wdXQubmFtZSxcbiAgICAgICAgdGFyZ2V0VmlldyxcbiAgICAgICAgdGFyZ2V0Q3R4LFxuICAgICAgICBuZXdDaWQ6IGNpZCxcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICBwZW5kaW5nLS1cbiAgICAgICAgICBpZihwZW5kaW5nID09PSAwKXsgY2FsbGJhY2soKSB9XG4gICAgICAgIH1cbiAgICAgIH1dKVxuICAgIH0sIHRlbXBsYXRlRG9tLCB0ZW1wbGF0ZURvbSlcbiAgfVxuXG4gIHB1c2hMaW5rUGF0Y2goZSwgaHJlZiwgdGFyZ2V0RWwsIGNhbGxiYWNrKXtcbiAgICBsZXQgbGlua1JlZiA9IHRoaXMubGl2ZVNvY2tldC5zZXRQZW5kaW5nTGluayhocmVmKVxuICAgIC8vIG9ubHkgYWRkIGxvYWRpbmcgc3RhdGVzIGlmIGV2ZW50IGlzIHRydXN0ZWQgKGl0IHdhcyB0cmlnZ2VyZWQgYnkgdXNlciwgc3VjaCBhcyBjbGljaykgYW5kXG4gICAgLy8gaXQncyBub3QgYSBmb3J3YXJkL2JhY2sgbmF2aWdhdGlvbiBmcm9tIHBvcHN0YXRlXG4gICAgbGV0IGxvYWRpbmcgPSBlLmlzVHJ1c3RlZCAmJiBlLnR5cGUgIT09IFwicG9wc3RhdGVcIlxuICAgIGxldCByZWZHZW4gPSB0YXJnZXRFbCA/ICgpID0+IHRoaXMucHV0UmVmKFt7ZWw6IHRhcmdldEVsLCBsb2FkaW5nOiBsb2FkaW5nLCBsb2NrOiB0cnVlfV0sIG51bGwsIFwiY2xpY2tcIikgOiBudWxsXG4gICAgbGV0IGZhbGxiYWNrID0gKCkgPT4gdGhpcy5saXZlU29ja2V0LnJlZGlyZWN0KHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuICAgIGxldCB1cmwgPSBocmVmLnN0YXJ0c1dpdGgoXCIvXCIpID8gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9JHtocmVmfWAgOiBocmVmXG5cbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuLCBcImxpdmVfcGF0Y2hcIiwge3VybH0pLnRoZW4oXG4gICAgICAoe3Jlc3B9KSA9PiB7XG4gICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICBpZihyZXNwLmxpbmtfcmVkaXJlY3Qpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcGxhY2VNYWluKGhyZWYsIG51bGwsIGNhbGxiYWNrLCBsaW5rUmVmKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0aGlzLmxpdmVTb2NrZXQuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICAgICAgICB0aGlzLmhyZWYgPSBocmVmXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFwcGx5UGVuZGluZ1VwZGF0ZXMoKVxuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobGlua1JlZilcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgKHtlcnJvcjogX2Vycm9yLCB0aW1lb3V0OiBfdGltZW91dH0pID0+IGZhbGxiYWNrKClcbiAgICApXG4gIH1cblxuICBnZXRGb3Jtc0ZvclJlY292ZXJ5KCl7XG4gICAgaWYodGhpcy5qb2luQ291bnQgPT09IDApeyByZXR1cm4ge30gfVxuXG4gICAgbGV0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuXG4gICAgcmV0dXJuIERPTS5hbGwodGhpcy5lbCwgYGZvcm1bJHtwaHhDaGFuZ2V9XWApXG4gICAgICAuZmlsdGVyKGZvcm0gPT4gZm9ybS5pZClcbiAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmVsZW1lbnRzLmxlbmd0aCA+IDApXG4gICAgICAuZmlsdGVyKGZvcm0gPT4gZm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9BVVRPX1JFQ09WRVIpKSAhPT0gXCJpZ25vcmVcIilcbiAgICAgIC5tYXAoZm9ybSA9PiBmb3JtLmNsb25lTm9kZSh0cnVlKSlcbiAgICAgIC5yZWR1Y2UoKGFjYywgZm9ybSkgPT4ge1xuICAgICAgICBhY2NbZm9ybS5pZF0gPSBmb3JtXG4gICAgICAgIHJldHVybiBhY2NcbiAgICAgIH0sIHt9KVxuICB9XG5cbiAgbWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKXtcbiAgICBsZXQgd2lsbERlc3Ryb3lDSURzID0gZGVzdHJveWVkQ0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgfSlcblxuICAgIGlmKHdpbGxEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgIC8vIHdlIG11c3QgcmVzZXQgdGhlIHJlbmRlciBjaGFuZ2UgdHJhY2tpbmcgZm9yIGNpZHMgdGhhdFxuICAgICAgLy8gY291bGQgYmUgYWRkZWQgYmFjayBmcm9tIHRoZSBzZXJ2ZXIgc28gd2UgZG9uJ3Qgc2tpcCB0aGVtXG4gICAgICB3aWxsRGVzdHJveUNJRHMuZm9yRWFjaChjaWQgPT4gdGhpcy5yZW5kZXJlZC5yZXNldFJlbmRlcihjaWQpKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX3dpbGxfZGVzdHJveVwiLCB7Y2lkczogd2lsbERlc3Ryb3lDSURzfSkudGhlbigoKSA9PiB7XG4gICAgICAgIC8vIHdlIG11c3Qgd2FpdCBmb3IgcGVuZGluZyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSBiZWZvcmUgZGV0ZXJtaW5pbmdcbiAgICAgICAgLy8gaWYgdGhlIGNpZHMgd2VyZSBhZGRlZCBiYWNrIHRvIHRoZSBET00gaW4gdGhlIG1lYW50aW1lICgjMzEzOSlcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIFNlZSBpZiBhbnkgb2YgdGhlIGNpZHMgd2Ugd2FudGVkIHRvIGRlc3Ryb3kgd2VyZSBhZGRlZCBiYWNrLFxuICAgICAgICAgIC8vIGlmIHRoZXkgd2VyZSBhZGRlZCBiYWNrLCB3ZSBkb24ndCBhY3R1YWxseSBkZXN0cm95IHRoZW0uXG4gICAgICAgICAgbGV0IGNvbXBsZXRlbHlEZXN0cm95Q0lEcyA9IHdpbGxEZXN0cm95Q0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmKGNvbXBsZXRlbHlEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfZGVzdHJveWVkXCIsIHtjaWRzOiBjb21wbGV0ZWx5RGVzdHJveUNJRHN9KS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZC5wcnVuZUNJRHMocmVzcC5jaWRzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG93bnNFbGVtZW50KGVsKXtcbiAgICBsZXQgcGFyZW50Vmlld0VsID0gZWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUilcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpID09PSB0aGlzLmlkIHx8XG4gICAgICAocGFyZW50Vmlld0VsICYmIHBhcmVudFZpZXdFbC5pZCA9PT0gdGhpcy5pZCkgfHxcbiAgICAgICghcGFyZW50Vmlld0VsICYmIHRoaXMuaXNEZWFkKVxuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMgPSB7fSl7XG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybSwgUEhYX0hBU19TVUJNSVRURUQsIHRydWUpXG4gICAgY29uc3QgaW5wdXRzID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKVxuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IERPTS5wdXRQcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRCwgdHJ1ZSkpXG4gICAgdGhpcy5saXZlU29ja2V0LmJsdXJBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBzdWJtaXR0ZXIsIG9wdHMsICgpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKClcbiAgICB9KVxuICB9XG5cbiAgYmluZGluZyhraW5kKXsgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKGtpbmQpIH1cbn1cbiIsICIvKiogSW5pdGlhbGl6ZXMgdGhlIExpdmVTb2NrZXRcbiAqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3c3M6Ly9leGFtcGxlLmNvbS9saXZlXCJgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9saXZlXCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtQaG9lbml4LlNvY2tldH0gc29ja2V0IC0gdGhlIHJlcXVpcmVkIFBob2VuaXggU29ja2V0IGNsYXNzIGltcG9ydGVkIGZyb20gXCJwaG9lbml4XCIuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICogICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAqICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvbi4gT3V0c2lkZSBvZiBrZXlzIGxpc3RlZCBiZWxvdywgYWxsXG4gKiBjb25maWd1cmF0aW9uIGlzIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgUGhvZW5peCBTb2NrZXQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuZGVmYXVsdHNdIC0gVGhlIG9wdGlvbmFsIGRlZmF1bHRzIHRvIHVzZSBmb3IgdmFyaW91cyBiaW5kaW5ncyxcbiAqIHN1Y2ggYXMgYHBoeC1kZWJvdW5jZWAuIFN1cHBvcnRzIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqXG4gKiAgIC0gZGVib3VuY2UgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LWRlYm91bmNlIHRpbWUuIERlZmF1bHRzIDMwMFxuICogICAtIHRocm90dGxlIC0gdGhlIG1pbGxpc2Vjb25kIHBoeC10aHJvdHRsZSB0aW1lLiBEZWZhdWx0cyAzMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIGZvciBwYXNzaW5nIGNvbm5lY3QgcGFyYW1zLlxuICogVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIExpdmVWaWV3LiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgKGVsKSA9PiB7dmlldzogZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1teS12aWV3LW5hbWVcIiwgdG9rZW46IHdpbmRvdy5teVRva2VufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5kaW5nUHJlZml4XSAtIFRoZSBvcHRpb25hbCBwcmVmaXggdG8gdXNlIGZvciBhbGwgcGh4IERPTSBhbm5vdGF0aW9ucy5cbiAqIERlZmF1bHRzIHRvIFwicGh4LVwiLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmhvb2tzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IGhvb2sgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLnVwbG9hZGVyc10gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IGZvciByZWZlcmVuY2luZyBMaXZlVmlldyB1cGxvYWRlciBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmxvYWRlclRpbWVvdXRdIC0gVGhlIG9wdGlvbmFsIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhcHBseVxuICogbG9hZGluZyBzdGF0ZXMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLm1heFJlbG9hZHNdIC0gVGhlIG1heGltdW0gcmVsb2FkcyBiZWZvcmUgZW50ZXJpbmcgZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMucmVsb2FkSml0dGVyTWluXSAtIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiBub3JtYWwgcmVsb2FkIGF0dGVtcHRzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNYXhdIC0gVGhlIG1heGltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmZhaWxzYWZlSml0dGVyXSAtIFRoZSB0aW1lIGJldHdlZW4gcmVsb2FkIGF0dGVtcHRzIGluIGZhaWxzYWZlIG1vZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy52aWV3TG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0byBsb2cgZGVidWcgaW5mb3JtYXRpb24uIEZvciBleGFtcGxlOlxuICpcbiAqICAgICAodmlldywga2luZCwgbXNnLCBvYmopID0+IGNvbnNvbGUubG9nKGAke3ZpZXcuaWR9ICR7a2luZH06ICR7bXNnfSAtIGAsIG9iailcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubWV0YWRhdGFdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBtYXBwaW5nIGV2ZW50IG5hbWVzIHRvIGZ1bmN0aW9ucyBmb3JcbiAqIHBvcHVsYXRpbmcgZXZlbnQgbWV0YWRhdGEuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBtZXRhZGF0YToge1xuICogICAgICAgY2xpY2s6IChlLCBlbCkgPT4ge1xuICogICAgICAgICByZXR1cm4ge1xuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgZGV0YWlsOiBlLmRldGFpbCB8fCAxLFxuICogICAgICAgICB9XG4gKiAgICAgICB9LFxuICogICAgICAga2V5ZG93bjogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAga2V5OiBlLmtleSxcbiAqICAgICAgICAgICBjdHJsS2V5OiBlLmN0cmxLZXksXG4gKiAgICAgICAgICAgbWV0YUtleTogZS5tZXRhS2V5LFxuICogICAgICAgICAgIHNoaWZ0S2V5OiBlLnNoaWZ0S2V5XG4gKiAgICAgICAgIH1cbiAqICAgICAgIH1cbiAqICAgICB9XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuc2Vzc2lvblN0b3JhZ2VdIC0gQW4gb3B0aW9uYWwgU3RvcmFnZSBjb21wYXRpYmxlIG9iamVjdFxuICogVXNlZnVsIHdoZW4gTGl2ZVZpZXcgd29uJ3QgaGF2ZSBhY2Nlc3MgdG8gYHNlc3Npb25TdG9yYWdlYC4gIEZvciBleGFtcGxlLCBUaGlzIGNvdWxkXG4gKiBoYXBwZW4gaWYgYSBzaXRlIGxvYWRzIGEgY3Jvc3MtZG9tYWluIExpdmVWaWV3IGluIGFuIGlmcmFtZS4gIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogICAgIGNsYXNzIEluTWVtb3J5U3RvcmFnZSB7XG4gKiAgICAgICBjb25zdHJ1Y3RvcigpIHsgdGhpcy5zdG9yYWdlID0ge30gfVxuICogICAgICAgZ2V0SXRlbShrZXlOYW1lKSB7IHJldHVybiB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gfHwgbnVsbCB9XG4gKiAgICAgICByZW1vdmVJdGVtKGtleU5hbWUpIHsgZGVsZXRlIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB9XG4gKiAgICAgICBzZXRJdGVtKGtleU5hbWUsIGtleVZhbHVlKSB7IHRoaXMuc3RvcmFnZVtrZXlOYW1lXSA9IGtleVZhbHVlIH1cbiAqICAgICB9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmxvY2FsU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgZm9yIHdoZW4gTGl2ZVZpZXcgd29uJ3QgaGF2ZSBhY2Nlc3MgdG8gYGxvY2FsU3RvcmFnZWAuXG4gKiBTZWUgYG9wdHMuc2Vzc2lvblN0b3JhZ2VgIGZvciBleGFtcGxlcy5cbiovXG5cbmltcG9ydCB7XG4gIEJJTkRJTkdfUFJFRklYLFxuICBDT05TRUNVVElWRV9SRUxPQURTLFxuICBERUZBVUxUUyxcbiAgRkFJTFNBRkVfSklUVEVSLFxuICBMT0FERVJfVElNRU9VVCxcbiAgTUFYX1JFTE9BRFMsXG4gIFBIWF9ERUJPVU5DRSxcbiAgUEhYX0RST1BfVEFSR0VULFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9LRVksXG4gIFBIWF9MSU5LX1NUQVRFLFxuICBQSFhfTElWRV9MSU5LLFxuICBQSFhfTFZfREVCVUcsXG4gIFBIWF9MVl9MQVRFTkNZX1NJTSxcbiAgUEhYX0xWX1BST0ZJTEUsXG4gIFBIWF9MVl9ISVNUT1JZX1BPU0lUSU9OLFxuICBQSFhfTUFJTixcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfVEhST1RUTEUsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfU0VTU0lPTixcbiAgUkVMT0FEX0pJVFRFUl9NSU4sXG4gIFJFTE9BRF9KSVRURVJfTUFYLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFTE9BRF9TVEFUVVNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBjbG9zdXJlLFxuICBkZWJ1ZyxcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgQnJvd3NlciBmcm9tIFwiLi9icm93c2VyXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBIb29rcyBmcm9tIFwiLi9ob29rc1wiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5leHBvcnQgbGV0IGlzVXNlZElucHV0ID0gKGVsKSA9PiBET00uaXNVc2VkSW5wdXQoZWwpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVTb2NrZXQge1xuICBjb25zdHJ1Y3Rvcih1cmwsIHBoeFNvY2tldCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnVubG9hZGVkID0gZmFsc2VcbiAgICBpZighcGh4U29ja2V0IHx8IHBoeFNvY2tldC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBhIHBob2VuaXggU29ja2V0IG11c3QgYmUgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byB0aGUgTGl2ZVNvY2tldCBjb25zdHJ1Y3Rvci4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICAgICAgICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAgICAgICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAgICAgIGApXG4gICAgfVxuICAgIHRoaXMuc29ja2V0ID0gbmV3IHBoeFNvY2tldCh1cmwsIG9wdHMpXG4gICAgdGhpcy5iaW5kaW5nUHJlZml4ID0gb3B0cy5iaW5kaW5nUHJlZml4IHx8IEJJTkRJTkdfUFJFRklYXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnZpZXdMb2dnZXIgPSBvcHRzLnZpZXdMb2dnZXJcbiAgICB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzID0gb3B0cy5tZXRhZGF0YSB8fCB7fVxuICAgIHRoaXMuZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKGNsb25lKERFRkFVTFRTKSwgb3B0cy5kZWZhdWx0cyB8fCB7fSlcbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5wcmV2QWN0aXZlID0gbnVsbFxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gbnVsbFxuICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsXG4gICAgdGhpcy5saW5rUmVmID0gMVxuICAgIHRoaXMucm9vdHMgPSB7fVxuICAgIHRoaXMuaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKHdpbmRvdy5sb2NhdGlvbilcbiAgICB0aGlzLmhvb2tzID0gb3B0cy5ob29rcyB8fCB7fVxuICAgIHRoaXMudXBsb2FkZXJzID0gb3B0cy51cGxvYWRlcnMgfHwge31cbiAgICB0aGlzLmxvYWRlclRpbWVvdXQgPSBvcHRzLmxvYWRlclRpbWVvdXQgfHwgTE9BREVSX1RJTUVPVVRcbiAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lciA9IG51bGxcbiAgICB0aGlzLm1heFJlbG9hZHMgPSBvcHRzLm1heFJlbG9hZHMgfHwgTUFYX1JFTE9BRFNcbiAgICB0aGlzLnJlbG9hZEppdHRlck1pbiA9IG9wdHMucmVsb2FkSml0dGVyTWluIHx8IFJFTE9BRF9KSVRURVJfTUlOXG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNYXggPSBvcHRzLnJlbG9hZEppdHRlck1heCB8fCBSRUxPQURfSklUVEVSX01BWFxuICAgIHRoaXMuZmFpbHNhZmVKaXR0ZXIgPSBvcHRzLmZhaWxzYWZlSml0dGVyIHx8IEZBSUxTQUZFX0pJVFRFUlxuICAgIHRoaXMubG9jYWxTdG9yYWdlID0gb3B0cy5sb2NhbFN0b3JhZ2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2UgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IHdpbmRvdy5zZXNzaW9uU3RvcmFnZVxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IGZhbHNlXG4gICAgdGhpcy5ib3VuZEV2ZW50TmFtZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnNlcnZlckNsb3NlUmVmID0gbnVsbFxuICAgIHRoaXMuZG9tQ2FsbGJhY2tzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBqc1F1ZXJ5U2VsZWN0b3JBbGw6IG51bGwsXG4gICAgICBvblBhdGNoU3RhcnQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uUGF0Y2hFbmQ6IGNsb3N1cmUoKSxcbiAgICAgIG9uTm9kZUFkZGVkOiBjbG9zdXJlKCksXG4gICAgICBvbkJlZm9yZUVsVXBkYXRlZDogY2xvc3VyZSgpfSxcbiAgICBvcHRzLmRvbSB8fCB7fSlcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25TZXQoKVxuICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbiA9IHBhcnNlSW50KHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfSElTVE9SWV9QT1NJVElPTikpIHx8IDBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIF9lID0+IHtcbiAgICAgIHRoaXMudW5sb2FkZWQgPSB0cnVlXG4gICAgfSlcbiAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgaWYodGhpcy5pc1VubG9hZGVkKCkpe1xuICAgICAgICAvLyByZWxvYWQgcGFnZSBpZiBiZWluZyByZXN0b3JlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZSBhbmQgYnJvd3NlciBkb2VzIG5vdCBlbWl0IFwicGFnZXNob3dcIlxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gcHVibGljXG5cbiAgdmVyc2lvbigpeyByZXR1cm4gTFZfVlNOIH1cblxuICBpc1Byb2ZpbGVFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0VuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0Rpc2FibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJmYWxzZVwiIH1cblxuICBlbmFibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcInRydWVcIikgfVxuXG4gIGVuYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX1BST0ZJTEUsIFwidHJ1ZVwiKSB9XG5cbiAgZGlzYWJsZURlYnVnKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfREVCVUcsIFwiZmFsc2VcIikgfVxuXG4gIGRpc2FibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9QUk9GSUxFKSB9XG5cbiAgZW5hYmxlTGF0ZW5jeVNpbSh1cHBlckJvdW5kTXMpe1xuICAgIHRoaXMuZW5hYmxlRGVidWcoKVxuICAgIGNvbnNvbGUubG9nKFwibGF0ZW5jeSBzaW11bGF0b3IgZW5hYmxlZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoaXMgYnJvd3NlciBzZXNzaW9uLiBDYWxsIGRpc2FibGVMYXRlbmN5U2ltKCkgdG8gZGlzYWJsZVwiKVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0sIHVwcGVyQm91bmRNcylcbiAgfVxuXG4gIGRpc2FibGVMYXRlbmN5U2ltKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfTEFURU5DWV9TSU0pIH1cblxuICBnZXRMYXRlbmN5U2ltKCl7XG4gICAgbGV0IHN0ciA9IHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0pXG4gICAgcmV0dXJuIHN0ciA/IHBhcnNlSW50KHN0cikgOiBudWxsXG4gIH1cblxuICBnZXRTb2NrZXQoKXsgcmV0dXJuIHRoaXMuc29ja2V0IH1cblxuICBjb25uZWN0KCl7XG4gICAgLy8gZW5hYmxlIGRlYnVnIGJ5IGRlZmF1bHQgaWYgb24gbG9jYWxob3N0IGFuZCBub3QgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIiAmJiAhdGhpcy5pc0RlYnVnRGlzYWJsZWQoKSl7IHRoaXMuZW5hYmxlRGVidWcoKSB9XG4gICAgbGV0IGRvQ29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMucmVzZXRSZWxvYWRTdGF0dXMoKVxuICAgICAgaWYodGhpcy5qb2luUm9vdFZpZXdzKCkpe1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cygpXG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIGlmKHRoaXMubWFpbil7XG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5iaW5kVG9wTGV2ZWxFdmVudHMoe2RlYWQ6IHRydWV9KVxuICAgICAgfVxuICAgICAgdGhpcy5qb2luRGVhZFZpZXcoKVxuICAgIH1cbiAgICBpZihbXCJjb21wbGV0ZVwiLCBcImxvYWRlZFwiLCBcImludGVyYWN0aXZlXCJdLmluZGV4T2YoZG9jdW1lbnQucmVhZHlTdGF0ZSkgPj0gMCl7XG4gICAgICBkb0Nvbm5lY3QoKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiBkb0Nvbm5lY3QoKSlcbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KGNhbGxiYWNrKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgLy8gcmVtb3ZlIHRoZSBzb2NrZXQgY2xvc2UgbGlzdGVuZXIgdG8gYXZvaWQgdHJ5aW5nIHRvIGhhbmRsZVxuICAgIC8vIGEgc2VydmVyIGNsb3NlIGV2ZW50IHdoZW4gaXQgaXMgYWN0dWFsbHkgY2F1c2VkIGJ5IHVzIGRpc2Nvbm5lY3RpbmdcbiAgICBpZih0aGlzLnNlcnZlckNsb3NlUmVmKXtcbiAgICAgIHRoaXMuc29ja2V0Lm9mZih0aGlzLnNlcnZlckNsb3NlUmVmKVxuICAgICAgdGhpcy5zZXJ2ZXJDbG9zZVJlZiA9IG51bGxcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdChjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGxhY2VUcmFuc3BvcnQodHJhbnNwb3J0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5zb2NrZXQucmVwbGFjZVRyYW5zcG9ydCh0cmFuc3BvcnQpXG4gICAgdGhpcy5jb25uZWN0KClcbiAgfVxuXG4gIGV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUgPSBudWxsKXtcbiAgICBsZXQgZSA9IG5ldyBDdXN0b21FdmVudChcInBoeDpleGVjXCIsIHtkZXRhaWw6IHtzb3VyY2VFbGVtZW50OiBlbH19KVxuICAgIHRoaXMub3duZXIoZWwsIHZpZXcgPT4gSlMuZXhlYyhlLCBldmVudFR5cGUsIGVuY29kZWRKUywgdmlldywgZWwpKVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGV4ZWNKU0hvb2tQdXNoKGVsLCBwaHhFdmVudCwgZGF0YSwgY2FsbGJhY2spe1xuICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgIGxldCBlID0gbmV3IEN1c3RvbUV2ZW50KFwicGh4OmV4ZWNcIiwge2RldGFpbDoge3NvdXJjZUVsZW1lbnQ6IGVsfX0pXG4gICAgICBKUy5leGVjKGUsIFwiaG9va1wiLCBwaHhFdmVudCwgdmlldywgZWwsIFtcInB1c2hcIiwge2RhdGEsIGNhbGxiYWNrfV0pXG4gICAgfSlcbiAgfVxuXG4gIHVubG9hZCgpe1xuICAgIGlmKHRoaXMudW5sb2FkZWQpeyByZXR1cm4gfVxuICAgIGlmKHRoaXMubWFpbiAmJiB0aGlzLmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyh0aGlzLm1haW4sIFwic29ja2V0XCIsICgpID0+IFtcImRpc2Nvbm5lY3QgZm9yIHBhZ2UgbmF2XCJdKSB9XG4gICAgdGhpcy51bmxvYWRlZCA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3lBbGxWaWV3cygpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgfVxuXG4gIHRyaWdnZXJET00oa2luZCwgYXJncyl7IHRoaXMuZG9tQ2FsbGJhY2tzW2tpbmRdKC4uLmFyZ3MpIH1cblxuICB0aW1lKG5hbWUsIGZ1bmMpe1xuICAgIGlmKCF0aGlzLmlzUHJvZmlsZUVuYWJsZWQoKSB8fCAhY29uc29sZS50aW1lKXsgcmV0dXJuIGZ1bmMoKSB9XG4gICAgY29uc29sZS50aW1lKG5hbWUpXG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMoKVxuICAgIGNvbnNvbGUudGltZUVuZChuYW1lKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGxvZyh2aWV3LCBraW5kLCBtc2dDYWxsYmFjayl7XG4gICAgaWYodGhpcy52aWV3TG9nZ2VyKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgdGhpcy52aWV3TG9nZ2VyKHZpZXcsIGtpbmQsIG1zZywgb2JqKVxuICAgIH0gZWxzZSBpZih0aGlzLmlzRGVidWdFbmFibGVkKCkpe1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpXG4gICAgICBkZWJ1Zyh2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0RE9NVXBkYXRlKGNhbGxiYWNrKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFmdGVyKGNhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gIH1cblxuICBvbkNoYW5uZWwoY2hhbm5lbCwgZXZlbnQsIGNiKXtcbiAgICBjaGFubmVsLm9uKGV2ZW50LCBkYXRhID0+IHtcbiAgICAgIGxldCBsYXRlbmN5ID0gdGhpcy5nZXRMYXRlbmN5U2ltKClcbiAgICAgIGlmKCFsYXRlbmN5KXtcbiAgICAgICAgY2IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2IoZGF0YSksIGxhdGVuY3kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZFdpdGhKaXR0ZXIodmlldywgbG9nKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBsZXQgbWluTXMgPSB0aGlzLnJlbG9hZEppdHRlck1pblxuICAgIGxldCBtYXhNcyA9IHRoaXMucmVsb2FkSml0dGVyTWF4XG4gICAgbGV0IGFmdGVyTXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4TXMgLSBtaW5NcyArIDEpKSArIG1pbk1zXG4gICAgbGV0IHRyaWVzID0gQnJvd3Nlci51cGRhdGVMb2NhbCh0aGlzLmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTLCAwLCBjb3VudCA9PiBjb3VudCArIDEpXG4gICAgaWYodHJpZXMgPj0gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgIGFmdGVyTXMgPSB0aGlzLmZhaWxzYWZlSml0dGVyXG4gICAgfVxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBpZiB2aWV3IGhhcyByZWNvdmVyZWQsIHN1Y2ggYXMgdHJhbnNwb3J0IHJlcGxhY2VkLCB0aGVuIGNhbmNlbFxuICAgICAgaWYodmlldy5pc0Rlc3Ryb3llZCgpIHx8IHZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICB2aWV3LmRlc3Ryb3koKVxuICAgICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pXG4gICAgICBpZih0cmllcyA+PSB0aGlzLm1heFJlbG9hZHMpe1xuICAgICAgICB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BleGNlZWRlZCAke3RoaXMubWF4UmVsb2Fkc30gY29uc2VjdXRpdmUgcmVsb2Fkcy4gRW50ZXJpbmcgZmFpbHNhZmUgbW9kZWBdKVxuICAgICAgfVxuICAgICAgaWYodGhpcy5oYXNQZW5kaW5nTGluaygpKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgYWZ0ZXJNcylcbiAgfVxuXG4gIGdldEhvb2tDYWxsYmFja3MobmFtZSl7XG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5zdGFydHNXaXRoKFwiUGhvZW5peC5cIikgPyBIb29rc1tuYW1lLnNwbGl0KFwiLlwiKVsxXV0gOiB0aGlzLmhvb2tzW25hbWVdXG4gIH1cblxuICBpc1VubG9hZGVkKCl7IHJldHVybiB0aGlzLnVubG9hZGVkIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSB9XG5cbiAgZ2V0QmluZGluZ1ByZWZpeCgpeyByZXR1cm4gdGhpcy5iaW5kaW5nUHJlZml4IH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gYCR7dGhpcy5nZXRCaW5kaW5nUHJlZml4KCl9JHtraW5kfWAgfVxuXG4gIGNoYW5uZWwodG9waWMsIHBhcmFtcyl7IHJldHVybiB0aGlzLnNvY2tldC5jaGFubmVsKHRvcGljLCBwYXJhbXMpIH1cblxuICBqb2luRGVhZFZpZXcoKXtcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmJvZHlcbiAgICBpZihib2R5ICYmICF0aGlzLmlzUGh4Vmlldyhib2R5KSAmJiAhdGhpcy5pc1BoeFZpZXcoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpKXtcbiAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhib2R5KVxuICAgICAgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKVxuICAgICAgdmlldy5qb2luRGVhZCgpXG4gICAgICBpZighdGhpcy5tYWluKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdmlldy5leGVjTmV3TW91bnRlZCgpXG4gICAgICAgIC8vIHJlc3RvcmUgc2Nyb2xsIHBvc2l0aW9uIHdoZW4gbmF2aWdhdGluZyBmcm9tIGFuIGV4dGVybmFsIC8gbm9uLWxpdmUgcGFnZVxuICAgICAgICB0aGlzLm1heWJlU2Nyb2xsKGhpc3Rvcnkuc3RhdGU/LnNjcm9sbClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgam9pblJvb3RWaWV3cygpe1xuICAgIGxldCByb290c0ZvdW5kID0gZmFsc2VcbiAgICBET00uYWxsKGRvY3VtZW50LCBgJHtQSFhfVklFV19TRUxFQ1RPUn06bm90KFske1BIWF9QQVJFTlRfSUR9XSlgLCByb290RWwgPT4ge1xuICAgICAgaWYoIXRoaXMuZ2V0Um9vdEJ5SWQocm9vdEVsLmlkKSl7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhyb290RWwpXG4gICAgICAgIC8vIHN0aWNraWVzIGNhbm5vdCBiZSBtb3VudGVkIGF0IHRoZSByb3V0ZXIgYW5kIHRoZXJlZm9yZSBzaG91bGQgbm90XG4gICAgICAgIC8vIGdldCBhIGhyZWYgc2V0IG9uIHRoZW1cbiAgICAgICAgaWYoIURPTS5pc1BoeFN0aWNreShyb290RWwpKXsgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKSB9XG4gICAgICAgIHZpZXcuam9pbigpXG4gICAgICAgIGlmKHJvb3RFbC5oYXNBdHRyaWJ1dGUoUEhYX01BSU4pKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB9XG4gICAgICByb290c0ZvdW5kID0gdHJ1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHJvb3RzRm91bmRcbiAgfVxuXG4gIHJlZGlyZWN0KHRvLCBmbGFzaCwgcmVsb2FkVG9rZW4pe1xuICAgIGlmKHJlbG9hZFRva2VuKXsgQnJvd3Nlci5zZXRDb29raWUoUEhYX1JFTE9BRF9TVEFUVVMsIHJlbG9hZFRva2VuLCA2MCkgfVxuICAgIHRoaXMudW5sb2FkKClcbiAgICBCcm93c2VyLnJlZGlyZWN0KHRvLCBmbGFzaClcbiAgfVxuXG4gIHJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCBjYWxsYmFjayA9IG51bGwsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBjb25zdCBsaXZlUmVmZXJlciA9IHRoaXMuY3VycmVudExvY2F0aW9uLmhyZWZcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gdGhpcy5vdXRnb2luZ01haW5FbCB8fCB0aGlzLm1haW4uZWxcblxuICAgIGNvbnN0IHN0aWNraWVzID0gRE9NLmZpbmRQaHhTdGlja3koZG9jdW1lbnQpIHx8IFtdXG4gICAgY29uc3QgcmVtb3ZlRWxzID0gRE9NLmFsbCh0aGlzLm91dGdvaW5nTWFpbkVsLCBgWyR7dGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpfV1gKVxuICAgICAgLmZpbHRlcihlbCA9PiAhRE9NLmlzQ2hpbGRPZkFueShlbCwgc3RpY2tpZXMpKVxuXG4gICAgY29uc3QgbmV3TWFpbkVsID0gRE9NLmNsb25lTm9kZSh0aGlzLm91dGdvaW5nTWFpbkVsLCBcIlwiKVxuICAgIHRoaXMubWFpbi5zaG93TG9hZGVyKHRoaXMubG9hZGVyVGltZW91dClcbiAgICB0aGlzLm1haW4uZGVzdHJveSgpXG5cbiAgICB0aGlzLm1haW4gPSB0aGlzLm5ld1Jvb3RWaWV3KG5ld01haW5FbCwgZmxhc2gsIGxpdmVSZWZlcmVyKVxuICAgIHRoaXMubWFpbi5zZXRSZWRpcmVjdChocmVmKVxuICAgIHRoaXMudHJhbnNpdGlvblJlbW92ZXMocmVtb3ZlRWxzKVxuICAgIHRoaXMubWFpbi5qb2luKChqb2luQ291bnQsIG9uRG9uZSkgPT4ge1xuICAgICAgaWYoam9pbkNvdW50ID09PSAxICYmIHRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSBwaHgtcmVtb3ZlIGVscyByaWdodCBiZWZvcmUgd2UgcmVwbGFjZSB0aGUgbWFpbiBlbGVtZW50XG4gICAgICAgICAgcmVtb3ZlRWxzLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpXG4gICAgICAgICAgc3RpY2tpZXMuZm9yRWFjaChlbCA9PiBuZXdNYWluRWwuYXBwZW5kQ2hpbGQoZWwpKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwucmVwbGFjZVdpdGgobmV3TWFpbkVsKVxuICAgICAgICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSBudWxsXG4gICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobGlua1JlZilcbiAgICAgICAgICBvbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0cmFuc2l0aW9uUmVtb3ZlcyhlbGVtZW50cywgY2FsbGJhY2spe1xuICAgIGxldCByZW1vdmVBdHRyID0gdGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgbGV0IHNpbGVuY2VFdmVudHMgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgfVxuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgLy8gcHJldmVudCBhbGwgbGlzdGVuZXJzIHdlIGNhcmUgYWJvdXQgZnJvbSBidWJibGluZyB0byB3aW5kb3dcbiAgICAgIC8vIHNpbmNlIHdlIGFyZSByZW1vdmluZyB0aGUgZWxlbWVudFxuICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHNpbGVuY2VFdmVudHMsIHRydWUpXG4gICAgICB9XG4gICAgICB0aGlzLmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKHJlbW92ZUF0dHIpLCBcInJlbW92ZVwiKVxuICAgIH0pXG4gICAgLy8gcmVtb3ZlIHRoZSBzaWxlbmNlZCBsaXN0ZW5lcnMgd2hlbiB0cmFuc2l0aW9ucyBhcmUgZG9uZSBpbmNhc2UgdGhlIGVsZW1lbnQgaXMgcmUtdXNlZFxuICAgIC8vIGFuZCBjYWxsIGNhbGxlcidzIGNhbGxiYWNrIGFzIHNvb24gYXMgd2UgYXJlIGRvbmUgd2l0aCB0cmFuc2l0aW9uc1xuICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgZm9yKGxldCBldmVudCBvZiB0aGlzLmJvdW5kRXZlbnROYW1lcyl7XG4gICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgc2lsZW5jZUV2ZW50cywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9KVxuICB9XG5cbiAgaXNQaHhWaWV3KGVsKXsgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsIH1cblxuICBuZXdSb290VmlldyhlbCwgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLCBudWxsLCBmbGFzaCwgbGl2ZVJlZmVyZXIpXG4gICAgdGhpcy5yb290c1t2aWV3LmlkXSA9IHZpZXdcbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgb3duZXIoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIGxldCB2aWV3ID0gbWF5YmUoY2hpbGRFbC5jbG9zZXN0KFBIWF9WSUVXX1NFTEVDVE9SKSwgZWwgPT4gdGhpcy5nZXRWaWV3QnlFbChlbCkpIHx8IHRoaXMubWFpblxuICAgIHJldHVybiB2aWV3ICYmIGNhbGxiYWNrID8gY2FsbGJhY2sodmlldykgOiB2aWV3XG4gIH1cblxuICB3aXRoaW5Pd25lcnMoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIHRoaXMub3duZXIoY2hpbGRFbCwgdmlldyA9PiBjYWxsYmFjayh2aWV3LCBjaGlsZEVsKSlcbiAgfVxuXG4gIGdldFZpZXdCeUVsKGVsKXtcbiAgICBsZXQgcm9vdElkID0gZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKVxuICAgIHJldHVybiBtYXliZSh0aGlzLmdldFJvb3RCeUlkKHJvb3RJZCksIHJvb3QgPT4gcm9vdC5nZXREZXNjZW5kZW50QnlFbChlbCkpXG4gIH1cblxuICBnZXRSb290QnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3RzW2lkXSB9XG5cbiAgZGVzdHJveUFsbFZpZXdzKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnJvb3RzKXtcbiAgICAgIHRoaXMucm9vdHNbaWRdLmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbaWRdXG4gICAgfVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgfVxuXG4gIGRlc3Ryb3lWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3QgPSB0aGlzLmdldFJvb3RCeUlkKGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCkpXG4gICAgaWYocm9vdCAmJiByb290LmlkID09PSBlbC5pZCl7XG4gICAgICByb290LmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbcm9vdC5pZF1cbiAgICB9IGVsc2UgaWYocm9vdCl7XG4gICAgICByb290LmRlc3Ryb3lEZXNjZW5kZW50KGVsLmlkKVxuICAgIH1cbiAgfVxuXG4gIGdldEFjdGl2ZUVsZW1lbnQoKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICB9XG5cbiAgZHJvcEFjdGl2ZUVsZW1lbnQodmlldyl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHZpZXcub3duc0VsZW1lbnQodGhpcy5wcmV2QWN0aXZlKSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpe1xuICAgIGlmKHRoaXMucHJldkFjdGl2ZSAmJiB0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpe1xuICAgICAgdGhpcy5wcmV2QWN0aXZlLmZvY3VzKClcbiAgICB9XG4gIH1cblxuICBibHVyQWN0aXZlRWxlbWVudCgpe1xuICAgIHRoaXMucHJldkFjdGl2ZSA9IHRoaXMuZ2V0QWN0aXZlRWxlbWVudCgpXG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KXsgdGhpcy5wcmV2QWN0aXZlLmJsdXIoKSB9XG4gIH1cblxuICBiaW5kVG9wTGV2ZWxFdmVudHMoe2RlYWR9ID0ge30pe1xuICAgIGlmKHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyl7IHJldHVybiB9XG5cbiAgICB0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMgPSB0cnVlXG4gICAgLy8gZW50ZXIgZmFpbHNhZmUgcmVsb2FkIGlmIHNlcnZlciBoYXMgZ29uZSBhd2F5IGludGVudGlvbmFsbHksIHN1Y2ggYXMgXCJkaXNjb25uZWN0XCIgYnJvYWRjYXN0XG4gICAgdGhpcy5zZXJ2ZXJDbG9zZVJlZiA9IHRoaXMuc29ja2V0Lm9uQ2xvc2UoZXZlbnQgPT4ge1xuICAgICAgLy8gZmFpbHNhZmUgcmVsb2FkIGlmIG5vcm1hbCBjbG9zdXJlIGFuZCB3ZSBzdGlsbCBoYXZlIGEgbWFpbiBMVlxuICAgICAgaWYoZXZlbnQgJiYgZXZlbnQuY29kZSA9PT0gMTAwMCAmJiB0aGlzLm1haW4peyByZXR1cm4gdGhpcy5yZWxvYWRXaXRoSml0dGVyKHRoaXMubWFpbikgfVxuICAgIH0pXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCl7IH0pIC8vIGVuc3VyZSBhbGwgY2xpY2sgZXZlbnRzIGJ1YmJsZSBmb3IgbW9iaWxlIFNhZmFyaVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgZSA9PiB7XG4gICAgICBpZihlLnBlcnNpc3RlZCl7IC8vIHJlbG9hZCBwYWdlIGlmIGJlaW5nIHJlc3RvcmVkIGZyb20gYmFjay9mb3J3YXJkIGNhY2hlXG4gICAgICAgIHRoaXMuZ2V0U29ja2V0KCkuZGlzY29ubmVjdCgpXG4gICAgICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogd2luZG93LmxvY2F0aW9uLmhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIn0pXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0sIHRydWUpXG4gICAgaWYoIWRlYWQpeyB0aGlzLmJpbmROYXYoKSB9XG4gICAgdGhpcy5iaW5kQ2xpY2tzKClcbiAgICBpZighZGVhZCl7IHRoaXMuYmluZEZvcm1zKCkgfVxuICAgIHRoaXMuYmluZCh7a2V5dXA6IFwia2V5dXBcIiwga2V5ZG93bjogXCJrZXlkb3duXCJ9LCAoZSwgdHlwZSwgdmlldywgdGFyZ2V0RWwsIHBoeEV2ZW50LCBfcGh4VGFyZ2V0KSA9PiB7XG4gICAgICBsZXQgbWF0Y2hLZXkgPSB0YXJnZXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9LRVkpKVxuICAgICAgbGV0IHByZXNzZWRLZXkgPSBlLmtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpIC8vIGNocm9tZSBjbGlja2VkIGF1dG9jb21wbGV0ZXMgc2VuZCBhIGtleWRvd24gd2l0aG91dCBrZXlcbiAgICAgIGlmKG1hdGNoS2V5ICYmIG1hdGNoS2V5LnRvTG93ZXJDYXNlKCkgIT09IHByZXNzZWRLZXkpeyByZXR1cm4gfVxuXG4gICAgICBsZXQgZGF0YSA9IHtrZXk6IGUua2V5LCAuLi50aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbCl9XG4gICAgICBKUy5leGVjKGUsIHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgIH0pXG4gICAgdGhpcy5iaW5kKHtibHVyOiBcImZvY3Vzb3V0XCIsIGZvY3VzOiBcImZvY3VzaW5cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIHBoeFRhcmdldCkgPT4ge1xuICAgICAgaWYoIXBoeFRhcmdldCl7XG4gICAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgICAgSlMuZXhlYyhlLCB0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuYmluZCh7Ymx1cjogXCJibHVyXCIsIGZvY3VzOiBcImZvY3VzXCJ9LCAoZSwgdHlwZSwgdmlldywgdGFyZ2V0RWwsIHBoeEV2ZW50LCBwaHhUYXJnZXQpID0+IHtcbiAgICAgIC8vIGJsdXIgYW5kIGZvY3VzIGFyZSB0cmlnZ2VyZWQgb24gZG9jdW1lbnQgYW5kIHdpbmRvdy4gRGlzY2FyZCBvbmUgdG8gYXZvaWQgZHVwc1xuICAgICAgaWYocGh4VGFyZ2V0ID09PSBcIndpbmRvd1wiKXtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbClcbiAgICAgICAgSlMuZXhlYyhlLCB0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMub24oXCJkcmFnb3ZlclwiLCBlID0+IGUucHJldmVudERlZmF1bHQoKSlcbiAgICB0aGlzLm9uKFwiZHJvcFwiLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgbGV0IGRyb3BUYXJnZXRJZCA9IG1heWJlKGNsb3Nlc3RQaHhCaW5kaW5nKGUudGFyZ2V0LCB0aGlzLmJpbmRpbmcoUEhYX0RST1BfVEFSR0VUKSksIHRydWVUYXJnZXQgPT4ge1xuICAgICAgICByZXR1cm4gdHJ1ZVRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9EUk9QX1RBUkdFVCkpXG4gICAgICB9KVxuICAgICAgbGV0IGRyb3BUYXJnZXQgPSBkcm9wVGFyZ2V0SWQgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZHJvcFRhcmdldElkKVxuICAgICAgbGV0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRhdGFUcmFuc2Zlci5maWxlcyB8fCBbXSlcbiAgICAgIGlmKCFkcm9wVGFyZ2V0IHx8IGRyb3BUYXJnZXQuZGlzYWJsZWQgfHwgZmlsZXMubGVuZ3RoID09PSAwIHx8ICEoZHJvcFRhcmdldC5maWxlcyBpbnN0YW5jZW9mIEZpbGVMaXN0KSl7IHJldHVybiB9XG5cbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKGRyb3BUYXJnZXQsIGZpbGVzLCBlLmRhdGFUcmFuc2ZlcilcbiAgICAgIGRyb3BUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgIH0pXG4gICAgdGhpcy5vbihQSFhfVFJBQ0tfVVBMT0FEUywgZSA9PiB7XG4gICAgICBsZXQgdXBsb2FkVGFyZ2V0ID0gZS50YXJnZXRcbiAgICAgIGlmKCFET00uaXNVcGxvYWRJbnB1dCh1cGxvYWRUYXJnZXQpKXsgcmV0dXJuIH1cbiAgICAgIGxldCBmaWxlcyA9IEFycmF5LmZyb20oZS5kZXRhaWwuZmlsZXMgfHwgW10pLmZpbHRlcihmID0+IGYgaW5zdGFuY2VvZiBGaWxlIHx8IGYgaW5zdGFuY2VvZiBCbG9iKVxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXModXBsb2FkVGFyZ2V0LCBmaWxlcylcbiAgICAgIHVwbG9hZFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgfSlcbiAgfVxuXG4gIGV2ZW50TWV0YShldmVudE5hbWUsIGUsIHRhcmdldEVsKXtcbiAgICBsZXQgY2FsbGJhY2sgPSB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzW2V2ZW50TmFtZV1cbiAgICByZXR1cm4gY2FsbGJhY2sgPyBjYWxsYmFjayhlLCB0YXJnZXRFbCkgOiB7fVxuICB9XG5cbiAgc2V0UGVuZGluZ0xpbmsoaHJlZil7XG4gICAgdGhpcy5saW5rUmVmKytcbiAgICB0aGlzLnBlbmRpbmdMaW5rID0gaHJlZlxuICAgIHRoaXMucmVzZXRSZWxvYWRTdGF0dXMoKVxuICAgIHJldHVybiB0aGlzLmxpbmtSZWZcbiAgfVxuXG4gIC8vIGFueXRpbWUgd2UgYXJlIG5hdmlnYXRpbmcgb3IgY29ubmVjdGluZywgZHJvcCByZWxvYWQgY29va2llIGluIGNhc2VcbiAgLy8gd2UgaXNzdWUgdGhlIGNvb2tpZSBidXQgdGhlIG5leHQgcmVxdWVzdCB3YXMgaW50ZXJydXB0ZWQgYW5kIHRoZSBzZXJ2ZXIgbmV2ZXIgZHJvcHBlZCBpdFxuICByZXNldFJlbG9hZFN0YXR1cygpeyBCcm93c2VyLmRlbGV0ZUNvb2tpZShQSFhfUkVMT0FEX1NUQVRVUykgfVxuXG4gIGNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpe1xuICAgIGlmKHRoaXMubGlua1JlZiAhPT0gbGlua1JlZil7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ocmVmID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgZ2V0SHJlZigpeyByZXR1cm4gdGhpcy5ocmVmIH1cblxuICBoYXNQZW5kaW5nTGluaygpeyByZXR1cm4gISF0aGlzLnBlbmRpbmdMaW5rIH1cblxuICBiaW5kKGV2ZW50cywgY2FsbGJhY2spe1xuICAgIGZvcihsZXQgZXZlbnQgaW4gZXZlbnRzKXtcbiAgICAgIGxldCBicm93c2VyRXZlbnROYW1lID0gZXZlbnRzW2V2ZW50XVxuXG4gICAgICB0aGlzLm9uKGJyb3dzZXJFdmVudE5hbWUsIGUgPT4ge1xuICAgICAgICBsZXQgYmluZGluZyA9IHRoaXMuYmluZGluZyhldmVudClcbiAgICAgICAgbGV0IHdpbmRvd0JpbmRpbmcgPSB0aGlzLmJpbmRpbmcoYHdpbmRvdy0ke2V2ZW50fWApXG4gICAgICAgIGxldCB0YXJnZXRQaHhFdmVudCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoYmluZGluZylcbiAgICAgICAgaWYodGFyZ2V0UGh4RXZlbnQpe1xuICAgICAgICAgIHRoaXMuZGVib3VuY2UoZS50YXJnZXQsIGUsIGJyb3dzZXJFdmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZSwgZXZlbnQsIHZpZXcsIGUudGFyZ2V0LCB0YXJnZXRQaHhFdmVudCwgbnVsbClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7d2luZG93QmluZGluZ31dYCwgZWwgPT4ge1xuICAgICAgICAgICAgbGV0IHBoeEV2ZW50ID0gZWwuZ2V0QXR0cmlidXRlKHdpbmRvd0JpbmRpbmcpXG4gICAgICAgICAgICB0aGlzLmRlYm91bmNlKGVsLCBlLCBicm93c2VyRXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlLCBldmVudCwgdmlldywgZWwsIHBoeEV2ZW50LCBcIndpbmRvd1wiKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGJpbmRDbGlja3MoKXtcbiAgICB0aGlzLm9uKFwibW91c2Vkb3duXCIsIGUgPT4gdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IGUudGFyZ2V0KVxuICAgIHRoaXMuYmluZENsaWNrKFwiY2xpY2tcIiwgXCJjbGlja1wiKVxuICB9XG5cbiAgYmluZENsaWNrKGV2ZW50TmFtZSwgYmluZGluZ05hbWUpe1xuICAgIGxldCBjbGljayA9IHRoaXMuYmluZGluZyhiaW5kaW5nTmFtZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGUgPT4ge1xuICAgICAgbGV0IHRhcmdldCA9IG51bGxcbiAgICAgIC8vIGEgc3ludGhldGljIGNsaWNrIGV2ZW50IChkZXRhaWwgMCkgd2lsbCBub3QgaGF2ZSBjYXVzZWQgYSBtb3VzZWRvd24gZXZlbnQsXG4gICAgICAvLyB0aGVyZWZvcmUgdGhlIGNsaWNrU3RhcnRlZEF0VGFyZ2V0IGlzIHN0YWxlXG4gICAgICBpZihlLmRldGFpbCA9PT0gMCkgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IGUudGFyZ2V0XG4gICAgICBsZXQgY2xpY2tTdGFydGVkQXRUYXJnZXQgPSB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0IHx8IGUudGFyZ2V0XG4gICAgICAvLyB3aGVuIHNlYXJjaGluZyB0aGUgdGFyZ2V0IGZvciB0aGUgY2xpY2sgZXZlbnQsIHdlIGFsd2F5cyB3YW50IHRvXG4gICAgICAvLyB1c2UgdGhlIGFjdHVhbCBldmVudCB0YXJnZXQsIHNlZSAjMzM3MlxuICAgICAgdGFyZ2V0ID0gY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIGNsaWNrKVxuICAgICAgdGhpcy5kaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdFRhcmdldClcbiAgICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsXG4gICAgICBsZXQgcGh4RXZlbnQgPSB0YXJnZXQgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShjbGljaylcbiAgICAgIGlmKCFwaHhFdmVudCl7XG4gICAgICAgIGlmKERPTS5pc05ld1BhZ2VDbGljayhlLCB3aW5kb3cubG9jYXRpb24pKXsgdGhpcy51bmxvYWQoKSB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZih0YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjXCIpeyBlLnByZXZlbnREZWZhdWx0KCkgfVxuXG4gICAgICAvLyBub29wIGlmIHdlIGFyZSBpbiB0aGUgbWlkZGxlIG9mIGF3YWl0aW5nIGFuIGFjayBmb3IgdGhpcyBlbCBhbHJlYWR5XG4gICAgICBpZih0YXJnZXQuaGFzQXR0cmlidXRlKFBIWF9SRUZfU1JDKSl7IHJldHVybiB9XG5cbiAgICAgIHRoaXMuZGVib3VuY2UodGFyZ2V0LCBlLCBcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy53aXRoaW5Pd25lcnModGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICBKUy5leGVjKGUsIFwiY2xpY2tcIiwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldCwgW1wicHVzaFwiLCB7ZGF0YTogdGhpcy5ldmVudE1ldGEoXCJjbGlja1wiLCBlLCB0YXJnZXQpfV0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuICB9XG5cbiAgZGlzcGF0Y2hDbGlja0F3YXkoZSwgY2xpY2tTdGFydGVkQXQpe1xuICAgIGxldCBwaHhDbGlja0F3YXkgPSB0aGlzLmJpbmRpbmcoXCJjbGljay1hd2F5XCIpXG4gICAgRE9NLmFsbChkb2N1bWVudCwgYFske3BoeENsaWNrQXdheX1dYCwgZWwgPT4ge1xuICAgICAgaWYoIShlbC5pc1NhbWVOb2RlKGNsaWNrU3RhcnRlZEF0KSB8fCBlbC5jb250YWlucyhjbGlja1N0YXJ0ZWRBdCkpKXtcbiAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZWwsIHZpZXcgPT4ge1xuICAgICAgICAgIGxldCBwaHhFdmVudCA9IGVsLmdldEF0dHJpYnV0ZShwaHhDbGlja0F3YXkpXG4gICAgICAgICAgaWYoSlMuaXNWaXNpYmxlKGVsKSAmJiBKUy5pc0luVmlld3BvcnQoZWwpKXtcbiAgICAgICAgICAgIEpTLmV4ZWMoZSwgXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgZWwsIFtcInB1c2hcIiwge2RhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgZS50YXJnZXQpfV0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBiaW5kTmF2KCl7XG4gICAgaWYoIUJyb3dzZXIuY2FuUHVzaFN0YXRlKCkpeyByZXR1cm4gfVxuICAgIGlmKGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24peyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gXCJtYW51YWxcIiB9XG4gICAgbGV0IHNjcm9sbFRpbWVyID0gbnVsbFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIF9lID0+IHtcbiAgICAgIGNsZWFyVGltZW91dChzY3JvbGxUaW1lcilcbiAgICAgIHNjcm9sbFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIEJyb3dzZXIudXBkYXRlQ3VycmVudFN0YXRlKHN0YXRlID0+IE9iamVjdC5hc3NpZ24oc3RhdGUsIHtzY3JvbGw6IHdpbmRvdy5zY3JvbGxZfSkpXG4gICAgICB9LCAxMDApXG4gICAgfSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmKCF0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKSl7IHJldHVybiB9XG4gICAgICBsZXQge3R5cGUsIGJhY2tUeXBlLCBpZCwgc2Nyb2xsLCBwb3NpdGlvbn0gPSBldmVudC5zdGF0ZSB8fCB7fVxuICAgICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuXG4gICAgICAvLyBDb21wYXJlIHBvc2l0aW9ucyB0byBkZXRlcm1pbmUgZGlyZWN0aW9uXG4gICAgICBsZXQgaXNGb3J3YXJkID0gcG9zaXRpb24gPiB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb25cblxuICAgICAgdHlwZSA9IGlzRm9yd2FyZCA/IHR5cGUgOiAoYmFja1R5cGUgfHwgdHlwZSlcblxuICAgICAgLy8gVXBkYXRlIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDBcbiAgICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfSElTVE9SWV9QT1NJVElPTiwgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uLnRvU3RyaW5nKCkpXG5cbiAgICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6bmF2aWdhdGVcIiwge2RldGFpbDoge2hyZWYsIHBhdGNoOiB0eXBlID09PSBcInBhdGNoXCIsIHBvcDogdHJ1ZSwgZGlyZWN0aW9uOiBpc0ZvcndhcmQgPyBcImZvcndhcmRcIiA6IFwiYmFja3dhcmRcIn19KVxuICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSAoKSA9PiB7IHRoaXMubWF5YmVTY3JvbGwoc2Nyb2xsKSB9XG4gICAgICAgIGlmKHRoaXMubWFpbi5pc0Nvbm5lY3RlZCgpICYmICh0eXBlID09PSBcInBhdGNoXCIgJiYgaWQgPT09IHRoaXMubWFpbi5pZCkpe1xuICAgICAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGV2ZW50LCBocmVmLCBudWxsLCBjYWxsYmFjaylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlcGxhY2VNYWluKGhyZWYsIG51bGwsIGNhbGxiYWNrKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIFBIWF9MSVZFX0xJTkspXG4gICAgICBsZXQgdHlwZSA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSVZFX0xJTkspXG4gICAgICBpZighdHlwZSB8fCAhdGhpcy5pc0Nvbm5lY3RlZCgpIHx8ICF0aGlzLm1haW4gfHwgRE9NLndhbnRzTmV3VGFiKGUpKXsgcmV0dXJuIH1cblxuICAgICAgLy8gV2hlbiB3cmFwcGluZyBhbiBTVkcgZWxlbWVudCBpbiBhbiBhbmNob3IgdGFnLCB0aGUgaHJlZiBjYW4gYmUgYW4gU1ZHQW5pbWF0ZWRTdHJpbmdcbiAgICAgIGxldCBocmVmID0gdGFyZ2V0LmhyZWYgaW5zdGFuY2VvZiBTVkdBbmltYXRlZFN0cmluZyA/IHRhcmdldC5ocmVmLmJhc2VWYWwgOiB0YXJnZXQuaHJlZlxuXG4gICAgICBsZXQgbGlua1N0YXRlID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShQSFhfTElOS19TVEFURSlcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSAvLyBkbyBub3QgYnViYmxlIGNsaWNrIHRvIHJlZ3VsYXIgcGh4LWNsaWNrIGJpbmRpbmdzXG4gICAgICBpZih0aGlzLnBlbmRpbmdMaW5rID09PSBocmVmKXsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgaWYodHlwZSA9PT0gXCJwYXRjaFwiKXtcbiAgICAgICAgICB0aGlzLnB1c2hIaXN0b3J5UGF0Y2goZSwgaHJlZiwgbGlua1N0YXRlLCB0YXJnZXQpXG4gICAgICAgIH0gZWxzZSBpZih0eXBlID09PSBcInJlZGlyZWN0XCIpe1xuICAgICAgICAgIHRoaXMuaGlzdG9yeVJlZGlyZWN0KGUsIGhyZWYsIGxpbmtTdGF0ZSwgbnVsbCwgdGFyZ2V0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZXhwZWN0ZWQgJHtQSFhfTElWRV9MSU5LfSB0byBiZSBcInBhdGNoXCIgb3IgXCJyZWRpcmVjdFwiLCBnb3Q6ICR7dHlwZX1gKVxuICAgICAgICB9XG4gICAgICAgIGxldCBwaHhDbGljayA9IHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2xpY2tcIikpXG4gICAgICAgIGlmKHBoeENsaWNrKXtcbiAgICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4gdGhpcy5leGVjSlModGFyZ2V0LCBwaHhDbGljaywgXCJjbGlja1wiKSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgfVxuXG4gIG1heWJlU2Nyb2xsKHNjcm9sbCl7XG4gICAgaWYodHlwZW9mKHNjcm9sbCkgPT09IFwibnVtYmVyXCIpe1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbClcbiAgICAgIH0pIC8vIHRoZSBib2R5IG5lZWRzIHRvIHJlbmRlciBiZWZvcmUgd2Ugc2Nyb2xsLlxuICAgIH1cbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSl7XG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBgcGh4OiR7ZXZlbnR9YCwge2RldGFpbDogcGF5bG9hZH0pXG4gIH1cblxuICBkaXNwYXRjaEV2ZW50cyhldmVudHMpe1xuICAgIGV2ZW50cy5mb3JFYWNoKChbZXZlbnQsIHBheWxvYWRdKSA9PiB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQpKVxuICB9XG5cbiAgd2l0aFBhZ2VMb2FkaW5nKGluZm8sIGNhbGxiYWNrKXtcbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiBpbmZvfSlcbiAgICBsZXQgZG9uZSA9ICgpID0+IERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwge2RldGFpbDogaW5mb30pXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZG9uZSkgOiBkb25lXG4gIH1cblxuICBwdXNoSGlzdG9yeVBhdGNoKGUsIGhyZWYsIGxpbmtTdGF0ZSwgdGFyZ2V0RWwpe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkgfHwgIXRoaXMubWFpbi5pc01haW4oKSl7IHJldHVybiBCcm93c2VyLnJlZGlyZWN0KGhyZWYpIH1cblxuICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogaHJlZiwga2luZDogXCJwYXRjaFwifSwgZG9uZSA9PiB7XG4gICAgICB0aGlzLm1haW4ucHVzaExpbmtQYXRjaChlLCBocmVmLCB0YXJnZXRFbCwgbGlua1JlZiA9PiB7XG4gICAgICAgIHRoaXMuaGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgbGlua1JlZilcbiAgICAgICAgZG9uZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBoaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmID0gdGhpcy5zZXRQZW5kaW5nTGluayhocmVmKSl7XG4gICAgaWYoIXRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpeyByZXR1cm4gfVxuXG4gICAgLy8gSW5jcmVtZW50IHBvc2l0aW9uIGZvciBuZXcgc3RhdGVcbiAgICB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24rK1xuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfSElTVE9SWV9QT1NJVElPTiwgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uLnRvU3RyaW5nKCkpXG5cbiAgICAvLyBzdG9yZSB0aGUgdHlwZSBmb3IgYmFjayBuYXZpZ2F0aW9uXG4gICAgQnJvd3Nlci51cGRhdGVDdXJyZW50U3RhdGUoKHN0YXRlKSA9PiAoey4uLnN0YXRlLCBiYWNrVHlwZTogXCJwYXRjaFwifSkpXG5cbiAgICBCcm93c2VyLnB1c2hTdGF0ZShsaW5rU3RhdGUsIHtcbiAgICAgIHR5cGU6IFwicGF0Y2hcIixcbiAgICAgIGlkOiB0aGlzLm1haW4uaWQsXG4gICAgICBwb3NpdGlvbjogdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uXG4gICAgfSwgaHJlZilcblxuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6bmF2aWdhdGVcIiwge2RldGFpbDoge3BhdGNoOiB0cnVlLCBocmVmLCBwb3A6IGZhbHNlLCBkaXJlY3Rpb246IFwiZm9yd2FyZFwifX0pXG4gICAgdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbilcbiAgfVxuXG4gIGhpc3RvcnlSZWRpcmVjdChlLCBocmVmLCBsaW5rU3RhdGUsIGZsYXNoLCB0YXJnZXRFbCl7XG4gICAgY29uc3QgY2xpY2tMb2FkaW5nID0gdGFyZ2V0RWwgJiYgZS5pc1RydXN0ZWQgJiYgZS50eXBlICE9PSBcInBvcHN0YXRlXCJcbiAgICBpZihjbGlja0xvYWRpbmcpeyB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwicGh4LWNsaWNrLWxvYWRpbmdcIikgfVxuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkgfHwgIXRoaXMubWFpbi5pc01haW4oKSl7IHJldHVybiBCcm93c2VyLnJlZGlyZWN0KGhyZWYsIGZsYXNoKSB9XG5cbiAgICAvLyBjb252ZXJ0IHRvIGZ1bGwgaHJlZiBpZiBvbmx5IHBhdGggcHJlZml4XG4gICAgaWYoL15cXC8kfF5cXC9bXlxcL10rLiokLy50ZXN0KGhyZWYpKXtcbiAgICAgIGxldCB7cHJvdG9jb2wsIGhvc3R9ID0gd2luZG93LmxvY2F0aW9uXG4gICAgICBocmVmID0gYCR7cHJvdG9jb2x9Ly8ke2hvc3R9JHtocmVmfWBcbiAgICB9XG4gICAgbGV0IHNjcm9sbCA9IHdpbmRvdy5zY3JvbGxZXG4gICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiBocmVmLCBraW5kOiBcInJlZGlyZWN0XCJ9LCBkb25lID0+IHtcbiAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgZmxhc2gsIChsaW5rUmVmKSA9PiB7XG4gICAgICAgIGlmKGxpbmtSZWYgPT09IHRoaXMubGlua1JlZil7XG4gICAgICAgICAgLy8gSW5jcmVtZW50IHBvc2l0aW9uIGZvciBuZXcgc3RhdGVcbiAgICAgICAgICB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24rK1xuICAgICAgICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfSElTVE9SWV9QT1NJVElPTiwgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uLnRvU3RyaW5nKCkpXG5cbiAgICAgICAgICAvLyBzdG9yZSB0aGUgdHlwZSBmb3IgYmFjayBuYXZpZ2F0aW9uXG4gICAgICAgICAgQnJvd3Nlci51cGRhdGVDdXJyZW50U3RhdGUoKHN0YXRlKSA9PiAoey4uLnN0YXRlLCBiYWNrVHlwZTogXCJyZWRpcmVjdFwifSkpXG5cbiAgICAgICAgICBCcm93c2VyLnB1c2hTdGF0ZShsaW5rU3RhdGUsIHtcbiAgICAgICAgICAgIHR5cGU6IFwicmVkaXJlY3RcIixcbiAgICAgICAgICAgIGlkOiB0aGlzLm1haW4uaWQsXG4gICAgICAgICAgICBzY3JvbGw6IHNjcm9sbCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb25cbiAgICAgICAgICB9LCBocmVmKVxuXG4gICAgICAgICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpuYXZpZ2F0ZVwiLCB7ZGV0YWlsOiB7aHJlZiwgcGF0Y2g6IGZhbHNlLCBwb3A6IGZhbHNlLCBkaXJlY3Rpb246IFwiZm9yd2FyZFwifX0pXG4gICAgICAgICAgdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbilcbiAgICAgICAgfVxuICAgICAgICAvLyBleHBsaWNpdGx5IHVuZG8gY2xpY2stbG9hZGluZyBjbGFzc1xuICAgICAgICAvLyAoaW4gY2FzZSBpdCBvcmlnaW5hdGVkIGluIGEgc3RpY2t5IGxpdmUgdmlldywgb3RoZXJ3aXNlIGl0IHdvdWxkIGJlIHJlbW92ZWQgYW55d2F5KVxuICAgICAgICBpZihjbGlja0xvYWRpbmcpeyB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKFwicGh4LWNsaWNrLWxvYWRpbmdcIikgfVxuICAgICAgICBkb25lKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlZ2lzdGVyTmV3TG9jYXRpb24obmV3TG9jYXRpb24pe1xuICAgIGxldCB7cGF0aG5hbWUsIHNlYXJjaH0gPSB0aGlzLmN1cnJlbnRMb2NhdGlvblxuICAgIGlmKHBhdGhuYW1lICsgc2VhcmNoID09PSBuZXdMb2NhdGlvbi5wYXRobmFtZSArIG5ld0xvY2F0aW9uLnNlYXJjaCl7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50TG9jYXRpb24gPSBjbG9uZShuZXdMb2NhdGlvbilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgYmluZEZvcm1zKCl7XG4gICAgbGV0IGl0ZXJhdGlvbnMgPSAwXG4gICAgbGV0IGV4dGVybmFsRm9ybVN1Ym1pdHRlZCA9IGZhbHNlXG5cbiAgICAvLyBkaXNhYmxlIGZvcm1zIG9uIHN1Ym1pdCB0aGF0IHRyYWNrIHBoeC1jaGFuZ2UgYnV0IHBlcmZvcm0gZXh0ZXJuYWwgc3VibWl0XG4gICAgdGhpcy5vbihcInN1Ym1pdFwiLCBlID0+IHtcbiAgICAgIGxldCBwaHhTdWJtaXQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwic3VibWl0XCIpKVxuICAgICAgbGV0IHBoeENoYW5nZSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpXG4gICAgICBpZighZXh0ZXJuYWxGb3JtU3VibWl0dGVkICYmIHBoeENoYW5nZSAmJiAhcGh4U3VibWl0KXtcbiAgICAgICAgZXh0ZXJuYWxGb3JtU3VibWl0dGVkID0gdHJ1ZVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgIHZpZXcuZGlzYWJsZUZvcm0oZS50YXJnZXQpXG4gICAgICAgICAgLy8gc2FmYXJpIG5lZWRzIG5leHQgdGlja1xuICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgaWYoRE9NLmlzVW5sb2FkYWJsZUZvcm1TdWJtaXQoZSkpeyB0aGlzLnVubG9hZCgpIH1cbiAgICAgICAgICAgIGUudGFyZ2V0LnN1Ym1pdCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5vbihcInN1Ym1pdFwiLCBlID0+IHtcbiAgICAgIGxldCBwaHhFdmVudCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpXG4gICAgICBpZighcGh4RXZlbnQpe1xuICAgICAgICBpZihET00uaXNVbmxvYWRhYmxlRm9ybVN1Ym1pdChlKSl7IHRoaXMudW5sb2FkKCkgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS50YXJnZXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgIEpTLmV4ZWMoZSwgXCJzdWJtaXRcIiwgcGh4RXZlbnQsIHZpZXcsIGUudGFyZ2V0LCBbXCJwdXNoXCIsIHtzdWJtaXR0ZXI6IGUuc3VibWl0dGVyfV0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBmb3IobGV0IHR5cGUgb2YgW1wiY2hhbmdlXCIsIFwiaW5wdXRcIl0pe1xuICAgICAgdGhpcy5vbih0eXBlLCBlID0+IHtcbiAgICAgICAgaWYoZSBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50ICYmIGUudGFyZ2V0LmZvcm0gPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgLy8gdGhyb3cgb24gaW52YWxpZCBKUy5kaXNwYXRjaCB0YXJnZXQgYW5kIG5vb3AgaWYgQ3VzdG9tRXZlbnQgdHJpZ2dlcmVkIG91dHNpZGUgSlMuZGlzcGF0Y2hcbiAgICAgICAgICBpZihlLmRldGFpbCAmJiBlLmRldGFpbC5kaXNwYXRjaGVyKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZGlzcGF0Y2hpbmcgYSBjdXN0b20gJHt0eXBlfSBldmVudCBpcyBvbmx5IHN1cHBvcnRlZCBvbiBpbnB1dCBlbGVtZW50cyBpbnNpZGUgYSBmb3JtYClcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuICAgICAgICBsZXQgaW5wdXQgPSBlLnRhcmdldFxuICAgICAgICAvLyBkbyBub3QgZmlyZSBwaHgtY2hhbmdlIGlmIHdlIGFyZSBpbiB0aGUgbWlkZGxlIG9mIGEgY29tcG9zaXRpb24gc2Vzc2lvblxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9pc0NvbXBvc2luZ1xuICAgICAgICAvLyBTYWZhcmkgaGFzIGlzc3VlcyBpZiB0aGUgaW5wdXQgaXMgdXBkYXRlZCB3aGlsZSBjb21wb3NpbmdcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zMzIyXG4gICAgICAgIGlmKGUuaXNDb21wb3Npbmcpe1xuICAgICAgICAgIGNvbnN0IGtleSA9IGBjb21wb3NpdGlvbi1saXN0ZW5lci0ke3R5cGV9YFxuICAgICAgICAgIGlmKCFET00ucHJpdmF0ZShpbnB1dCwga2V5KSl7XG4gICAgICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwga2V5LCB0cnVlKVxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbXBvc2l0aW9uZW5kXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gdHJpZ2dlciBhIG5ldyBpbnB1dC9jaGFuZ2UgZXZlbnRcbiAgICAgICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQodHlwZSwge2J1YmJsZXM6IHRydWV9KSlcbiAgICAgICAgICAgICAgRE9NLmRlbGV0ZVByaXZhdGUoaW5wdXQsIGtleSlcbiAgICAgICAgICAgIH0sIHtvbmNlOiB0cnVlfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGlucHV0RXZlbnQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKVxuICAgICAgICBsZXQgZm9ybUV2ZW50ID0gaW5wdXQuZm9ybSAmJiBpbnB1dC5mb3JtLmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpXG4gICAgICAgIGxldCBwaHhFdmVudCA9IGlucHV0RXZlbnQgfHwgZm9ybUV2ZW50XG4gICAgICAgIGlmKCFwaHhFdmVudCl7IHJldHVybiB9XG4gICAgICAgIGlmKGlucHV0LnR5cGUgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQudmFsaWRpdHkgJiYgaW5wdXQudmFsaWRpdHkuYmFkSW5wdXQpeyByZXR1cm4gfVxuXG4gICAgICAgIGxldCBkaXNwYXRjaGVyID0gaW5wdXRFdmVudCA/IGlucHV0IDogaW5wdXQuZm9ybVxuICAgICAgICBsZXQgY3VycmVudEl0ZXJhdGlvbnMgPSBpdGVyYXRpb25zXG4gICAgICAgIGl0ZXJhdGlvbnMrK1xuICAgICAgICBsZXQge2F0OiBhdCwgdHlwZTogbGFzdFR5cGV9ID0gRE9NLnByaXZhdGUoaW5wdXQsIFwicHJldi1pdGVyYXRpb25cIikgfHwge31cbiAgICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIGFsd2F5cyBmaXJlIGF0IGxlYXN0IG9uZSBcImlucHV0XCIgZXZlbnQgYmVmb3JlIGV2ZXJ5IFwiY2hhbmdlXCJcbiAgICAgICAgLy8gSWdub3JlIFwiY2hhbmdlXCIgZXZlbnRzLCB1bmxlc3MgdGhlcmUgd2FzIG5vIHByaW9yIFwiaW5wdXRcIiBldmVudC5cbiAgICAgICAgLy8gVGhpcyBjb3VsZCBoYXBwZW4gaWYgdXNlciBjb2RlIHRyaWdnZXJzIGEgXCJjaGFuZ2VcIiBldmVudCwgb3IgaWYgdGhlIGJyb3dzZXIgaXMgbm9uLWNvbmZvcm1pbmcuXG4gICAgICAgIGlmKGF0ID09PSBjdXJyZW50SXRlcmF0aW9ucyAtIDEgJiYgdHlwZSA9PT0gXCJjaGFuZ2VcIiAmJiBsYXN0VHlwZSA9PT0gXCJpbnB1dFwiKXsgcmV0dXJuIH1cblxuICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiLCB7YXQ6IGN1cnJlbnRJdGVyYXRpb25zLCB0eXBlOiB0eXBlfSlcblxuICAgICAgICB0aGlzLmRlYm91bmNlKGlucHV0LCBlLCB0eXBlLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZGlzcGF0Y2hlciwgdmlldyA9PiB7XG4gICAgICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VELCB0cnVlKVxuICAgICAgICAgICAgSlMuZXhlYyhlLCBcImNoYW5nZVwiLCBwaHhFdmVudCwgdmlldywgaW5wdXQsIFtcInB1c2hcIiwge190YXJnZXQ6IGUudGFyZ2V0Lm5hbWUsIGRpc3BhdGNoZXI6IGRpc3BhdGNoZXJ9XSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5vbihcInJlc2V0XCIsIChlKSA9PiB7XG4gICAgICBsZXQgZm9ybSA9IGUudGFyZ2V0XG4gICAgICBET00ucmVzZXRGb3JtKGZvcm0pXG4gICAgICBsZXQgaW5wdXQgPSBBcnJheS5mcm9tKGZvcm0uZWxlbWVudHMpLmZpbmQoZWwgPT4gZWwudHlwZSA9PT0gXCJyZXNldFwiKVxuICAgICAgaWYoaW5wdXQpe1xuICAgICAgICAvLyB3YWl0IHVudGlsIG5leHQgdGljayB0byBnZXQgdXBkYXRlZCBpbnB1dCB2YWx1ZVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiBmYWxzZX0pKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkZWJvdW5jZShlbCwgZXZlbnQsIGV2ZW50VHlwZSwgY2FsbGJhY2spe1xuICAgIGlmKGV2ZW50VHlwZSA9PT0gXCJibHVyXCIgfHwgZXZlbnRUeXBlID09PSBcImZvY3Vzb3V0XCIpeyByZXR1cm4gY2FsbGJhY2soKSB9XG5cbiAgICBsZXQgcGh4RGVib3VuY2UgPSB0aGlzLmJpbmRpbmcoUEhYX0RFQk9VTkNFKVxuICAgIGxldCBwaHhUaHJvdHRsZSA9IHRoaXMuYmluZGluZyhQSFhfVEhST1RUTEUpXG4gICAgbGV0IGRlZmF1bHREZWJvdW5jZSA9IHRoaXMuZGVmYXVsdHMuZGVib3VuY2UudG9TdHJpbmcoKVxuICAgIGxldCBkZWZhdWx0VGhyb3R0bGUgPSB0aGlzLmRlZmF1bHRzLnRocm90dGxlLnRvU3RyaW5nKClcblxuICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgIGxldCBhc3luY0ZpbHRlciA9ICgpID0+ICF2aWV3LmlzRGVzdHJveWVkKCkgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyhlbClcbiAgICAgIERPTS5kZWJvdW5jZShlbCwgZXZlbnQsIHBoeERlYm91bmNlLCBkZWZhdWx0RGVib3VuY2UsIHBoeFRocm90dGxlLCBkZWZhdWx0VGhyb3R0bGUsIGFzeW5jRmlsdGVyLCAoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHNpbGVuY2VFdmVudHMoY2FsbGJhY2spe1xuICAgIHRoaXMuc2lsZW5jZWQgPSB0cnVlXG4gICAgY2FsbGJhY2soKVxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICB9XG5cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICB0aGlzLmJvdW5kRXZlbnROYW1lcy5hZGQoZXZlbnQpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGUgPT4ge1xuICAgICAgaWYoIXRoaXMuc2lsZW5jZWQpeyBjYWxsYmFjayhlKSB9XG4gICAgfSlcbiAgfVxuXG4gIGpzUXVlcnlTZWxlY3RvckFsbChzb3VyY2VFbCwgcXVlcnksIGRlZmF1bHRRdWVyeSl7XG4gICAgbGV0IGFsbCA9IHRoaXMuZG9tQ2FsbGJhY2tzLmpzUXVlcnlTZWxlY3RvckFsbFxuICAgIHJldHVybiBhbGwgPyBhbGwoc291cmNlRWwsIHF1ZXJ5LCBkZWZhdWx0UXVlcnkpIDogZGVmYXVsdFF1ZXJ5KClcbiAgfVxufVxuXG5jbGFzcyBUcmFuc2l0aW9uU2V0IHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFNldCgpXG4gICAgdGhpcy5wZW5kaW5nT3BzID0gW11cbiAgfVxuXG4gIHJlc2V0KCl7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5mb3JFYWNoKHRpbWVyID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKVxuICAgIH0pXG4gICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKVxuICB9XG5cbiAgYWZ0ZXIoY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuc2l6ZSgpID09PSAwKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXNoUGVuZGluZ09wKGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIGFkZFRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKXtcbiAgICBvblN0YXJ0KClcbiAgICBsZXQgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKVxuICAgICAgb25Eb25lKClcbiAgICAgIHRoaXMuZmx1c2hQZW5kaW5nT3BzKClcbiAgICB9LCB0aW1lKVxuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkKHRpbWVyKVxuICB9XG5cbiAgcHVzaFBlbmRpbmdPcChvcCl7IHRoaXMucGVuZGluZ09wcy5wdXNoKG9wKSB9XG5cbiAgc2l6ZSgpeyByZXR1cm4gdGhpcy50cmFuc2l0aW9ucy5zaXplIH1cblxuICBmbHVzaFBlbmRpbmdPcHMoKXtcbiAgICBpZih0aGlzLnNpemUoKSA+IDApeyByZXR1cm4gfVxuICAgIGxldCBvcCA9IHRoaXMucGVuZGluZ09wcy5zaGlmdCgpXG4gICAgaWYob3Ape1xuICAgICAgb3AoKVxuICAgICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKVxuICAgIH1cbiAgfVxufVxuIiwgIi8qXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuUGhvZW5peCBMaXZlVmlldyBKYXZhU2NyaXB0IENsaWVudFxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuU2VlIHRoZSBoZXhkb2NzIGF0IGBodHRwczovL2hleGRvY3MucG0vcGhvZW5peF9saXZlX3ZpZXdgIGZvciBkb2N1bWVudGF0aW9uLlxuXG4qL1xuXG5pbXBvcnQgTGl2ZVNvY2tldCwge2lzVXNlZElucHV0fSBmcm9tIFwiLi9saXZlX3NvY2tldFwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgVmlld0hvb2sgZnJvbSBcIi4vdmlld19ob29rXCJcbmltcG9ydCBWaWV3IGZyb20gXCIuL3ZpZXdcIlxuXG4vKiogQ3JlYXRlcyBhIFZpZXdIb29rIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gZWxlbWVudCBhbmQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGhvb2suXG4gKiBAcGFyYW0ge09iamVjdH0gW2NhbGxiYWNrc10gLSBUaGUgbGlzdCBvZiBob29rIGNhbGxiYWNrcywgc3VjaCBhcyBtb3VudGVkLFxuICogICB1cGRhdGVkLCBkZXN0cm95ZWQsIGV0Yy5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICogICBjb25uZWN0ZWRDYWxsYmFjaygpe1xuICogICAgIGxldCBvbkxpdmVWaWV3TW91bnRlZCA9ICgpID0+IHRoaXMuaG9vay5wdXNoRXZlbnQoLi4uKSlcbiAqICAgICB0aGlzLmhvb2sgPSBjcmVhdGVIb29rKHRoaXMsIHttb3VudGVkOiBvbkxpdmVWaWV3TW91bnRlZH0pXG4gKiAgIH1cbiAqIH1cbiAqXG4gKiAqTm90ZSo6IGBjcmVhdGVIb29rYCBtdXN0IGJlIGNhbGxlZCBmcm9tIHRoZSBgY29ubmVjdGVkQ2FsbGJhY2tgIGxpZmVjeWNsZVxuICogd2hpY2ggaXMgdHJpZ2dlcmVkIGFmdGVyIHRoZSBlbGVtZW50IGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBET00uIElmIHlvdSB0cnlcbiAqIHRvIGNhbGwgYGNyZWF0ZUhvb2tgIGZyb20gdGhlIGNvbnN0cnVjdG9yLCBhbiBlcnJvciB3aWxsIGJlIGxvZ2dlZC5cbiAqXG4gKiBAcmV0dXJucyB7Vmlld0hvb2t9IFJldHVybnMgdGhlIFZpZXdIb29rIGluc3RhbmNlIGZvciB0aGUgY3VzdG9tIGVsZW1lbnQuXG4gKi9cbmxldCBjcmVhdGVIb29rID0gKGVsLCBjYWxsYmFja3MgPSB7fSkgPT4ge1xuICBsZXQgZXhpc3RpbmdIb29rID0gRE9NLmdldEN1c3RvbUVsSG9vayhlbClcbiAgaWYoZXhpc3RpbmdIb29rKXsgcmV0dXJuIGV4aXN0aW5nSG9vayB9XG5cbiAgbGV0IGhvb2sgPSBuZXcgVmlld0hvb2soVmlldy5jbG9zZXN0VmlldyhlbCksIGVsLCBjYWxsYmFja3MpXG4gIERPTS5wdXRDdXN0b21FbEhvb2soZWwsIGhvb2spXG4gIHJldHVybiBob29rXG59XG5cbmV4cG9ydCB7XG4gIExpdmVTb2NrZXQsXG4gIGlzVXNlZElucHV0LFxuICBjcmVhdGVIb29rXG59XG4iLCAiLy8gSWYgeW91IHdhbnQgdG8gdXNlIFBob2VuaXggY2hhbm5lbHMsIHJ1biBgbWl4IGhlbHAgcGh4Lmdlbi5jaGFubmVsYFxuLy8gdG8gZ2V0IHN0YXJ0ZWQgYW5kIHRoZW4gdW5jb21tZW50IHRoZSBsaW5lIGJlbG93LlxuLy8gaW1wb3J0IFwiLi91c2VyX3NvY2tldC5qc1wiXG5cbi8vIFlvdSBjYW4gaW5jbHVkZSBkZXBlbmRlbmNpZXMgaW4gdHdvIHdheXMuXG4vL1xuLy8gVGhlIHNpbXBsZXN0IG9wdGlvbiBpcyB0byBwdXQgdGhlbSBpbiBhc3NldHMvdmVuZG9yIGFuZFxuLy8gaW1wb3J0IHRoZW0gdXNpbmcgcmVsYXRpdmUgcGF0aHM6XG4vL1xuLy8gICAgIGltcG9ydCBcIi4uL3ZlbmRvci9zb21lLXBhY2thZ2UuanNcIlxuLy9cbi8vIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gYG5wbSBpbnN0YWxsIHNvbWUtcGFja2FnZSAtLXByZWZpeCBhc3NldHNgIGFuZCBpbXBvcnRcbi8vIHRoZW0gdXNpbmcgYSBwYXRoIHN0YXJ0aW5nIHdpdGggdGhlIHBhY2thZ2UgbmFtZTpcbi8vXG4vLyAgICAgaW1wb3J0IFwic29tZS1wYWNrYWdlXCJcbi8vXG5cbi8vIEluY2x1ZGUgcGhvZW5peF9odG1sIHRvIGhhbmRsZSBtZXRob2Q9UFVUL0RFTEVURSBpbiBmb3JtcyBhbmQgYnV0dG9ucy5cbmltcG9ydCBcInBob2VuaXhfaHRtbFwiXG4vLyBFc3RhYmxpc2ggUGhvZW5peCBTb2NrZXQgYW5kIExpdmVWaWV3IGNvbmZpZ3VyYXRpb24uXG5pbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuaW1wb3J0IHRvcGJhciBmcm9tIFwiLi4vdmVuZG9yL3RvcGJhclwiXG5pbXBvcnQgSG9va3MgZnJvbSBcIi4vaG9va3NcIlxuXG5sZXQgY3NyZlRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcbmxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHtcbiAgbG9uZ1BvbGxGYWxsYmFja01zOiAyNTAwLFxuICBwYXJhbXM6IHtfY3NyZl90b2tlbjogY3NyZlRva2VufSxcbiAgaG9va3M6IEhvb2tzXG59KVxuXG4vLyBTaG93IHByb2dyZXNzIGJhciBvbiBsaXZlIG5hdmlnYXRpb24gYW5kIGZvcm0gc3VibWl0c1xudG9wYmFyLmNvbmZpZyh7YmFyQ29sb3JzOiB7MDogXCIjMjlkXCJ9LCBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsIDAsIDAsIC4zKVwifSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCBfaW5mbyA9PiB0b3BiYXIuc2hvdygzMDApKVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgX2luZm8gPT4gdG9wYmFyLmhpZGUoKSlcblxuLy8gY29ubmVjdCBpZiB0aGVyZSBhcmUgYW55IExpdmVWaWV3cyBvbiB0aGUgcGFnZVxubGl2ZVNvY2tldC5jb25uZWN0KClcblxuLy8gZXhwb3NlIGxpdmVTb2NrZXQgb24gd2luZG93IGZvciB3ZWIgY29uc29sZSBkZWJ1ZyBsb2dzIGFuZCBsYXRlbmN5IHNpbXVsYXRpb246XG4vLyA+PiBsaXZlU29ja2V0LmVuYWJsZURlYnVnKClcbi8vID4+IGxpdmVTb2NrZXQuZW5hYmxlTGF0ZW5jeVNpbSgxMDAwKSAgLy8gZW5hYmxlZCBmb3IgZHVyYXRpb24gb2YgYnJvd3NlciBzZXNzaW9uXG4vLyA+PiBsaXZlU29ja2V0LmRpc2FibGVMYXRlbmN5U2ltKClcbndpbmRvdy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuXG4iLCAibGV0IEhvb2tzID0ge31cbi8vIFVzZSB0aGUgZ2xvYmFsIFNvcnRhYmxlIG9iamVjdCBpbnN0ZWFkIG9mIGltcG9ydGluZyBpdFxuLy8gaW1wb3J0IFNvcnRhYmxlIGZyb20gXCJzb3J0YWJsZWpzXCJcblxuSG9va3MuUmVoZWFyc2FsSGlzdG9yeSA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLmhhbmRsZUV2ZW50KFwicHJpbnRfcGxhblwiLCAoe2RhdGV9KSA9PiB7XG4gICAgICAvLyBIaWRlIHRoZSBtYWluIGNvbnRlbnRcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWhlYXJzYWwtaGlzdG9yeScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBcbiAgICAgIC8vIEhpZGUgYWxsIHByaW50IHBsYW5zIGV4Y2VwdCB0aGUgb25lIHdlIHdhbnQgdG8gcHJpbnRcbiAgICAgIGNvbnN0IHByaW50UGxhbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJpbnQtcGxhbicpO1xuICAgICAgcHJpbnRQbGFucy5mb3JFYWNoKHBsYW4gPT4ge1xuICAgICAgICBwbGFuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy8gU2hvdyBvbmx5IHRoZSBwbGFuIHdlIHdhbnQgdG8gcHJpbnRcbiAgICAgIGNvbnN0IHRhcmdldFBsYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucHJpbnQtcGxhbltkYXRhLWRhdGU9XCIke2RhdGV9XCJdYCk7XG4gICAgICBpZiAodGFyZ2V0UGxhbikge1xuICAgICAgICB0YXJnZXRQbGFuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBTaG93IHRoZSBwcmludC1vbmx5IGNvbnRhaW5lclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByaW50LW9ubHknKS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIFxuICAgICAgLy8gV2FpdCBhIHNob3J0IG1vbWVudCBmb3IgdGhlIGNvbnRlbnQgdG8gYmUgdmlzaWJsZVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5wcmludCgpO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzdG9yZSB0aGUgbWFpbiBjb250ZW50IGFuZCBoaWRlIHRoZSBwcmludC1vbmx5IGNvbnRhaW5lclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVoZWFyc2FsLWhpc3RvcnknKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByaW50LW9ubHknKS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfSk7XG4gIH1cbn1cblxuSG9va3MuU2V0TGlzdEhpc3RvcnkgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5oYW5kbGVFdmVudChcInByaW50X3NldF9saXN0XCIsICh7bmFtZX0pID0+IHtcbiAgICAgIC8vIEhpZGUgdGhlIG1haW4gY29udGVudFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldC1saXN0LWhpc3RvcnknKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgXG4gICAgICAvLyBIaWRlIGFsbCBwcmludCBzZXQgbGlzdHMgZXhjZXB0IHRoZSBvbmUgd2Ugd2FudCB0byBwcmludFxuICAgICAgY29uc3QgcHJpbnRTZXRMaXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcmludC1zZXRsaXN0Jyk7XG4gICAgICBwcmludFNldExpc3RzLmZvckVhY2goc2V0TGlzdCA9PiB7XG4gICAgICAgIHNldExpc3Quc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAvLyBTaG93IG9ubHkgdGhlIHNldCBsaXN0IHdlIHdhbnQgdG8gcHJpbnRcbiAgICAgIGNvbnN0IHRhcmdldFNldExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucHJpbnQtc2V0bGlzdFtkYXRhLW5hbWU9XCIke25hbWV9XCJdYCk7XG4gICAgICBpZiAodGFyZ2V0U2V0TGlzdCkge1xuICAgICAgICB0YXJnZXRTZXRMaXN0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBTaG93IHRoZSBwcmludC1vbmx5IGNvbnRhaW5lclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NldGxpc3QtcHJpbnQtY29udGFpbmVyJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICBcbiAgICAgIC8vIFdhaXQgYSBzaG9ydCBtb21lbnQgZm9yIHRoZSBjb250ZW50IHRvIGJlIHZpc2libGVcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB3aW5kb3cucHJpbnQoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc3RvcmUgdGhlIG1haW4gY29udGVudCBhbmQgaGlkZSB0aGUgcHJpbnQtb25seSBjb250YWluZXJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldC1saXN0LWhpc3RvcnknKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NldGxpc3QtcHJpbnQtY29udGFpbmVyJykuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICB9LCAxMDApO1xuICAgIH0pO1xuICB9XG59XG5cbkhvb2tzLlNvcnRhYmxlU29uZ3MgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc3QgaG9vayA9IHRoaXM7XG4gICAgXG4gICAgLy8gVXNlIHRoZSBnbG9iYWwgU29ydGFibGUgb2JqZWN0XG4gICAgbmV3IFNvcnRhYmxlKHRoaXMuZWwsIHtcbiAgICAgIGFuaW1hdGlvbjogMTUwLFxuICAgICAgaGFuZGxlOiBcIi5kcmFnLWhhbmRsZVwiLFxuICAgICAgZ2hvc3RDbGFzczogXCJzb3J0YWJsZS1naG9zdFwiLFxuICAgICAgZHJhZ0NsYXNzOiBcInNvcnRhYmxlLWRyYWdcIixcbiAgICAgIG9uRW5kOiBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgY29uc3Qgc29uZ0lkID0gZXZ0Lml0ZW0uZGF0YXNldC5zb25nSWQ7XG4gICAgICAgIGNvbnN0IG5ld0luZGV4ID0gZXZ0Lm5ld0luZGV4O1xuICAgICAgICBjb25zdCBvbGRJbmRleCA9IGV2dC5vbGRJbmRleDtcbiAgICAgICAgY29uc3Qgc2V0SW5kZXggPSBob29rLmVsLmRhdGFzZXQuc2V0SW5kZXg7XG4gICAgICAgIFxuICAgICAgICBpZiAobmV3SW5kZXggIT09IG9sZEluZGV4KSB7XG4gICAgICAgICAgaG9vay5wdXNoRXZlbnQoXCJyZW9yZGVyX3NvbmdcIiwge1xuICAgICAgICAgICAgc29uZ19pZDogc29uZ0lkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBvbGRfaW5kZXg6IG9sZEluZGV4LnRvU3RyaW5nKCksXG4gICAgICAgICAgICBuZXdfaW5kZXg6IG5ld0luZGV4LnRvU3RyaW5nKCksXG4gICAgICAgICAgICBzZXRfaW5kZXg6IHNldEluZGV4LnRvU3RyaW5nKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhvb2tzOyAiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBTUEsT0FBQyxTQUFVQSxTQUFRQyxXQUFVO0FBQzNCO0FBR0EsU0FBQyxXQUFZO0FBQ1gsY0FBSSxXQUFXO0FBQ2YsY0FBSSxVQUFVLENBQUMsTUFBTSxPQUFPLFVBQVUsR0FBRztBQUN6QyxtQkFBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLFVBQVUsQ0FBQ0QsUUFBTyx1QkFBdUIsRUFBRSxHQUFHO0FBQ3hFLFlBQUFBLFFBQU8sd0JBQ0xBLFFBQU8sUUFBUSxDQUFDLElBQUksdUJBQXVCO0FBQzdDLFlBQUFBLFFBQU8sdUJBQ0xBLFFBQU8sUUFBUSxDQUFDLElBQUksc0JBQXNCLEtBQzFDQSxRQUFPLFFBQVEsQ0FBQyxJQUFJLDZCQUE2QjtBQUFBLFVBQ3JEO0FBQ0EsY0FBSSxDQUFDQSxRQUFPO0FBQ1YsWUFBQUEsUUFBTyx3QkFBd0IsU0FBVSxVQUFVLFNBQVM7QUFDMUQsa0JBQUksWUFBVyxvQkFBSSxLQUFLLEdBQUUsUUFBUTtBQUNsQyxrQkFBSSxhQUFhLEtBQUssSUFBSSxHQUFHLE1BQU0sV0FBVyxTQUFTO0FBQ3ZELGtCQUFJLEtBQUtBLFFBQU8sV0FBVyxXQUFZO0FBQ3JDLHlCQUFTLFdBQVcsVUFBVTtBQUFBLGNBQ2hDLEdBQUcsVUFBVTtBQUNiLHlCQUFXLFdBQVc7QUFDdEIscUJBQU87QUFBQSxZQUNUO0FBQ0YsY0FB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QkFBZ0I7QUFBQSxjQUM3QixTQUFTLE9BQU8sU0FBUztBQUFBLGNBQ3pCLFdBQVcsU0FBUyxTQUFTO0FBQUEsY0FDN0IsV0FBVyxTQUFTLFNBQVM7QUFBQSxjQUM3QixXQUFXLFNBQVMsU0FBUztBQUFBLFlBQy9CLENBQUM7QUFBQSxVQUNIO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBRUEsTUFBT0MsaUJBQVFEOzs7QUQxRWYsTUFBSSxZQUFZLFNBQVMsY0FBYyx5QkFBeUIsRUFBRSxhQUFhLFNBQVM7QUFDeEYsTUFBSSxhQUFhLElBQUksV0FBVyxTQUFTLFFBQVE7QUFBQSxJQUMvQyxvQkFBb0I7QUFBQSxJQUNwQixRQUFRLEVBQUMsYUFBYSxVQUFTO0FBQUEsSUFDL0IsT0FBT0U7QUFBQSxFQUNULENBQUM7QUFHRCxnQkFBQUMsUUFBTyxPQUFPLEVBQUMsV0FBVyxFQUFDLEdBQUcsT0FBTSxHQUFHLGFBQWEsb0JBQW1CLENBQUM7QUFDeEUsU0FBTyxpQkFBaUIsMEJBQTBCLFdBQVMsY0FBQUEsUUFBTyxLQUFLLEdBQUcsQ0FBQztBQUMzRSxTQUFPLGlCQUFpQix5QkFBeUIsV0FBUyxjQUFBQSxRQUFPLEtBQUssQ0FBQztBQUd2RSxhQUFXLFFBQVE7QUFNbkIsU0FBTyxhQUFhOyIsCiAgIm5hbWVzIjogWyJ3aW5kb3ciLCAiZG9jdW1lbnQiLCAidG9wYmFyIiwgIkN1c3RvbUV2ZW50IiwgImNsb3N1cmUiLCAibGl2ZVNvY2tldCIsICJjbG9zdXJlIiwgImUiLCAiaXNFbXB0eSIsICJmaWxlIiwgIm1vcnBoQXR0cnMiLCAibW9ycGhkb20iLCAiY2hpbGRyZW5Pbmx5IiwgInRhcmdldENvbnRhaW5lciIsICJjbG9uZSIsICJlbCIsICJsb2NrIiwgImxvYWRpbmciLCAiZW50cnkiLCAiaW5wdXQiLCAiY2xvc3VyZSIsICJIb29rcyIsICJob29rc19kZWZhdWx0IiwgImhvb2tzX2RlZmF1bHQiLCAidG9wYmFyIl0KfQo=
