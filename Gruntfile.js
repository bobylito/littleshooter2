module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      options: {
        transform: [ require('grunt-react').browserify ],
        bundleOptions:{
          debug: true
        }
      },
      app: {
        src : 'src/app.js',
        dest: 'js/app.js'
      }
    },
    watch: {
      files: ['./src/*'],
      tasks: ['build']
    },
  })

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['browserify:app']);
  //grunt.registerTask('serve', ['connect:server']);
};
