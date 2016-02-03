# BackboneFire

[![Build Status](https://travis-ci.org/firebase/backbonefire.svg?branch=master)](https://travis-ci.org/firebase/backbonefire)
[![Coverage Status](https://img.shields.io/coveralls/firebase/backbonefire.svg?branch=master&style=flat)](https://coveralls.io/r/firebase/backbonefire?branch=master)
[![Version](https://badge.fury.io/gh/firebase%2Fbackbonefire.svg?branch=master)](http://badge.fury.io/gh/firebase%2Fbackbonefire)

BackboneFire is the officially supported [Backbone](http://backbonejs.org) binding for Firebasem data. The bindings let you use special model and collection types that allow for synchronizing data with [Firebase](http://www.firebase.com/?utm_medium=web&utm_source=backbonefire).

## Live Demo

Play around with our [realtime Todo App demo](https://backbonefire.firebaseapp.com/). This Todo App is a simple port of the TodoMVC app using BackboneFire.

## Basic Usage
Using BackboneFire collections and models is very similar to the regular ones in Backbone. To setup with BackboneFire use `Backbone.Firebase` rather than just `Backbone`.

**Note: A `Backbone.Firebase.Model` should not be used with a `Backbone.Firebase.Collection`. Use a regular
`Backbone.Model` with a `Backbone.Firebase.Collection`.**

```javascript
// This is a plain old Backbone Model
var Todo = Backbone.Model.extend({
  defaults: {
    completed: false,
    title: 'New todo'
  }
});

// This is a Firebase Collection that syncs data from this url
var Todos = Backbone.Firebase.Collection.extend({
  url: 'https://<your-firebase>.firebaseio.com/todos',
  model: Todo
});
```

## Downloading BackboneFire

To get started include Firebase and BackboneFire after the usual Backbone dependencies (jQuery, Underscore, and Backbone).

```html
<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

<!-- Underscore -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore.js"></script>

<!-- Backbone -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.0.3/firebase.js"></script>

<!-- BackboneFire -->
<script src="https://cdn.firebase.com/libs/backbonefire/0.5.1/backbonefire.js"></script>
```

Use the URL above to download both the minified and non-minified versions of BackboneFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/backbonefire/releases).
[Firebase](https://www.firebase.com/docs/web/quickstart.html?utm_medium=web&utm_source=backbonefire) and
[Backbone](http://backbonejs.org/) can be downloaded directly from their respective websites.

You can also install BackboneFire via Bower and its dependencies will be downloaded automatically:

```bash
$ bower install backbonefire --save
```

Once you've included BackboneFire and its dependencies into your project, you will have access to the `Backbone.Firebase.Collection`, and `Backbone.Firebase.Model` objects.


## Getting Started with Firebase

BackboneFire requires the Firebase database in order to sync data. You can
[sign up here](https://www.firebase.com/signup/?utm_medium=web&utm_source=backbonefire) for a free
account.

## autoSync

As of the 0.5 release there are two ways to sync `Models` and `Collections`. By specifying the property `autoSync` to either true of false, you can control whether the component is synced in realtime. The `autoSync` property is true by default.

#### autoSync: true

```javascript
var RealtimeList = Backbone.Firebase.Collection.extend({
  url: 'https://<your-firebase>.firebaseio.com/todos',
  autoSync: true // this is true by default
})
// this collection will immediately begin syncing data
// no call to fetch is required, and any calls to fetch will be ignored
var realtimeList = new RealtimeList();

realtimeList.on('sync', function(collection) {
  console.log('collection is loaded', collection);
});
```

#### autoSync: false

```javascript
// This collection will remain empty until fetch is called
var OnetimeList = Backbone.Firebase.Collection.extend({
  url: 'https://<your-firebase>.firebaseio.com/todos',
  autoSync: false
})
var onetimeList = new OnetimeList();

onetimeList.on('sync', function(collection) {
  console.log('collection is loaded', collection);
});

onetimeList.fetch();
```

## Backbone.Firebase.Collection

This is a special collection object that will automatically synchronize its contents with your Firebase database.
You may extend this object, and must provide a Firebase database URL or a Firebase database reference as the
`url` property.

Each model in the collection will have its own `firebase` property that is its reference in Firebase.

For a simple example of using `Backbone.Firebase.Collection` see [todos.js]().

```javascript
var TodoList = Backbone.Firebase.Collection.extend({
  model: Todo,
  url: 'https://<your-firebase>.firebaseio.com/todos'
});
```

You may also apply an `orderByChild` or some other
[query](https://www.firebase.com/docs/web/guide/retrieving-data.html#section-queries) on a
reference and pass it in:

### Queries

```javascript
var TodoList = Backbone.Firebase.Collection.extend({
  url: new Firebase('https://<your-firebase>.firebaseio.com/todos').orderByChild('importance')
});
```

### url as a function

The `url` property can be set with a function. This function must return a Firebase database ref or a url.

```javascript
var TodoList = Backbone.Firebase.Collection.extend({
  url: function() {
    return new Firebase(...);
  }
});
```


### initialize function

Any models added to the collection will be synchronized to the provided Firebase database. Any other clients
using the Backbone binding will also receive `add`, `remove` and `changed` events on the collection
as appropriate.

You should add and remove your models to the collection as you normally would, (via `add()` and
`remove()`) and _remote_ data will be instantly updated. Subsequently, the same events will fire on
all your other clients immediately.

### add(model)

Adds a new model to the collection. If autoSync set to true, the newly added model will be synchronized to your Firebase database, triggering an
`add` and `sync` event both locally and on all other clients. If autoSync is set to false, the `add` event will only be raised locally.

```javascript
todoList.add({
  subject: 'Make more coffee',
  importance: 1
});

todoList.on('all', function(event) {
  // if autoSync is true this will log add and sync
  // if autoSync is false this will only log add
  console.log(event);
});
```

### remove(model)

Removes a model from the collection. If autoSync is set to true this model will also be removed from your Firebase database, triggering a `remove` event both locally and on all other clients. If autoSync is set to false, this model will only trigger a local `remove` event.

```javascript
todoList.remove(someModel);

todoList.on('all', function(event) {
  // if autoSync is true this will log remove and sync
  // if autoSync is false this will only log remove
  console.log(event);
});
```

### create(value)

Creates and adds a new model to the collection. The newly created model is returned, along with an
`id` property (uniquely generated by the Firebase client library).

```javascript
var model = todoList.create({bar: "foo"});
todoList.get(model.id);

todoList.on('all', function(event) {
  // will log add and sync
  console.log(event);
});
```

## Backbone.Firebase.Model

This is a special model object that will automatically synchronize its contents with your Firebase database. You
may extend this object, and must provide a Firebase database URL or reference as the `url`
property.

```javascript
var Todo = Backbone.Firebase.Model.extend({
  url: "https://<your-firebase>.firebaseio.com/mytodo"
});
```
You may apply query methods as with `Backbone.Firebase.Collection`.

### urlRoot
The `urlRoot` property can be used to dynamically set the Firebase database reference from the model's id.

```javascript
var Todo = Backbone.Firebase.Model.extend({
  urlRoot: 'https://<your-firebase>.firebaseio.com/todos'
});

// The url for this todo will be https://<your-firebase>.firebaseio.com/todos/1
var todo = new Todo({
  id: 1
});
```

You do not need to call any functions that will affect _remote_ data when `autoSync` is enabled. Calling `fetch()` will simply fire the `sync` event.

If `autoSync` is enabled, you should modify your model as you normally would, (via `set()` and `destroy()`) and _remote_ data
will be instantly updated.

#### autoSync: true

```javascript
var RealtimeModel = Backbone.Firebase.Model.extend({
  url: 'https://<your-firebase>.firebaseio.com/mytodo',
  autoSync: true // true by default
});

var realtimeModel = new RealtimeModel();

realtimeModel.on('sync', function(model) {
  console.log('model loaded', model);
});

// calling .set() will sync the changes to your database
// this will fire the sync, change, and change:name events
realtimeModel.set('name', 'Bob');
```

#### autoSync: false

```javascript
var RealtimeModel = Backbone.Firebase.Model.extend({
  url: 'https://<your-firebase>.firebaseio.com/mytodo',
  autoSync: false
});

var realtimeModel = new RealtimeModel();

realtimeModel.on('sync', function(model) {
  console.log('model loaded', model);
});

// this will fire off the sync event
realtimeModel.fetch();

// calling .save() will sync the changes to your database
// this will fire the sync, change, and change:name events
realtimeModel.save('name', 'Bob');

```

### set(value)

Sets the contents of the model and updates it in your database.

```javascript
MyTodo.set({foo: "bar"}); // Model is instantly updated in your database (and other clients)
```

### destroy()

Removes the model locally, and from Firebase.

```javascript
MyTodo.destroy(); // Model is instantly removed from your database (and other clients)
```

## Contributing

If you'd like to contribute to BackboneFire, you'll need to run the following commands to get your
environment set up:

```bash
$ git clone https://github.com/firebase/backbonefire.git
$ cd backbonefire           # go to the backbonefire directory
$ npm install -g grunt-cli  # globally install grunt task runner
$ npm install -g bower      # globally install Bower package manager
$ npm install               # install local npm build / test dependencies
$ bower install             # install local JavaScript dependencies
$ grunt watch               # watch for source file changes
```

`grunt watch` will watch for changes to `src/backbonefire.js` and lint and minify the source file when a
change occurs. The output files - `backbonefire.js` and `backbonefire.min.js` - are written to the `/dist/`
directory.

You can run the test suite via the command line using `grunt test`.
