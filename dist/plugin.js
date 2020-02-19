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
  this.onopen = function () {};
});