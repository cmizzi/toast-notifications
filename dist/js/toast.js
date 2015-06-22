
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

    Toast.prototype.setClasses = function(classes) {
      var cls, i, j, len, len1, ref, results;
      if (classes instanceof Object) {
        for (i = 0, len = classes.length; i < len; i++) {
          cls = classes[i];
          this.notify.classList.add(cls);
        }
        return;
      }
      ref = classes.split(" ");
      results = [];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        cls = ref[j];
        results.push(this.notify.classList.add(cls));
      }
      return results;
    };

    Toast.prototype.notify = function(type, message) {
      var e, timelife, timer;
      this.notify = document.createElement("li");
      this.notify.classList.add("toasts-notify");
      this.notify.classList.add("magictime");
      this.notify.classList.add(this.getOption("onShow"));
      this.notify.innerHTML = message;
      this.setClasses(type);
      if (this.getOption("timelife")) {
        timelife = document.createElement("div");
        timelife.classList.add("toasts-timelife");
        this.notify.appendChild(timelife);
      }
      timer = new Date();
      timer.setSeconds(timer.getSeconds() + this.getOption("delay"));
      this.notify.timer = timer;
      try {
        Toast.container.insertBefore(this.notify, Toast.container.firstChild);
      } catch (_error) {
        e = _error;
        Toast.container.appendChild(this.notify);
      }
      return this.remove();
    };

    Toast.prototype.remove = function() {
      var hidden, that;
      that = this;
      hidden = false;
      return setTimeout(function() {
        var current, delta, from, timelife, to, width;
        current = new Date();
        if (current.getSeconds() >= that.notify.timer.getSeconds()) {
          if (!that.notify.classList.contains("ondeHide")) {
            that.notify.classList.remove(that.getOption("onShow"));
            that.notify.classList.add(that.getOption("onHide"));
          }
          that.notify.addEventListener(that.checkAnimations(), function(event) {
            if (event.animationName !== that.getOption("onHide")) {
              return;
            }
            return that.notify.remove();
          });
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

    Toast.prototype.checkAnimations = function() {
      var animation, animations, label;
      animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
      };
      for (label in animations) {
        animation = animations[label];
        if (this.notify.style[label] !== void 0) {
          return animation;
        }
      }
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
