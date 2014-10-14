define([
    'utils'
], function(
    utils
) {
    'use strict';
    
    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    };
    
    var App = function() {
        this.options = {
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
            ],
            // animation end event name
            animEndEventName: animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
            // support css animations
            support: Modernizr.cssanimations
        };
    };
    
    App.prototype = {
        init: function() {
            this.bindEvents();
            this.setupPage();
        },
        
        el: {
            styles: $('#custom-styles'),
            colored: {
                paths: $('.colored-svg path'),
                bgs: $('.colored-bg')
            },
            
            header: $('#page-header'),
            
            homePage: $('#home-page'),
            greeting: $('#intro-greeting'),
            
            portfolioPage: $('#portfolio-page'),
            entries: $('#portfolio > section')
        },
        
        bindEvents: function() {
            $(window).on('scroll.' + this.options.appName, this.setColors.bind(this));
            $(window).on('hashchange.' + this.options.appName, this.hashChange.bind(this));
            
            this.el.portfolioPage.on('click.' + this.options.appName, '.swf-trigger', this.showSwf.bind(this));
            
            this.setColors();
        },
        
        setColors: function() { 
            //Get fraction of scroll related to document size
            var scrollFraction = window.pageYOffset / ($(document).height() - window.innerHeight);
            
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
                ' }' +
                ' .colored-border-hover:hover {' +
                '     border-color:' + rgbString + ' !important;' +
                ' }'
            );
        },
        
        setupPage: function() {
            var randGreeting = this.options.greetings[Math.floor(Math.random() * this.options.greetings.length)];
            this.el.greeting.text(randGreeting).show();
            this.hashChange();
        },
        
        hashChange: function(e) {
            // Remove initial slash if it exists
            var loc = (window.location.hash.indexOf('/') == -1) ? '' : window.location.hash.split('/')[1];
            
            if (loc === '') {
                // Home page
                this.hideSwfs();
                
                this.changePage(this.el.homePage);
            } else {
                // Project page
                
                // Show correct section of portfolio,
                // And load images
                var $active = this.el.portfolioPage.find('[data-entry="'+ loc + '"]'),
                    $img = $active.find('img[data-src]');
                
                $img.each(function(){
                    var $this = $(this);
                    
                    $this.attr('src', $this.data('src'));
                });
                
                this.el.portfolioPage.css('height', '').find('section:visible').hide();
                $active.show();
                
                // Project page
                this.changePage(this.el.portfolioPage);
            }
        },
        
        changePage: function($el) {
            var $current = $('.page.active');
            var $next = $el;
            var animEventName = this.options.animEndEventName;

            if ($next.length === 0 || $current[0] === $next[0]) return;

            if ($current.length === 0) {
                $next.addClass('active');
                return;   
            }

            var direction = ($current.index() < $next.index()) ? ['Left','Right'] : ['Right', 'Left'];

            var curClass = 'page-moveTo' + direction[0],
                nextClass = 'page-moveFrom' + direction[1];

            var changeClasses = function(){
                $current.addClass(curClass).on(animEventName, function(){
                    $current.removeClass('active ' + curClass).off(animEventName);
                });
                $next.addClass('active ' + nextClass).on(animEventName, function(){
                    $next.removeClass(nextClass).off(animEventName);
                });
            };

            if (window.animationEndEvent === void 0) {
                setTimeout(changeClasses, 10);
            } else {
                changeClasses();
            }
        },
        
        showSwf: function(e){
            e.preventDefault();
            
            var id = $(e.currentTarget).data('swfid');
            if (!id) return;
            
            var $preview = $('img[data-swfpreview="' + id + '"]'),
                $container = $('div[data-swfid="' + id + '"]'),
                src = $container.data('url'),
                width = $container.data('width'),
                height = $container.data('height');
            
            $preview.hide();
            
            var html = utils.createSwf(src, {width: width, height: height}, {wmode: 'transparent'});
            
            $container.html(html).show();
        },
        
        hideSwfs: function(){
            var $containers = $('div[data-swfid]');
            
            $containers.each(function(){
                var $this = $(this),
                    id = $this.data('swfid');
                
                $('img[data-swfpreview="' + id + '"]').show();
                $this.empty();
            });
        }
    };
    
    var Rainbowlemon = new App();
    
    return Rainbowlemon;
});
