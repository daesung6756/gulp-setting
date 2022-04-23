"use strict";
// 요청 모듈 정의 ES
const gulp = require('gulp'),
      cache = require('gulp-cache'),
      scss = require('gulp-sass')(require('sass')),
      Fiber = require('fibers'),
      dartSsss = require('dart-sass'),
      sourcemaps = require ('gulp-sourcemaps'),
      postcss = require ('gulp-postcss'),
      autoprefixer = require ('autoprefixer'),
      fileInclude = require('gulp-file-include'),
      nodemon = require('gulp-nodemon'),
      browserSync = require('browser-sync').create(),
      babel = require('gulp-babel'),
      del = require('del'),
      concat = require('gulp-concat'),
      concatCss = require('gulp-concat-css'),
      cleanCSS = require('gulp-clean-css'),
      nunjucksRender = require('gulp-nunjucks-render'),
      data = require('gulp-data'),
      imagemin = require('gulp-imagemin'),
      imageminPngquant = require('imagemin-pngquant'),
      imageminZopfli = require('imagemin-zopfli'),
      imageminMozjpeg = require('imagemin-mozjpeg'),
      imageminGiflossy = require('imagemin-giflossy'),
      htmlbeautify = require('gulp-html-beautify');

const apfBrwsowsers = [
    'ie >= 8',
];

// CLEAN
gulp.task('clean',() => {
    return del('dist');
})

// FONT
gulp.task('fonts',() => {
    return gulp.src('src/assets/fonts/*.*')
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(browserSync.reload({ stream : true }));
});

// IMAGES
gulp.task('images',() => {
    return gulp.src(['src/assets/images/**/*.*'])
        .pipe(cache(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browserSync.reload({ stream : true }));
});

// SCSS
gulp.task( 'scss', () => {
    const options = {
        scss : {
            outputStyle: 'expanded',
            indentType: 'space',
            indentWidth: 1,
            compiler: dartSsss,
        },
        postcss: [ autoprefixer ({overrideBrowserslist: apfBrwsowsers,})]
    };
    return gulp.src('src/assets/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(scss({fiber:Fiber}).on('error', scss.logError))
        .pipe(postcss(options.postcss))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload({ stream : true }));
})

// HTML
gulp.task('html', () => {
    const options = {
        indentSize: 2
    };
    return gulp.src([
        'src/page/*',
        '!' + 'src/page/include' ])
        .pipe(fileInclude({prefix: '@@', basepath: 'src/page/include'}))
        .pipe(data(function() {
            return require('./src/data.json')
        }))
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream : true }));
})

// JS
gulp.task('script', () => {
    return gulp.src('src/assets/js/**/*.js')
        .pipe(babel({
            'presets':[
                '@babel/preset-env'
            ]
        }))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.reload({ stream : true }));
});

// VENDOR JS
gulp.task('vendor:js', () => {
    return gulp.src('src/assets/vendor/js/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/assets/js/vendor'))
        .pipe(browserSync.reload({ stream : true }));
});

// VENDOR JS MAP
gulp.task('vendor:js map', () => {
    return gulp.src('src/assets/vendor/js/*.map')
        .pipe(gulp.dest('dist/assets/js/vendor'))
        .pipe(browserSync.reload({ stream : true }));
});

// VENDOR CSS
gulp.task('vendor:css', () => {
    return gulp.src('src/assets/vendor/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(concatCss('vendor.css'))
        .pipe(cleanCSS({debug: true}, (details) => {
            console.log(`${details.name}: ${`original size : ` + details.stats.originalSize}`);
            console.log(`${details.name}: ${`minify size : ` + details.stats.minifiedSize}`);
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css/vendor'))
        .pipe(browserSync.reload({ stream : true }));
});

// WEB SERVER
gulp.task('webServer', () => {
    return nodemon({
        script: 'server.js' ,
        watch: 'server'
    });
});

// BROWSER SYNC
gulp.task('browserSync', () => {
    browserSync.init({
            proxy: 'http://localhost:8005/',
            port: 8006,
        }
    );
});

// WATCH
gulp.task('watch', () =>  {
    return [
        gulp.watch('src/assets/images/**/*.*', gulp.series('images')),
        gulp.watch('src/assets/fonts/**/*.*', gulp.series('fonts')),
        gulp.watch('src/assets/scss/**/**/*.scss', gulp.series('scss')),
        gulp.watch('src/assets/vendor/js/**/*.js', gulp.series('vendor:js')),
        gulp.watch('src/assets/vendor/css/**/*.js', gulp.series('vendor:css')),
        gulp.watch('src/page/**/*.html', gulp.series('html')),
        gulp.watch('src/templates/**/*.*', gulp.series('html')),
        gulp.watch('src/assets/js/**/*.js', gulp.series('script'))
    ]

});

// index
const series = gulp.series([
    'clean',
    'vendor:js',
    'vendor:js map',
    'vendor:css',
    'images',
    'fonts',
    'scss',
    'html',
    'script',
    gulp.parallel('webServer','browserSync','watch')
])

// run
gulp.task('default', series);