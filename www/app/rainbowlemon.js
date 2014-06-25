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
            
            header: $('#page-header'),
            greeting: $('#intro-greeting'),
            portfolioContainer: $('#portfolio-container'),
            portfolioWrap: $('#portfolio-wrap'),
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
                rgbString = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')',
                m = 0.85,
                rgbDarkString = 'rgb(' + (rgb.r * m >> 0) + ',' + (rgb.g * m >> 0) + ',' + (rgb.b * m >> 0) + ')';
            
            this.el.styles.html(
                ' .colored-svg path {' +
                '     fill:' + rgbString + ' !important;' +
                ' }' +
                ' .colored-bg,'+
                ' .colored-title-hover:after {' +
                '     background-color:' + rgbString + ' !important;' +
                ' }' +
                ' a {' +
                '     color: '+ rgbDarkString + ';' +
                ' }' +
                ' .colored-border {' +
                '     border-color:' + rgbString + ' !important;' +
                ' }'
            );
        },
        
        setupPage: function(){
            this.el.greeting.text(_.sample(this.options.greetings)).show();
            this.changePage();
        },
        
        scrollToPortfolio: function(){
            var top = this.el.portfolioContainer.offset().top,
                offset = this.el.header.outerHeight();
            
            $('html,body').animate({
              scrollTop: top - offset - 20
            }, 300);
        },
        
        changePage: function(e){
            var loc = (window.location.hash.indexOf('/') == -1) ? '' : window.location.hash.split('/')[1];
            
            if (loc !== ''){
                var $active = this.el.portfolio.find('[data-entry="'+ loc + '"]'),
                    $img = $active.find('img[data-src]');
                
                $img.each(function(){
                    var $this = $(this);
                    
                    $this.attr('src', $this.data('src'));
                });
                
                //hide previous page and show current page
                this.el.portfolio.css('height', '').find('section:visible').hide();
                $active.show();
                
                this.el.portfolioContainer.attr('data-page', '2');
            } else {
                //set height to 0 to render container correctly
                this.el.portfolio.css('height', '0');
                this.el.portfolioContainer.attr('data-page', '1');
            }
            
            // Dont scroll to portfolio on first page load
            if (typeof e === 'object') this.scrollToPortfolio();
        }
    
    };
    
    return App;
});
