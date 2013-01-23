Backfire
========
Backfire is a set of Backbone bindings for [Firebase](http://www.firebase.com).
The bindings let you use a special Collection type that will automatically
synchronize all models contained within it to Firebase, without the need
to make explicit calls to save or sync.

Usage
-----
Include both firebase.js and backbone-firebase.js in your application.

    <script src="https://cdn.firebase.com/v0/firebase.js"></script>
    <script src="backbone-firebase.js"></script>

There are two primary ways to use the bindings:

### METHOD 1: Backbone.Firebase.Collection

You will have access to a new object, `Backbone.Firebase.Collection`. You
may extend this object, and must provide a URL or Firebase reference as the
`firebase` property. For example:

    var TodoList = Backbone.Firebase.Collection.extend({
      model: Todo,
      firebase: "https://<your-namespace>.firebaseio.com"
    });

Any models added to the collection, will be synchronized to the provided
Firebase. Any other clients using the Backbone binding will also receive
`add`, `remove` and `changed` events on the collection as appropriate.

**BE AWARE!** The important difference between using a regular collection and
a Firebase collection is that **you do not need to call any functions that will
affect _remote_ data**. If you call any of the `fetch`, `sync`, `save`, `create`
or `destroy` methods, **the library will throw an exception**.

You should add and remove your models to the collection as normal, and the
_remote_ data is instantly updated, and events on all your other clients will
also be immediately triggered!

Please see [todos.js](https://github.com/firebase/backfire/blob/master/todos.js)
for an example of how to use this special collection object.

### METHOD 2: Backbone.sync

The bindings also override `Backbone.sync` to use Firebase. You may consider
this option if you want to maintain an explicit seperation between _local_ and
_remote_ data.

This adapter works very similarly to the
[localStorage adapter](http://documentcloud.github.com/backbone/docs/backbone-localstorage.html)
used in the canonical Todos example. You simply provide a `firebase` property
in your Model or Collection, and that object will be persisted at that location.

For example:

    var TodoList = Backbone.Collection.extend({
      model: Todo,
      firebase: new Backbone.Firebase("https://<your-namespace>.firebaseio.com")
    });

will ensure that any calls to `fetch` or `sync` on the collection will update
the provided Firebase with the appropriate data. The same is true for the
`save` and `destroy` methods on a model.

Please see [todos-sync.js](https://github.com/firebase/backfire/blob/master/todos-sync.js)
for ana example of how to use this feature.

License
-------
[MIT](http://firebase.mit-license.org).
