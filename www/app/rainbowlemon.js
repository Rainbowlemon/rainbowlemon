define([
    'utils',
    'jquery-throttle-debounce'
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
            support: Modernizr.cssanimations,
            
            // store previous scroll height and header top value
            prevScroll: 0,
            headerTop: 0
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
            breadcrumb: $('#page-breadcrumb'),
            
            homePage: $('#home-page'),
            greeting: $('#intro-greeting'),
            
            portfolioPage: $('#portfolio-page'),
            entries: $('#portfolio > section')
        },
        
        bindEvents: function() {
            $('main').on('scroll', '.page.active', $.throttle(100, this.checkHeader.bind(this)).bind(this));
            $(window).on('hashchange', this.hashChange.bind(this));
            
            this.el.portfolioPage.on('click', '.swf-trigger', this.showSwf.bind(this));
        },
        
        setupPage: function() {
            this.hashChange();
        },
        
        setGreeting: function(){
            var randGreeting = this.options.greetings[Math.floor(Math.random() * this.options.greetings.length)];
            this.el.greeting.text(randGreeting).show();
        },
        
        checkHeader: function(e) {
            var currentScroll = e.currentTarget.scrollTop;
            
            // Store any values that don't change
            if (this.options.headerHeight === void 0){
                this.options.headerHeight = this.el.header.outerHeight();
            }
            
            var targetTop = this.options.headerTop + (this.options.prevScroll - currentScroll);
            
            if (targetTop >= 0) {
                targetTop = 0;
            } else if (targetTop <= -this.options.headerHeight) {
                targetTop = -this.options.headerHeight;
            }
            
            if (targetTop !== this.options.headerTop) {
                this.el.header.css('transform', 'translate3d(0px, ' + targetTop + 'px, 0px)');
                this.options.headerTop = targetTop;
            }
            
            this.options.prevScroll = currentScroll;
        },
        
        hashChange: function(e) {
            // Remove initial slash if it exists
            var loc = (window.location.hash.indexOf('/') == -1) ? '' : window.location.hash.split('/')[1];
            
            if (loc === '') {
                // Home page
                this.el.breadcrumb.removeClass('active');
                this.hideSwfs();
                this.setGreeting();
                
                if (window.location.hash !== '#!' && window.location.hash !== '#') {
                    window.location.replace('#!');
                } else {
                    this.changePage(this.el.homePage);
                }
            } else {
                // Project page
                var projectName = loc.split('-').join(' ');
                this.el.breadcrumb.find('span').html('&nbsp;&nbsp;&raquo;&nbsp;&nbsp;' + projectName).end().addClass('active');
                
                this.el.portfolioPage.find('section:visible').hide();
                var $entry = this.el.portfolioPage.find('[data-entry="'+ loc + '"]');
                
                if ($entry.length !== 0) {
                    $entry.show();
                    this.changePage(this.el.portfolioPage);
                } else {
                    window.location.replace('#!');
                }
            }
        },
        
        loadImages: function($el){
            if ($el.length === 0) return;
            
            $el.find('section:visible img[data-src]').each(function(index){
                var $this = $(this);
                
                $this.css('opacity', 0).on('load', function(){
                    $(this).addClass('show');
                }).attr('src', $this.data('src'));
            });
        },
        
        changePage: function($next) {
            var $current = $('.page.active');
            var animEventName = this.options.animEndEventName;
            var _this = this;
            
            // If the page hasn't changed, don't do anything
            if ($next.length === 0 || $current[0] === $next[0]) return;
            
            // Set original class name as data, to reset class names when URL changes (avoid bugs with quick navigation)
            if ($next.data('originalClass') === void 0) {
                $next.data('originalClass', $next[0].className);
            }

            // Initial pageload - no pages are currently active
            if ($current.length === 0) {
                $next.addClass('active');
                this.loadImages($next);
                return;
            }
            
            // Get the correct class to add to each page
            var direction = ($current.index() < $next.index()) ? ['Left','Right'] : ['Right', 'Left'];
            var curClass = 'page-moveTo' + direction[0],
                nextClass = 'page-moveFrom' + direction[1];

            var changeClasses = function(){
                // Reset classes on pages
                $current.attr('class', $current.data('originalClass'));
                $next.attr('class', $next.data('originalClass'));
                
                $next.scrollTop(0).trigger('scroll');
                
                // Remove animation event on page, add animating class, and check for animation finish
                $current.off(animEventName).addClass(curClass).on(animEventName, function(){
                    $current.attr('class', $current.data('originalClass')).off(animEventName);
                });
                
                $next.off(animEventName).addClass('active ' + nextClass).on(animEventName, function(){
                    $next.removeClass(nextClass).off(animEventName);
                    
                    _this.loadImages($next);
                });
            };
            
            if (this.options.animEndEventName === void 0) {
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
