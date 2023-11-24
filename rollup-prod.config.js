import defaultConfig from './rollup.config.js';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import license from 'rollup-plugin-license';
import terser from '@rollup/plugin-terser';
import path from 'path';
import { generateSW } from 'rollup-plugin-workbox';
import { workboxConfig } from './workbox-config.js';

// Files to remove before doing new src
const deleteConfig = {
  targets: ['src/*']
};

// Extract license comments in separate file LICENSE.txt
const licenseConfig = {
  thirdParty: {
    output: path.join(__dirname, 'src', 'LICENSE.txt'),
    includePrivate: true
  }
};

// Used for minify JS
const terserConfig = {
  format: {
    comments: false
  }
};

// Extra files to copy in src directory ./src
const copyConfig = {
  targets: [
    { src: 'manifest.json', dest: 'src' },
    { src: 'version.json', dest: 'src' },
    { src: 'upgrade-browser.html', dest: 'src' },
    { src: 'node_modules/@webcomponents/webcomponentsjs/**', dest: 'src/node_modules/@webcomponents/webcomponentsjs' },
    {
      src: 'node_modules/web-animations-js/web-animations-next-lite.min.js',
      dest: 'src/node_modules/web-animations-js'
    },
    { src: 'node_modules/dayjs/dayjs.min.js', dest: 'src/node_modules/dayjs' },
    { src: 'node_modules/dayjs/plugin/utc.js', dest: 'src/node_modules/dayjs/plugin' },
    {
      src: 'node_modules/linkifyjs/**',
      dest: 'src/node_modules/linkifyjs'
    },
    { src: 'images', dest: 'src' },
    { src: 'assets', dest: 'src' },
    { src: 'index.html', dest: 'src' }
  ]
};

const config = {
  ...defaultConfig,
  plugins: [
    del(deleteConfig),
    ...defaultConfig.plugins,
    license(licenseConfig),
    terser(terserConfig),
    copy(copyConfig),
    generateSW(workboxConfig)
  ],
  preserveEntrySignatures: false
};

export default config;