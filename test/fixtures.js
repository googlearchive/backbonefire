MockFirebase.override();

function MockSnap(params) {
  params = params || {};

  this._name = params.name || '';
  this._val = params.val || '';

  this.name = function() {
    return this._name;
  };
  this.val = function() {
    return this._val;
  };
  this.setName = function(name) {
    this._name = name;
  };
  this.setVal = function(val) {
    this._val = val;
  };
}