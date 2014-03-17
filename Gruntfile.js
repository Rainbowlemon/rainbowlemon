module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: 'web/app/**/*.js'
            }
        },
        
        sass: {
            dev: {
                files: {
                    'web/css/style.css': 'sass/style.scss'
                }
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'web/css/style.css': 'sass/style.scss'
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
                devFile: 'web/vendor/bower/modernizr/modernizr.js',
                outputFile: 'web/vendor/libs/modernizr/modernizr-custom.js',
                
                extra: {
                    load: false
                },
                
                uglify: true,
                
                files: {
                    src: [
                        'web/app/**/*',
                        'sass/**/*'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-modernizr');
    
    grunt.registerTask('default', ['modernizr', 'sass', 'jshint']);
};