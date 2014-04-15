module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    files: {
      js: {
        main: [
          'app/js/models/*.js',
          'app/js/*/*.js',
          'app/js/*.js'
        ],
        vendor: [
          'app/vendor/jquery-2.1.0.min.js',
          'app/vendor/underscore-min.js',
          'app/vendor/*.js',
        ]
      },
      css: {
        main: 'app/css/main.css',
        all:  ['app/css/*.css']
      },
      less: ['app/less/*.less'],
      index: 'app/index.html',

      build: {
        lib: 'build/javascripts/lib.min.js',
        app: 'build/javascripts/application.min.js',
        css: 'build/stylesheets/application.css',
        idx: 'build/index.html'
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      '<%= files.build.app %>': '<%= files.js.main %>'
    },

    concat: {
      options: {
        separator: ";",
        stripBanners: true
      },
      js: {
        src: '<%= files.js.vendor %>',
        dest: '<%= files.build.lib %>'
      },
      css: {
        src: '<%= files.css.all %>',
        dest: '<%= files.build.css %>'
      }
    },

    jshint: {
      options: {
        curly: true,
        eqnull: true,
        eqeqeq: true,
        boss: true,
        lastsemic: true,
        loopfunc: true,
        trailing: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true
      },
      files: ['Gruntfile.js', '<%= files.js.main %>']
    },

    less: {
      development: {
        options: {
          cleancss: true,
          compress: true,
          report: 'min'
        },
        files: {
          '<%= files.css.main %>': '<%= files.less %>'
        }
      }
    },

    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'app/fonts/',
            src: ['**/*.*'],
            dest:'build/fonts/'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            cwd: 'app/images/',
            src: ['**/*.*'],
            dest:'build/images/'
          }
        ]
      },
      main: {
        files: [
          { src: '<%= files.index %>',     dest: '<%= files.build.idx %>' },
        ]
      }
    },

    watch: {
      files: ['<%= files.js.main %>', '<%= files.less %>', '<%= files.index %>'],
      tasks: ['jshint', 'uglify', 'less', 'concat', 'copy']
    },

    jasmine: {
      tests: {
        src: ['<%= files.js.main %>'],
        options: {
          specs: 'spec/javascripts/*Spec.js',
          helpers: 'spec/javascripts/helpers/*.js',
          vendor: '<%= files.js.vendor %>',
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'less', 'concat', 'copy']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('test', ['jasmine']);
};