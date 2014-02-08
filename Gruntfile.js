module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    files: {
      js: {
        main: 'app/js/main.js',
        vendor: ['app/vendor/*.js']
      },
      css: {
        main: 'app/css/main.css',
        all:  ['app/css/*.css']
      },
      less: {
        main: 'app/less/main.less'
      },
      build: {
        lib: 'app/build/lib.min.js',
        app: 'app/build/application.min.js',
        css: 'app/build/application.css'
      },
      'public': {
        lib: 'public/javascripts/lib.min.js',
        app: 'public/javascripts/application.min.js',
        css: 'public/stylesheets/application.css'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      '<%= files.build.app %>': '<%= files.js.main %>'
    },

    concat: {
      options: {
        separator: ';',
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
          '<%= files.css.main %>': '<%= files.less.main %>'
        }
      }
    },

    copy: {
      main: {
        files: [
          { src: '<%= files.build.css %>', dest: '<%= files.public.css %>' },
          { src: '<%= files.build.app %>', dest: '<%= files.public.app %>' },
          { src: '<%= files.build.lib %>', dest: '<%= files.public.lib %>' },
        ]
      }
    },

    watch: {
      files: ['<%= files.js.main %>', '<%= files.less.main %>'],
      tasks: ['jshint', 'uglify', 'less', 'concat', 'copy']
    }

  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'less', 'concat', 'copy']);
  grunt.registerTask('dev', ['watch']);
};