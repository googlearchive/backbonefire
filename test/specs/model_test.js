describe('Backbone.Firebase.Model', function() {

  it('should exist', function() {
    return expect(Backbone.Firebase.Model).to.be.ok;
  });

  it('should extend', function() {
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://',
      autoSync: false
    });
    return expect(Model).to.be.ok;
  });

  it('should contstruct', function() {
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://'
    });
    return expect(new Model()).to.be.ok;
  });

  it('should build a url when urlRoot and an id is provided', function() {
    var spy = sinon.spy();
    var Model = Backbone.Firebase.Model.extend({
      urlRoot: 'Mock://',
      url: spy
    });

    var model = new Model({
      id: 1
    });

    return expect(spy.called).to.be.ok;
  });

  describe('autoSync:true', function() {

    it('should enable autoSync by default', function() {
      var spy = sinon.spy();
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });

      var model = new Model();

      return expect(model.autoSync).to.be.ok;
    });

    it('should call sync when model is set', function() {
      var spy = sinon.spy();
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });

      var model = new Model();

      model.on('sync', spy);

      model.set('ok', 'ok');
      model.firebase.flush();

      return expect(spy.called).to.be.ok;
    });

  });

});