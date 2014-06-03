module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*<%= pkg.name %>' + ' <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				src: 'server.js',
				dest: 'server.min.js'
			}
		},
		jshint: {
			all: ['*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['jshint', 'uglify']);
};