require.config({
    paths: {
        'easing': '../vendor/bower/jquery.easing/js/jquery.easing',
        'underscore': '../vendor/bower/underscore/underscore',
        'fastclick': '../vendor/bower/fastclick/lib/fastclick',
        
        'utils': '../vendor/libs/utils/utils',
        'app': 'rainbowlemon'
    },
    shim: {
        underscore: {
            exports: ['_']
        }
    }
});

require([
    'underscore',
    'app',
    'fastclick'
], function(
    _,
    App
) {
    'use strict';
    
    App.init();
});
