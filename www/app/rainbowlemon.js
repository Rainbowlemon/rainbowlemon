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
            this.setupPage();
        },
        
        options: {
            appName: 'rainbowlemon',
            baseColor: [0,0.7,0.89],
            greetings: [
                'Hey',
                '你好',
                'Salut',
                'Hallo',
                'Shalom',
                'Ciào',
                '안녕',
                'Olá',
                'Hej',
                'Xin chào'
            ]
        },
        
        el: {
            styles: $('#custom-styles'),
            colored: {
                paths: $('.colored-svg path'),
                bgs: $('.colored-bg')
            },
            
            greeting: $('#intro-greeting'),
            portfolio: $('#portfolio'),
            entries: $('#portfolio > section')
        },
        
        bindEvents: function() {
            $(window).on('scroll.' + this.options.appName, this.setColors.bind(this));
            $(window).on('hashchange.' + this.options.appName, this.changePage.bind(this));
            
            this.setColors(); //set page colors before scroll
        },
        
        setColors: function() { 
            //Get fraction of scroll related to document size
            var scrollFraction = window.scrollY / ($(document).height() - window.innerHeight);
            
            if (scrollFraction > 1) scrollFraction = 1;
            
            var hue = 360 - (260 * scrollFraction);
            
            var rgb = utils.hsbToRgb(hue/360, this.options.baseColor[1], this.options.baseColor[2]),
                rgbString = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
            
            this.el.styles.html(
                ' .colored-svg path {' +
                '     fill:' + rgbString + ' !important;' +
                ' }' +
                ' .colored-bg,'+
                ' #page-header > nav a:after {' +
                '     background-color:' + rgbString + ' !important;' +
                ' }'
            );
        },
        
        setupPage: function(){
            this.el.greeting.text(_.sample(this.options.greetings)).show();
        },
        
        changePage: function(e){
            console.log(e);
            
            if (e.hash === '#'){
                console.log('home');
            }
        }
    
    };
    
    return App;
});
