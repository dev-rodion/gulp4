const { src, dest, watch, parallel, series } = require("gulp");
// scr is a function to find files
// dest is a function to send file to given directory
// watch is a function to watch for file changes
// parallel is a function to call functions in parallel
// series is a function to call functions in series

const sass = require("gulp-sass")(require("sass")); // gulp-sass is a plugin to convert scss to css; sass is a required plugin
const concat = require("gulp-concat"); // gulp-concat is a plugin to concatenate files (can rename files)
const browserSync = require("browser-sync").create(); // browser-sync is a plugin to create localhost and refresh the browser page in real time
const uglify = require("gulp-uglify-es").default; // gulp-urglify-es is a plugin to uglify javascript code
const autoprefixer = require("gulp-autoprefixer"); // gulp-autoprefixer is a plugin to add css prefixes for old browsers
const imagemin = require("gulp-imagemin"); // gulp-imagemin is a plugin to minify png, jpeg, gif and svg images
const del = require("del"); // del is a plugin to delete files or directories
const {htmlValidator} = require("gulp-w3c-html-validator")

function initBrowserSync() {
  browserSync.init({ // initializes localhost
    server: { // sets server parameters
      baseDir: "app/", // sets the base directory
  }});
}

function validateHtml() {
  return src(['app/*.html']) // finds and selects all html files
    .pipe(htmlValidator.analyzer()) // analyzes html files
    .pipe(htmlValidator.reporter()); // reports about errors
}

function styles() {
  return src(["app/scss/style.scss"]) // finds and selects files
    .pipe(sass({ // converts scss to css
        outputStyle: "compressed", // compress css to one line
    }))
    .pipe(concat("style.min.css")) // concatenates the files and sets the filename
    .pipe(autoprefixer({ // adds css prefixes for old browsers
        overrideBrowserslist: ["last 10 version"], // adds css prefixes for the latest 10 versions in every browser
    }))
    .pipe(dest("app/css")) // sends file to app/css directory
    .pipe(browserSync.stream()); // refreshes the browser page
}

function scripts() {
  return src(["app/js/main.js"]) // finds and selects files
    .pipe(concat("script.min.js")) // concatenates the js files and sets the filename
    .pipe(uglify()) // uglifies js code
    .pipe(dest("app/js/")) // sends file to app/js directory
    .pipe(browserSync.stream()); // refreshes the browser page
}

function images() {
  return src(["app/images/**/*"]) // finds and selects images
    .pipe(imagemin([// minifies images
        imagemin.gifsicle({ interlaced: true }), // gif minifig options
        imagemin.mozjpeg({ quality: 75, progressive: true }), // jpeg minifig options
        imagemin.optipng({ optimizationLevel: 5 }), // png minifig options
        imagemin.svgo({ // svg minifig options
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
    }),]))
    .pipe(dest("dist/images"));
}

function watching() {
  watch(["app/scss/**/*.scss"], styles); // calls the styles function when scss files change in app/scss directory
  watch(["app/js/main.js", "!app/js/script.min.js"], scripts); // calls the scripts function when main.js file change in app/js directory
  watch(["app/*.html"], validateHtml); // calls the scripts function when main.js file change in app/js directory
  watch(["app/*.html"]).on("change", browserSync.reload); // refreshes the browser page when HTML files change
}

function build() {
  return src([
      "app/css/style.min.css", // selects style.min.js in app/css directory
      "app/js/script.min.js", // selects script.min.js in app/js directory
      "app/fonts/**/*", // selects all font files in app/fonts directory
      "app/*.html", // selects all html files in app/ directory
  ], { base: "app" }) // indicates to preserve nesting of files and directories
    .pipe(dest("dist/")); // sends files to dist/ directory
}

function cleanDist() {
  return del("dist/"); // deletes dist/ directory
}

// adds the ability to use the function by keyword (gulp *keyword*)
exports.styles = styles;
exports.watching = watching;
exports.initBrowserSync = initBrowserSync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.validateHtml = validateHtml;

// adds the ability to use the function by "gulp" keyword (gulp)
exports.default = parallel(scripts, initBrowserSync, watching); // calls functions in parallel
exports.build = series(cleanDist, images, build); // calls functions in series
