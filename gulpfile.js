"use strict";
// 요청 모듈 정의 ES
var
    gulp = require('gulp'),
    cache = require('gulp-cache'),
    scss = require('gulp-sass')(require('sass')),
    Fiber = require('fibers'),
    dartSsss = require('dart-sass'),
    sourcemaps = require ('gulp-sourcemaps'),
    postcss = require ('gulp-postcss'),
    autoprefixer = require ('autoprefixer'),
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
    htmlbeautify = require('gulp-html-beautify'),
    plumber = require('gulp-plumber'),
    spritesmith = require('gulp.spritesmith'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream');


gulp.task('clean', async function () {
    return del('dist');
})

gulp.task('copy:fonts',async function () {
    return gulp.src('src/assets/fonts/*.*')
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('images:minify', async() => {
    return gulp.src(['src/assets/images/**/*.*'])
    .pipe(plumber())
    .pipe(cache(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('images:sprite', async function() {
    var spConfig = {
        targetImgPath: './src/assets/sprite/*.png',
        targetRetinaImgPath: './src/assets/sprite/*@2x.png',
        destImgName: 'sprite.png',
        destRetinaImgName: 'sprite2x.png',
        destCssName: '_sprite.scss',
        destImgPath: './dist/assets/images/sprite',
        destCssPath: './src/assets/scss/import',
        destCssTemplate:'./src/assets/sprite/handlebarsStr.css.handlebars'
    }
    var spriteData = gulp.src(spConfig.targetImgPath)
    .pipe(plumber())
    .pipe(spritesmith({
        retinaSrcFilter: spConfig.targetRetinaImgPath,
        imgName: spConfig.destImgName,
        retinaImgName: spConfig.destRetinaImgName,
        padding: 5,
        cssName: spConfig.destCssName,
        cssTemplate: spConfig.destCssTemplate,
    }));

    var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(plumber())
    .pipe(cache(imagemin()))
    .pipe(gulp.dest(spConfig.destImgPath));

    var cssStream = spriteData.css
    .pipe(buffer())
    .pipe(plumber())
    .pipe(gulp.dest(spConfig.destCssPath));

    return merge(imgStream, cssStream)
    .pipe(buffer())
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task( 'scss:dev', async function () {
    var options = {
        postcss: [ autoprefixer ({overrideBrowserslist: ['last 2 versions']})]
    };
    return gulp.src('src/assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(scss({
        fiber:Fiber,
        outputStyle: 'expanded', //compressed , expanded ,compact ,nested
        indentType: 'space',
        indentWidth: 1,
        compiler: dartSsss,
    })).on('error', scss.logError)
    .pipe(postcss(options.postcss))
    .pipe( sourcemaps.write())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({ stream : true }));
})

gulp.task( 'scss:build', async function () {
    var options = {
        postcss: [ autoprefixer ({overrideBrowserslist: ['last 2 versions']})]
    };
    return gulp.src('src/assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(scss({
        fiber:Fiber,
        outputStyle: 'compressed', //compressed , expanded ,compact ,nested
        indentType: 'space',
        indentWidth: 1,
        compiler: dartSsss,
    })).on('error', scss.logError)
    .pipe(postcss(options.postcss))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({ stream : true }));
})

gulp.task('html:build', async function() {
    var options = {
        indentSize: 2
    };
    return gulp.src('src/page/**/*.html')
    .pipe(plumber())
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

gulp.task('script:dev', async function() {
    return gulp.src('src/assets/js/**/*.js')
    .pipe(plumber())
    .pipe( sourcemaps.init())
    .pipe(babel({
        'presets':[
            '@babel/preset-env'
        ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('script:build', async function() {
    return gulp.src('src/assets/js/**/*.js')
    .pipe(plumber())
    .pipe(babel({
        'presets':[
            '@babel/preset-env'
        ]
    }))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(browserSync.reload({ stream : true }));
});


gulp.task('vendorJs:build', async function() {
    return gulp.src('src/assets/vendor/js/*.js')
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/assets/js/vendor'))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('vendorCss:build', async function() {
    return gulp.src('src/assets/vendor/css/*.css')
    .pipe(plumber())
    .pipe(concatCss('vendor.css'))
    .pipe(cleanCSS({debug: true}, (details) => {
        console.log(`${details.name}: ${`original size : ` + details.stats.originalSize}`);
        console.log(`${details.name}: ${`minify size : ` + details.stats.minifiedSize}`);
    }))
    .pipe(gulp.dest('dist/assets/css/vendor'))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('webServer', async function() {
    return nodemon({
        script: 'server.js' ,
        watch: 'server'
    });
});

gulp.task('browserSync', async function() {
    browserSync.init({
        proxy: 'http://localhost:8005/',
        port: 8006,
        }
    );
});

gulp.task('watch', async function()  {
    return [
        gulp.watch('src/assets/images/**/*.*', gulp.series(['images:minify'])),
        gulp.watch('src/assets/fonts/**/*.*', gulp.series(['copy:fonts'])),
        gulp.watch('src/assets/scss/**/**/*.scss', gulp.series(['scss:dev'])),
        gulp.watch('src/assets/vendor/js/**/*.js', gulp.series(['vendorJs:build'])),
        gulp.watch('src/assets/vendor/css/**/*.js', gulp.series(['vendorCss:build'])),
        gulp.watch('src/page/**/*.html', gulp.series(['html:build'])),
        gulp.watch('src/templates/**/*.*', gulp.series(['html:build'])),
        gulp.watch('src/**/*.json', gulp.series(['html:build'])),
        gulp.watch('src/assets/js/**/*.js', gulp.series(['script:dev'])),
        gulp.watch('src/assets/sprite/**/*.png', gulp.series(['images:sprite']))
    ]
});

gulp.task('dev', gulp.series([ 'copy:fonts', 'images:minify', 'images:sprite', 'scss:dev', 'script:dev', 'vendorJs:build', 'vendorCss:build', 'html:build', 'webServer','browserSync','watch']));
gulp.task('build', gulp.series(['clean', 'copy:fonts', 'images:minify', 'images:sprite', 'scss:build', 'script:build', 'vendorJs:build', 'vendorCss:build','html:build','webServer','browserSync']));

