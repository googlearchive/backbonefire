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

  it('should call url fn when urlRoot and an id is provided', function() {
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

  // it('should build a url when urlRoot and an id is provided', function() {
  //   var Model = Backbone.Firebase.Model.extend({
  //     urlRoot: 'Mock://'
  //   });
  // 
  //   var model = new Model({
  //     id: 1
  //   });
  //
  //   // wat?
  //   console.log('Model URL ->', model.url());
  //
  //   return expect(model.url()).should.equal('Mock://1');
  // });

  it('should update model', function() {
    // TODO: Test _updateModel
  });

  it('should set changed attributes to null', function() {
    // TODO: Test _updateModel

  });

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
      name: 1,
      val: {
        firstName: 'David'
      }
    });

    model._unsetAttributes(mockSnap);

    expect(model.get('firstName')).to.be.ok;
    expect(model.get('lastName')).to.be.undefined;

  });

  it('should set local', function() {
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://'
    });
    var model = new Model();
    var mockSnap = new MockSnap();
    sinon.spy(model, '_unsetAttributes');

    model._setLocal(mockSnap);

    expect(model._unsetAttributes.calledOnce).to.be.ok;
    model._unsetAttributes.restore();
  });

  it('should set id', function() {
    // TODO: Test _setId
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://'
    });
    var model = new Model();
    var mockSnap = new MockSnap();
    sinon.spy(mockSnap, 'name');
    model._setId(mockSnap);

    expect(mockSnap.name.calledOnce).to.be.ok;

    mockSnap.name.restore();
  });

  it('should set id to its value', function() {
    // TODO: Test _setId
    var Model = Backbone.Firebase.Model.extend({
      url: 'Mock://'
    });
    var model = new Model();
    var mockSnap = new MockSnap({
      name: 1
    });
    model._setId(mockSnap);

    model.get('id').should.equal(mockSnap.name());
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

  describe('autoSync:true', function() {

    var Model = null;

    beforeEach(function() {
      Model = Backbone.Firebase.Model.extend({
        url: 'Mock://'
      });
    });

    describe('ignored methods', function() {

      beforeEach(function() {
        sinon.spy(console, 'warn');
      });

      afterEach(function() {
        console.warn.restore();
      });

      it('should do nothing when save is called', function() {
        var model = new Model();
        model.save();
        return expect(console.warn.calledOnce).to.be.ok;
      });

      it('should do nothing when fetch is called', function() {
        var model = new Model();
        model.fetch();
        return expect(console.warn.calledOnce).to.be.ok;
      });

      it('should do nothing when sync is called', function() {
        var model = new Model();
        model.sync();
        return expect(console.warn.calledOnce).to.be.ok;
      });

    });

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

  describe('autoSync:false', function() {

    it('should silently set update values locally', function() {
      // TODO: Test _listenLocalChange to silently update
    });

  });

});