/**
 * Backbone Firebase Adapter.
 */

(function() {

var _ = this._;
var Backbone = this.Backbone;

Backbone.Firebase = function(ref) {
  this._fbref = ref;
  this._children = [];
  if (typeof ref == "string") {
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
    var model = childSnap.val();
    model.id = childSnap.name();
    if (prevChild) {
      var item = _.find(this._children, function(child) {
        return child.id == prevChild
      });
      this._children.splice(this._children.indexOf(item) + 1, 0, model);
    } else {
      this._children.unshift(model);
    }
  },
  _childMoved: function(childSnap, prevChild) {
    var model = childSnap.val();
    this._children = _.reject(this._children, function(child) {
      return child.id == model.id;
    });
    this._childAdded(childSnap, prevChild);
  },
  _childChanged: function(childSnap, prevChild) {
    var model = childSnap.val();
    model.id = childSnap.name();
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
    }
    var val = model.toJSON();
    this._fbref.child(model.id).set(val, _.bind(function(err) {
      if (!err) {
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
    this._fbref.child(model.id).update(val, function(err) {
      if (!err) {
        cb(null, val);
      } else {
        cb("Could not update model " + model.id, null);
      }
    });
  },

  'delete': function(model, cb) {
    this._fbref.child(model.id).remove(function(err) {
      if (!err) {
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

// Custom Firebase Collection.
Backbone.Firebase.Collection = Backbone.Collection.extend({
  sync: function() {
    this._log("Sync called on a Firebase collection, ignoring.");
  },

  fetch: function() {
    this._log("Fetch called on a Firebase collection, ignoring.");
  },

  constructor: function(models, options) {
    if (options && options.firebase) {
      this.firebase = options.firebase;
    }
    switch (typeof this.firebase) {
      case "object": break;
      case "string": this.firebase = new Firebase(this.firebase); break;
      default: throw new Error("Invalid firebase reference created");
    }

    // Apply parent constructor (this will also call initialize).
    Backbone.Collection.apply(this, arguments);
    
    // Add handlers for remote events.
    this.firebase.on("child_added", this._childAdded.bind(this));
    this.firebase.on("child_moved", this._childMoved.bind(this));
    this.firebase.on("child_changed", this._childChanged.bind(this));
    this.firebase.on("child_removed", this._childRemoved.bind(this));

    // Add handlers for all models in this collection, and any future ones
    // that may be added.
    function _updateModel(model, options) {
      this.firebase.child(model.id).update(model.toJSON());
    }
    function _unUpdateModel(model) {
      model.off("change", _updateModel, this);
    }

    for (var i = 0; i < this.models.length; i++) {
      this.models[i].on("change", _updateModel, this);
      this.models[i].once("remove", _unUpdateModel, this);
    }
    this.on("add", function(model) {
      model.on("change", _updateModel, this);
      model.once("remove", _unUpdateModel, this);
    }, this);
  },

  comparator: function(model) {
    return model.id;
  },

  add: function(models, options) {
    var parsed = this._parseModels(models);
    for (var i = 0; i < parsed.length; i++) {
      var model = parsed[i];
      this.firebase.child(model.id).set(model);
    }
    // TODO: Implement options.success
  },

  remove: function(models, options) {
    var parsed = this._parseModels(models);
    for (var i = 0; i < parsed.length; i++) {
      var model = parsed[i];
      this.firebase.child(model.id).set(null);
    }
    // TODO: Implement options.success
  },

  create: function(model, options) {
    this._log("Create called, aliasing to add. Consider using Collection.add!");
    options = options ? _.clone(options) : {};
    if (options.wait) {
      this._log("Wait option provided to create, ignoring.");
    }
    model = Backbone.Collection.prototype._prepareModel.apply(
      this, [model, options]
    );
    if (!model) {
      return false;
    }
    this.add([model], options);
    return model;
  },

  _log: function(msg) {
    if (console && console.log) {
      console.log(msg);
    }
  },

  // TODO: Options will be ignored for add & remove, document this!
  _parseModels: function(models) {
    var ret = [];
    models = _.isArray(models) ? models.slice() : [models];
    for (var i = 0; i < models.length; i++) {
      var model = models[i];
      if (!model.id) {
        model.id = this.firebase.push().name();
      }
      if (model.toJSON && typeof model.toJSON == "function") {
        model = model.toJSON();
      }
      ret.push(model);
    }
    return ret;
  },

  _childAdded: function(snap) {
    Backbone.Collection.prototype.add.apply(this, [snap.val()]);
  },

  _childMoved: function(snap) {
    // TODO: Investigate: can this occur without the ID changing?
    this._log("_childMoved called with " + snap.val());
  },

  _childChanged: function(snap) {
    var model = snap.val();
    var item = _.find(this.models, function(child) {
      return child.id == model.id
    });
    if (!item) {
      // TODO: Investigate: what is the right way to handle this case?
      throw new Error("Could not find model with ID " + model.id);
    }
    item.set(model);
  },

  _childRemoved: function(snap) {
    Backbone.Collection.prototype.remove.apply(this, [snap.val()]);
  }
});

})();

