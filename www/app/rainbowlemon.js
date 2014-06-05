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
            portfolioContainer: $('#portfolio-container'),
            portfolioOverview: $('#portfolio-overview'),
            portfolio: $('#portfolio'),
            entries: $('#portfolio > section')
        },
        
        bindEvents: function() {
            $(window).on('scroll.' + this.options.appName, this.setColors.bind(this));
            $(window).on('hashchange.' + this.options.appName, this.changePage.bind(this));
            
            this.setColors();
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
            this.changePage();
        },
        
        changePage: function(e){
            var loc = (window.location.hash.indexOf('/') == -1) ? '' : window.location.hash.split('/')[1];
            
            if (loc !== ''){
                var $active = this.el.portfolio.find('[data-entry="'+ loc + '"]'),
                    $img = $active.find('img[data-src]');
                
                //Hide any portfolio entries that might already be shown
                this.el.portfolio.find('section:visible').hide();
                
                $img.each(function(){
                    var $this = $(this);
                    
                    $this.attr('src', $this.data('src'));
                });
                
                //Need to set the height on the container so the overview doesn't disappear when setting to position:absolute
                /*
                this.el.portfolioContainer.css({
                    'height': this.el.portfolioOverview.outerHeight(true)
                });
                */
                this.el.portfolioOverview.css('position', 'absolute');
                
                $active.show();
                this.el.portfolioContainer.attr('data-page', '2');
            } else {
                //Set the height on the portfolio container again, in case it has changed
                /*
                this.el.portfolioContainer.css({
                    'height': this.el.portfolioOverview.outerHeight(true)
                });
                */
                
                this.el.portfolioContainer.attr('data-page', '1');
            }
        }
    
    };
    
    return App;
});
