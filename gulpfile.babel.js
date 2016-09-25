let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let watchify = require('watchify');
let babel = require('babelify');

let allProjects = ['planetario', '2.5D'];
let projects = getParams() || allProjects;

gulp.task('default', compile);
gulp.task('build', buildAll);
gulp.task('watch', watchProject);

// Will build only one if '--project' is specified
function buildAll() {
    projects.forEach(function(project) {
        compile(project, false);
    });
}

function watchProject() {
    if (projects.length > 1) {
        console.error("Please use '--project <project>' to watch");
        return false;
    }

    compile(projects[0], true);
}

function compile(project, watch) {
  let bundler = browserify('./projects/'+ project +'/app.js', { debug: true });
  if (watch) {
      bundler = watchify(bundler);
  }

  bundler.transform(babel);

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/'+ project +'/'));
  }

  if (watch) {
    console.log(">> Watching project: ", project," <<");
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  copyfiles(project);
  rebundle();
}

function copyfiles(project) {
    gulp.src('./projects/'+ project +'/**/*.{jpg,png,gif,svg,html,css}')
    .pipe(gulp.dest('./build/'+ project +'/'));
}

function getParams() {
    let i = process.argv.indexOf("--project");
    if(i>-1 && process.argv[i+1] !== undefined) {
        return [process.argv[i+1]];
    }
}
