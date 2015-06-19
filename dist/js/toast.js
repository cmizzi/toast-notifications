
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - Studionet
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function() {
  var Toast;

  window.Toast = Toast = (function() {
    Toast.prototype.notify = null;

    Toast.prototype.options = null;

    Toast.container = null;

    Toast.options = {
      timelife: true,
      delay: 7,
      onShow: "spaceInDown",
      onHide: "spaceOutUp"
    };

    function Toast(type, message) {
      type = Toast.getType(type);
      if (!type || !message) {
        throw type + " unrecodnized";
      }
      if (!Toast.container) {
        this.createContainer();
      }
      this.notify(type, message);
    }

    Toast.configureOptions = function(given) {
      var key, options, property;
      options = Toast.options;
      if (typeof given !== 'object') {
        return options;
      }
      for (key in given) {
        property = given[key];
        if (options[key] === void 0) {
          throw "`" + key + "` option doesn't exist";
        }
        options[key] = property;
      }
      return options;
    };

    Toast.prototype.getOption = function(name) {
      return Toast.options[name];
    };

    Toast.prototype.notify = function(type, message) {
      var timelife, timer;
      this.notify = document.createElement("li");
      this.notify.classList.add("toasts-notify");
      this.notify.classList.add(type);
      this.notify.classList.add("magictime");
      this.notify.classList.add(this.getOption("onShow"));
      this.notify.innerHTML = message;
      if (this.getOption("timelife")) {
        timelife = document.createElement("div");
        timelife.classList.add("toasts-timelife");
        this.notify.appendChild(timelife);
      }
      timer = new Date();
      timer.setSeconds(timer.getSeconds() + this.getOption("delay"));
      this.notify.timer = timer;
      Toast.container.appendChild(this.notify);
      return this.remove();
    };

    Toast.prototype.remove = function() {
      var that;
      that = this;
      return setTimeout(function() {
        var current, delta, from, timelife, to, width;
        current = new Date();
        if (current.getSeconds() === that.notify.timer.getSeconds()) {
          that.notify.classList.remove(that.getOption("onShow"));
          that.notify.classList.add(that.getOption("onHide"));
          return;
        }
        if (that.getOption("timelife")) {
          timelife = that.notify.querySelector(".toasts-timelife");
          width = timelife.clientWidth;
          from = current.getSeconds();
          to = that.notify.timer.getSeconds();
          delta = Math.max(from, to) - Math.min(from, to);
          delta = width / Math.abs(delta);
          timelife.style.width = (width - delta) + "px";
        }
        return that.remove();
      }, 1000);
    };

    Toast.getType = function(classList) {
      var i, len, type;
      if (typeof classList === "string") {
        classList = classList.split(" ");
      }
      for (i = 0, len = classList.length; i < len; i++) {
        type = classList[i];
        if (type.match(/^(info|success|error|alert|warning)$/)) {
          return type;
        }
      }
      return null;
    };

    Toast.prototype.createContainer = function() {
      var container;
      container = document.createElement("ul");
      container.classList.add("toasts-container");
      document.body.appendChild(container);
      return Toast.container = container;
    };

    Toast.guess = function(container, options) {
      var i, len, node, ref, results;
      container.classList.add("hide");
      ref = container.childNodes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        if (node.nodeType === 3) {
          continue;
        }
        results.push(new Toast(node.classList, node.innerHTML, options));
      }
      return results;
    };

    Toast.setOptions = function(options) {
      return Toast.options = Toast.configureOptions(options);
    };

    return Toast;

  })();

}).call(this);
