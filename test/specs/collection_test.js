describe('Backbone.Firebase.Collection', function() {

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

  it('should extend construct', function() {
    var spy = sinon.spy();
    var Collection = Backbone.Firebase.Collection.extend({
      url: 'Mock://'
    });
    return expect(new Collection()).to.be.ok;
  });

  describe('autoSync:true', function() {

    it('should enable autoSync by default', function() {
      var spy = sinon.spy();
      var Model = Backbone.Firebase.Collection.extend({
        url: 'Mock://'
      });

      var model = new Model();

      return expect(model.autoSync).to.be.ok;
    });

    it('should call sync when added', function() {
      var spy = sinon.spy();
      var Models = Backbone.Firebase.Collection.extend({
        url: 'Mock://',
        autoSync: true
      });

      var models = new Models();

      models.on('sync', spy);

      models.add({ title: 'blah' });
      models.firebase.flush();
      return expect(spy.called).to.be.ok;
    });

  });

  describe('autoSync:false', function() {

    it('should not call sync when added', function() {
      var spy = sinon.spy();
      var Models = Backbone.Firebase.Collection.extend({
        url: 'Mock://',
        autoSync: false
      });

      var models = new Models();

      models.on('sync', spy);

      models.add({ title: 'blah' });

      models.firebase.flush();

      return expect(spy.called).to.be.false;
    });

  });


  describe('#_parseModels()', function() {
    var Collection = Backbone.Firebase.Collection.extend({
      url: 'Mock://'
    });

    var collection = new Collection();

    it('should be a method', function() {
      return expect(collection).to.have.property('_parseModels').that.is.a('function');
    });

    it('should return an empty array when called without parameters', function() {
      var result = collection._parseModels();
      return expect(result).to.eql([]);
    });

  });

});