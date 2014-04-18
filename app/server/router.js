var indexRoutes = require('./routes/index');
var mailerRoutes = require('./routes/mailer');
var composerRoutes = require('./routes/composer');
var senderRoutes = require('./routes/sender');

module.exports = function(app) {

  // Log In //
  app.get('/', indexRoutes.get);
  app.post('/', indexRoutes.post);

  // mailer //
  app.get('/mailer', mailerRoutes.get);

  // composer //
  app.get('/composer', composerRoutes.get);
  app.post('/composer', composerRoutes.post);

  // sender //
  app.get('/sender', senderRoutes.get);
  app.post('/sender', senderRoutes.post);

  // all other routes 404
  app.get('*', function(req, res) { res.render('404', { title: "Page Not Found"}); });
};
