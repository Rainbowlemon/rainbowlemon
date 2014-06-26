module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('../_aws/rainbowlemon.json'),
        
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
            temp: {
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
                    dest: 'temp/'
                }]
            }
        },
        
        compress: {
            build: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: 'temp/',
                src: ['**/*'],
                dest: 'build/',
                filter: 'isFile',
                ext: function(ext){
                    return ext;
                }
            }
        },
        
        clean: {
            build: 'build/',
            backup: 'backup/',
            temp: 'temp/'
        },
        
        requirejs: {
            temp: {
                options: {
                    name: 'main',
                    mainConfigFile: 'www/app/main.js',
                    out: 'temp/app/<%= pkg.version %>.js',
                    preserveLicenseComments: false,
                    almond: true,
                    replaceRequireScript: [{
                        files: ['temp/index.html'],
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
                        'action': 'upload',
                        expand: true,
                        cwd: 'build/',
                        src: ['**'],
                        dest: '',
                        differential: true,
                        params: {
                            ContentEncoding: 'gzip'
                        }
                    },{
                        'action': 'delete',
                        dest: '/',
                        cwd: 'build/',
                        differential: true,
                        exclude: 'app/*.js'
                    }
                ]
            },
            
            backup: {
                cwd: 'backup/',
                dest: '/',
                'action': 'download'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-aws-s3');
    
    grunt.registerTask('build', ['clean:build', 'clean:temp', 'copy:temp', 'requirejs:temp', 'compress:build', 'clean:temp']);
    grunt.registerTask('backup', ['clean:backup', 'aws_s3:backup']);
    grunt.registerTask('wipe', ['aws_s3:wipe']);
    grunt.registerTask('deploy', ['aws_s3:deploy']);
    
    grunt.registerTask('default', ['modernizr', 'sass', 'jshint', 'clean:build', 'clean:temp', 'copy:temp', 'requirejs:temp', 'compress:build', 'aws_s3:deploy', 'clean:temp']);
};