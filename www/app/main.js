require.config({
    paths: {
        'jquery': '../vendor/libs/jquery/jquery',
        'easing': '../vendor/bower/jquery.easing/js/jquery.easing',
        'underscore': '../vendor/bower/underscore/underscore',
        'fastclick': '../vendor/bower/fastclick/lib/fastclick',
        
        'app': 'rainbowlemon'
    },
    shim: {
        jquery: {
            exports: ['$', 'jQuery']
        },
        underscore: {
            exports: '_'
        }
    }
});

require([
    'rainbowlemon',
    'fastclick'
], function(
    App
) {
    'use strict';
    
    console.log(App);
});
