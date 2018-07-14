
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

gulp.task('default', function(){
    gulp.watch("*.scss", ["minificarCss"]);
    gulp.watch("script.js",["minifyJs"]);
});

gulp.task("minifyJs", function(){
    return gulp.src("script.js")
                .pipe(uglify())
                .pipe(gulp.dest('build/js'));
});

gulp.task("minificarCss", function(){
    return gulp.src("*.scss")
               .pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
               .pipe(gulp.dest("build/css"));
});