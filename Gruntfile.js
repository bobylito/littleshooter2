module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      options: {
        transform: [ require('grunt-react').browserify ]
      },
      app: {
        src : 'src/app.js',
        dest: 'js/app.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-browserify');
  //grunt.loadNpmTasks('grunt-contrib-watch');

  //grunt.registerTask('default', ['build', 'connect:server', 'watch']);
  grunt.registerTask('build', ['browserify:app']);
  //grunt.registerTask('serve', ['connect:server']);
};
