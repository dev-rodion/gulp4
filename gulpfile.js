const { src, dest, watch } = require("gulp");
// scr is a function to find files
// dest is a function to send file to given directory
// watch is a function to watch for file changes

const sass = require("gulp-sass")(require("sass")); // gulp-sass is a plugin to convert scss to css; sass is a required plugin
const concat = require("gulp-concat"); // gulp-concat is a plugin to concatenate files (can rename files)

function styles() {
  return src("app/scss/style.scss") // finds style.scss filee in app/scss/ directory
    .pipe(sass({// converts scss to css
        outputStyle: "compressed", // compress css to one line
    }))
    .pipe(concat('style.min.css')) // concatenates the files and sets the filename 
    .pipe(dest("app/css")); // sends file to app/css directory
}

function watching() {
  watch(['app/scss/**/*.scss'],styles) // calls the styles function when scss files change in app/scss directory 
}

// adds the ability to use the function by keyword (gulp *keyword*)
exports.styles = styles; 
exports.watching = watching; 