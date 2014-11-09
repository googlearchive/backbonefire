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

  describe('#_compareAttributes', function() {
    // should null remotely out deleted values
    var collection;
    beforeEach(function() {
      var Collection = Backbone.Firebase.Collection.extend({
        url: 'Mock://',
        autoSync: true
      });

      collection = new Collection();
    });

    it('should should set deleted values to null', function() {

      var remoteAttributes = {
        id: 1,
        name: 'David'
      };

      var localAttributes = {
        id: 1
      };

      var updatedAttributes = collection._compareAttributes(remoteAttributes, localAttributes);

      // name should be set to null since the local property for name was removed
      assert(updatedAttributes.name === null);
    });

    it('should return updated attributes', function() {

      var remoteAttributes = {
        id: 1,
        name: 'Kato'
      };

      var localAttributes = {
        id: 1,
        name: 'David',
        age: 26
      };

      // name and age should be populated in an object because they were updated in the local attributes
      var updatedAttributes = collection._compareAttributes(remoteAttributes, localAttributes);
      expect(updatedAttributes).to.be.defined;
      expect(updatedAttributes.id).to.be.undefined;
      assert(updatedAttributes.name === 'David');
      assert(updatedAttributes.age === 26);
    });

  });

  describe('#_setWithPriority', function() {
    var collection;
    var ref;
    var item;
    beforeEach(function() {
      var Collection = Backbone.Firebase.Collection.extend({
        url: 'Mock://',
        autoSync: true
      });

      collection = new Collection();
      item = {
        '.priority': 1,
        name: 'David'
      }
    });

    it('should call setWithPriority on a Firebase reference', function() {
      collection._setWithPriority(collection.firebase, item);
      collection.firebase.flush();
      expect(collection.firebase.setWithPriority.calledOnce).to.be.ok;
    });

    it('should delete local priority', function() {
      var setItem = collection._setWithPriority(collection.firebase, item);
      collection.firebase.flush();
      expect(setItem['.priority']).to.be.undefined;
    });

  });

  describe('#_updateToFirebase', function() {

    it('should call update on a Firebase reference', function() {
      var Collection = Backbone.Firebase.Collection.extend({
        url: 'Mock://',
        autoSync: true
      });
      collection = new Collection();
      collection._updateToFirebase(collection.firebase, { id: '1' });
      collection.firebase.flush();
      expect(collection.firebase.update.calledOnce).to.be.ok;
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

    describe('calling Backbone.Collection.prototype._prepareModel', function() {
      var Users, Users, users;

      beforeEach(function() {
        User = Backbone.Model.extend({}),
        Users = Backbone.Firebase.Collection.extend({
          url: 'Mock://',
          initialize: function(models, options) {
            this.model = function(attrs, opts) {
              return new User(_.extend(attrs, { addedFromCollection: true}), opts);
            };
          }
        });
        users = new Users();
      });

      it('should call Backbone.Collection.prototype._prepareModel', function() {
        sinon.spy(Backbone.Collection.prototype, '_prepareModel');
        users.add({ firstname: 'Dave' });
        expect(Backbone.Collection.prototype._prepareModel.calledOnce).to.be.ok;
        Backbone.Collection.prototype._prepareModel.restore();
      });

      it('should prepare models', function() {
        var addedArray = users.add({ firstname: 'Dave' });
        var addedObject = addedArray[0];
        expect(addedObject.addedFromCollection).to.be.ok;
      });

    });

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
        Backbone.Collection.prototype.remove.restore();
      });

      // silent remove
      it('should call Backbone.Collection.remove silently', function() {
        sinon.spy(Backbone.Collection.prototype, 'remove');

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
        Backbone.Collection.prototype.remove.restore();
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
        Backbone.Collection.prototype.add.restore();
      });

      // silent add
      it('should call Backbone.Collection.add silently', function() {
        sinon.spy(Backbone.Collection.prototype, 'add');
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
        Backbone.Collection.prototype.add.restore();
      });

    });

    describe('#_updateModel', function() {

      var collection;
      var model;
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

        model = new Backbone.Model({
          id: "1",
          name: 'Kato',
          age: 26
        });

      });

      it('should not update if the model\'s _remoteChanging property is true', function() {

        model._remoteChanging = true;

        collection._updateModel(model);

        var collectionModel = collection.models[0];

        // The name property should still be equal to 'David'
        // because 'model' object had _remoteChanging set to true
        // which cancels the update. This is because _remoteChanging
        // indicates that the item is being updated through the
        // Firebase sync listeners
        collectionModel.get('name').should.equal('David');

      });

      it('should call _setWithPriority if the .priority property is present', function() {
        sinon.spy(collection, '_setWithPriority');
        model.attributes['.priority'] = 14;
        collection._updateModel(model);
        expect(collection._setWithPriority.calledOnce).to.be.ok;
        collection._setWithPriority.restore();
      });

      it('should call _updateToFirebase if no .priority property is present', function() {
        sinon.spy(collection, '_updateToFirebase');
        collection._updateModel(model);
        expect(collection._updateToFirebase.calledOnce).to.be.ok;
        collection._updateToFirebase.restore();
      });

    });

    describe('#_removeModel', function() {

      var collection;
      var model;
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

      it('should remove the model if destroy is called', function() {

      });

      it('should fire off a success function if provided', function() {

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

});