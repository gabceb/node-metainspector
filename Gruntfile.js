/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        camelcase: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          require: true,
          __dirname: true,
          process: true,
          /*MOCHA*/
          describe: true,
          it: true,
          before: true,
          beforeEach: true,
          after: true,
          afterEach: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      files: ['lib/**/*.js', 'test/**/*.js', 'index.js']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint']);

};
