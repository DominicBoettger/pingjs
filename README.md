# pingjs

[![Build Status](https://travis-ci.org/dominic.boettger/pingjs.svg?branch=master)](https://travis-ci.org/dominic.boettger/pingjs)

[![NPM](https://nodei.co/npm-dl/pingjs.png?months=1)](https://nodei.co/npm/pingjs/)

[![NPM](https://nodei.co/npm/pingjs.png?downloads=true&stars=true)](https://nodei.co/npm/pingjs/)

[![NPM version](https://badge.fury.io/js/pingjs@2x.png)](http://badge.fury.io/js/pingjs)

Ping module for node > 4.X

Usage:
```javascript
var pingermod = require('../');
var pinger = new pingermod();
pinger.ping('8.8.8.8', {
 count: 1,
 timeout: 1000,
 payload: 'pingjs'
}).then(stats) {
  console.log(stats);
});
```
