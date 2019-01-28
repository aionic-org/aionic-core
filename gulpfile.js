const gulp = require('gulp')
const merge = require('gulp-merge-json')

const bases = {
  src: 'src/',
  dist: 'dist/',
  components: 'rest/components/',
  output: 'output/'
}

const paths = {
  policy: 'rest/components/**/policy.json',
  html: 'rest/components/**/templates/*.html'
}

// Task for copying html templates
gulp.task('copy', function() {
  gulp.src(paths.html, { cwd: bases.src }).pipe(gulp.dest(bases.components, { cwd: bases.dist }))
})

// Task for merging policies
gulp.task('merge', () => {
  gulp
    .src(paths.policy, { cwd: bases.src })
    .pipe(merge({ fileName: 'policies.combined.json', concatArrays: true }))
    .pipe(gulp.dest(bases.output, { cwd: bases.dist }))
})
