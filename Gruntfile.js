module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('aws.json'),
        
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
        },
        
        copy: {
            temp: {
                files: [{
                    expand: true, 
                    cwd: 'web/', 
                    src: ['*', 'app/templates/**/*', 'css/**', 'img/**', 'fonts/*', 'vendor/libs/**/*'], 
                    dest: 'temp/'
                }]
            }
        },
        
        clean: {
            temp: 'temp/' 
        },
        
        requirejs: {
            temp: {
                options: {
                    name: 'main',
                    mainConfigFile: 'web/app/main.js',
                    out: 'temp/app/main.js',
                    preserveLicenseComments: false,
                    almond: true
                /*
                    name: 'main',
                    mainConfigFile: 'web/app/main.js',
                    out: 'temp/app/<%= pkg.version %>.js',
                    preserveLicenseComments: false,
                    almond: true,
                    replaceRequireScript: [{
                        files: ['temp/index.html'],
                        module: '<%= pkg.version %>',
                        modulePath: '/temp/app/<%= pkg.version %>'
                    }]
                */
                }
            }
        },
        
        aws_s3: {
            options: {
                accessKeyId: '<%= aws.accessKeyId %>',
                secretAccessKey: '<%= aws.secretAccessKey %>',
                bucket: '<%= aws.bucket %>',
                region: 'eu-west-1',
                uploadConcurrency: 5
            },
            
            wipe: {
                files: [
                    {
                        dest: '/',
                        'action': 'delete'
                    }
                ]
            },
            
            deploy: {
                files: [
                    {
                        expand: true,
                        cwd: 'temp/',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-aws-s3');
    
    grunt.registerTask('wipe', ['aws_s3:wipe']);
    grunt.registerTask('deploy', ['clean:temp', 'copy:temp', 'requirejs:temp', 'aws_s3:deploy', 'clean:temp']);
    grunt.registerTask('default', ['modernizr', 'sass', 'jshint']);
};