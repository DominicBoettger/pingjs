"use strict";
class pingoptions {
    constructor(opts) {
        this.count = opts.count || 1;
        this.payload = opts.payload || 'pinger';
        this.timeout = opts.timeout || 1000;
    }
}
module.exports = pingoptions;
