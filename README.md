# BackFire

[![Build Status](https://travis-ci.org/firebase/backfire.svg?branch=master)](https://travis-ci.org/firebase/backfire)
[![Version](https://badge.fury.io/gh/firebase%2Fbackfire.svg?branch=master)](http://badge.fury.io/gh/firebase%2Fbackfire)

BackFire is the officially supported [Backbone](http://backbonejs.org) binding for Firebase. The bindings let you use special model and collection types that allow for synchronizing data with [Firebase](http://www.firebase.com/?utm_medium=web&utm_source=backfire).

## Live Demo

<<<<<<< HEAD
Play around with our [realtime Todo App demo](https://backbonefire.firebaseapp.com)
which was created using BackFire.
=======
Play around with our [realtime Todo App demo](https://backbonefire.firebaseapp.com/). This Todo App is a simple port of the TodoMVC app using Backfire.

## Basic Usage

```javascript
var Todo = Backbone.Model.extend({
  defaults: {
    completed: false,
    title: 'New todo'
  }
});
var Todos = Backbone.Firebase.Collection.extend({
  url: 'https://<your-firebase>.firebaseio.com/todos',
  model: Todo
});
```
>>>>>>> 0.5-release


## Downloading BackFire

To get started include Firebase and Backfire after the usual Backbone dependencies (jQuery, Underscore, and Backbone).

```html
<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

<!-- Underscore -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore.js"></script>

<!-- Backbone -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.0.3/firebase.js"></script>

<!-- BackFire -->
<<<<<<< HEAD
<script src="https://cdn.firebase.com/libs/backfire/0.4.0/backfire.min.js"></script>
=======
<script src="https://cdn.firebase.com/libs/backfire/0.5.0/backfire.js"></script>
>>>>>>> 0.5-release
```

Use the URL above to download both the minified and non-minified versions of BackFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/backfire/releases).
[Firebase](https://www.firebase.com/docs/web/quickstart.html?utm_medium=web&utm_source=backfire) and
[Backbone](http://backbonejs.org/) can be downloaded directly from their respective websites.

You can also install BackFire via Bower and its dependencies will be downloaded automatically:

```bash
$ bower install backfire --save
```

Once you've included BackFire and its dependencies into your project, you will have access to the `Backbone.Firebase.Collection`, and `Backbone.Firebase.Model` objects.


## Getting Started with Firebase

BackFire requires Firebase in order to sync data. You can
[sign up here](https://www.firebase.com/signup/?utm_medium=web&utm_source=backfire) for a free
account.

## Backbone.Firebase.Collection

This is a special collection object that will automatically synchronize its contents with Firebase.
You may extend this object, and must provide a Firebase URL or a Firebase reference as the
`firebase` property.

Each model in the collection will be treated as a `Backbone.Firebase.Model` (see below).

Please see [todos.js](https://github.com/firebase/backfire/blob/gh-pages/examples/todos/todos.js)
for an example of how to use this special collection object.

```javascript
var TodoList = Backbone.Firebase.Collection.extend({
  model: Todo,
  firebase: "https://<your-firebase>.firebaseio.com"
});
```

You may also apply a `limit` or some other
[query](https://www.firebase.com/docs/web/guide/retrieving-data.html#section-queries) on a
reference and pass it in:

```javascript
var Messages = Backbone.Firebase.Collection.extend({
  firebase: new Firebase("https://<your-firebase>.firebaseio.com").limit(10)
});
```
Any models added to the collection will be synchronized to the provided Firebase. Any other clients
using the Backbone binding will also receive `add`, `remove` and `changed` events on the collection
as appropriate.

**BE AWARE!** You do not need to call any functions that will affect _remote_ data. If you call
`fetch()` or `sync()` on the collection, **the library will ignore it silently**.

```javascript
Messages.fetch(); // DOES NOTHING
Messages.sync();  // DOES NOTHING
```

You should add and remove your models to the collection as you normally would, (via `add()` and
`remove()`) and _remote_ data will be instantly updated. Subsequently, the same events will fire on
all your other clients immediately.

### add(model)

Adds a new model to the collection. This model will be synchronized to Firebase, triggering an
`add` event both locally and on all other clients.

```javascript
Messages.add({
  subject: "Hello",
  time: new Date().getTime()
});
```

### remove(model)

Removes a model from the collection. This model will also be removed from Firebase, triggering a
`remove` event both locally and on all other clients.

```javascript
Messages.remove(someModel);
```

### create(value)

Creates and adds a new model to the collection. The newly created model is returned, along with an
`id` property (uniquely generated by Firebase).

```javascript
var model = Messages.create({bar: "foo"});
Messages.get(model.id);
```

## Backbone.Firebase.Model

This is a special model object that will automatically synchronize its contents with Firebase. You
may extend this object, and must provide a Firebase URL or a Firebase reference as the `firebase`
property.

```javascript
var MyTodo = Backbone.Firebase.Model.extend({
  firebase: "https://<your-firebase>.firebaseio.com/mytodo"
});
```
You may apply limits as with `Backbone.Firebase.Collection`.

**BE AWARE!** You do not need to call any functions that will affect _remote_ data. If you call
`save()`, `sync()` or `fetch()` on the model, **the library will ignore it silently**.

```javascript
MyTodo.save();  // DOES NOTHING
MyTodo.sync();  // DOES NOTHING
MyTodo.fetch(); // DOES NOTHING
```

You should modify your model as you normally would, (via `set()` and `destroy()`) and _remote_ data
will be instantly updated.

### set(value)

Sets the contents of the model and updates it in Firebase.

```javascript
MyTodo.set({foo: "bar"}); // Model is instantly updated in Firebase (and other clients)
```

### destroy()

Removes the model locally, and from Firebase.

```javascript
MyTodo.destroy(); // Model is instantly removed from Firebase (and other clients)
```

## Contributing

If you'd like to contribute to BackFire, you'll need to run the following commands to get your
environment set up:

```bash
$ git clone https://github.com/firebase/backfire.git
$ cd backfire               # go to the backfire directory
$ npm install -g grunt-cli  # globally install grunt task runner
$ npm install -g bower      # globally install Bower package manager
$ npm install               # install local npm build / test dependencies
$ bower install             # install local JavaScript dependencies
$ grunt watch               # watch for source file changes
```

`grunt watch` will watch for changes to `src/backfire.js` and lint and minify the source file when a
change occurs. The output files - `backfire.js` and `backfire.min.js` - are written to the `/dist/`
directory.

You can run the test suite via the command line using `grunt test`.
