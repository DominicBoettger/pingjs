'use strict';
var crypto = require('crypto');
var pingoptions = require('./types/pingoptions');
var raw = require('raw-socket');
var microtime = require('microtime');
var ECHO_REPLY = 0;
var ECHO_CODE = 0;
var ECHO_REQUEST = 8;
var OFFSET_ECHO_TYPE = 0;
var OFFSET_ECHO_CODE = 1;
var OFFSET_ECHO_CHECKSUM = 2;
var OFFSET_PING_ID = 4;
var OFFSET_PING_SEQUENCE = 6;
var OFFSET_PING_PAYLOAD = 8;
class pinger {
    ping(dest, options) {
        options = new pingoptions(options);
        var pingId = this.generateEchoId();
        var socket = raw.createSocket({ protocol: raw.Protocol.ICMP });
        var pingresults = {
            destination: dest,
            pingsSent: 0,
            pingsreceived: 0,
            pings: new Array(options.count)
        };
        return new Promise((resolve, reject) => {
            var self = this;
            var bytesSent = 0;
            var currentPingTimeout = null;
            socket.on('message', function (buffer, source) {
                if (source !== dest || !bytesSent) {
                    return;
                }
                var expectedBuffer = self.pingMessage(true, pingId, pingresults.pingsSent - 1, options.payload);
                var icmpBuffer = buffer.slice(-bytesSent);
                if (icmpBuffer.toString('HEX') === expectedBuffer.toString('HEX')) {
                    if (currentPingTimeout) {
                        clearTimeout(currentPingTimeout);
                    }
                    setTimeout(function () {
                        pingresults.pings[pingresults.pingsSent - 1].received = microtime.now();
                        if (pingresults.pings[pingresults.pingsSent - 1].received && pingresults.pings[pingresults.pingsSent - 1].sent) {
                            pingresults.pings[pingresults.pingsSent - 1].time =
                                (pingresults.pings[pingresults.pingsSent - 1].received - pingresults.pings[pingresults.pingsSent - 1].sent) / 1000;
                        }
                        if (pingresults.pings[pingresults.pingsSent - 1].time) {
                            pingresults.pings[pingresults.pingsSent - 1].status = 'success';
                        }
                        else {
                            pingresults.pings[pingresults.pingsSent - 1].status = 'failed';
                        }
                        pingresults.pingsreceived++;
                        if (options.onReply) {
                            options.onReply(icmpBuffer, buffer, pingresults.pings[pingresults.pingsSent - 1], pingresults);
                        }
                        if (pingresults.pingsSent === options.count) {
                            socket.close();
                            resolve(pingresults);
                        }
                        else {
                            sendPing();
                        }
                    }, 0);
                }
            });
            sendPing();
            function sendPing() {
                var buffer = self.pingMessage(false, pingId, pingresults.pingsSent, options.payload);
                bytesSent = buffer.length;
                pingresults.pings[pingresults.pingsSent] = {};
                pingresults.pings[pingresults.pingsSent].sent = microtime.now();
                pingresults.pings[pingresults.pingsSent].status = 'failed';
                pingresults.pingsSent++;
                socket.send(buffer, 0, buffer.length, dest, function (err) {
                    if (err) {
                        reject(err.toString());
                    }
                });
                currentPingTimeout = setTimeout(function () {
                    if (options.onTimeout) {
                        options.onTimeout();
                    }
                    if (pingresults.pingsSent === options.count) {
                        socket.close();
                        resolve(pingresults);
                    }
                    else {
                        sendPing();
                    }
                }, options.timeout);
            }
        });
    }
    generateEchoId() {
        return crypto.randomBytes(2);
    }
    pingMessage(isReply, pingId, sequence, data) {
        if (data.length % 2 === 0) {
            data = data;
        }
        else {
            data = data + '\x00';
        }
        var buffer = new Buffer(8 + data.length, 'ascii');
        buffer.writeUInt8(isReply ? ECHO_REPLY : ECHO_REQUEST, OFFSET_ECHO_TYPE);
        buffer.writeUInt8(ECHO_CODE, OFFSET_ECHO_CODE);
        buffer.writeUInt16BE(0, OFFSET_ECHO_CHECKSUM);
        buffer.writeUInt16BE(pingId.readUInt16BE(0), OFFSET_PING_ID);
        buffer.writeUInt16BE(sequence, OFFSET_PING_SEQUENCE);
        buffer.write(data, OFFSET_PING_PAYLOAD);
        raw.writeChecksum(buffer, OFFSET_ECHO_CHECKSUM, raw.createChecksum(buffer));
        return buffer;
    }
}
module.exports = pinger;
