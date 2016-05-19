module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ["build"],
            release: {
                options: {
                    force: true
                },
                src: ['release']
            }
        },
        jshint: {
            options: {
                undef: false,
                unused: false,
                nonbsp: true/*,
                reporter: require('jshint-stylish')*/
            },
            files: ['src/main/javascript/**/*.js']
        },
        jslint: {
            javascript: {
                options: {
                    edition: 'latest',
                    errorsOnly: true
                },
                src: ['src/main/javascript/**/*.js']
            }
        },
        karma: {
            server: {
                configFile: 'karma.conf.js'
            },
            ci: {
                configFile: 'karma.conf.ci.js'
            }
        },
        copy: {
            build: {
                files: [{expand: true, src: ['src/main/javascript/*.js'], dest: 'build/', filter: 'isFile'}]
            },
            release: {
                files: [
                    {
                        expand: true,
                        src: [
                            'build/<%= pkg.name %>.min.js',
                            'build/<%= pkg.name %>.js',
                            'build/src/main/javascript/index.js'
                        ],
                        dest: 'release/',
                        filter: 'isFile',
                        flatten: true
                    },
                    {
                        expand: true,
                        src: [
                            'build/reports/**'
                        ],
                        dest: 'release/reports/',
                        filter: 'isFile',
                        flatten: false
                    }
                ]
            }
        },
        uglify: {
            build_min: {
                options: {
                    mangle: true
                },
                files: {
                    'build/<%= pkg.name %>.min.js': ['build/src/main/javascript/software.bytepushers.*.js']
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            build: {
                src: ['build/src/main/javascript/software.bytepushers.*.js'],
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        release: {
            options: {
                commitMessage: 'release <%= version %>',
                tagMessage: 'version <%= version %>',
                github: {
                    repo: 'byte-pushers/bytepushers-js-core',
                    accessTokenVar: 'GITHUB_ACCESS_TOKE_'
                }
            }
        },
        bumpup: './bower.json',
        bowerRelease: {
            options: {
                main: 'release/bytepushers-js-core.min.js',
                dependencies: {
                    
                }
            },
            stable: {
                options: {
                    endpoint: 'https://github.com/byte-pushers/bytepushers-js-core.git',
                    packageName: 'bytepushers-js-core',
                    stageDir: 'releases/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release/',
                        src: ['bytepushers-js-core.js', 'bytepushers-js-core.min.js']
                    }
                ]
            },
            devel: {
                options: {
                    endpoint: 'https://github.com/byte-pushers/bytepushers-js-core/tree/develop',
                    packageName: 'bytepushers-js-core',
                    stageDir: 'tags/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release/',
                        src: ['bytepushers-js-core.js', 'bytepushers-js-core.min.js']
                    }
                ]
            }
        }
    });
    
    

    var build = grunt.option('target') || 'build';
    var npmRelease = grunt.option('target') || 'release';
    var karma_server = grunt.option('target') || 'server';
    var karma_ci = grunt.option('target') || 'ci';

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-release');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('validate', ['jshint', 'jslint']);
    grunt.registerTask('test', ['test-karma-ci']);
    grunt.registerTask('test-karma', ['karma:' + karma_server]);
    grunt.registerTask('test-karma-ci', ['karma:' + karma_ci]);
    grunt.registerTask('package', ['copy:' + build, 'uglify', 'concat']);
    grunt.registerTask('packageRelease', ['bumpup', 'npmRelease', 'bowerRelease']);
    grunt.registerTask('build', ['clean:' + build, 'validate', 'test', 'package']);
    grunt.registerTask('release', ['clean:release', 'build', 'copy:release', 'packageRelease']);
};