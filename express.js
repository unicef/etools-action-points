// const express = require('express');
// const browserCapabilities = require('browser-capabilities');

// const app = express();
// const basedir = __dirname + '/build/';
// let port = 8080;

// function getSourcesPath(request) {
//   let clientCapabilities = browserCapabilities.browserCapabilities(
//     request.headers['user-agent']);

//   clientCapabilities = new Set(clientCapabilities);

//   if (clientCapabilities.has('modules') && clientCapabilities.has('es2015')) {
//     return basedir + 'esm-bundled/';
//   } else if (clientCapabilities.has('es2015')) {
//     return basedir + 'es6-bundled/';
//   } else {
//     return basedir + 'es5-bundled/';
//   }
// }

// app.use('/apd/', (req, res, next)=> {
//   express.static(getSourcesPath(req))(req, res, next);
// });

// app.get(/.*service-worker\.js/, function(req, res) {
//   res.sendFile(getSourcesPath(req) + 'service-worker.js');
// });

// app.get('/*', prpl.makeHandler('.', {
//   builds: [
//     {name: 'modern', browserCapabilities: ['es2015', 'push']},
//     {name: 'fallback'},
//   ],
// }));

// app.listen(8080);


// app.use(function(req, res) {
//   // static file requrests that end up here are missing so they should return 404
//   if (req.originalUrl.startsWith('/src/')) {
//     res.status(404).send('Not found');
//   } else {
//     // handles requests that look like /pmp/interventions/details
//     res.sendFile(getSourcesPath(req) + 'index.html');
//   }
// });
// console.log('APD server started on port', port);
// app.listen(port);


const prpl = require('prpl-server');
const path = require('path');
const express = require('express');
const port = 8080;
// const app = express();

app.get('/api/launch', (req, res, next) => res.send('boom'));

// const isDeveloping = process.env.NODE_ENV !== 'production';
// if (isDeveloping) {
// let webpack = require('webpack');
// let webpackMiddleware = require('webpack-dev-middleware');
// let webpackHotMiddleware = require('webpack-hot-middleware');
// let config = require('./webpack.config.js');
// serve the content using webpack
// app.use(middleware);
// app.use(webpackHotMiddleware(compiler));
// } else {
// serve the content using static directory
// app.use(express.static(staticPath));
// }

app.get('/apd/', prpl.makeHandler('./src', {
  builds: [
    {name: 'esm-bundled', browserCapabilities: ['es2015', 'push']},
    {name: 'es6-bundled', browserCapabilities: ['es2015']},
    {name: 'es5-bundled'}
  ]
}));


const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, 'index.html');
app.use(express.static(DIST_DIR));
app.get('*', (req, res) => {
  res.sendFile(HTML_FILE);
});
// const PORT = process.env.PORT || 8080;
// app.listen(port, () => {
//   console.log(`App listening to ${port}....`);
//   console.log('Press Ctrl+C to quit.');
// });
app.listen(port, () => console.log(`APD app listening on port ${port}!`));
