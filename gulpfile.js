const gulp = require('gulp');
const del = require('del');
const useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    gulpIf = require('gulp-if')
    runSeq = require('run-sequence'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    loadJsonFile = require('load-json-file'),
    imagemin = require('gulp-imagemin');


gulp.task('images', function () {
    return gulp.src('src/img/**/*.+(jpg|png|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('favicon', function () {
    return gulp.src('src/favicon.ico')
        .pipe(gulp.dest('dist'));
});


gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    });
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function () {
    return del.sync('dist');
})

gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('useref', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', babel({ presets: ['es2015'] })))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/pages/**/*.+(html|nunjucks)', ['nunjucks']);
    gulp.watch('src/templates/**/*.+(html|nunjucks)', ['nunjucks']);
    gulp.watch('src/*.json', ['nunjucks']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('nunjucks', function () {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
        // adding data
        .pipe(data(function () {
            return loadJsonFile.sync('./src/data.json');
        }))
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // output files in src folder
        .pipe(gulp.dest('src'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('build', function (callback) {
    runSeq('clean:dist',
        'sass',
        'nunjucks',
        ['useref', 'images', 'fonts', 'favicon'],
        callback
    );
});

gulp.task('default', function (callback) {
    runSeq(['sass', 'nunjucks', 'browserSync', 'watch'],
        callback
    );
});
