module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    options: {
        src: '<%= pkg.name %>.js',
        build: 'build/<%= pkg.name %>.min.js',
        reporter: 'Spec'
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true
      },
      build: {
        src: '<%= options.src %>',
        dest: '<%= options.build %>'
      }
    },

    'unit-phantom': {
        options: {
            reporter: '<%= options.reporter %>',
            run: true
        },
        dev: {
            src: ['test/dev.html']
        },
        release: {
            src: ['test/release.html']
        }
    },
    'unit-node': {
        options: {
            require: [
                'should',
                function () { _ = require('lodash'); },
                function () { Config = require('./browser-config'); }
            ],
            reporter: '<% print(options.reporter.toLowerCase()) %>',
            growl: true,
            clearRequireCache: true
        },
        dev: {
            src: ['test/tests/**/*.js']
        },
        release: {
            options: {
                require: [
                    'should',
                    function () { _ = require('lodash'); },
                    function () { Config = require('./build/browser-config.min'); }
                ]
            },
            src: ['test/tests/**/*.js']
        }
    },

    watch: {
        tests: {
            files: ['<%= options.src %>', 'test/tests/**/*.js'],
            tasks: ['test:unit:dev']
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.renameTask('mocha', 'unit-phantom');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.renameTask('mochaTest', 'unit-node');

  // Test tasks
  grunt.registerTask('test:unit:dev', 'Run unit tests against dev code.', ['unit-node:dev', 'unit-phantom:dev']);
  grunt.registerTask('test:dev', 'Run all tests against dev code.', ['test:unit:dev']);

  grunt.registerTask('test:unit:release', 'Run unit tests against release code.', ['unit-node:release', 'unit-phantom:release']);
  grunt.registerTask('test:release', 'Run all tests against release code.', ['test:unit:release']);

  grunt.registerTask('test', 'One task to run them all (alias to test:dev)', ['test:dev']);

  // Project lifecycle tasks
  grunt.registerTask('dev', 'Run tests on change.', ['watch']);
  grunt.registerTask('release', 'Build a release (test dev code AND release).', ['reporter:dot', 'test:dev', 'uglify', 'test:release']);

  grunt.registerTask('reporter:dot', 'Set mocha reporter to Dot', function () {
    grunt.config.set('options.reporter', 'Dot');
  });

};
