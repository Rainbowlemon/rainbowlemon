require.config({
    paths: {
        jquery: [
            '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
            //If the CDN location fails, load from this location
            '../vendor/bower/jquery/dist/jquery.min'
        ],
        'easing': '../vendor/bower/jquery.easing/js/jquery.easing',
        'underscore': '../vendor/bower/underscore/underscore',
        'fastclick': '../vendor/bower/fastclick/lib/fastclick',
        
        'utils': '../vendor/libs/utils/utils',
        'app': 'rainbowlemon'
    },
    shim: {
        easing: ['jquery'],
        underscore: {
            exports: ['_']
        }
    }
});

require([
    'app',
    'fastclick'
], function(
    App
) {
    'use strict';
    
    App.init();
});
