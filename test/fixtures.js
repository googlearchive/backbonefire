MockFirebase.override();

function MockSnap(params) {
  params = params || {};

  this._key = params.key;
  this._key = params.name;
  this._val = params.val;

  this.name = function() {
    return this._key;
  };
  this.key = function() {
    return this._key;
  };
  this.val = function() {
    return this._val;
  };
  this.setKey = function(key) {
    this._key = key;
  };
  this.setVal = function(val) {
    this._val = val;
  };
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}