const express = require('express'); // eslint-disable-line
const compression = require('compression'); // eslint-disable-line
var browserCapabilities = require('browser-capabilities'); // eslint-disable-line

const app = express();
const basedir = __dirname + '/src/'; // eslint-disable-line

app.use(compression());


function getSourcesPath(request) {
  let clientCapabilities = browserCapabilities.browserCapabilities(
      request.headers['user-agent']);

  clientCapabilities = new Set(clientCapabilities); // eslint-disable-line
  if (clientCapabilities.has('modules')) {
    return basedir;
  } else {
    return basedir;
  }
}

app.use('/apd/', (req, res, next) => {
  const sourceFolder = getSourcesPath(req);
  express.static(sourceFolder)(req, res, next);
});

app.get(/.*service-worker\.js/, function(req, res) {
  res.sendFile(getSourcesPath(req) + 'service-worker.js');
});

app.get(/.*manifest\.json/, function(req, res) {
  res.sendFile(getSourcesPath(req) + 'manifest.json');
});

app.use((req, res) => {
  // handles app access using a different state path than index (otherwise it will not return any file)
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.sendFile(getSourcesPath(req) + 'index.html');
});

app.listen(8080);
