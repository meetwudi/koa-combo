var koa = require('koa'),
  app = koa(),
  combo = require('./index');

app.use(combo);

app.listen(3000);