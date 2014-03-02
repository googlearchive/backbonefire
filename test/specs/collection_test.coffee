describe 'Backbone.Firebase.Collection', ->

    beforeEach ->
        Col = Backbone.Firebase.Collection.extend model: new Backbone.Model, firebase: new Firebase
        @fbCol = new Col()

    it 'should exist', ->
        expect(@fbCol)
            .to.be.ok

    describe '#_parseModels()', ->

        it 'should be a method', ->
            expect(@fbCol)
                .to.have.property('_parseModels')
                .that.is.a 'function'

        it 'should return an empty array when called without parameters', ->
            result = @fbCol._parseModels()
            expect(result).to.eql([])
    