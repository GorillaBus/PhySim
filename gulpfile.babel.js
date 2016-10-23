let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let rename = require('gulp-rename');
let replace = require('gulp-replace');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let watchify = require('watchify');
let babel = require('babelify');
let fs = require('fs');

let allProjects = ['2.5d', '3d-point-lines', 'bezier-curves', 'bigbang', 'collision-detect', 'earth-sun-gravitation', 'friction', 'gravitations', 'normal-distribution-meter', 'paint-splatter', 'particles', 'perlin-noise', 'planetario', 'spaceship', 'springs-1', 'springs-2', 'random-walker', 'uniform-distribution-meter'];
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
    console.error("Please use '-p <project>' to watch");
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
  let localCSS = '';
  let path = {
              project: './projects/'+ project,
              build: './build/'+ project
            };

  let dir = fs.existsSync(path.project + '/css') ? fs.readdirSync(path.project + '/css'):[];

  if (dir.length) {
    let pattern = /.+\.css$/;
    for (var i=0; i<dir.length; i++) {
      if (pattern.test(dir[i])) {
        localCSS += "<link rel='stylesheet' href='css/"+ dir[i] +"' />";
      }
    }
  }

  if (fs.existsSync('./projects/'+ project +'/index.html')){
  };
  // Copy common index file unless there is a local one
  if (!fs.existsSync('./projects/'+ project +'/index.html')){
    gulp.src('./src/default.html')
    //.pipe(replace(/%(.{3})%/g, '$1foo'))
    .pipe(replace('%title%', project.charAt(0).toUpperCase() + project.slice(1)))
    .pipe(replace('%local_css%', localCSS))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./build/'+ project +'/'));

  } else {

    gulp.src('./projects/'+ project +'/index.html')
    .pipe(gulp.dest('./build/'+ project +'/'));
  }

  // Copy common CSS and check if CSS dir exists
  gulp.src('./src/css/common.css')
  .pipe(gulp.dest('./build/'+ project +'/css'));

  // Copy resources and local stylesheets
  gulp.src('./projects/'+ project +'/**/*.{jpg,png,gif,svg,css}')
  .pipe(gulp.dest('./build/'+ project +'/'));
}

function getParams() {
    let i = process.argv.indexOf("-p");
    if(i>-1 && process.argv[i+1] !== undefined) {
        return [process.argv[i+1]];
    }
}
