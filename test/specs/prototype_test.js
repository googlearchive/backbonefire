describe('Backbone.Firebase', function() {

  it('should exist', function() {
    return expect(Backbone.Firebase).to.be.ok;
  });

  describe('#_readOnce', function() {

    var ref;
    beforeEach(function() {
      ref = new Firebase('Mock://');
    });

    // To read a value one-time, once() will be called on a Firebase reference.
    it('should call Firebase.once', function() {
      Backbone.Firebase._readOnce(ref, function() {});
      ref.flush();
      expect(ref.once.calledOnce).to.be.ok;
    });

    // _readOnce calls once() which will return a snapshot from the
    // callback function. We need to make sure we're properly returning
    // that from the callback function parameter.
    it('should return a snapshot from a callback function', function() {
      var snapExpected;
      Backbone.Firebase._readOnce(ref, function(snap) {
        snapExpected = snap;
      });
      ref.flush();
      expect(snapExpected).to.be.defined;
      expect(snapExpected.val).to.be.defined;
    });

  });

  describe('#_setToFirebase', function() {

    var ref;
    beforeEach(function() {
      ref = new Firebase('Mock://');
    });

    it('should call Firebase.set', function() {
      Backbone.Firebase._setToFirebase(ref, {}, function() {});
      ref.flush();
      expect(ref.set.calledOnce).to.be.ok;
    });

    it('should return a response from a callback function', function() {
      var responseExpected;
      Backbone.Firebase._setToFirebase(ref, { id: '1'}, function(err) {
        responseExpected = err;
      });
      ref.flush();
      expect(responseExpected).to.be.defined;
    });

  });

  describe('#_updateToFirebase', function() {

    var ref;
    beforeEach(function() {
      ref = new Firebase('Mock://');
    });

    it('should call Firebase.update', function() {
      Backbone.Firebase._updateToFirebase(ref, {}, function() {});
      ref.flush();
      expect(ref.update.calledOnce).to.be.ok;
    });

    it('should return a response from a callback function', function() {
      var responseExpected;
      Backbone.Firebase._updateToFirebase(ref, { id: '1'}, function(err) {
        responseExpected = err;
      });
      ref.flush();
      expect(responseExpected).to.be.defined;
    });

  });

  describe('#_onCompleteCheck', function() {

    var item;
    beforeEach(function() {
      item = { id: '1' };
    });

    //_onCompleteCheck = function(err, item, options)

    it('should call options.error if an error exists', function() {
      var spy = sinon.spy();
      options = {
        error: spy
      };
      Backbone.Firebase._onCompleteCheck(new Error(), item, options);
      expect(spy.calledOnce).to.be.ok;
    });

    it('should call options.success if no error exists', function() {
      var spy = sinon.spy();
      options = {
        success: spy
      };
      Backbone.Firebase._onCompleteCheck(null, item, options);
      expect(spy.calledOnce).to.be.ok;
    });

    it('should return if no options are present', function() {
      Backbone.Firebase._onCompleteCheck(null, item, null);
    });

  });

  describe('#sync', function() {

    //   Backbone.Firebase.sync = function(method, model, options)

    var model;
    beforeEach(function() {
      var Model = Backbone.Firebase.Model.extend({
        url: 'Mock://',
        autoSync: false
      });
      model = new Model();
    });

    describe('#sync("read", ...)', function() {

      // sync('read', model, null)
      // This should call _readOnce with proxies to Firebase.once()
      it('should call Backbone.Firebase._readOnce', function() {
        sinon.spy(Backbone.Firebase, '_readOnce');
        Backbone.Firebase.sync('read', model, null);
        expect(Backbone.Firebase._readOnce.calledOnce).to.be.ok;
        Backbone.Firebase._readOnce.restore();
      });

      // sync('read', model, { success: Function })
      // This should call _readOnce and test for a success callback
      it('should call Backbone.Firebase._readOnce with a success option', function() {
        var responseExpected;
        sinon.spy(Backbone.Firebase, '_readOnce');
        Backbone.Firebase.sync('read', model, {
          success: function(resp) {
            responseExpected = resp;
          }
        });
        model.firebase.flush();
        expect(responseExpected).to.be.defined;
        Backbone.Firebase._readOnce.restore();
      });

      // - one time read with error?

    });

    describe('#sync("create", ...)', function() {

      // create
      // - set to firebase
      it('should call Backbone.Firebase._setToFirebase', function() {
        sinon.spy(Backbone.Firebase, '_setToFirebase');
        Backbone.Firebase.sync('create', model, null);
        expect(Backbone.Firebase._setToFirebase.calledOnce).to.be.ok;
        Backbone.Firebase._setToFirebase.restore();
      });

    });

    describe('#sync("update", ...)', function() {
      // update
      // - update to firebase
      it('should call Backbone.Firebase._updateToFirebase', function() {
        sinon.spy(Backbone.Firebase, '_updateToFirebase');
        Backbone.Firebase.sync('update', model, null);
        expect(Backbone.Firebase._updateToFirebase.calledOnce).to.be.ok;
        Backbone.Firebase._updateToFirebase.restore();
      });
    });

  });

});