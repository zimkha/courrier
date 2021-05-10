const gulp = require('gulp');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();
var port = 7003;

var replace = require('gulp-replace');
var linkProject = 'samakeurback/public/';


// Compile SCSS files and minify CSS files
gulp.task('sass', function () {
    return gulp.src('assets/css/sass/*')
        .pipe(sass())
        .pipe(gulp.dest('assets/css/'))
        .pipe(sync.stream());

});

gulp.task('serve', function() {
    sync.init({
        proxy: "http://localhost/" + linkProject,
        port:port+1
    });

    gulp.watch("assets/css/*.css").on('change', sync.reload);
    gulp.watch('assets/css/sass/*.scss', ['sass']);
    gulp.watch('assets/css/sass/**/*.scss', ['sass']);


    gulp.watch("assets/js/**/*.js").on('change', sync.reload);
    gulp.watch("assets/js/**/**/*.js").on('change', sync.reload);


    // For Laravel
    gulp.watch("*.php").on('change', sync.reload);
    gulp.watch("../resources/views/*.php").on('change', sync.reload);
    gulp.watch("../resources/views/**/*.php").on('change', sync.reload);
});


// Default task
gulp.task('default', ['sass', 'serve']);
