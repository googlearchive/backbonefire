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

  this._fbref.on("child_added", this._childAdded, this);
  this._fbref.on("child_moved", this._childMoved, this);
  this._fbref.on("child_changed", this._childChanged, this);
  this._fbref.on("child_removed", this._childRemoved, this);
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
      model.id = this._fbref.ref().push().name();
    }
    var val = model.toJSON();
    this._fbref.ref().child(model.id).set(val, _.bind(function(err) {
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
    this._fbref.ref().child(model.id).update(val, function(err) {
      if (!err) {
        cb(null, val);
      } else {
        cb("Could not update model " + model.id, null);
      }
    });
  },

  'delete': function(model, cb) {
    this._fbref.ref().child(model.id).remove(function(err) {
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

  store[method].apply(store, [model, function(err, val) {
    if (err) {
      model.trigger("error", model, err, options);
      if (Backbone.VERSION === "0.9.10") {
        options.error(model, err, options);
      } else {
        options.error(err);
      }
    } else {
      model.trigger("sync", model, val, options);
      if (Backbone.VERSION === "0.9.10") {
        options.success(model, val, options);
      } else {
        options.success(val);
      }
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

    // Apply parent constructor (this will also call initialize).
    Backbone.Collection.apply(this, arguments);

    if (options && options.firebase) {
      this.firebase = options.firebase;
    }
    switch (typeof this.firebase) {
      case "object": break;
      case "string": this.firebase = new Firebase(this.firebase); break;
      case "function": this.firebase = this.firebase(); break;
      default: throw new Error("Invalid firebase reference created");
    }

    // Add handlers for remote events.
    this.firebase.on("child_added", _.bind(this._childAdded, this));
    this.firebase.on("child_moved", _.bind(this._childMoved, this));
    this.firebase.on("child_changed", _.bind(this._childChanged, this));
    this.firebase.on("child_removed", _.bind(this._childRemoved, this));

    // Add handlers for all models in this collection, and any future ones
    // that may be added.
    function _updateModel(model, options) {
      this.firebase.ref().child(model.id).update(model.toJSON());
    }

    this.listenTo(this, 'change', _updateModel, this);
  },

  comparator: function(model) {
    return model.id;
  },

  add: function(models, options) {
    var parsed = this._parseModels(models);
    options = options ? _.clone(options) : {};
    options.success = _.isFunction(options.success) ? options.success : function() {};

    for (var i = 0; i < parsed.length; i++) {
      var model = parsed[i];
      this.firebase.ref().child(model.id).set(model, _.bind(options.success, model));
    }
  },

  remove: function(models, options) {
    var parsed = this._parseModels(models);
    options = options ? _.clone(options) : {};
    options.success = _.isFunction(options.success) ? options.success : function() {};

    for (var i = 0; i < parsed.length; i++) {
      var model = parsed[i];
      this.firebase.ref().child(model.id).set(null, _.bind(options.success, model));
    }
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
      if (model.toJSON && typeof model.toJSON == "function") {
        model = model.toJSON();
      }
      if (!model.id) {
        model.id = this.firebase.ref().push().name();
      }
      ret.push(model);
    }
    return ret;
  },

  _childAdded: function(snap) {
    var model = snap.val()
    if (!model.id) model.id = snap.name()
    Backbone.Collection.prototype.add.apply(this, [model]);
  },

  _childMoved: function(snap) {
    // TODO: Investigate: can this occur without the ID changing?
    this._log("_childMoved called with " + snap.val());
  },

  _childChanged: function(snap) {
    var model = snap.val();
    if (!model.id) model.id = snap.name()
    var item = _.find(this.models, function(child) {
      return child.id == model.id
    });
    if (!item) {
      // TODO: Investigate: what is the right way to handle this case?
      throw new Error("Could not find model with ID " + model.id);
    }

    var diff = _.difference(_.keys(item.attributes), _.keys(model));
    _.each(diff, function(key) {
      item.unset(key);
    });

    item.set(model);
  },

  _childRemoved: function(snap) {
    var model = snap.val()
    if (!model.id) model.id = snap.name()
    Backbone.Collection.prototype.remove.apply(this, [model]);
  }
});

// Custom Firebase Model.
Backbone.Firebase.Model = Backbone.Model.extend({
  save: function() {
    this._log("Save called on a Firebase model, ignoring.");
  },

  destroy: function(options) {
    // TODO: Fix naive success callback. Add error callback.
    this.firebase.ref().set(null, this._log);
    this.trigger('destroy', this, this.collection, options);
    if (options.success) {
      options.success(this,null,options);
    }
  },

  constructor: function(model, options) {

    // Apply parent constructor (this will also call initialize).
    Backbone.Model.apply(this, arguments);

    if (options && options.firebase) {
      this.firebase = options.firebase;
    }
    switch (typeof this.firebase) {
      case "object": break;
      case "string": this.firebase = new Firebase(this.firebase); break;
      case "function": this.firebase = this.firebase(); break;
      default: throw new Error("Invalid firebase reference created");
    }

    // Add handlers for remote events.
    this.firebase.on("value", this._modelChanged.bind(this));

    this._listenLocalChange(true);
  },
  
  _listenLocalChange: function(state) {
    if (state)
      this.on("change", this._updateModel, this);
    else 
      this.off("change", this._updateModel, this);
  },

  _updateModel: function(model, options) {
    // Find the deleted keys and set their values to null
    // so Firebase properly deletes them.
    var modelObj = model.toJSON();
    _.each(model.changed, function(value, key) {
      if (typeof value === "undefined" || value === null)
        if (key == "id")
          delete modelObj[key];
        else
          modelObj[key] = null;
    });
    if (_.size(modelObj))
      this.firebase.ref().update(modelObj, this._log);
  },

  _modelChanged: function(snap) {
    // Unset attributes that have been deleted from the server
    // by comparing the keys that have been removed.
    var newModel = snap.val();
    if (typeof newModel === "object" && newModel !== null) {
      var diff = _.difference(_.keys(this.attributes), _.keys(newModel));
      var _this = this;
      _.each(diff, function(key) {
          _this.unset(key);
      });
    }
    this._listenLocalChange(false);
    this.set(newModel);
    this.trigger('sync', this, null, null);
    this._listenLocalChange(true);
  },

  _log: function(msg) {
    if (typeof msg === "undefined" || msg === null) return;
    if (console && console.log) {
      console.log(msg);
    }
  }
  
});

})();
