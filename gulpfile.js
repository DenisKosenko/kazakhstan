const {src, dest, series, watch} = require('gulp')
const less = require('gulp-less')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');

function html() {
    return src('src/**.html')
      .pipe(htmlmin({
        collapseWhitespace: true
      }))
      .pipe(dest('dist'))
  }

function lesss() {
    return src('src/css/**/*.less')
      .pipe(less())
      .pipe(csso())
      .pipe(concat('index.css'))
      .pipe(dest('dist'))
  };

function clear() {
    return del('dist')
}
  

function serve() {
    sync.init({
      server: './dist'
    })
  
    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/css/**/*.less', series(lesss)).on('change', sync.reload)
}

function img(){
    return src('src/img/*')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
};

function fonts(){
    return src('src/fonts/**/*')
      .pipe(dest('dist/fonts'))
}

function replaceurl() {
    return src(['dist/*'])
      .pipe(replace('url(../', 'url('))
      .pipe(replace('href="css/style.css"', 'href="index.css"'))
      .pipe(dest('dist'));
};


exports.build = series(clear, lesss, html, replaceurl, fonts, img)
exports.serve = series(clear, lesss, html, serve, replace, fonts, img)
exports.clear = clear