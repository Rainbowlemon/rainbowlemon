require.config({
    paths: {
        'fastclick': '../vendor/bower/fastclick/lib/fastclick',
        'jquery-throttle-debounce': '../vendor/bower/jquery-throttle-debounce/jquery.ba-throttle-debounce',
        'utils': '../vendor/libs/utils/utils',
        'app': 'rainbowlemon'
    }
});

require([
    'app',
    'fastclick',
], function(
    App,
    FastClick
) {
    'use strict';
    
    FastClick.attach(document.body);
    
    App.init();
});
