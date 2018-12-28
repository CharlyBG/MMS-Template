const
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    imgmin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps')

const browserSync = require('browser-sync').create()

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: 'test/'
        }
    })
})

gulp.task('sass', () => {
    return gulp.src('src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('test/css/'))
    .pipe(browserSync.stream())
})

gulp.task('html', () => {
    return gulp.src('src/*.html')
    .pipe(htmlmin({
        html5: true,
        removeComments: true,
        removeScriptTypeAttributes: true,
        removeEmptyAttributes: true
    }))
    .pipe(gulp.dest('test/'))
})

gulp.task('babel', () => {
    return gulp.src('src/js/**/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest('test/js/'))
})

gulp.task('img', () => {
    return gulp.src('src/img/*.*')
    .pipe(imgmin())
    .pipe(gulp.dest('test/img/'))
})

gulp.task('watch', () => {
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass')),
    gulp.watch('src/js/**/*.js', gulp.parallel('babel')),
    gulp.watch('src/*.html', gulp.parallel('html')),
    gulp.watch('src/img/*.*', gulp.parallel('img'))
})

gulp.task('reload', () => {
    return gulp.watch('test/js/main.js').on('change', browserSync.reload),
    gulp.watch('test/*.html').on('change', browserSync.reload)
})

gulp.task('start', gulp.parallel('serve', 'watch', 'reload'))

let cdest = 'dist/'
    htmloptions = {
        html5: true,
        removeComments: true,
        removeScriptTypeAttributes: true,
        removeEmptyAttributes: true,
        collapseWhitespace:true
    }

gulp.task('compileHTML', () => {
    return gulp.src('src/*.html')
    .pipe(htmlmin(htmloptions))
    .pipe(gulp.dest(cdest))  
})

gulp.task('compileCSS', () => {
    return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed', sourceMap: true }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cdest+'css/'))
})

gulp.task('compileJS', () => {
    return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cdest+'js/'))
})

gulp.task('minifyIMG', () => {
    return gulp.src('src/img/*.*')
    .pipe(gulp.dest(cdest+'img/'))
})

gulp.task('build', gulp.parallel('compileHTML', 'compileCSS', 'compileJS', 'minifyIMG'))