describe 'Backbone.Firebase.Collection', ->

    beforeEach ->
        Col = Backbone.Firebase.Collection.extend model: new Backbone.Model, firebase: new Firebase
        @fbCol = new Col()

    it 'should exist', ->
        expect(@fbCol)
            .to.be.ok

    describe '#reset()', ->

        it 'should be a method', ->
            expect(@fbCol)
                .to.have.property('reset')
                .that.is.a 'function'

        it 'should not throw an error when called without parameters', ->
            expect( =>
                @fbCol.reset()
            ).to.not.throw()
    