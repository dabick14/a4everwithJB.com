(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveal everything on load (single-screen desktop, short mobile page) ---- */
  requestAnimationFrame(function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  });

  /* ---- countdown ---- */
  var TARGET = new Date('2027-01-02T00:00:00+00:00').getTime();

  var els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds')
  };
  var grid = document.getElementById('countdown-grid');
  var arrivedMsg = document.getElementById('countdown-arrived');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function render() {
    var now = Date.now();
    var diff = TARGET - now;

    if (diff <= 0) {
      if (grid) grid.hidden = true;
      if (arrivedMsg) arrivedMsg.hidden = false;
      clearInterval(timer);
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    var next = { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };

    Object.keys(next).forEach(function (key) {
      var el = els[key];
      if (!el) return;
      if (el.textContent !== next[key]) {
        el.textContent = next[key];
        if (!reduceMotion) {
          el.classList.remove('tick');
          void el.offsetWidth; /* restart animation */
          el.classList.add('tick');
        }
      }
    });
  }

  render();
  var timer = setInterval(render, 1000);
})();
