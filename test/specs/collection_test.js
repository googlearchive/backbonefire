describe('Backbone.Firebase.Collection', function() {

  MockFirebase.override();

  it('should exist', function() {
    return expect(Backbone.Firebase.Collection).to.be.ok;
  });

  it('should extend', function() {
    var spy = sinon.spy();
    var Collection = Backbone.Firebase.Collection.extend({
      url: 'Mock://'
    });
    return expect(Collection).to.be.ok;
  });

});