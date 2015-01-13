describe('Backbone.Firebase.Model', function() {

  it('should exist', function() {
    return expect(Backbone.Firebase.Model).to.be.ok;
  });

  it('should extend', function() {
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://'
    });
    return expect(Model).to.be.ok;
  });

  it('should contstruct', function() {
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://'
    });
    return expect(new Model()).to.be.ok;
  });

  it('should create a model with a urlRoot from its id', function() {
    var mockUrl = 'https://mock-bf.firebaseio.com/users';
    var Model = Backbone.Firebase.Model.extend({
      urlRoot: mockUrl
    });
    var model = new Model({
      id: 'david'
    });

    model.url().should.equal(mockUrl + '/' + model.get('id'));
  });

  describe('#constructor', function() {

    it('should throw an error if an invalid url is provided', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: true
      });
      try {
        var model = new Model();
      } catch (err) {
        assert(err.message === 'url parameter required');
      }
    });

    it('should call Backbone.Firebase._determineRef with url as a Firebase reference', function() {
      sinon.spy(Backbone.Firebase, '_determineRef');
      var ref = new Firebase('Mock://');
      var Model = Backbone.Firebase.Model.extend({
        url: ref
      });
      var model = new Model();
      expect(Backbone.Firebase._determineRef.calledOnce).to.be.ok;
      Backbone.Firebase._determineRef.restore();
    });

  });

  describe('#destroy', function() {

    var model;
    beforeEach(function() {
      var Model = Backbone.Firebase.Model.extend({
        urlRoot: 'Mock://'
      });

      model = new Model();
    });

    it('should trigger the destroy event', function() {
      var spy = sinon.spy();

      model.on('destroy', spy);

      model.destroy();
      model.firebase.flush();

      expect(spy.calledOnce).to.be.ok;

    });

  });

  describe('#_unsetAttributes', function() {

    it('should unset attributes that have been deleted on the server', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });
      var model = new Model();

      // set the initial attributes silently
      model.set({
        firstName: 'David',
        lastName: 'East'
      }, { silent: true });

      // create a mock snap that removes the 'lastName' property
      var mockSnap = new MockSnap({
        name: '1',
        val: {
          firstName: 'David'
        }
      });

      model._unsetAttributes(mockSnap);

      expect(model.get('firstName')).to.be.ok;
      expect(model.get('lastName')).to.be.undefined;

    });

    it('should call _unsetAttributes', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });

      var model = new Model();

      var mockSnap = new MockSnap({
        name: '1',
        val: {
          firstname: 'David'
        }
      });

      sinon.spy(model, '_unsetAttributes');

      model._setLocal(mockSnap);

      expect(model._unsetAttributes.calledOnce).to.be.ok;
      model._unsetAttributes.restore();
    });


  });

  describe('#_setId', function() {
    it('should set id to its value', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });
      var model = new Model();
      var mockSnap = new MockSnap({
        name: '1'
      });
      model._setId(mockSnap);

      model.get('id').should.equal('1');
    });
  });

  describe('SyncModel', function() {

    var Model = null;

    beforeEach(function() {
      Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });
    });

    describe('#fetch', function() {

      it('should trigger "sync" when fetch is called', function() {
        var model = new Model();
        var syncIsCalled = false;
        model.fetch();
        model.on('sync', function() {
          syncIsCalled = true;
        });
        model.firebase.flush();
        return expect(syncIsCalled).to.be.ok;
      });

      it('should call Backbone.Firebase._promiseEvent', function() {
        var model = new Model();
        sinon.spy(Backbone.Firebase, '_promiseEvent');

        model.fetch();
        model.firebase.flush();

        expect(Backbone.Firebase._promiseEvent.calledOnce).to.be.ok;

        Backbone.Firebase._promiseEvent.restore();
      });

    });

    describe('#sync', function() {

      // Backbone.Firebase.Model.sync should proxy to Backbone.Firebase.sync
      // if it comes from a OnceModel
      it('should call Backbone.Firebase.sync', function() {
        sinon.spy(Backbone.Firebase, 'sync');

        model = new Model();

        model.sync('read', model, null);

        expect(Backbone.Firebase.sync.calledOnce).to.be.ok;
        Backbone.Firebase.sync.restore();
      });

    });

    describe('#constructor', function() {

      it('should call sync when model is set', function() {
        var spy = sinon.spy();

        var model = new Model();

        model.on('sync', spy);

        model.set('ok', 'ok');
        model.firebase.flush();

        return expect(spy.called).to.be.ok;
      });

      it('should set up a Firebase value listener', function() {
        var spy = sinon.spy();

        var model = new Model();
        model.firebase.on('value', spy);
        model.firebase.flush();

        return expect(spy.called).to.be.ok;
      });

      it('should listen for local changes', function() {
        var model = new Model();
        var spy = sinon.spy();

        model._listenLocalChange(spy);

        model.set('ok', 'ok');
        model.firebase.flush();

        return expect(spy.called).to.be.ok;
      });

    });

  });

  describe('OnceModel', function() {

    describe('#constructor', function(){

      it('should call _listenLocalChange', function() {
        sinon.spy(Backbone.Firebase.Model.prototype, '_listenLocalChange');

        var Model = Backbone.Firebase.Model.extend({
          url: 'Mock://',
          autoSync: false
        });
        model = new Model();

        expect(Backbone.Firebase.Model.prototype._listenLocalChange.calledOnce).to.be.ok;
        Backbone.Firebase.Model.prototype._listenLocalChange.restore();
      });

      it('should listen for local changes', function() {
        var Model = Backbone.Firebase.Model.extend({
          url: 'Mock://',
          autoSync: false
        });

        var model = new Model();
        var spy = sinon.spy();

        model._listenLocalChange(spy);

        model.set('ok', 'ok');
        model.firebase.flush();

        return expect(spy.called).to.be.ok;
      });

    });

    describe('#sync', function() {

      // Backbone.Firebase.Model.sync should proxy to Backbone.Firebase.sync
      // if it comes from a OnceModel
      it('should call Backbone.Firebase.sync', function() {
        sinon.spy(Backbone.Firebase, 'sync');

        var Model = Backbone.Firebase.Model.extend({
          url: 'Mock://',
          autoSync: false
        });
        model = new Model();

        model.sync('read', model, null);

        expect(Backbone.Firebase.sync.calledOnce).to.be.ok;
        Backbone.Firebase.sync.restore();
      });

    });

  });

  describe('autoSync options', function() {

    /*

    Model null -> Instance null = true
    Model null -> Instance autosync:true = true
    Model null -> Instance autosync:false = false


    Model autosync:true -> Instance null = true
    Model autosync:true -> Instance autosync:false = false
    Model autosync:true -> Instance autosync:true = true

    Model autosync:false -> Instance null = false
    Model autosync:false -> Instance autosync:true
    Model autosync:false -> Instance autosync:true = true

    */

    it('Constructor null -> Instance null', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });
      var model = new Model();
      return expect(model.autoSync).to.be.ok;
    });

    it('Constructor null -> Instance true', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });
      var model = new Model({}, { autoSync: true });
      return expect(model.autoSync).to.be.ok;
    });

    it('Constructor null -> Instance false', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });
      var model = new Model({}, { autoSync: false });
      return expect(model.autoSync).to.be.false;
    });

    it('Constructor true -> Instance null', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://',
        autoSync: true
      });
      var model = new Model();
      return expect(model.autoSync).to.be.ok;
    });

    it('Constructor true -> Instance true', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://',
        autoSync: true
      });
      var model = new Model({}, { autoSync: true });
      return expect(model.autoSync).to.be.ok;
    });

    it('Constructor true -> Instance false', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://',
        autoSync: true
      });
      var model = new Model({}, { autoSync: false });
      return expect(model.autoSync).to.be.false;
    });

    it('Constructor false -> Instance null', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://',
        autoSync: false
      });
      var model = new Model();
      return expect(model.autoSync).to.be.false;
    });

    it('Constructor false -> Instance true', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://',
        autoSync: false
      });
      var model = new Model({}, { autoSync: true });
      return expect(model.autoSync).to.be.ok;
    });

    it('Constructor false -> Instance false', function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://',
        autoSync: false
      });
      var model = new Model({}, { autoSync: false });
      return expect(model.autoSync).to.be.false;
    });

  });

});
