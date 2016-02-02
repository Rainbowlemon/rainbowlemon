module.exports = function(grunt) {
    'use strict';
    
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: 'www/app/**/*.js'
            }
        },
        
        sass: {
            dev: {
                files: {
                    'www/css/style.css': 'sass/style.scss'
                }
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'www/css/style.css': 'sass/style.scss'
                }
            }
        },
        
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass:dev']
            }
        },
        
        modernizr: {
            dist: {
                devFile: 'www/libs/modernizr/modernizr.js',
                outputFile: 'www/libs/modernizr/modernizr-custom.js',
                
                extra: {
                    load: false
                },
                
                tests: ['csstransforms'],
                
                uglify: true,
                
                files: {
                    src: [
                        'www/app/**/*',
                        'sass/**/*'
                    ]
                }
            }
        },
        
        copy: {
            build: {
                files: [{
                    expand: true, 
                    cwd: 'www/', 
                    src: [
                        '*',
                        'app/templates/**/*',
                        'css/**',
                        'docs/**',
                        'img/**',
                        '!img/embedded-svgs/**/*',
                        'fonts/*',
                        'portfolio/**/*',
                        'libs/modernizr/modernizr-custom.js'
                    ], 
                    dest: 'build/'
                }]
            }
        },
        
        clean: {
            build: 'build/'
        },
        
        requirejs: {
            build: {
                options: {
                    name: 'main',
                    mainConfigFile: 'www/app/main.js',
                    out: 'build/app/<%= pkg.version %>.js',
                    preserveLicenseComments: false,
                    almond: true,
                    replaceRequireScript: [{
                        files: ['build/index.html'],
                        module: '<%= pkg.version %>',
                        modulePath: './app/<%= pkg.version %>'
                    }]
                }
            }
        },
        
        'gh-pages': {
            options: {
                base: 'build',
                branch: 'master',
                repo: 'git@github.com:Rainbowlemon/rainbowlemon.github.io.git'
            },
            src: '**/*'
        }
    });
    
    grunt.registerTask('build', ['clean:build', 'copy:build', 'requirejs:build']);
    
    grunt.registerTask('default', ['modernizr', 'sass', 'jshint', 'clean:build', 'copy:build', 'requirejs:build', 'gh-pages', 'clean:build']);
};