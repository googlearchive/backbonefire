/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		}
	},
	paths: {
		jquery: '../bower_components/jquery/jquery',
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		text: '../bower_components/requirejs-text/text',
		firebase: '../bower_components/firebase/firebase',
		backbonefire: 'backbonefire'
	}
});

require([
	'backbone',
	'views/app',
	'routers/router',
	'collections/todos'
], function (Backbone, AppView, Workspace, Todos) {
	/*jshint nonew:false*/
	// Initialize routing and start Backbone.history()
	new Workspace();
	Backbone.history.start();
	// Initialize the application view
	new AppView({ collection: Todos });
});