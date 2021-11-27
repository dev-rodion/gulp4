const { src, dest, watch, parallel } = require("gulp");
// scr is a function to find files
// dest is a function to send file to given directory
// watch is a function to watch for file changes
// parallel is a function to call functions in parallel

const sass = require("gulp-sass")(require("sass")); // gulp-sass is a plugin to convert scss to css; sass is a required plugin
const concat = require("gulp-concat"); // gulp-concat is a plugin to concatenate files (can rename files)
const browserSync = require('browser-sync').create(); // browser-sync is a plugin to create localhost and update the project in real time

function initBrowserSync () {
  browserSync.init({ // initializes localhost
    server: { // sets server parameters
        baseDir: "app/" // sets the base directory
    }
  });
}

function styles() {
  return src("app/scss/style.scss") // finds style.scss filee in app/scss/ directory
    .pipe(sass({// converts scss to css
        outputStyle: "compressed", // compress css to one line
    }))
    .pipe(concat('style.min.css')) // concatenates the files and sets the filename 
    .pipe(dest("app/css")) // sends file to app/css directory
    .pipe(browserSync.stream()) // re
}

function watching() {
  watch(['app/scss/**/*.scss'],styles); // calls the styles function when scss files change in app/scss directory 
  watch(['app/*.html']).on('change', browserSync.reload); // reloads the browser page when HTML files change
}

// adds the ability to use the function by keyword (gulp *keyword*)
exports.styles = styles; 
exports.watching = watching; 
exports.initBrowserSync = initBrowserSync; 

// adds the ability to use the function by "gulp" keyword (gulp)
exports.default = parallel(initBrowserSync, watching) // calls function in parallel