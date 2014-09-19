describe('Backbone.Firebase', function() {

  beforeEach(function() {
    return this.Firebase = new Backbone.Firebase(new Firebase);
  });

  it('should exist', function() {
    return expect(this.Firebase).to.be.ok;
  });

  it('should create a Firebase reference', function() {
    return expect(this.Firebase._fbref).to.be.an.instanceOf(Firebase);
  });

  return describe('#_childAdded()', function() {

    return it('should be a method', function() {
      return expect(this.Firebase).to.have.property('_childAdded').that.is.a('function');
    });

  });

});