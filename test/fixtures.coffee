class window.Firebase
    constructor: ->
        @name = sinon.stub().returns(@)
        @set = sinon.stub().returns(@)
        @child = sinon.stub().returns(@)
        @ref = sinon.stub().returns(@)
        @push = sinon.stub().returns(@)
        @update = sinon.stub().returns(@)
        @auth = sinon.stub().returns(@)
        @on = sinon.stub().returns(@)
        @off = sinon.stub().returns(@)
        @once = sinon.stub().returns(@)
