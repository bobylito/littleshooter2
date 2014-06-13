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
        src : 'src/js/app.js',
        dest: 'js/app.js'
      }
    },
    stylus : {
      dev:{
        options:{
          linenos : true
        },
        files : {
          './css/app.css' : './src/stylus/index.styl'
        }
      }
    },
    watch: {
      files: ['./src/**/*'],
      tasks: ['build']
    },
  })

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['browserify:app', 'stylus']);
  //grunt.registerTask('serve', ['connect:server']);
};
