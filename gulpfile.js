const { src, dest } = require("gulp");
// scr is a function to find files
// dest is a function to send file to given directory

const sass = require("gulp-sass")(require("sass")); // gulp-sass is a plugin to convert scss to css; sass is a required plugin

function styles() {
  return src("app/scss/style.scss") // finds style.scss filee in app/scss/ directory
    .pipe(sass({
        // converts scss to css
        outputStyle: "compressed", // compress css to one line
    }))
    .pipe()
    .pipe(dest("app/css")); // sends file to app/css directory
}

exports.styles = styles; // adds the ability to use the function by keyword (gulp *keyword*)
