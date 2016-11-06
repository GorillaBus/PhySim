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
let path = require('path');

// Global variables
let paths = {
  project: './projects/',
  local: './projects/local/',
  build: './build/'
};

// Gulp tasks
gulp.task('default', compile);
gulp.task('build', buildAll);
gulp.task('watch', watchProject);
gulp.task('create', createProject);


// Will build only one if '-p' is specified
function buildAll() {
  let param = getParams();
  let projects = param ? [param] : getProjects();

  if (param && param === '*local') {
    projects = getProjects(true);
  }

  projects.forEach(function(project) {
      compile(project, false);
  });
}

// Watch project files and recompile when needed
function watchProject() {
  let project = getParams();

  if (project) {
    compile(project, true);
  }
}

// Bundle project files and create build directory
function compile(project, watch) {
  if (!fs.existsSync(paths.project + project) || project === 'local') {
    console.error(">> Invalid project directory name '", project, "'");
    return false;
  }

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

// Copy resources to project's build directory
function copyfiles(project) {
  let localCSS = '';
  let dir = fs.existsSync(paths.project + project + '/css') ? fs.readdirSync(paths.project + project + '/css'):[];

  if (dir.length) {
    let pattern = /.+\.css$/;
    for (var i=0; i<dir.length; i++) {
      if (pattern.test(dir[i])) {
        localCSS += "<link rel='stylesheet' href='css/"+ dir[i] +"' />";
      }
    }
  }

  // if (fs.existsSync('./projects/'+ project +'/index.html')){
  //
  // };

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


// Create a new project from boilerplate
function createProject() {
  let project = getParams();
  if (fs.existsSync(paths.project + project )) {
    console.error(">> Project directory '", project, "' already exists.");
    return;
  }
  gulp.src(['src/boilerplate/**/*', '!src/boilerplate/**/*.gitignore'], {
    base: 'src/boilerplate'
  })
  .pipe(gulp.dest(paths.project + project));
}


/* Helper functions */

function getParams(pKey) {
    pKey = pKey || '-p';
    let i = process.argv.indexOf(pKey);
    if(i>-1 && process.argv[i+1] !== undefined) {
        return [process.argv[i+1]].toString();
    }
    return false;
}

function getProjects(local) {
  let localDir = fs.readdirSync(paths.local)
                   .filter(function(file) {
                     return fs.statSync(path.join(paths.local, file)).isDirectory();
                   });
  localDir.forEach(function(p, i) {
    localDir[i] = 'local/' + p;
  });

  // Returns only LOCAL project directories
  if (local) {
    return localDir;
  }

  let pubDir = fs.readdirSync(paths.project)
                 .filter(function(file) {
                   return fs.statSync(path.join(paths.project, file)).isDirectory();
                 });
  pubDir.splice(pubDir.indexOf('local'), 1);
  return pubDir.concat(localDir);
}
