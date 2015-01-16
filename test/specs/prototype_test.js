describe('Backbone.Firebase', function() {

  it('should exist', function() {
    return expect(Backbone.Firebase).to.be.ok;
  });

  describe('#_promiseEvent', function() {
    var syncPromise;
    var clock;
    beforeEach(function() {
      syncPromise = {
        resolve: true
      };
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it('should resolve with a success', function() {
      var successCalled = false;
      syncPromise.success = true;
      Backbone.Firebase._promiseEvent({
        syncPromise: syncPromise,
        success: function() {
          successCalled = true;
        },
        context: this
      });
      clock.tick(100);
      expect(successCalled).to.be.ok;
    });

    it('should resolve with an error', function() {
      var errorCalled = false;
      syncPromise.err = new Error('Error!');
      Backbone.Firebase._promiseEvent({
        syncPromise: syncPromise,
        error: function() {
          errorCalled = true;
        },
        context: this
      });
      clock.tick(1000);
      expect(errorCalled).to.be.ok;
    });

    it('should resolve with a complete', function() {
      var completeCalled = false;
      syncPromise.success = true;
      Backbone.Firebase._promiseEvent({
        syncPromise: syncPromise,
        success: function() {

        },
        complete: function() {
          completeCalled = true;
        },
        context: this
      });
      clock.tick(100);
      expect(completeCalled).to.be.ok;
    });

  });

  describe("#_isPrimitive", function() {

    it('should return false for null', function() {
      var value = Backbone.Firebase._isPrimitive(null);
      expect(value).to.be.false;
    });

    it('should return false for object', function() {
      var value = Backbone.Firebase._isPrimitive({});
      expect(value).to.be.false;
    });

    it('should return true for string', function() {
      var value = Backbone.Firebase._isPrimitive('hello');
      expect(value).to.be.true;
    });

    it('should return true for int', function() {
      var value = Backbone.Firebase._isPrimitive(1);
      expect(value).to.be.true;
    });

    it('should return true for bool', function() {
      var value = Backbone.Firebase._isPrimitive(true);
      expect(value).to.be.true;
    });

  });

  describe('#_checkId', function() {

    it('should add an id to a new model', function() {

      var mockSnap = new MockSnap({
        name: '1',
        val: {
          firstname: 'David'
        }
      });

      var model = Backbone.Firebase._checkId(mockSnap, 'id');

      expect(model.id).to.be.ok;
      model.id.should.equal(mockSnap.name());

    });

    it('should throw an error if the model is not an object', function() {
      var mockSnap = new MockSnap({
        name: '1',
        val: 'hello'
      });
      try {
        var model = Backbone.Firebase._checkId(1, 'id');
      } catch (err) {
        expect(err).to.be.ok
      }

    });

    it('should create an object with an id for null values', function() {
      var mockSnap = new MockSnap({
        name: '1',
        val: null
      });
      var model = Backbone.Firebase._checkId(mockSnap, 'id');
      expect(model.id).to.be.ok;
    });

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

    describe('#_setWithCheck', function() {

      it('should call Backbone.Firebase._setToFirebase', function() {
        sinon.spy(Backbone.Firebase, '_setToFirebase');
        Backbone.Firebase._setWithCheck(model.firebase, null, null);
        expect(Backbone.Firebase._setToFirebase.calledOnce).to.be.ok;
        Backbone.Firebase._setToFirebase.restore();
      });

      // test that _onCompleteCheck is called
      it('should call Backbone.Firebase._onCompleteCheck', function() {
        sinon.spy(Backbone.Firebase, '_onCompleteCheck');
        Backbone.Firebase._setWithCheck(model.firebase, null, null);
        model.firebase.flush();
        expect(Backbone.Firebase._onCompleteCheck.calledOnce).to.be.ok;
        Backbone.Firebase._onCompleteCheck.restore();
      });

    });


    describe('#sync("create", ...)', function() {

      it('should call Backbone.Firebase._onCompleteCheck', function() {
        sinon.spy(Backbone.Firebase, '_onCompleteCheck');
        Backbone.Firebase.sync('create', model, null);
        model.firebase.flush();
        expect(Backbone.Firebase._onCompleteCheck.calledOnce).to.be.ok;
        Backbone.Firebase._onCompleteCheck.restore();
      });

      it('should call Backbone.Firebase._setWithCheck', function() {
        sinon.spy(Backbone.Firebase, '_setWithCheck');
        Backbone.Firebase.sync('create', model, null);
        model.firebase.flush();
        expect(Backbone.Firebase._setWithCheck.calledOnce).to.be.ok;
        Backbone.Firebase._setWithCheck.restore();
      });

    });

    describe('#sync("update", ...)', function() {
      // update

      // test that _onCompleteCheck is called
      it('should call Backbone.Firebase._onCompleteCheck', function() {
        sinon.spy(Backbone.Firebase, '_onCompleteCheck');
        Backbone.Firebase.sync('update', model, null);
        model.firebase.flush();
        expect(Backbone.Firebase._onCompleteCheck.calledOnce).to.be.ok;
        Backbone.Firebase._onCompleteCheck.restore();
      });

      it('should call Backbone.Firebase._updateWithCheck', function() {
        sinon.spy(Backbone.Firebase, '_updateWithCheck');
        Backbone.Firebase.sync('update', model, null);
        model.firebase.flush();
        expect(Backbone.Firebase._updateWithCheck.calledOnce).to.be.ok;
        Backbone.Firebase._updateWithCheck.restore();
      });

    });

  });

  describe('#_throwError', function() {

    it('should throw and catch an error', function() {
      try {
        Backbone.Firebase._throwError('Error');
      } catch (err) {
        expect(err).to.be.defined;
      }
    });

  });

  describe('#_determineRef', function() {

    // return new Firebase if string
    it('should create a Firebase ref if a string is provided', function() {
      sinon.spy(window, 'Firebase');
      Backbone.Firebase._determineRef('Mock://');
      expect(Firebase.calledOnce).to.be.ok;
      window.Firebase.restore();
    });

    // return object if a ref
    it('should return a Firebase ref if a ref is provided', function() {
      var paramRef = new Firebase('Mock://');
      var returnedRef = Backbone.Firebase._determineRef(paramRef);
      assert(typeof(returnedRef) === 'object');
    });

    // throw error if not object or string
    it('should throw an error if neither an object or string is provided', function() {
      try {
        Backbone.Firebase._determineRef(false);
      } catch (error) {
        assert(error.message === 'Invalid type passed to url property');
      }
    });

  });

});
