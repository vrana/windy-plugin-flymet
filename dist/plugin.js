"use strict";

/**
 * This is main plugin loading function
 * Feel free to write your own compiler
 */
W.loadPlugin(
/* Mounting options */
{
  "name": "windy-plugin-flymet",
  "version": "0.5.0",
  "author": "Jakub Vrana",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vrana/windy-plugin-flymet"
  },
  "description": "Windy plugin for Flymet.",
  "displayName": "My super plugin",
  "hook": "menu"
},
/* HTML */
'',
/* CSS */
'',
/* Constructor */
function () {
  var store = W.require('store');

  var map = W.require('map');

  var flymet;

  this.onopen = function () {
    flymet = L.imageOverlay('https://flymet.meteopress.cz/cr/cudf13.png', [[48, 11.65], [51.65, 19.35]], {
      opacity: .5
    });
    updateFlymet();
    store.on('timestamp', updateFlymet);
  };

  function updateFlymet() {
    var timestamp = new Date(store.get('timestamp'));
    var now = new Date();
    var hour = timestamp.getUTCHours();

    if (isSameDay(timestamp, now) && hour > 0) {
      flymet.setUrl('https://flymet.meteopress.cz/cr/cudf' + hour + '.png').addTo(map);
    } else if (isSameDay(timestamp, addDay(now))) {
      flymet.setUrl('https://flymet.meteopress.cz/cr' + (hour ? 'dl/cudf' + hour : '/cudf24') + '.png').addTo(map);
    } else if (isSameDay(timestamp, addDay(now)) && hour == 0) {
      flymet.setUrl('https://flymet.meteopress.cz/crdl/cudf24.png').addTo(map);
    } else {
      flymet.remove();
    }
  }

  function addDay(date) {
    date.setDate(date.getDate() + 1);
    return date;
  }

  function isSameDay(a, b) {
    return a.toISOString().substr(0, 10) == b.toISOString().substr(0, 10);
  }
});