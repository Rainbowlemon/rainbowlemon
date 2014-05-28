define([
    'require',
    'jquery',
    'utils'
], function(
    require,
    $,
    utils
) {
    'use strict';
    
    var App = {
        
        init: function() {
            this.bindEvents();
            
        },
        
        options: {
            appName: 'rainbowlemon',
            baseColor: [0,0.7,0.89]
        },
        
        el: {
            styles: $('#custom-styles'),
            colored: {
                paths: $('.colored-svg path'),
                bgs: $('.colored-bg')
            }
        },
        
        bindEvents: function() {
            $(window).on('scroll.' + this.options.appName, this.setColors.bind(this));
        },
        
        setColors: function() { 
            //Get fraction of scroll related to document size
            var scrollFraction = window.scrollY / ($(document).height() - window.innerHeight);
            
            console.log(scrollFraction);
            
            if (scrollFraction > 1) scrollFraction = 1;
            
            var hue = 360 - (260 * scrollFraction);
            
            var rgb = utils.hsbToRgb(hue/360, this.options.baseColor[1], this.options.baseColor[2]),
                rgbString = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
            
            this.el.styles.html(
                ' .colored-svg path {' +
                '     fill:' + rgbString +
                ' }' +
                ' .colored-bg,'+
                ' #page-header > nav a:after {' +
                '     background-color:' + rgbString +
                ' }'
            );
        }
    
    };
    
    return App;
});
