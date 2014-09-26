describe('Backbone.Firebase.Model', function() {

  it('should exist', function() {
    return expect(Backbone.Firebase.Model).to.be.ok;
  });

  it('should extend', function() {
    var spy = sinon.spy();
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://',
      autoSync: false
    });
    return expect(Model).to.be.ok;
  });

});