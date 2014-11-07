describe('Backbone.Firebase.Collection', function() {

  it('should exist', function() {
    return expect(Backbone.Firebase.Collection).to.be.ok;
  });

  it('should extend', function() {
    var Collection = Backbone.Firebase.Collection.extend({
      url: 'Mock://'
    });
    return expect(Collection).to.be.ok;
  });

  it('should extend construct', function() {
    var Collection = Backbone.Firebase.Collection.extend({
      url: 'Mock://'
    });
    return expect(new Collection()).to.be.ok;
  });

  describe('autoSync:true', function() {

    it('should enable autoSync by default', function() {
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


    it('should add an id to a new model', function() {

      var mockSnap = new MockSnap({
        name: 1,
        val: {}
      });

      var Collection = Backbone.Firebase.Collection.extend({
        url: 'Mock://',
        autoSync: true
      });

      var collection = new Collection();

      var model = collection._checkId(mockSnap);

      expect(model.id).to.be.ok;
      model.id.should.equal(mockSnap.name());

    });

    describe('#_preventSync', function() {
      var collection;
      var model = {};
      beforeEach(function() {
        var Collection = Backbone.Firebase.Collection.extend({
          url: 'Mock://',
          autoSync: true
        });

        collection = new Collection();
      })

      it('should change from false to true', function() {

        collection._preventSync(model, true);
        expect(model._remoteChanging).to.be.ok;

      });

      it('should change from true to false', function() {

        collection._preventSync(model, false);
        expect(model._remoteChanging).to.be.false;

      });

    });

    describe('#_childChanged', function() {

      var collection;
      beforeEach(function() {
        var Collection = Backbone.Firebase.Collection.extend({
          url: 'Mock://',
          autoSync: true
        });

        collection = new Collection();

        collection.models = [
          new Backbone.Model({
            id: 1,
            name: 'David',
            age: 26
          })
        ];

      });

      it('should unset local property from remote deletion', function() {

        var mockSnap = new MockSnap({
          name: 1,
          val: {
            name: 'David'
            // age has been removed
          }
        });

        collection._childChanged(mockSnap);

        var changedModel = collection.models[0];

        expect(changedModel.age).to.be.undefined;

      });

      it('should update local model from remote update', function () {

        var mockSnap = new MockSnap({
          name: 1,
          val: {
            name: 'David',
            age: 26,
            favDino: 'trex'
            // trex has been added
          }
        });

        collection._childChanged(mockSnap);

        var changedModel = collection.models[0];

        expect(changedModel.get('favDino')).to.be.ok;

      });

    });

    describe('#_childRemoved', function() {

      var collection;
      beforeEach(function() {
        var Collection = Backbone.Firebase.Collection.extend({
          url: 'Mock://',
          autoSync: true
        });

        collection = new Collection();

        collection.models = [
          new Backbone.Model({
            id: 1,
            name: 'David',
            age: 26
          })
        ];

      });

      it('should call Backbone.Collection.remove', function() {
        sinon.spy(Backbone.Collection.prototype, 'remove');

        var mockSnap = new MockSnap({
          name: 1,
          val: {
            id: 1,
            name: 'David',
            age: 26
          }
        });

        collection._childRemoved(mockSnap);

        expect(Backbone.Collection.prototype.remove.calledOnce).to.be.ok;

      });

      // silent remove
      it('should call Backbone.Collection.remove silently', function() {

        var mockSnap = new MockSnap({
          name: 1,
          val: {
            id: 1,
            name: 'David',
            age: 26
          }
        });

        collection._suppressEvent = true;
        collection._childRemoved(mockSnap);

        expect(Backbone.Collection.prototype.remove.calledWith({silent: true}));

      });

    });

    describe('#_childAdded', function() {

      var collection;
      beforeEach(function() {
        var Collection = Backbone.Firebase.Collection.extend({
          url: 'Mock://',
          autoSync: true
        });

        collection = new Collection();

        collection.models = [
          new Backbone.Model({
            id: 1,
            name: 'David',
            age: 26
          })
        ];

      });

      it('should call Backbone.Collection.add', function() {
        sinon.spy(Backbone.Collection.prototype, 'add');

        var mockSnap = new MockSnap({
          name: 1,
          val: {
            id: 1,
            name: 'David',
            age: 26
          }
        });

        collection._childAdded(mockSnap);

        expect(Backbone.Collection.prototype.add.calledOnce).to.be.ok;

      });

      // silent add
      it('should call Backbone.Collection.add silently', function() {

        var mockSnap = new MockSnap({
          name: 1,
          val: {
            id: 1,
            name: 'David',
            age: 26
          }
        });

        collection._suppressEvent = true;
        collection._childAdded(mockSnap);

        expect(Backbone.Collection.prototype.add.calledWith({silent: true}));

      });

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