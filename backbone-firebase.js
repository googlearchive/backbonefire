/**
 * Backbone Firebase Adapter
 * Based on the Backbone localStorage Adapter.
 */

(function() {

var _ = this._;
var Backbone = this.Backbone;

Backbone.Firebase = function(ref) {
  this._fbref = ref;
  this._children = [];
  if (typeof name == "string") {
    this._fbref = new Firebase(ref);
  }

  _.bindAll(this);
  this._fbref.on("child_added", this._childAdded);
  this._fbref.on("child_moved", this._childMoved);
  this._fbref.on("child_changed", this._childChanged);
  this._fbref.on("child_removed", this._childRemoved);
};

_.extend(Backbone.Firebase.prototype, {

  _childAdded: function(childSnap, prevChild) {
    this._children.push(childSnap.val());
  },
  _childMoved: function(childSnap, prevChild) {
    var model = childSnap.val();
    this._children.splice(index, 1);
    if (prevChild) {
      var item = _.find(this._children, function(child) {
        return child.id == prevChild
      });
      this._children.splice(this._children.indexOf(item) + 1, 0, model);
    } else {
      this._children.unshift(model);
    }
  },
  _childChanged: function(childSnap, prevChild) {
    var model = childSnap.val();
    var item = _.find(this._children, function(child) {
      return child.id == model.id
    });
    this._children[this._children.indexOf(item)] = model;
  },
  _childRemoved: function(oldChildSnap) {
    var model = oldChildSnap.val();
    this._children = _.reject(this._children, function(child) {
      return child.id == model.id
    });
  },

  create: function(model, cb) {
    if (!model.id) {
      model.id = this._fbref.push().name();
      model.set(model.idAttribute, model.id);
    }
    var val = model.toJSON();
    this._fbref.child(model.id).set(val, _.bind(function(success) {
      if (success) {
        cb(null, val);
      } else {
        cb("Could not create model " + model.id);
      }
    }, this));
  },

  read: function(model, cb) {
    if (!model.id) {
      _.defer(cb, "Invalid model ID provided to read");
      return;
    }
    var index = _.find(this._children, function(child) {
      return child.id == model.id
    });
    _.defer(cb, null, this._children[index]);
  },

  readAll: function(model, cb) {
    _.defer(cb, null, this._children);
  },

  update: function(model, cb) {
    var val = model.toJSON();
    console.log("called update with " + JSON.stringify(val));
    this._fbref.child(model.id).update(val, function(success) {
      if (success) {
        cb(null, val);
      } else {
        cb("Could not update model " + model.id, null);
      }
    });
  },

  delete: function(model, cb) {
    this._fbref.child(model.id).remove(function(success) {
      if (success) {
        cb(null, model);
      } else {
        cb("Could not delete model " + model.id);
      }
    });
  }
});


Backbone.Firebase.sync = function(method, model, options, error) {
  var store = model.firebase || model.collection.firebase;

  // Backwards compatibility with Backbone <= 0.3.3
  if (typeof options == 'function') {
    options = {
      success: options,
      error: error
    };
  }

  if (method == "read" && model.id == undefined) {
    method = "readAll";
  }

  store[method].apply(this, [model, function(err, val) {
    if (err) {
      options.error(model, err, options);
    } else {
      options.success(model, val, options);
    }
  }]);
};

Backbone.oldSync = Backbone.sync;

// Override 'Backbone.sync' to default to Firebase sync.
// the original 'Backbone.sync' is still available in 'Backbone.oldSync'
Backbone.sync = function(method, model, options, error) {
  var syncMethod = Backbone.oldSync;
  if (model.firebase || (model.collection && model.collection.firebase)) {
    syncMethod = Backbone.Firebase.sync;
  }
	return syncMethod.apply(this, [method, model, options, error]);
};

})();
