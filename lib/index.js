'use strict';

var util = require('util');
var Transform = require('stream').Transform;

module.exports = StreamSpeed;

util.inherits(StreamSpeed, Transform);

function StreamSpeed(cb) {
  if (!(this instanceof StreamSpeed)) {
    return new StreamSpeed(cb);
  }

  Transform.call(this);

  this.total = 0;
  this.startTime = Date.now();
  this.previousTime = this.startTime;
  this.callback = cb || noop;
  this.average = 0;
}

StreamSpeed.prototype._transform = function (chunk, encoding, cb) {
  var len = chunk.length;
  var now = Date.now();
  var speed = len / (now - this.previousTime);
  
  this.total += len;
  
  this.average = this.total / (now - this.startTime);

  this.emit('speed', speed, this.average);
  this.callback(speed, this.average);

  this.previousTime = now;

  cb(null, chunk);
};

StreamSpeed.prototype._flush = function (cb) {
  cb();
};

function noop() {}
