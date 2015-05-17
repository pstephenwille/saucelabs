'use strict';


module.exports = {
  chrome: {browserName: 'chrome'},
  firefox: {browserName: 'firefox'},
  explorer: {browserName: 'internet explorer'},
  safari: {browserName: 'safari', platform: 'OS X 10.10', version: '8.0'},
  iphone: {
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '8.2',
    deviceName: 'iPhone Simulator',
    'device-orientation': 'portrait'
  }
};