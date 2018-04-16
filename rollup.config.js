import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/light.min.js',
    name: 'Light',
    format: 'iife',
  },
  plugins: [uglify()],
};
