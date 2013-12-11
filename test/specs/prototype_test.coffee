describe 'Backbone.Firebase', ->

    beforeEach ->
        @Firebase = new Backbone.Firebase(new Firebase)

    it 'should exist', ->
        expect(@Firebase)
            .to.be.ok

    it 'should create a Firebase reference', ->
        expect(@Firebase._fbref)
            .to.be.an.instanceOf Firebase

    describe '#_childAdded()', ->

        it 'should be a method', ->
            expect(@Firebase)
                .to.have.property('_childAdded')
                .that.is.a 'function'
