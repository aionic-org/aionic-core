const gulp = require('gulp')
const merge = require('gulp-merge-json')

const bases = {
  src: 'src/',
  dist: 'dist/',
  modules: 'modules/',
  output: 'output/'
}

const paths = {
  policy: 'modules/**/policy.json',
  html: 'modules/**/templates/*.html'
}

// Task for copying html templates
gulp.task('copy', function() {
  gulp.src(paths.html, { cwd: bases.src }).pipe(gulp.dest(bases.modules, { cwd: bases.dist }))
})

// Task for merging policies
gulp.task('merge', () => {
  gulp
    .src(paths.policy, { cwd: bases.src })
    .pipe(merge({ fileName: 'policies.combined.json', concatArrays: true }))
    .pipe(gulp.dest(bases.output, { cwd: bases.dist }))
})
