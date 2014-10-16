module.exports = function(grunt) {
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
                devFile: 'www/vendor/bower/modernizr/modernizr.js',
                outputFile: 'www/vendor/libs/modernizr/modernizr-custom.js',
                
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
                        'img/**',
                        '!img/embedded-svgs/**/*',
                        'fonts/*',
                        'portfolio/**/*',
                        'vendor/libs/modernizr/modernizr-custom.js'
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
        
        imagemin: {
            build: {
                options: {
                    optimizationLevel: 2
                },
                files: [{
                    expand: true,
                    cwd: 'www/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'www/img/'
                }]
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
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-newer');
    
    grunt.registerTask('build', ['clean:build', 'copy:build', 'requirejs:build']);
    
    grunt.registerTask('default', ['modernizr', 'sass', 'jshint', 'newer:imagemin', 'clean:build', 'copy:build', 'requirejs:build', 'gh-pages', 'clean:build']);
};