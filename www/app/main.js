require.config({
    paths: {
        'easing': '../vendor/bower/jquery.easing/js/jquery.easing',
        'fastclick': '../vendor/bower/fastclick/lib/fastclick',
        
        'utils': '../vendor/libs/utils/utils',
        'app': 'rainbowlemon'
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
