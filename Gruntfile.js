module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('aws.json'),
        
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
                    src: ['*', 'app/templates/**/*', 'css/**', 'img/**', 'fonts/*', 'vendor/libs/**/*'], 
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
                        cwd: 'build/',
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
    
    grunt.registerTask('build', ['clean:build', 'copy:build', 'requirejs:build']);
    grunt.registerTask('deploy', ['aws_s3:wipe', 'aws_s3:deploy', 'clean:build']);
    grunt.registerTask('default', ['modernizr', 'sass', 'jshint', 'clean:build', 'copy:build', 'requirejs:build', 'aws_s3:wipe', 'aws_s3:deploy', 'clean:build']);
};