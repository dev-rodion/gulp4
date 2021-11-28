const { src, dest, watch, parallel } = require("gulp");
// scr is a function to find files
// dest is a function to send file to given directory
// watch is a function to watch for file changes
// parallel is a function to call functions in parallel

const sass = require("gulp-sass")(require("sass")); // gulp-sass is a plugin to convert scss to css; sass is a required plugin
const concat = require("gulp-concat"); // gulp-concat is a plugin to concatenate files (can rename files)
const browserSync = require('browser-sync').create(); // browser-sync is a plugin to create localhost and refresh the browser page in real time
const uglify = require('gulp-uglify-es').default; // gulp-urglify-es is a plugin to uglify javascript code 
const autoprefixer = require('gulp-autoprefixer'); // gulp-autoprefixer is a plugin to add css prefixes for old browsers 

function initBrowserSync () {
  browserSync.init({ // initializes localhost
    server: { // sets server parameters
        baseDir: "app/" // sets the base directory
    }
  });
}

function styles() {
  return src(["app/scss/style.scss"]) // finds and selects files
    .pipe(sass({// converts scss to css
        outputStyle: "compressed", // compress css to one line
    }))
    .pipe(concat('style.min.css')) // concatenates the files and sets the filename 
    .pipe(autoprefixer({ // adds css prefixes for old browsers
      grid: 'autoplace', // adds IE 10-11 prefixes for grid layout properties
      overrideBrowserslist: ["last 10 version"] // adds css prefixes for the latest 10 versions in every browser
    }))  
    .pipe(dest("app/css")) // sends file to app/css directory
    .pipe(browserSync.stream()) // refreshes the browser page
}

function scripts() {
  return src(['app/js/main.js']) // finds and selects files
  .pipe(concat('script.min.js')) // concatenates the js files and sets the filename
  .pipe(uglify()) // uglifies js code
  .pipe(dest('app/js/')) // sends file to app/js directory
  .pipe(browserSync.stream()) // refreshes the browser page
}

function watching() {
  watch(['app/scss/**/*.scss'],styles); // calls the styles function when scss files change in app/scss directory 
  watch(['app/js/main.js'],scripts); // calls the scripts function when main.js file change in app/js directory 
  watch(['app/*.html']).on('change', browserSync.reload); // refreshes the browser page when HTML files change
}

// adds the ability to use the function by keyword (gulp *keyword*)
exports.styles = styles; 
exports.watching = watching; 
exports.initBrowserSync = initBrowserSync; 
exports.scripts = scripts; 

// adds the ability to use the function by "gulp" keyword (gulp)
exports.default = parallel(scripts,initBrowserSync, watching) // calls function in parallel