import commonjs from '@rollup/plugin-commonjs';

const config = {
  input: 'wrapper.js',
  output: {
    file: './interpreter.js',
    format: 'esm'
  },
  plugins: [commonjs({ transformMixedEsModules: true }),]
};

export default config;