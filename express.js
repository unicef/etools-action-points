const prpl = require('prpl-server');
const express = require('express');
const port = 8080;
const app = express();

app.get('/api/launch', (req, res, next) => res.send('boom'));

app.get('/apd/', prpl.makeHandler('./build/', {
  builds: [
    {name: 'esm-bundled', browserCapabilities: ['es2015', 'push']},
    {name: 'es6-bundled', browserCapabilities: ['es2015']},
    {name: 'es5-bundled'}
  ]
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
