window.Firebase = (function() {
  function Firebase() {
    this.name = sinon.stub().returns(this);
    this.set = sinon.stub().returns(this);
    this.child = sinon.stub().returns(this);
    this.ref = sinon.stub().returns(this);
    this.push = sinon.stub().returns(this);
    this.update = sinon.stub().returns(this);
    this.auth = sinon.stub().returns(this);
    this.on = sinon.stub().returns(this);
    this.off = sinon.stub().returns(this);
    this.once = sinon.stub().returns(this);
  }

  return Firebase;

})();