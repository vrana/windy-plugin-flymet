"use strict";

/**
 * This is main plugin loading function
 * Feel free to write your own compiler
 */
W.loadPlugin(
/* Mounting options */
{
  "name": "windy-plugin-flymet",
  "version": "1.2.1",
  "author": "Jakub Vrana",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vrana/windy-plugin-flymet"
  },
  "description": "Windy plugin for Flymet.",
  "displayName": "Flymet",
  "hook": "contextmenu",
  "className": "plugin-lhpane plugin-mobile-fullscreen",
  "exclusive": "lhpane"
},
/* HTML */
'<div class="mobile-header"> <div class="mh-closing-x iconfont clickable" id="close-mobile-plugin">}</div> </div> <div class="plugin-content"> <h2>Flymet</h2> <ul style="padding-left: 20px;"> <li><a data-flymet="">nic</a></li> <li><a data-flymet="cudf" style="font-weight: bold;">Deficit konvektivní teploty</a> <a href="https://flymet.meteopress.cz/manual.php#popis21" target="_blank"><sup>?</sup></a></li> <li><a data-flymet="cukh">Kupovitá oblačnost</a> <a href="https://flymet.meteopress.cz/manual.php#popis22" target="_blank"><sup>?</sup></a></li> <li><a data-flymet="cuvr">Rychlost stoupání</a> <a href="https://flymet.meteopress.cz/manual.php#popis2" target="_blank"><sup>?</sup></a></li> <li><a data-flymet="curyb">Stoupání 1500 m</a> <a href="https://flymet.meteopress.cz/manual.php#popis27" target="_blank"><sup>?</sup></a></li> <li><a data-flymet="drtr">Druh termiky</a></li> </ul> <p>Neprůhlednost: <input id="flymet-opacity" type="range" min="0" max="100" value="50" style="vertical-align: text-bottom;"></p> <p>Zdroj dat: <a href="https://flymet.meteopress.cz/cr/" target="_blank">Flymet</a></p> </div>',
/* CSS */
'.onwindy-plugin-flymet .left-border{left:400px}.onwindy-plugin-flymet #search{display:none}#windy-plugin-flymet{width:400px;height:100%}#windy-plugin-flymet .plugin-content{padding:20px 15px 15px 15px;font-size:14px;line-height:1.6}#windy-plugin-flymet a{color:navy}',
/* Constructor */
function () {
  var _this = this;

  var rootScope = W.require('rootScope');

  var store = W.require('store');

  var _W$require = W.require('map'),
      map = _W$require.map;

  var flymet;
  var flymetType = 'cudf';

  document.getElementById('close-mobile-plugin').onclick = function () {
    return _this.close();
  };

  this.onopen = function () {
    if (!flymet) {
      var openInApp = document.getElementById('open-in-app');

      if (openInApp) {
        openInApp.style.display = 'none';
      }

      flymet = L.imageOverlay('https://flymet.meteopress.cz/cr/cudf13.png', [[48, 11.65], [51.65, 19.35]], {
        opacity: .5
      });
      updateFlymet();
      store.on('timestamp', updateFlymet);
    }
  };

  function updateFlymet() {
    var timestamp = new Date(store.get('timestamp'));
    var now = new Date();
    var hour = timestamp.getUTCHours();

    if (!flymetType) {
      flymet.remove();
    } else if (isSameDay(timestamp, now) && hour > 0) {
      flymet.setUrl('https://flymet.meteopress.cz/cr/' + flymetType + hour + '.png').addTo(map);
    } else if (isSameDay(timestamp, addDay(now))) {
      flymet.setUrl('https://flymet.meteopress.cz/cr' + (hour ? 'dl/' + flymetType + hour : '/' + flymetType + '24') + '.png').addTo(map);
    } else if (isSameDay(timestamp, addDay(now)) && hour < 20) {
      flymet.setUrl('https://flymet.meteopress.cz/crdl' + (hour ? '1/' + flymetType + hour : '/' + flymetType + '24') + '.png').addTo(map);
    } else {
      flymet.remove();
    }
  }

  Array.from(document.querySelectorAll('[data-flymet]')).forEach(function (el) {
    return el.onclick = function (event) {
      document.querySelector('[data-flymet="' + flymetType + '"]').style.fontWeight = 'normal';
      event.target.style.fontWeight = 'bold';
      flymetType = event.target.dataset['flymet'];
      updateFlymet();

      if (rootScope.isMobile) {
        _this.close();
      }
    };
  });

  document.querySelector('#flymet-opacity').oninput = function (e) {
    flymet.setOpacity(e.target.value / 100);
  };

  function addDay(date) {
    date.setDate(date.getDate() + 1);
    return date;
  }

  function isSameDay(a, b) {
    return a.getDate() == b.getDate();
  }
});