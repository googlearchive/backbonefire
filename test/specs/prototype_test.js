describe('Backbone.Firebase', function() {

  MockFirebase.override();

  it('should exist', function() {
    return expect(Backbone.Firebase).to.be.ok;
  });

});