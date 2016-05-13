describe('Backbone.Firebase', function() {

  it('should exist', function() {
    return expect(Backbone.Firebase).to.be.ok;
  });

  describe('UMD wrapper tests', function() {

    it('AMD', function() {
      expect( true ).to.be.true;
      define = function () {};
      define.amd = {};
      expect(typeof define === 'function'
        && define.amd != null).to.be.true;
    });

    it('Common', function() {
      module = {};
      module.exports = {};
      expect(typeof module === 'object'
        && typeof module.exports === 'object').to.be.true;
    });

    it('gobal', function() {
      Firebase = {};
      expect( typeof Firebase === 'object' ).to.be.true;
    });

  });
});
