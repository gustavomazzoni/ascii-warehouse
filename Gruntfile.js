module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //copy files to static folder
        copy: {
			project: {
				expand: true,
				cwd : 'src',
				src: ['index.html', 'app/**/*.html'],
				dest: 'static'
			}
		},

		clean: ['static'],

		/**
	     * `grunt concat` concatenates multiple source files into a single file.
	     */
	    concat: {
			/**
			 * The `compile_js` target is the concatenation of our application source
			 * code and all specified vendor source code into a single file.
			*/
			compile_js: {
				src: [
					'vendor/jquery/dist/jquery.min.js',
					'vendor/angular/angular.min.js',
					'vendor/oboe/dist/oboe-browser.min.js',
					'vendor/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
					'src/**/*.js',
					'!src/**/*.spec.js'
				],
				dest: 'static/assets/app.js'
			},
			compile_css: {
				src: [
					'src/**/*.css'
				],
				dest: 'static/assets/app.css'
			}
		},
        
        //uglify angularjs
        uglify: {
		    js: {
		        src: 'static/assets/app.js',
		        dest: 'static/assets/app.js'
		    }
		},

		// Test settings
	    /**
	     * The Karma configurations.
	     */
	    karma: {
	    	unit: {
	    		configFile: 'karma/karma.config.js',
	    		singleRun: true
	    	}
	    }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
    
    //register grunt default task
    grunt.registerTask('default', ['karma', 'clean', 'copy:project', 'concat:compile_js', 'concat:compile_css']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('production', ['karma', 'clean', 'copy:project', 'concat:compile_js', 'concat:compile_css', 'uglify']);
}