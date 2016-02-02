require.config({
    paths: {
        'fastclick': '../../node_modules/fastclick/lib/fastclick',
        'jquery-throttle-debounce': '../../node_modules/js-throttle-debounce/build/js-throttle-debounce.min.js',
        'utils': '../libs/utils/utils',
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
