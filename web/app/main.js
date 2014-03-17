require.config({
    paths: {
        'jquery': '../vendor/libs/jquery/jquery',
        'easing': '../vendor/bower/jquery.easing/js/jquery.easing',
        'underscore': '../vendor/bower/underscore/underscore',
        'backbone': '../vendor/bower/backbone/backbone',
        'backbone.babysitter': '../vendor/bower/backbone.babysitter/lib/amd/backbone.babysitter',
        'backbone.wreqr': '../vendor/bower/backbone.wreqr/lib/amd/backbone.wreqr',
        'marionette': '../vendor/bower/backbone.marionette/lib/core/amd/backbone.marionette',
        'syphon': '../vendor/bower/backbone.syphon/lib/amd/backbone.syphon',
        'text': '../vendor/bower/text/text',
        'fastclick': '../vendor/bower/fastclick/lib/fastclick'
    },
    shim: {
        jquery: {
            exports: ['$', 'jQuery']
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'Marionette'
        }
    }
});

require([
    'backbone',
    'app'
], function(
    Backbone,
    App
) {
    'use strict';
    
    /**
     * Apply patches to library mechanisms.
     * 
     * @param {object} options
     * @returns {undefined}
     */
    function initPatches(options)
    {
        // Render underscore templates.
        Backbone.Marionette.Renderer.render = function(template, data) {
            return _.template(template, data);
        };
        
        // Make cross-site requests possible.
        $.ajaxSetup({
            timeout: (30 * 1000),
            xhrFields: {
                withCredentials: true
            }
        });
        
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            options.xhrFields = {
                withCredentials: true
            };
        });
    }
    
    window.App = new App();
    
    window.App.addInitializer(initPatches);
    
    var options = {};
    
    navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) ?
        document.addEventListener("deviceready", function(){window.App.start(options);}, false):
        window.App.start(options);
});
